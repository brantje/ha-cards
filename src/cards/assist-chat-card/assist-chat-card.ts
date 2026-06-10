import { css, html, PropertyValues } from "lit";
import { repeat } from "lit/directives/repeat.js";
import { styleMap } from "lit/directives/style-map.js";
import { type HomeAssistant } from "custom-card-helpers";
import { BaseCard } from "../../shared/base-card";
import {
  AssistAudioRecorder,
  DEFAULT_SPEECH_RMS_THRESHOLD,
} from "../../shared/assist-audio-recorder";
import {
  dismissFollowUpHint,
  isFollowUpHintDismissed,
  setLastUsedPipelineId,
} from "../../shared/assist-chat-storage";
import { AssistPollController } from "../../shared/assist-poll-controller";
import { AssistRunCache, fetchRecentAssistRunsWithCache } from "../../shared/assist-run-cache";
import { formatAssistError } from "../../shared/assist-format";
import {
  assistConversationBubbleStyles,
  assistTypingDotsStyles,
} from "../../shared/assist-conversation-styles";
import "../../shared/template-text";
import { AssistChatAudioController } from "./assist-chat-audio";
import {
  renderAssistChatMessage,
  type AssistChatRenderContext,
} from "./assist-chat-render";
import {
  AssistChatLogDelta,
  AssistPipeline,
  applyAssistChatLogDelta,
  applyAssistProcessEvent,
  cloneAssistProcessModel,
  createAssistChatLogAccumulator,
  createAssistProcessModel,
  extractAssistConversationFromEvents,
  extractSpeechFromIntentOutput,
  getAssistRunCount,
  isBuiltInConversationAgent,
  isUnauthorizedWsError,
  listAssistPipelines,
  PipelineRunEvent,
  resolvePipelineId,
  runAssistPipeline,
  type AssistConversationFromEvents,
  type AssistProcessModel,
} from "../../shared/assist-pipeline";
import {
  AssistChatMessage,
  AssistChatRun,
  buildMessagesFromRuns,
  finalizeCancelledMessages,
  getRunsSnapshot,
  isRunFinished,
  isListeningPlaceholderMessage,
  isUnprocessedSttAssistantMessage,
  mergeHistoryMessages,
} from "./assist-chat-messages";
import {
  ASSIST_CHAT_CARD_DEFAULTS,
  AssistChatCardConfig,
  normalizeSuggestedPrompts,
} from "./assist-chat-card-config";
import "./assist-chat-card-editor";

type ProcessModel = AssistProcessModel;

const DEFAULTS = ASSIST_CHAT_CARD_DEFAULTS;
const CONVERSATION_REFRESH_MS = 1000;
const CONVERSATION_REFRESH_MAX_MS = 30000;
const IN_PROGRESS_HISTORY_POLL_MS = 400;
const MESSAGES_SCROLL_BOTTOM_THRESHOLD = 48;

/**
 * Single table of user-facing strings. Entries with a `haKey` resolve through
 * `hass.localize` first; the fallback is used when the key is unavailable.
 * A future i18n pass only needs to touch this table.
 */
const UI_TEXT = {
  listening: { fallback: "Listening..." },
  thinking: { fallback: "Thinking..." },
  preparing_reply: { fallback: "Preparing reply..." },
  waiting_reply: { fallback: "Waiting for reply..." },
  cancelled: { fallback: "Cancelled" },
  start_listening: { fallback: "Start listening" },
  stop_listening: { fallback: "Stop listening" },
  cancel: { fallback: "Cancel" },
  clear_conversation: { fallback: "Clear conversation" },
  dismiss: { fallback: "Dismiss" },
  conversation: { fallback: "Conversation" },
  status_idle: { fallback: "Idle" },
  status_listening: { fallback: "Listening" },
  status_thinking: { fallback: "Thinking" },
  listening_for_speech: { fallback: "Listening for speech" },
  preferred_pipeline: { fallback: "Preferred pipeline" },
  thinking_summary: { fallback: "Thinking" },
  thought: { fallback: "Thought" },
  thought_for: { fallback: "Thought for {duration}" },
  thought_for_cancelled: { fallback: "Thought for {duration} (cancelled)" },
  tool_arguments: { fallback: "Arguments" },
  tool_result: { fallback: "Result" },
  follow_up_hint: {
    fallback:
      "Follow-up questions after voice replies require an LLM conversation agent (OpenAI, Ollama, etc.). The built-in Home Assistant agent supports single-turn commands only.",
  },
  no_pipeline: { fallback: "No Assist pipeline is available." },
  voice_requires_stt: {
    fallback: "Voice input requires an Assist pipeline with speech-to-text configured.",
  },
  voice_not_supported: { fallback: "Voice input is not supported in this browser." },
  run_failed: { fallback: "Assist run failed." },
  request_rejected: { fallback: "Home Assistant rejected the Assist request." },
  mic_denied: {
    fallback:
      "Microphone access was denied. Allow microphone permission for Home Assistant in your device settings.",
  },
  mic_not_found: { fallback: "No microphone was found on this device." },
  mic_https: {
    haKey: "ui.dialogs.voice_command.not_supported_microphone_browser",
    fallback:
      "Your connection to Home Assistant is not secured using HTTPS. This causes browsers to block Home Assistant from accessing the microphone.",
  },
  mic_docs_link: {
    haKey: "ui.dialogs.voice_command.not_supported_microphone_documentation_link",
    fallback: "the documentation",
  },
  mic_docs: {
    haKey: "ui.dialogs.voice_command.not_supported_microphone_documentation",
    fallback: "Use the Home Assistant app or visit {documentation_link} to learn how to use a secure URL",
  },
  how_can_i_help: {
    haKey: "ui.dialogs.voice_command.how_can_i_help",
    fallback: "How can I help?",
  },
  input_placeholder: {
    haKey: "ui.dialogs.voice_command.input_text",
    fallback: "Ask Nabu",
  },
} as const;

type UiTextKey = keyof typeof UI_TEXT;

class AssistChatCard extends BaseCard {
  config!: AssistChatCardConfig;
  hass!: HomeAssistant | undefined;

  private pipelines: AssistPipeline[] = [];
  private resolvedPipelineId = "";
  private messages: AssistChatMessage[] = [];
  private inputValue = "";
  private processing = false;
  private listening = false;
  private loadingPipelines = false;
  private loadingHistory = false;
  private error = "";
  private conversationId: string | null = null;
  private activeUnsubscribe?: () => void;
  private audioRecorder?: AssistAudioRecorder;
  private sttBinaryHandlerId?: number | null;
  private audioBuffer?: Int16Array[];
  private readonly audioController = new AssistChatAudioController(() => {
    this.maybeContinueConversationAfterRun();
  });
  private chatLogAccumulator = createAssistChatLogAccumulator();
  private continueConversationAfterRun = false;
  private scrollFrame?: number;
  private stickToBottom = true;
  private stickThinkingToBottom = true;
  private loadToken = 0;
  private lastHistoryKey = "";
  private lastRunsSnapshot = "";
  private conversationClearedAt: number | null = null;
  private lastSeenRunTimestamp = 0;
  private historyPollController?: AssistPollController;
  private hasInProgressHistoryRun = false;
  private historyDisabled = false;
  private historyErrorLogged = false;
  private runCache = new AssistRunCache();
  private followUpHintDismissed = isFollowUpHintDismissed();
  private httpsWarningDismissed = false;
  private suggestedPrompts: string[] = [];
  private voiceInputHasSpeech = false;
  private userStartedRecordingOnce = false;
  private startingListening = false;
  private cardStyles: Record<string, string> = {};

  static properties = {
    hass: { attribute: false },
    config: { attribute: false },
    pipelines: { state: true },
    resolvedPipelineId: { state: true },
    messages: { state: true },
    inputValue: { state: true },
    processing: { state: true },
    listening: { state: true },
    loadingPipelines: { state: true },
    loadingHistory: { state: true },
    error: { state: true },
    followUpHintDismissed: { state: true },
    httpsWarningDismissed: { state: true },
    suggestedPrompts: { state: true },
  };

  static getConfigElement() {
    return document.createElement("assist-chat-card-editor");
  }

  static getStubConfig() {
    return {
      title: DEFAULTS.title,
      pipeline_id: DEFAULTS.pipeline_id,
      text_input: DEFAULTS.text_input,
      voice_input: DEFAULTS.voice_input,
      show_process: DEFAULTS.show_process,
    };
  }

  setConfig(config: AssistChatCardConfig) {
    this.config = {
      ...DEFAULTS,
      ...config,
      suggested_prompts: normalizeSuggestedPrompts(config.suggested_prompts),
    };

    this.cardStyles = {
      "--assist-chat-background": this.config.background_color || DEFAULTS.background_color,
      "--assist-chat-surface": this.config.surface_color || DEFAULTS.surface_color,
      "--assist-chat-user-bubble": this.config.user_chat_color || DEFAULTS.user_chat_color,
      "--assist-chat-user-text": this.config.user_chat_text_color || DEFAULTS.user_chat_text_color,
      "--assist-chat-assistant-bubble":
        this.config.assistant_chat_color || DEFAULTS.assistant_chat_color,
      "--assist-chat-assistant-text":
        this.config.assistant_chat_text_color || DEFAULTS.assistant_chat_text_color,
    };
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
    this.scheduleScrollToEnd(3, true);
    this.syncConversationRefreshTimer();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("visibilitychange", this.handleVisibilityChange);
    if (this.scrollFrame !== undefined) {
      window.cancelAnimationFrame(this.scrollFrame);
      this.scrollFrame = undefined;
    }
    this.stopMicVisualizer();
    this.clearConversationRefreshTimer();
    this.stopActiveRun();
    void this.closeAudioRecorder();
    this.audioController.unload(this.hass);
  }

  private async closeAudioRecorder() {
    await this.audioRecorder?.close();
    this.audioRecorder = undefined;
  }

  shouldUpdate(changedProperties: PropertyValues): boolean {
    return this.shouldUpdateNonEntityCard(changedProperties, [
      "pipelines",
      "resolvedPipelineId",
      "messages",
      "inputValue",
      "processing",
      "listening",
      "loadingPipelines",
      "loadingHistory",
      "error",
      "followUpHintDismissed",
      "httpsWarningDismissed",
      "suggestedPrompts",
    ]);
  }

  updated(changedProperties: PropertyValues) {
    if (changedProperties.has("messages")) {
      this.scheduleScrollToEnd();
    }

    if (!this.hass || !this.config) {
      return;
    }

    // `hass` shows up in changedProperties whenever a render was triggered by
    // another property while a hass swap was pending; only the first arrival
    // should kick off loading.
    const firstHass = changedProperties.has("hass") && !changedProperties.get("hass");

    if (
      firstHass ||
      changedProperties.has("config") ||
      changedProperties.has("resolvedPipelineId") ||
      changedProperties.has("processing") ||
      changedProperties.has("listening")
    ) {
      this.syncConversationRefreshTimer();
    }

    if (changedProperties.has("config")) {
      const prevConfig = changedProperties.get("config") as AssistChatCardConfig | undefined;
      const wasCardOnly = prevConfig?.card_only_history === true;

      if (this.usesCardOnlyHistory() && !wasCardOnly && !this.processing && !this.listening) {
        this.resetCardOnlyHistoryState();
      }
    }

    if (firstHass || changedProperties.has("config")) {
      void this.loadPipelines();
      const template = normalizeSuggestedPrompts(this.config.suggested_prompts);
      if (!template) {
        this.suggestedPrompts = [];
      }
    }

    if (changedProperties.has("listening")) {
      if (this.listening) {
        void this.updateComplete.then(() => this.startMicVisualizer());
      } else {
        this.stopMicVisualizer();
      }
    }
  }

  render() {
    const voicePipelineReady = this.isVoicePipelineConfigured();
    const needsHttpsForVoice = this.needsHttpsForVoice();

    return html`
      <ha-card style=${styleMap(this.cardStyles)}>
        <div class="card">
          ${this.renderHeader()}
          ${this.renderCapabilityHint()}
          ${this.renderMessages()}
          ${this.renderSuggestedPrompts()}
          ${this.renderSuggestedPromptsTemplateListener()}
          ${this.error ? html`<div class="error" role="alert">${this.error}</div>` : ""}
          <form class="input-row" @submit=${this.handleSubmit}>
            ${this.config.voice_input
              ? html`
                  <button
                    class=${this.listening ? "icon-button listening" : "icon-button"}
                    type="button"
                    title=${needsHttpsForVoice
                      ? this.getMicrophoneNotSupportedText().split("\n\n")[0]
                      : this.listening
                        ? this.text("stop_listening")
                        : this.text("start_listening")}
                    aria-label=${this.listening
                      ? this.text("stop_listening")
                      : this.text("start_listening")}
                    ?disabled=${(!this.listening && this.processing) || !voicePipelineReady}
                    @click=${this.handleListeningClick}
                  >
                    <ha-icon icon=${this.listening ? "mdi:microphone" : "mdi:microphone-outline"}></ha-icon>
                  </button>
                `
              : ""}
            ${this.listening
              ? this.renderListeningVisualizer()
              : this.config.text_input
                ? html`
                    <input
                      .value=${this.inputValue}
                      placeholder=${this.getInputPlaceholder()}
                      aria-label=${this.getInputPlaceholder()}
                      @input=${this.handleInput}
                    />
                    <button
                      class="send-button"
                      type="submit"
                      ?disabled=${this.processing || !this.inputValue.trim()}
                    >
                      <ha-icon icon="mdi:send"></ha-icon>
                    </button>
                  `
                : ""}
            ${this.processing
              ? html`
                  <button
                    class="icon-button cancel-button"
                    type="button"
                    title=${this.text("cancel")}
                    aria-label=${this.text("cancel")}
                    @click=${this.cancelActiveRun}
                  >
                    <ha-icon icon="mdi:stop"></ha-icon>
                  </button>
                `
              : ""}
            ${this.messages.length && !this.processing
              ? html`
                  <button
                    class="icon-button"
                    type="button"
                    title=${this.text("clear_conversation")}
                    aria-label=${this.text("clear_conversation")}
                    @click=${this.clearConversation}
                  >
                    <ha-icon icon="mdi:close-circle-outline"></ha-icon>
                  </button>
                `
              : ""}
          </form>
        </div>
      </ha-card>
    `;
  }

  private renderHeader() {
    if (this.config.show_header === false) {
      return "";
    }

    const title = this.config.title || DEFAULTS.title;
    const pipelineName = this.getPipelineName(this.resolvedPipelineId);
    const status = this.getCardStatus();

    return html`
      <header class="header">
        <div class="header-text">
          <h2 class="header-title">${title}</h2>
          <p class="header-pipeline">
            ${pipelineName || this.resolvedPipelineId || this.text("preferred_pipeline")}
          </p>
        </div>
        <span class=${`status-pill ${status}`} role="status">${this.getCardStatusLabel(status)}</span>
      </header>
    `;
  }

  private renderCapabilityHint() {
    if (
      this.followUpHintDismissed ||
      !this.shouldOfferFollowUpConversation() ||
      !this.config.voice_input ||
      !isBuiltInConversationAgent(this.getActivePipeline())
    ) {
      return "";
    }

    return html`
      <div class="info-banner" role="note">
        <span>${this.text("follow_up_hint")}</span>
        <button
          class="icon-button dismiss-button"
          type="button"
          title=${this.text("dismiss")}
          aria-label=${this.text("dismiss")}
          @click=${this.handleDismissFollowUpHint}
        >
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </div>
    `;
  }

  private renderSuggestedPromptsTemplateListener() {
    const template = normalizeSuggestedPrompts(this.config.suggested_prompts);
    if (!template) {
      return "";
    }

    return html`
      <ha-cards-template-text
        class="template-listener"
        .hass=${this.hass}
        .template=${template}
        .fallback=${template}
        ?multiline=${true}
        @lines-changed=${this.handleSuggestedPromptsChanged}
      ></ha-cards-template-text>
    `;
  }

  private handleSuggestedPromptsChanged = (event: CustomEvent<{ lines: string[] }>) => {
    this.suggestedPrompts = event.detail.lines;
  };

  private renderSuggestedPrompts() {
    const prompts = this.suggestedPrompts;
    if (this.config.show_suggested_prompts === false || !prompts.length) {
      return "";
    }

    if (this.messages.length && !this.config.always_show_suggested_prompts) {
      return "";
    }

    return html`
      <div class="suggested-prompts">
        ${prompts.map(
          (prompt, index) => html`
            <button
              class="prompt-chip"
              type="button"
              data-index=${index}
              ?disabled=${this.processing || this.listening}
              @click=${this.handleSuggestedPromptClick}
            >
              ${prompt}
            </button>
          `
        )}
      </div>
    `;
  }

  private renderMessages() {
    if (!this.messages.length) {
      return html`
        <div class="messages" role="log" aria-live="polite" aria-label=${this.text("conversation")}>
          <div class="empty-state">
            <ha-icon icon="mdi:message-processing-outline"></ha-icon>
            <span>${this.text("how_can_i_help")}</span>
          </div>
        </div>
      `;
    }

    return html`
      <div
        class="messages"
        role="log"
        aria-live="polite"
        aria-busy=${this.processing ? "true" : "false"}
        aria-label=${this.text("conversation")}
        @scroll=${this.handleMessagesScroll}
      >
        ${repeat(
          this.messages,
          (message) => message.id,
          (message) => this.renderMessage(message)
        )}
      </div>
    `;
  }

  private getRenderContext(): AssistChatRenderContext {
    return {
      showProcess: Boolean(this.config.show_process),
      showMessageTime: Boolean(this.config.show_message_time),
      showThinkingUntilResponse: Boolean(this.config.show_thinking_until_response),
      locale: this.hass?.locale,
      language: this.hass?.locale?.language,
      labels: {
        cancelled: this.text("cancelled"),
        listening: this.text("listening"),
        thinking: this.text("thinking"),
        preparing_reply: this.text("preparing_reply"),
        waiting_reply: this.text("waiting_reply"),
        thought_for_cancelled: (duration) => this.text("thought_for_cancelled", { duration }),
        thought_for: (duration) => this.text("thought_for", { duration }),
        thought: this.text("thought"),
        thinking_summary: this.text("thinking_summary"),
        tool_arguments: this.text("tool_arguments"),
        tool_result: this.text("tool_result"),
      },
      formatToolCallJson: (value) => this.formatToolCallJson(value),
      onThinkingScroll: this.handleThinkingScroll,
    };
  }

  private renderMessage(message: AssistChatMessage) {
    return renderAssistChatMessage(message, this.getRenderContext());
  }

  private handleMessagesScroll = (event: Event) => {
    const messages = event.currentTarget as HTMLElement;
    this.stickToBottom = this.isNearBottom(messages);
  };

  private handleThinkingScroll = (event: Event) => {
    const target = event.currentTarget as HTMLElement;
    const blocks = this.renderRoot.querySelectorAll(".thinking-content");
    const latest = blocks[blocks.length - 1];

    if (target !== latest) {
      return;
    }

    this.stickThinkingToBottom = this.isNearBottom(target);
  };

  private isNearBottom(element: HTMLElement, threshold = MESSAGES_SCROLL_BOTTOM_THRESHOLD) {
    return element.scrollHeight - element.scrollTop - element.clientHeight <= threshold;
  }

  private scheduleScrollToEnd(attempts = 3, force = false) {
    if (!force && !this.stickToBottom && !this.stickThinkingToBottom) {
      return;
    }

    if (this.scrollFrame !== undefined) {
      window.cancelAnimationFrame(this.scrollFrame);
      this.scrollFrame = undefined;
    }

    const scroll = (remainingAttempts: number) => {
      this.scrollFrame = window.requestAnimationFrame(() => {
        this.scrollFrame = undefined;
        if (force || this.stickToBottom) {
          this.scrollMessagesToEnd();
        }
        if (force || this.stickThinkingToBottom) {
          this.scrollThinkingToEnd();
        }

        if (remainingAttempts > 0) {
          scroll(remainingAttempts - 1);
        }
      });
    };

    scroll(attempts);
  }

  private scrollMessagesToEnd() {
    const messages = this.renderRoot.querySelector(".messages") as HTMLElement | null;

    if (messages) {
      messages.scrollTop = messages.scrollHeight;
    }
  }

  private scrollThinkingToEnd() {
    const blocks = this.renderRoot.querySelectorAll(".thinking-content");
    const latest = blocks[blocks.length - 1] as HTMLElement | undefined;

    if (latest) {
      latest.scrollTop = latest.scrollHeight;
    }
  }

  private handleInput(event: InputEvent) {
    this.inputValue = (event.target as HTMLInputElement).value;
  }

  private handleSubmit(event: Event) {
    event.preventDefault();
    const text = this.inputValue.trim();

    if (!text || this.processing || this.listening) {
      return;
    }

    this.inputValue = "";
    void this.processText(text);
    void this.updateComplete.then(() => this.focusTextInput());
  }

  private focusTextInput() {
    if (!this.config.text_input || this.listening) {
      return;
    }

    this.renderRoot.querySelector<HTMLInputElement>(".input-row input")?.focus();
  }

  private async processText(text: string) {
    const pipeline = await this.ensurePipeline();
    if (!pipeline || !this.hass) {
      return;
    }

    this.stopActiveRun();
    this.error = "";
    this.processing = true;
    this.chatLogAccumulator = createAssistChatLogAccumulator();
    this.continueConversationAfterRun = false;
    this.stickToBottom = true;
    this.stickThinkingToBottom = true;
    this.addMessage({ role: "user", text, status: "done" });
    const assistant = this.addMessage({
      role: "assistant",
      text: "",
      status: "pending",
      process: createAssistProcessModel(),
    });

    setLastUsedPipelineId(pipeline.id);

    try {
      const unsubscribe = await runAssistPipeline(
        this.hass,
        (event) => this.handleRunEvent(event, assistant),
        {
          start_stage: "intent",
          end_stage: this.getPipelineEndStage(),
          input: { text },
          pipeline: pipeline.id,
          conversation_id: this.conversationId,
        }
      );
      this.activeUnsubscribe = unsubscribe;
    } catch (error) {
      this.setAssistantError(assistant, this.formatError(error));
      this.processing = false;
    }
  }

  private handleListeningClick(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    void this.toggleListening();
  }

  private async toggleListening() {
    if (this.listening) {
      this.stopListening();
      return;
    }

    if (!this.isVoicePipelineConfigured()) {
      this.error = this.text("voice_requires_stt");
      return;
    }

    if (AssistAudioRecorder.isInsecureConnection()) {
      this.httpsWarningDismissed = false;
      this.showMicrophoneNotSupportedMessage();
      return;
    }

    if (!AssistAudioRecorder.isSupported()) {
      this.error = this.text("voice_not_supported");
      return;
    }

    await this.startListening(true);
  }

  private async startListening(userInitiated = false) {
    if (this.processing || this.startingListening || !this.supportsVoiceInput()) {
      return;
    }

    this.startingListening = true;

    try {
      if (userInitiated) {
        this.userStartedRecordingOnce = true;
      }

      const pipeline = await this.ensurePipeline();
      if (!pipeline || !this.hass || !this.isConnected) {
        return;
      }

      this.stopActiveRun();
      this.audioController.unload(this.hass);
      this.error = "";
      this.processing = true;
      this.listening = true;
      this.chatLogAccumulator = createAssistChatLogAccumulator();
      this.audioBuffer = [];
      this.voiceInputHasSpeech = false;
      this.sttBinaryHandlerId = undefined;
      this.stickToBottom = true;
      this.stickThinkingToBottom = true;
      let assistant: AssistChatMessage | undefined;
      let voiceProcess = createAssistProcessModel();
      this.removeListeningPlaceholder();
      const listeningPlaceholder = this.addMessage({
        role: "assistant",
        text: "",
        status: "listening",
        process: voiceProcess,
      });

      setLastUsedPipelineId(pipeline.id);

      if (!this.audioRecorder) {
        this.audioRecorder = new AssistAudioRecorder((chunk) => this.sendAudioChunk(chunk));
      }

      await this.audioRecorder.start();
      if (!this.isConnected) {
        await this.audioRecorder.stop();
        return;
      }
      this.continueConversationAfterRun = false;

      const unsubscribe = await runAssistPipeline(
        this.hass,
        (event) => {
          voiceProcess = this.applyProcessEvent(voiceProcess, event);
          listeningPlaceholder.process = voiceProcess;

          if (event.type === "stt-end") {
            this.removeListeningPlaceholder();
            const transcript = String(event.data?.stt_output?.text || "").trim();
            if (transcript) {
              this.addMessage({ role: "user", text: transcript, status: "done" });
              assistant = this.addMessage({
                role: "assistant",
                text: "",
                status: "pending",
                process: voiceProcess,
              });
            }
          }

          if (assistant) {
            this.handleRunEvent(event, assistant);
          } else if (event.type === "run-end") {
            this.removeUnprocessedSttMessages();
            this.finishRun();
          } else if (event.type === "error") {
            this.removeUnprocessedSttMessages();
            this.error = String(event.data?.message || this.text("run_failed"));
            this.finishRun();
          } else {
            this.messages = [...this.messages];
          }

          if (event.type === "run-start") {
            this.sttBinaryHandlerId = event.data?.runner_data?.stt_binary_handler_id;
            // Streaming TTS pipelines announce the audio URL on run-start.
            this.playTtsAudio(event.data?.tts_output?.url);
          } else if (event.type === "stt-start") {
            this.flushAudioBuffer();
          } else if (event.type === "stt-vad-end") {
            this.sendSpeechEndChunk();
          } else if (event.type === "stt-end") {
            this.sttBinaryHandlerId = undefined;
            this.stopListening(false);
          }
        },
        {
          start_stage: "stt",
          end_stage: this.getPipelineEndStage(),
          input: { sample_rate: this.audioRecorder.sampleRate || 16000 },
          pipeline: pipeline.id,
          conversation_id: this.conversationId,
        }
      );
      this.activeUnsubscribe = unsubscribe;
    } catch (error) {
      this.error = this.formatError(error);
      this.stopListening(false);
      this.processing = false;
    } finally {
      this.startingListening = false;
    }
  }

  private handleRunEvent(event: PipelineRunEvent, assistant: AssistChatMessage) {
    assistant.process = this.applyProcessEvent(assistant.process, event);

    if (event.type === "intent-progress" && event.data?.chat_log_delta) {
      this.applyIntentDelta(assistant, event.data.chat_log_delta as AssistChatLogDelta);
    } else if (event.type === "intent-end") {
      this.conversationId = event.data?.intent_output?.conversation_id || this.conversationId;
      this.continueConversationAfterRun = Boolean(event.data?.intent_output?.continue_conversation);
      this.applyIntentEnd(assistant, event);

      if (this.getPipelineEndStage() === "intent") {
        this.finishRun();
      }
    } else if (event.type === "tts-end") {
      this.playTtsAudio(event.data?.tts_output?.url);
    } else if (event.type === "run-end") {
      this.finishRun();
    } else if (event.type === "error") {
      this.setAssistantError(assistant, String(event.data?.message || this.text("run_failed")));
      this.finishRun();
    }

    this.messages = [...this.messages];
  }

  private applyIntentDelta(assistant: AssistChatMessage, delta: AssistChatLogDelta) {
    this.chatLogAccumulator.assistantText = assistant.text || "";
    this.chatLogAccumulator.thinking = assistant.thinking || "";
    this.chatLogAccumulator.toolCalls = assistant.process?.toolCalls || [];

    applyAssistChatLogDelta(this.chatLogAccumulator, delta);

    if (this.chatLogAccumulator.assistantText) {
      assistant.text = this.chatLogAccumulator.assistantText;
      assistant.status = "streaming";
    }

    if (this.chatLogAccumulator.thinking) {
      assistant.thinking = this.chatLogAccumulator.thinking;
      if (!this.chatLogAccumulator.assistantText) {
        assistant.status = "thinking";
      }
    }

    if (assistant.process) {
      assistant.process.toolCalls = this.chatLogAccumulator.toolCalls;
    }
  }

  private applyIntentEnd(assistant: AssistChatMessage, event: PipelineRunEvent) {
    const output = event.data?.intent_output;
    const response = extractSpeechFromIntentOutput(output);

    if (!response) {
      return;
    }

    assistant.text = response;
    assistant.status = output?.response?.response_type === "error" ? "error" : "done";
  }

  private applyProcessEvent(process: ProcessModel | undefined, event: PipelineRunEvent) {
    const next = cloneAssistProcessModel(process || createAssistProcessModel());
    applyAssistProcessEvent(next, event);
    return next;
  }

  private async ensurePipeline() {
    if (!this.hass) {
      return undefined;
    }

    if (!this.pipelines.length || !this.resolvedPipelineId) {
      await this.loadPipelines();
    }

    const pipeline = this.getActivePipeline();
    if (!pipeline) {
      this.error = this.text("no_pipeline");
      return undefined;
    }

    return pipeline;
  }

  private async loadPipelines(forceHistory = false) {
    if (!this.hass || this.loadingPipelines) {
      return;
    }

    const token = ++this.loadToken;
    this.loadingPipelines = true;

    try {
      const response = await listAssistPipelines(this.hass);
      if (token !== this.loadToken) {
        return;
      }

      this.pipelines = response.pipelines || [];
      const pipelineId = resolvePipelineId(this.config.pipeline_id, response);
      this.resolvedPipelineId = pipelineId;
      this.error = "";

      if (pipelineId && !this.usesCardOnlyHistory()) {
        await this.loadRecentHistory(pipelineId, token, forceHistory);
      } else if (!pipelineId && !this.processing && !this.listening) {
        this.messages = [];
        this.conversationId = null;
      }
    } catch (error) {
      if (token === this.loadToken) {
        this.error = this.formatError(error);
      }
    } finally {
      if (token === this.loadToken) {
        this.loadingPipelines = false;
      }
    }
  }

  /**
   * Best-effort history refresh. Returns false when the fetch failed in a
   * retryable way (drives poll backoff). History errors never surface in the
   * user-facing error slot — that is reserved for the user's own actions.
   */
  private async loadRecentHistory(
    pipelineId: string,
    token = this.loadToken,
    force = false,
    fallbackMessages: AssistChatMessage[] = this.messages,
    preserveLocalMessages = false
  ): Promise<boolean> {
    if (
      !this.hass ||
      this.processing ||
      this.listening ||
      this.historyDisabled ||
      this.usesCardOnlyHistory()
    ) {
      return true;
    }

    const historyKey = `${pipelineId}:${this.getHistoryRunCount()}`;

    if (!force && historyKey === this.lastHistoryKey) {
      return true;
    }

    this.loadingHistory = true;

    try {
      const runs = await this.fetchRunsWithCache(pipelineId, this.getHistoryRunCount());
      if (token !== this.loadToken) {
        return true;
      }

      this.historyErrorLogged = false;

      for (const run of runs) {
        const runTime = new Date(run.timestamp).getTime();
        if (Number.isFinite(runTime) && runTime > this.lastSeenRunTimestamp) {
          this.lastSeenRunTimestamp = runTime;
        }
      }

      const snapshot = getRunsSnapshot(runs);
      const hasRunChanges = snapshot !== this.lastRunsSnapshot;
      this.hasInProgressHistoryRun = runs.some((run) => !isRunFinished(run.events || []));

      if (!hasRunChanges && !preserveLocalMessages) {
        this.lastHistoryKey = historyKey;
        this.scheduleInProgressHistoryPoll();
        return true;
      }

      const { messages, conversationId } = buildMessagesFromRuns(runs, {
        active: this.processing || this.listening,
        clearedAt: this.conversationClearedAt,
      });
      const mergedMessages = preserveLocalMessages
        ? mergeHistoryMessages(messages, fallbackMessages, {
            dropPersistLocal: this.httpsWarningDismissed,
          })
        : messages;

      // A history poll started while idle can finish after the user starts a voice
      // run; never overwrite live session state with stale debug history.
      if (this.processing || this.listening) {
        return true;
      }

      this.messages = mergedMessages.filter((message) => !isUnprocessedSttAssistantMessage(message));
      this.conversationId = this.resolveConversationId(conversationId, preserveLocalMessages);
      this.lastRunsSnapshot = snapshot;
      this.lastHistoryKey = historyKey;
      this.scheduleInProgressHistoryPoll();
      return true;
    } catch (error) {
      if (token !== this.loadToken) {
        return true;
      }

      this.lastHistoryKey = "";

      if (isUnauthorizedWsError(error)) {
        // Non-admin users may not call the pipeline debug API. History is
        // best-effort: disable it permanently instead of erroring forever.
        this.historyDisabled = true;
        this.clearConversationRefreshTimer();
        return true;
      }

      if (!this.historyErrorLogged) {
        console.warn("assist-chat-card: failed to load Assist history", error);
        this.historyErrorLogged = true;
      }

      return false;
    } finally {
      if (token === this.loadToken) {
        this.loadingHistory = false;
      }
    }
  }

  /**
   * Fetch recent debug runs, re-downloading details only for runs that are
   * new or still in progress. Finished runs are immutable and served from
   * cache, so a steady-state poll costs one `list` call.
   */
  private async fetchRunsWithCache(pipelineId: string, runCount: number): Promise<AssistChatRun[]> {
    if (!this.hass) {
      return [];
    }

    return fetchRecentAssistRunsWithCache(this.hass, pipelineId, runCount, this.runCache, isRunFinished);
  }

  private removeListeningPlaceholder() {
    const nextMessages = this.messages.filter((message) => !isListeningPlaceholderMessage(message));

    if (nextMessages.length !== this.messages.length) {
      this.messages = nextMessages;
    }
  }

  private removeUnprocessedSttMessages() {
    const nextMessages = this.messages.filter(
      (message) => !isListeningPlaceholderMessage(message) && !isUnprocessedSttAssistantMessage(message)
    );

    if (nextMessages.length !== this.messages.length) {
      this.messages = nextMessages;
    }
  }

  private getHistoryPollController() {
    if (!this.historyPollController) {
      this.historyPollController = new AssistPollController({
        intervalMs: CONVERSATION_REFRESH_MS,
        maxBackoffMs: CONVERSATION_REFRESH_MAX_MS,
        shouldPoll: () => this.shouldLiveRefresh(),
        onPoll: async () => {
          if (!this.resolvedPipelineId) {
            return true;
          }

          return this.loadRecentHistory(
            this.resolvedPipelineId,
            this.loadToken,
            true,
            this.messages,
            true
          );
        },
      });
    }

    return this.historyPollController;
  }

  private syncConversationRefreshTimer() {
    if (!this.shouldLiveRefresh()) {
      this.clearConversationRefreshTimer();
      return;
    }

    const controller = this.getHistoryPollController();
    controller.reset();
    controller.sync();
  }

  private shouldLiveRefresh() {
    return Boolean(
      this.hass &&
        this.resolvedPipelineId &&
        !this.processing &&
        !this.listening &&
        !this.historyDisabled &&
        !this.usesCardOnlyHistory() &&
        this.isConnected &&
        !document.hidden
    );
  }

  private clearConversationRefreshTimer() {
    this.historyPollController?.stop();
  }

  private scheduleInProgressHistoryPoll() {
    if (!this.hasInProgressHistoryRun || !this.shouldLiveRefresh()) {
      return;
    }

    this.historyPollController?.requestSoon(IN_PROGRESS_HISTORY_POLL_MS);
  }

  private handleVisibilityChange = () => {
    if (document.hidden) {
      this.clearConversationRefreshTimer();
    } else {
      this.syncConversationRefreshTimer();
    }
  };

  private getActivePipeline() {
    return this.pipelines.find((pipeline) => pipeline.id === this.resolvedPipelineId);
  }

  private getPipelineEndStage(): "intent" | "tts" {
    const pipeline = this.getActivePipeline();
    if (!this.config.enable_audio_playback || !pipeline?.tts_engine) {
      return "intent";
    }

    return "tts";
  }

  private renderListeningVisualizer() {
    return html`
      <div
        class="listening-visualizer"
        aria-live="polite"
        aria-label=${this.text("listening_for_speech")}
      >
        <span class="listening-dot" aria-hidden="true"></span>
        <span class="listening-label">${this.text("status_listening")}</span>
        <canvas class="listening-visualizer-canvas"></canvas>
      </div>
    `;
  }

  private startMicVisualizer() {
    if (!this.listening) {
      return;
    }

    const canvas = this.renderRoot.querySelector(
      ".listening-visualizer-canvas"
    ) as HTMLCanvasElement | null;
    this.audioController.startMicVisualizer(canvas, () => this.audioRecorder?.getAnalyser());
  }

  private stopMicVisualizer() {
    this.audioController.stopMicVisualizer();
  }

  private isVoicePipelineConfigured() {
    const pipeline = this.getActivePipeline();
    return Boolean(
      this.config.voice_input && !this.config.disable_speech && pipeline?.stt_engine
    );
  }

  private needsHttpsForVoice() {
    return this.isVoicePipelineConfigured() && AssistAudioRecorder.isInsecureConnection();
  }

  private supportsVoiceInput() {
    return this.isVoicePipelineConfigured() && AssistAudioRecorder.isSupported();
  }

  private showMicrophoneNotSupportedMessage() {
    const text = this.getMicrophoneNotSupportedText();

    if (this.messages.some((message) => message.persistLocal && message.text === text)) {
      this.messages = [...this.messages];
      this.scheduleScrollToEnd();
      return;
    }

    this.addMessage({
      role: "assistant",
      text,
      status: "done",
      persistLocal: true,
    });
    this.scheduleScrollToEnd();
  }

  private getMicrophoneNotSupportedText() {
    const browserMessage = this.text("mic_https");
    const docLinkText = this.text("mic_docs_link");
    const docUrl = "https://www.home-assistant.io/docs/configuration/securing/#remote-access";
    const documentationLink = `[${docLinkText}](${docUrl})`;
    const docMessage = this.text("mic_docs", { documentation_link: documentationLink });

    return `${browserMessage}\n\n${docMessage}`;
  }

  private getSpeechRmsThreshold() {
    const threshold = Number(this.config.speech_rms_threshold);
    return Number.isFinite(threshold) && threshold >= 0 ? threshold : DEFAULT_SPEECH_RMS_THRESHOLD;
  }

  private sendSpeechEndChunk() {
    if (
      !this.voiceInputHasSpeech ||
      this.sttBinaryHandlerId === undefined ||
      this.sttBinaryHandlerId === null
    ) {
      return;
    }

    this.sendAudioChunk(new Int16Array());
  }

  private sendAudioChunk(chunk: Int16Array) {
    const result = this.audioController.sendAudioChunk(
      this.hass,
      chunk,
      this.sttBinaryHandlerId,
      this.audioBuffer,
      this.getSpeechRmsThreshold(),
      this.voiceInputHasSpeech,
      () => {
        this.voiceInputHasSpeech = true;
      }
    );
    this.audioBuffer = result.buffer;
    this.voiceInputHasSpeech = result.hasSpeech;
  }

  private flushAudioBuffer() {
    this.audioController.flushAudioBuffer(
      this.hass,
      this.audioBuffer,
      this.sttBinaryHandlerId,
      this.getSpeechRmsThreshold(),
      () => {
        this.voiceInputHasSpeech = true;
      },
      this.voiceInputHasSpeech
    );
    this.audioBuffer = undefined;
  }

  private stopListening(sendEndChunk = true) {
    const hadSpeech = this.voiceInputHasSpeech;

    if (sendEndChunk) {
      if (hadSpeech) {
        this.flushAudioBuffer();
        this.sendSpeechEndChunk();
      } else {
        this.activeUnsubscribe?.();
        this.activeUnsubscribe = undefined;
        this.processing = false;
        this.removeUnprocessedSttMessages();
        this.refreshHistoryAfterRun();
      }
    }

    this.stopMicVisualizer();
    this.audioRecorder?.stop();
    this.audioBuffer = undefined;
    this.sttBinaryHandlerId = undefined;
    this.listening = false;
    this.voiceInputHasSpeech = false;
  }

  private cancelActiveRun() {
    if (!this.processing) {
      return;
    }

    this.messages = finalizeCancelledMessages(this.messages);
    this.audioController.unload(this.hass);
    this.continueConversationAfterRun = false;
    this.stopActiveRun();
    this.refreshHistoryAfterRun();
  }

  private stopActiveRun() {
    this.activeUnsubscribe?.();
    this.activeUnsubscribe = undefined;
    this.stopListening(false);
    this.processing = false;
  }

  private finishRun() {
    this.activeUnsubscribe?.();
    this.activeUnsubscribe = undefined;
    this.processing = false;
    this.stopListening(false);
    this.removeUnprocessedSttMessages();
    this.refreshHistoryAfterRun();
    this.maybeContinueConversationAfterRun(this.audioController.isPlaying());
  }

  private refreshHistoryAfterRun() {
    if (!this.resolvedPipelineId || this.historyDisabled || this.usesCardOnlyHistory()) {
      return;
    }

    const token = ++this.loadToken;
    void this.loadRecentHistory(this.resolvedPipelineId, token, true, this.messages, true);
  }

  private playTtsAudio(url?: string) {
    this.audioController.playTts(
      this.hass,
      url,
      Boolean(this.config.enable_audio_playback),
      this.config.tts_media_player || undefined
    );
  }

  private shouldOfferFollowUpConversation() {
    return Boolean(this.config.continue_conversation || this.config.always_continue_conversation);
  }

  private shouldContinueConversationAfterRun() {
    if (!this.supportsVoiceInput() || !this.shouldOfferFollowUpConversation() || !this.userStartedRecordingOnce) {
      return false;
    }

    return Boolean(this.config.always_continue_conversation || this.continueConversationAfterRun);
  }

  private maybeContinueConversationAfterRun(skipWhenAudioPlaying = false) {
    if (skipWhenAudioPlaying && this.audioController.isPlaying()) {
      return;
    }

    if (this.shouldContinueConversationAfterRun()) {
      void this.startListening();
    }
  }

  private addMessage(message: Omit<AssistChatMessage, "id">) {
    const next: AssistChatMessage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      ...message,
      timestamp: message.timestamp || new Date().toISOString(),
    };
    this.messages = [...this.messages, next];
    return next;
  }

  private setAssistantError(assistant: AssistChatMessage, message: string) {
    assistant.text = message;
    assistant.status = "error";
    this.messages = [...this.messages];
  }

  private clearConversation() {
    this.stopActiveRun();
    this.loadToken++;
    // Anchor "cleared" to server-side run timestamps when available; the
    // local clock can be skewed relative to the Home Assistant host.
    this.conversationClearedAt = this.lastSeenRunTimestamp || Date.now();
    this.conversationId = null;
    this.userStartedRecordingOnce = false;
    this.stickToBottom = true;
    this.stickThinkingToBottom = true;
    this.httpsWarningDismissed = true;
    this.messages = [];
    this.error = "";
  }

  private formatToolCallJson(value: unknown) {
    if (value === undefined || value === null) {
      return "";
    }

    if (typeof value === "string") {
      return value;
    }

    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }

  private getPipelineName(pipelineId: string) {
    return this.pipelines.find((pipeline) => pipeline.id === pipelineId)?.name;
  }

  private getCardStatus(): "idle" | "listening" | "thinking" {
    if (this.listening) {
      return "listening";
    }

    if (this.processing) {
      return "thinking";
    }

    return "idle";
  }

  private getCardStatusLabel(status: "idle" | "listening" | "thinking") {
    if (status === "listening") {
      return this.text("status_listening");
    }

    if (status === "thinking") {
      return this.text("status_thinking");
    }

    return this.text("status_idle");
  }

  private handleSuggestedPromptClick(event: Event) {
    const index = Number((event.currentTarget as HTMLElement).dataset.index);
    const prompt = this.suggestedPrompts[index];

    if (!prompt || this.processing || this.listening) {
      return;
    }

    void this.processText(prompt);
  }

  private handleDismissFollowUpHint = () => {
    dismissFollowUpHint();
    this.followUpHintDismissed = true;
  };

  private getInputPlaceholder() {
    return this.text("input_placeholder");
  }

  private text(key: UiTextKey, values?: Record<string, string>): string {
    const entry = UI_TEXT[key] as { haKey?: string; fallback: string };
    let value = (entry.haKey && this.localize(entry.haKey, values)) || entry.fallback;

    if (values) {
      for (const [name, replacement] of Object.entries(values)) {
        value = value.replace(`{${name}}`, replacement);
      }
    }

    return value;
  }

  private localize(key: string, values?: Record<string, string>) {
    try {
      return this.hass?.localize?.(key, values) || "";
    } catch {
      return "";
    }
  }

  private formatError(error: unknown) {
    return formatAssistError(error, {
      fallback: this.text("request_rejected"),
      micDenied: this.text("mic_denied"),
      micNotFound: this.text("mic_not_found"),
      micHttps: this.text("mic_https"),
    });
  }

  private getRunCount() {
    return getAssistRunCount(this.config.run_count, DEFAULTS.run_count);
  }

  private getHistoryRunCount() {
    return Math.max(this.getRunCount(), 1);
  }

  private usesSessionConversation() {
    return this.config.session_conversation !== false;
  }

  private usesCardOnlyHistory() {
    return this.config.card_only_history === true;
  }

  private resetCardOnlyHistoryState() {
    this.messages = [];
    this.conversationId = null;
    this.lastHistoryKey = "";
    this.lastRunsSnapshot = "";
    this.hasInProgressHistoryRun = false;
    this.clearConversationRefreshTimer();
  }

  private resolveConversationId(historyConversationId: string | null, preserveLocalMessages: boolean) {
    if (this.usesSessionConversation()) {
      return preserveLocalMessages ? this.conversationId : null;
    }

    return historyConversationId || (preserveLocalMessages ? this.conversationId : null);
  }

  static styles = [
    assistConversationBubbleStyles,
    assistTypingDotsStyles,
    css`
    :host {
      height: 100%;
    }

    .template-listener {
      display: none;
    }

    ha-card {
      --assist-user-bubble: var(--assist-chat-user-bubble);
      --assist-user-text: var(--assist-chat-user-text);
      --assist-assistant-bubble: var(--assist-chat-assistant-bubble);
      --assist-assistant-text: var(--assist-chat-assistant-text);
      background: var(--assist-chat-background);
      border: 0;
      border-radius: 20px;
      box-sizing: border-box;
      height: 100%;
      overflow: hidden;
    }

    .card {
      background: var(--assist-chat-background);
      box-sizing: border-box;
      color: var(--primary-text-color);
      display: flex;
      flex-direction: column;
      gap: 12px;
      height: 100%;
      min-width: 0;
      padding: 12px;
    }

    .header {
      align-items: flex-start;
      display: flex;
      gap: 10px;
      justify-content: space-between;
      min-width: 0;
    }

    .header-text {
      display: grid;
      gap: 2px;
      min-width: 0;
    }

    .header-title {
      font-size: 14px;
      font-weight: 700;
      line-height: 1.3;
      margin: 0;
    }

    .header-pipeline {
      color: var(--secondary-text-color);
      font-size: 12px;
      line-height: 1.35;
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .status-pill {
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      border-radius: 999px;
      color: var(--secondary-text-color);
      flex: 0 0 auto;
      font-size: 12px;
      font-weight: 600;
      padding: 4px 8px;
      white-space: nowrap;
    }

    .status-pill.listening,
    .status-pill.thinking {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.16);
      color: var(--primary-color);
    }

    .info-banner {
      align-items: flex-start;
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
      border-radius: 12px;
      color: var(--primary-text-color);
      display: flex;
      font-size: 12px;
      gap: 8px;
      line-height: 1.45;
      padding: 10px 12px;
    }

    .info-banner .dismiss-button {
      flex: 0 0 auto;
      height: 28px;
      width: 28px;
    }

    .info-banner .dismiss-button ha-icon {
      --mdc-icon-size: 16px;
    }

    .suggested-prompts {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      min-width: 0;
    }

    .prompt-chip {
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      border: 0;
      border-radius: 999px;
      color: var(--primary-text-color);
      cursor: pointer;
      font: inherit;
      font-size: 12px;
      line-height: 1.35;
      max-width: 100%;
      padding: 7px 11px;
      text-align: left;
    }

    .prompt-chip:disabled {
      cursor: default;
      opacity: 0.55;
    }

    .messages {
      align-content: start;
      box-sizing: border-box;
      display: grid;
      flex: 1 1 auto;
      gap: 8px;
      grid-auto-rows: max-content;
      grid-template-columns: minmax(0, 1fr);
      min-height: 0;
      min-width: 0;
      overflow-y: auto;
      padding-right: 2px;
      scrollbar-width: thin;
      width: 100%;
    }

    .message {
      align-items: flex-start;
      display: flex;
      min-width: 0;
      width: 100%;
    }

    .message.user {
      justify-content: flex-end;
    }

    .message.assistant {
      justify-content: flex-start;
    }

    .bubble {
      flex: 0 1 auto;
    }

    .user .bubble {
      gap: 6px;
      max-width: 100%;
    }

    .tool-call-chip {
      display: inline-flex;
      flex-direction: column;
      gap: 6px;
      max-width: 100%;
      min-width: 0;
      width: fit-content;
    }

    .tool-call-chip[open] {
      width: 100%;
    }

    .tool-call-chip summary.process-chip {
      cursor: pointer;
      list-style: none;
    }

    .tool-call-chip summary.process-chip::-webkit-details-marker {
      display: none;
    }

    .tool-call-panel {
      background: rgba(0, 0, 0, 0.18);
      border-radius: 12px;
      box-sizing: border-box;
      display: grid;
      gap: 8px;
      max-width: 100%;
      min-width: 0;
      overflow: hidden;
      padding: 8px;
      width: 100%;
    }

    .tool-call-section {
      display: grid;
      gap: 4px;
      min-width: 0;
    }

    .tool-call-label {
      color: var(--secondary-text-color);
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.02em;
      text-transform: uppercase;
    }

    .tool-call-panel pre {
      background: rgba(0, 0, 0, 0.18);
      border-radius: 8px;
      box-sizing: border-box;
      font-size: 11px;
      line-height: 1.4;
      margin: 0;
      max-height: 180px;
      max-width: 100%;
      min-width: 0;
      overflow: auto;
      overflow-wrap: anywhere;
      padding: 8px;
      white-space: pre-wrap;
      width: 100%;
      word-break: break-word;
    }

    .message-time {
      align-self: flex-end;
      flex-shrink: 0;
      font-size: 12px;
      line-height: 1;
      white-space: nowrap;
    }

    .user .bubble .message-time {
      color: color-mix(in srgb, var(--assist-chat-user-text) 80%, transparent);
    }

    .assistant .bubble .message-time {
      color: var(--secondary-text-color);
    }

    .error {
      color: var(--error-color, #db4437);
    }

    ha-markdown {
      --mdc-typography-body1-font-size: 14px;
      color: inherit;
      display: block;
      max-width: 100%;
      min-width: 0;
      overflow-wrap: anywhere;
      width: 100%;
    }

    ha-markdown::part(content) {
      color: inherit;
      max-width: 100%;
      min-width: 0;
      overflow-wrap: anywhere;
      word-break: break-word;
    }

    .empty-state {
      align-items: center;
      align-self: start;
      background: var(--assist-chat-surface);
      border-radius: 16px;
      color: var(--secondary-text-color);
      display: flex;
      font-size: 14px;
      gap: 10px;
      justify-self: start;
      max-width: 100%;
      min-height: 0;
      padding: 10px 12px;
      width: fit-content;
    }

    .error {
      align-items: center;
      background: var(--assist-chat-surface);
      border-radius: 16px;
      color: var(--error-color, #db4437);
      display: flex;
      font-size: 14px;
      gap: 10px;
      min-height: 0;
      padding: 14px;
    }

    .empty-state ha-icon {
      --mdc-icon-size: 20px;
      color: var(--primary-color);
    }

    .process {
      align-self: stretch;
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-width: 0;
      width: 100%;
    }

    .process-stages,
    .process-tools {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      min-width: 0;
    }

    .process-tools {
      align-items: flex-start;
      width: 100%;
    }

    .process-chip {
      align-items: center;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      border-radius: 999px;
      color: var(--secondary-text-color);
      display: inline-flex;
      flex: 0 1 auto;
      font-size: 12px;
      gap: 4px;
      max-width: 100%;
      min-width: 0;
      overflow-wrap: anywhere;
      padding: 4px 7px;
    }

    .process-chip ha-icon {
      --mdc-icon-size: 12px;
    }

    .process-chip.running {
      color: var(--primary-color);
    }

    .process-chip.cancelled {
      color: var(--secondary-text-color);
    }

    .user .process-chip.running {
      color: var(--assist-chat-user-text);
    }

    .process-chip.done {
      color: var(--success-color, #43a047);
    }

    .process-chip.error {
      color: var(--error-color, #db4437);
    }

    .thinking {
      align-self: stretch;
      max-width: 100%;
      min-width: 0;
      width: 100%;
    }

    .thinking summary {
      color: var(--secondary-text-color);
      cursor: pointer;
      font-size: 13px;
      white-space: nowrap;
    }

    .thinking pre {
      background: rgba(0, 0, 0, 0.18);
      border-radius: 12px;
      box-sizing: border-box;
      font-size: 12px;
      line-height: 1.45;
      margin: 8px 0 0;
      max-height: 220px;
      overflow: auto;
      overflow-wrap: break-word;
      padding: 10px;
      white-space: pre-wrap;
      width: 100%;
      word-break: break-word;
    }

    .input-row {
      align-items: center;
      display: flex;
      flex: 0 0 auto;
      gap: 8px;
    }

    input {
      background: var(--assist-chat-surface);
      border: 0;
      border-radius: 999px;
      box-sizing: border-box;
      color: var(--primary-text-color);
      flex: 1 1 auto;
      font: inherit;
      font-size: 14px;
      min-width: 0;
      outline: none;
      padding: 11px 13px;
    }

    input::placeholder {
      color: var(--secondary-text-color);
    }

    .listening-visualizer {
      align-items: center;
      background: var(--assist-chat-surface);
      border-radius: 999px;
      box-sizing: border-box;
      color: var(--primary-text-color);
      display: flex;
      flex: 1 1 auto;
      font-size: 14px;
      gap: 8px;
      min-width: 0;
      padding: 8px 13px;
    }

    .listening-dot {
      animation: listening-pulse 1.4s ease-in-out infinite;
      background: var(--assist-chat-user-bubble);
      border-radius: 50%;
      flex: 0 0 auto;
      height: 8px;
      width: 8px;
    }

    .listening-label {
      flex: 0 0 auto;
      font-size: 14px;
    }

    .listening-visualizer-canvas {
      display: block;
      flex: 1 1 auto;
      height: 32px;
      min-width: 0;
      width: 100%;
    }

    @keyframes listening-pulse {
      0%,
      100% {
        opacity: 1;
        transform: scale(1);
      }

      50% {
        opacity: 0.55;
        transform: scale(0.85);
      }
    }

    button {
      -webkit-tap-highlight-color: transparent;
      cursor: pointer;
      font: inherit;
    }

    button:disabled {
      cursor: default;
      opacity: 0.55;
    }

    .icon-button,
    .send-button {
      align-items: center;
      background: var(--assist-chat-surface);
      border: 0;
      border-radius: 50%;
      color: var(--primary-text-color);
      display: inline-flex;
      flex: 0 0 auto;
      height: 42px;
      justify-content: center;
      padding: 0;
      width: 42px;
    }

    .send-button,
    .icon-button.listening {
      background: var(--assist-chat-user-bubble);
      color: var(--assist-chat-user-text);
    }

    .icon-button.cancel-button {
      color: var(--error-color, #db4437);
    }

    .icon-button ha-icon,
    .send-button ha-icon {
      --mdc-icon-size: 20px;
    }

  `,
  ];
}

customElements.define("assist-chat-card", AssistChatCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "assist-chat-card",
  name: "Assist Chat Card",
  description: "Dashboard chat card for Home Assistant Assist",
});
