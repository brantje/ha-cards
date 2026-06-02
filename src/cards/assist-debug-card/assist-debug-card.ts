import { css, html, PropertyValues } from "lit";
import { styleMap } from "lit/directives/style-map.js";
import { handleActionConfig, HomeAssistant } from "custom-card-helpers";
import { BaseCard } from "../../shared/base-card";
import "./assist-debug-card-editor";

type MetadataMode = "hidden" | "compact" | "full";
type AudioVisualizationType = "waveform" | "spectrum" | "meter" | "glow" | "ulysse31";
type AudioVisualizationPosition = "background" | "top" | "between" | "below_chat";

type AssistDebugCardConfig = {
  type: string;
  title?: string;
  pipeline_id?: string;
  run_count?: number;
  minimalistic_mode?: boolean;
  visualization_only?: boolean;
  conversation_only?: boolean;
  show_conversation?: boolean;
  metadata_mode?: MetadataMode;
  show_raw?: boolean;
  show_thinking?: boolean;
  show_summary?: boolean;
  show_stt?: boolean;
  show_intent?: boolean;
  show_tts?: boolean;
  mask_transcripts?: boolean;
  refresh_entity?: string;
  background_color?: string;
  surface_color?: string;
  text_color?: string;
  secondary_text_color?: string;
  accent_color?: string;
  user_chat_color?: string;
  user_chat_text_color?: string;
  assistant_chat_color?: string;
  assistant_chat_text_color?: string;
  audio_visualization?: boolean;
  audio_visualization_type?: AudioVisualizationType;
  audio_visualization_position?: AudioVisualizationPosition;
  audio_visualization_height?: number;
  audio_visualization_color?: string;
  audio_visualization_secondary_color?: string;
  audio_visualization_background?: string;
  audio_visualization_opacity?: number;
  audio_visualization_start_delay?: number;
};

type AssistPipeline = {
  id: string;
  name: string;
  language?: string;
};

type AssistRunListing = {
  pipeline_run_id: string;
  timestamp: string;
};

type PipelineRunEvent = {
  type: string;
  timestamp: string;
  data?: Record<string, any>;
};

type TtsAudio = {
  url: string;
  mimeType?: string;
  token?: string;
  mediaId?: string;
  timestamp?: string;
};

type StageModel = {
  engine?: string;
  language?: string;
  voice?: string;
  input?: string;
  output?: string;
  done: boolean;
  raw?: Record<string, any>;
};

type RunModel = {
  pipelineId: string;
  pipelineName?: string;
  runId: string;
  started?: Date;
  finished?: Date;
  stage: "ready" | "wake_word" | "stt" | "intent" | "tts" | "done" | "error";
  language?: string;
  run?: Record<string, any>;
  stt?: StageModel;
  intent?: StageModel & {
    preferLocalIntents?: boolean;
    processedLocally?: boolean;
  };
  tts?: StageModel;
  ttsAudio?: TtsAudio;
  error?: {
    code?: string;
    message?: string;
  };
  events: PipelineRunEvent[];
};

const DEFAULT_TITLE = "Assist debug";
const DEFAULT_PIPELINE_ID = "preferred";
const DEFAULT_RUN_COUNT = 5;
const DEFAULT_METADATA_MODE: MetadataMode = "compact";
const DEFAULT_AUDIO_VISUALIZATION_TYPE: AudioVisualizationType = "waveform";
const DEFAULT_AUDIO_VISUALIZATION_POSITION: AudioVisualizationPosition = "below_chat";
const ULYSSE31_AUDIO_COLOR = "#39ff14";
const ULYSSE31_AUDIO_BACKGROUND = "#000000";
const CONVERSATION_REFRESH_MS = 2000;
const THINKING_SCROLL_BOTTOM_THRESHOLD = 48;

const TEXT_KEYS = new Set([
  "text",
  "intent_input",
  "tts_input",
  "speech",
  "content",
  "thinking_content",
]);

class AssistDebugCard extends BaseCard {
  private static nextAudioVisualizationId = 0;

  config!: AssistDebugCardConfig;
  hass!: HomeAssistant;
  private readonly audioVisualizationId = `assist-debug-audio-${AssistDebugCard.nextAudioVisualizationId++}`;
  private loading = false;
  private error = "";
  private pipelines: AssistPipeline[] = [];
  private runs: AssistRunListing[] = [];
  private selectedRunId = "";
  private resolvedPipelineId = "";
  private runModel?: RunModel;
  private readonly sessionStartedAt = Date.now();
  private loadToken = 0;
  private lastLoadKey = "";
  private conversationRefreshTimer?: number;
  private thinkingDetailsOpen = false;
  private thinkingDetailsUserCollapsed = false;
  private thinkingDetailsRunId = "";
  private thinkingScrollRunId = "";
  private thinkingLastScrolledLength = 0;
  private thinkingAutoScrollEnabled = true;
  private audioContext?: AudioContext;
  private audioBuffer?: AudioBuffer;
  private analyser?: AnalyserNode;
  private audioSource?: AudioBufferSourceNode;
  private silentGain?: GainNode;
  private audioAnimationFrame?: number;
  private ulysse31AnimationFrame?: number;
  private ulysse31RotationX = 0;
  private ulysse31RotationY = 0;
  private ulysse31LastFrameAt = 0;
  private audioData?: Uint8Array;
  private audioStaticData?: Uint8Array;
  private audioPlaybackData?: Uint8Array;
  private audioKey = "";
  private audioSourceEnded = false;
  private audioAnimationStartedAt = 0;
  private audioStartDelayTimer?: number;
  private audioVisualizationStatus = "";
  private audioVisualizationLoading = false;
  private audioVisualizationError = "";
  private audioFetchUnavailable = false;
  private audioVisualizationPainted = false;
  private audioNeedsUserStart = false;
  private audioIsVisible = true;
  private intersectionObserver?: IntersectionObserver;
  private handleDocumentVisibilityChange = () => {
    this.audioIsVisible = !document.hidden;
    this.syncAudioAnimation();
    this.syncUlysse31IdleAnimation();
  };

  static properties = {
    hass: { attribute: false },
    config: { attribute: false },
    loading: { state: true },
    error: { state: true },
    pipelines: { state: true },
    runs: { state: true },
    selectedRunId: { state: true },
    resolvedPipelineId: { state: true },
    runModel: { state: true },
    audioVisualizationLoading: { state: true },
    audioVisualizationError: { state: true },
    audioVisualizationPainted: { state: true },
    audioNeedsUserStart: { state: true },
    audioVisualizationStatus: { state: true },
    thinkingDetailsOpen: { state: true },
  };

  static getConfigElement() {
    return document.createElement("assist-debug-card-editor");
  }

  static getStubConfig() {
    return {
      title: DEFAULT_TITLE,
      pipeline_id: DEFAULT_PIPELINE_ID,
      run_count: DEFAULT_RUN_COUNT,
      minimalistic_mode: false,
      visualization_only: false,
      conversation_only: false,
      show_conversation: false,
      metadata_mode: DEFAULT_METADATA_MODE,
      show_raw: true,
      show_thinking: true,
      show_summary: true,
      show_stt: true,
      show_intent: true,
      show_tts: true,
      mask_transcripts: false,
      audio_visualization: false,
      audio_visualization_type: DEFAULT_AUDIO_VISUALIZATION_TYPE,
      audio_visualization_position: DEFAULT_AUDIO_VISUALIZATION_POSITION,
    };
  }

  setConfig(config: AssistDebugCardConfig) {
    this.config = {
      title: DEFAULT_TITLE,
      pipeline_id: DEFAULT_PIPELINE_ID,
      run_count: DEFAULT_RUN_COUNT,
      minimalistic_mode: false,
      visualization_only: false,
      conversation_only: false,
      show_conversation: false,
      metadata_mode: DEFAULT_METADATA_MODE,
      show_raw: true,
      show_thinking: true,
      show_summary: true,
      show_stt: true,
      show_intent: true,
      show_tts: true,
      mask_transcripts: false,
      audio_visualization: false,
      audio_visualization_type: DEFAULT_AUDIO_VISUALIZATION_TYPE,
      audio_visualization_position: DEFAULT_AUDIO_VISUALIZATION_POSITION,
      ...config,
    };
  }

  protected getWatchedEntities(): string[] {
    return this.config?.refresh_entity ? [this.config.refresh_entity] : [];
  }

  connectedCallback() {
    super.connectedCallback();
    this.setupAudioVisibilityTracking();
    this.syncConversationRefreshTimer();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.clearConversationRefreshTimer();
    this.teardownAudioVisibilityTracking();
    this.cleanupAudioVisualization(true, true);
  }

  shouldUpdate(changedProperties: PropertyValues): boolean {
    if (
      changedProperties.has("config") ||
      changedProperties.has("loading") ||
      changedProperties.has("error") ||
      changedProperties.has("pipelines") ||
      changedProperties.has("runs") ||
      changedProperties.has("selectedRunId") ||
      changedProperties.has("resolvedPipelineId") ||
      changedProperties.has("runModel") ||
      changedProperties.has("audioVisualizationLoading") ||
      changedProperties.has("audioVisualizationError") ||
      changedProperties.has("audioVisualizationPainted") ||
      changedProperties.has("audioNeedsUserStart") ||
      changedProperties.has("thinkingDetailsOpen")
    ) {
      return true;
    }

    if (changedProperties.has("hass")) {
      const oldHass = changedProperties.get("hass") as HomeAssistant | undefined;
      if (!oldHass) {
        return Boolean(this.hass);
      }

      return super.shouldUpdate(changedProperties);
    }

    return false;
  }

  updated(changedProperties: PropertyValues) {
    if (!this.hass || !this.config) {
      return;
    }

    if (changedProperties.has("config") || changedProperties.has("hass")) {
      const oldHass = changedProperties.get("hass") as HomeAssistant | undefined;
      this.loadDebugData(Boolean(oldHass));
    }

    if (
      changedProperties.has("config") ||
      changedProperties.has("hass") ||
      changedProperties.has("loading") ||
      changedProperties.has("runModel") ||
      changedProperties.has("selectedRunId") ||
      changedProperties.has("runs")
    ) {
      this.syncConversationRefreshTimer();
    }

    if (changedProperties.has("config") || changedProperties.has("runModel") || changedProperties.has("hass")) {
      this.syncAudioVisualization();
    }

    if (
      this.config.show_thinking &&
      (changedProperties.has("runModel") || changedProperties.has("thinkingDetailsOpen"))
    ) {
      void this.updateComplete.then(() => this.maybeAutoScrollThinking());
    }
  }

  render() {
    const title = this.config.title || DEFAULT_TITLE;
    const pipelineName = this.getPipelineName(this.resolvedPipelineId);
    const styles = this.getCardStyles();

    return html`
      <ha-card style=${styleMap(styles)}>
        <div class=${this.config.visualization_only ? "card visualization-only-card" : "card"}>
          ${this.renderCardGlowVisualization()}
          ${this.config.visualization_only
            ? this.renderVisualizationOnlyContent()
            : html`
                ${this.config.minimalistic_mode
            ? ""
            : html`
                <header class="header">
                  <div>
                    <div class="eyebrow">${this.localize("ui.panel.config.voice_assistants.debug.title") || "Assist debug"}</div>
                    <h2>${title}</h2>
                    <p>${pipelineName || this.resolvedPipelineId || "Preferred pipeline"}</p>
                  </div>
                  <div class="actions">
                    <button class="icon-button" type="button" title="Refresh" aria-label="Refresh" @click=${this.handleRefresh}>
                      <ha-icon icon="mdi:refresh"></ha-icon>
                    </button>
                    <button class="icon-button" type="button" title="Open debug" aria-label="Open debug" @click=${this.openDebugPage}>
                      <ha-icon icon="mdi:open-in-new"></ha-icon>
                    </button>
                  </div>
                </header>
              `}

          ${this.renderContent()}
              `}
        </div>
      </ha-card>
    `;
  }

  private renderContent() {
    if (this.error) {
      return html`
        <div class="state error-state">
          <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
          <div>
            <strong>Unable to load debug data</strong>
            <span>${this.error}</span>
          </div>
        </div>
      `;
    }

    if (this.config.conversation_only && (this.loading || !this.runModel)) {
      return this.renderConversationOnly(this.runModel);
    }

    if (this.loading && !this.runModel) {
      return html`
        <div class="state">
          <ha-icon icon="mdi:progress-clock"></ha-icon>
          <span>Loading recent conversation runs...</span>
        </div>
      `;
    }

    if (!this.runModel) {
      return html`
        <div class="state">
          <ha-icon icon="mdi:message-processing-outline"></ha-icon>
          <div>
            <strong>No debug runs yet</strong>
            <span>Run a voice assistant conversation, then refresh this card.</span>
          </div>
        </div>
      `;
    }

    if (this.config.conversation_only) {
      return this.renderConversationOnly(this.runModel);
    }

    return html`
      ${this.renderAudioVisualization("top")}
      ${this.renderRunPicker()}
      ${this.config.show_conversation ? this.renderConversationOnly(this.runModel, false) : this.renderAudioVisualization("below_chat")}
      <div class="timeline">
        ${this.config.show_summary ? this.renderSummary(this.runModel) : ""}
        ${this.config.show_stt ? this.renderStage("Speech-to-text", "stt", this.runModel.stt) : ""}
        ${this.config.show_intent
          ? this.renderStage("Natural language processing", "intent", this.runModel.intent)
          : ""}
        ${this.config.show_tts ? this.renderStage("Text-to-speech", "tts", this.runModel.tts) : ""}
        ${this.renderThinking(this.runModel)}
        ${this.renderRaw(this.runModel)}
      </div>
    `;
  }

  private renderVisualizationOnlyContent() {
    if (!this.config.audio_visualization) {
      return "";
    }

    if (this.getAudioVisualizationType() === "glow") {
      return html`<div class="visualization-only-spacer" aria-hidden="true"></div>`;
    }

    return this.renderStandaloneAudioVisualization();
  }

  private renderRunPicker() {
    if (this.runs.length <= 1) {
      return "";
    }

    return html`
      <div class="run-picker" aria-label="Recent debug runs">
        ${this.runs.map(
          (run) => html`
            <button
              type="button"
              class=${run.pipeline_run_id === this.selectedRunId ? "run-chip selected" : "run-chip"}
              @click=${() => this.selectRun(run.pipeline_run_id)}
            >
              <span>${this.formatTime(run.timestamp)}</span>
              <small>${this.shortId(run.pipeline_run_id)}</small>
            </button>
          `
        )}
      </div>
    `;
  }

  private renderConversationOnly(run?: RunModel, renderTop = true) {
    const position = this.getAudioVisualizationPosition();
    const backgroundVisualization = this.renderAudioVisualization("background");
    const topVisualization = renderTop ? this.renderAudioVisualization("top") : "";
    const belowVisualization = this.renderAudioVisualization("below_chat");

    if (!run) {
      return html`
        ${topVisualization}
        <div class=${position === "background" ? "conversation-shell has-background-visualization" : "conversation-shell"}>
          ${backgroundVisualization}
          <div class="conversation conversation-only">
            <div class="bubble assistant loading">
              ${this.renderTypingDots()}
              <span>${this.loading ? "Loading conversation..." : "Waiting for a conversation..."}</span>
            </div>
          </div>
        </div>
        ${belowVisualization}
      `;
    }

    const { userText, assistantText } = this.getConversationMessages(run);
    const hasReply = Boolean(assistantText);
    const isError = run.stage === "error";
    const isProcessing = !hasReply && !isError;

    return html`
      ${topVisualization}
      <div class=${position === "background" ? "conversation-shell has-background-visualization" : "conversation-shell"}>
        ${backgroundVisualization}
        <div class="conversation conversation-only">
          ${userText ? html`<div class="bubble user">${userText}</div>` : ""}
          ${this.renderAudioVisualization("between")}
          ${hasReply
            ? html`<div class="bubble assistant">${assistantText}</div>`
            : isError
              ? html`<div class="bubble assistant error-bubble">${run.error?.message || "The assistant run failed."}</div>`
              : html`
                  <div class="bubble assistant loading">
                    ${this.renderTypingDots()}
                    <span>${this.getConversationLoadingText(run, isProcessing)}</span>
                  </div>
                `}
        </div>
      </div>
      ${belowVisualization}
    `;
  }

  private renderAudioVisualization(position: AudioVisualizationPosition) {
    if (
      !this.config.audio_visualization ||
      this.getAudioVisualizationType() === "glow" ||
      this.getAudioVisualizationPosition() !== position
    ) {
      return "";
    }

    const isUlysse31 = this.getAudioVisualizationType() === "ulysse31";
    if (!isUlysse31 && !this.runModel?.ttsAudio && !this.audioVisualizationLoading && !this.audioVisualizationError) {
      return "";
    }

    const isBackground = position === "background";
    const className =
      isBackground && !this.audioVisualizationPainted
        ? "audio-visualization audio-visualization-background is-pending"
        : `audio-visualization audio-visualization-${position}`;

    return html`
      <div class=${className}>
        <canvas
          class="audio-visualization-canvas"
          data-audio-visualization-id=${this.audioVisualizationId}
          aria-hidden="true"
        ></canvas>
        ${this.audioVisualizationError
          ? html`<div class="audio-visualization-overlay error-message">${this.audioVisualizationError}</div>`
          : ""}
        ${this.audioNeedsUserStart
          ? html`
              <button class="audio-start-button" type="button" @click=${this.handleStartAudioVisualization}>
                Start visualization
              </button>
            `
          : ""}
      </div>
    `;
  }

  private renderStandaloneAudioVisualization() {
    return html`
      <div class="audio-visualization audio-visualization-standalone">
        <canvas
          class="audio-visualization-canvas"
          data-audio-visualization-id=${this.audioVisualizationId}
          aria-hidden="true"
        ></canvas>
        ${this.audioVisualizationError
          ? html`<div class="audio-visualization-overlay error-message">${this.audioVisualizationError}</div>`
          : ""}
        ${this.audioNeedsUserStart
          ? html`
              <button class="audio-start-button" type="button" @click=${this.handleStartAudioVisualization}>
                Start visualization
              </button>
            `
          : ""}
      </div>
    `;
  }

  private renderCardGlowVisualization() {
    if (!this.config.audio_visualization || this.getAudioVisualizationType() !== "glow") {
      return "";
    }

    if (
      !this.config.visualization_only &&
      !this.runModel?.ttsAudio &&
      !this.audioVisualizationLoading &&
      !this.audioVisualizationError
    ) {
      return "";
    }

    return html`
      <div class="audio-visualization audio-visualization-card-background">
        <canvas
          class="audio-visualization-canvas"
          data-audio-visualization-id=${this.audioVisualizationId}
          aria-hidden="true"
        ></canvas>
      </div>
    `;
  }

  private renderTypingDots() {
    return html`
      <span class="typing-dots" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </span>
    `;
  }

  private renderSummary(run: RunModel) {
    const completed = run.stage === "done" || run.stage === "error";
    const duration = this.formatDuration(run.started, run.finished);

    return html`
      <details class="section summary" ?open=${completed}>
        <summary>
          <span class="status ${run.stage === "error" ? "error" : completed ? "done" : "running"}">
            <ha-icon .icon=${this.getStatusIcon(run.stage === "error" ? "error" : completed ? "done" : "running")}></ha-icon>
          </span>
          <span class="section-title">Run summary</span>
          <span class="duration">${duration || (this.loading ? "Updating" : "In progress")}</span>
          <ha-icon class="chevron" icon="mdi:chevron-down"></ha-icon>
        </summary>
        <div class="section-body">
          <dl class="meta-grid">
            <div>
              <dt>Run</dt>
              <dd>${this.shortId(run.runId)}</dd>
            </div>
            <div>
              <dt>Pipeline</dt>
              <dd>${run.pipelineName || run.pipelineId}</dd>
            </div>
            ${run.language
              ? html`
                  <div>
                    <dt>Language</dt>
                    <dd>${run.language}</dd>
                  </div>
                `
              : ""}
            <div>
              <dt>Status</dt>
              <dd>${run.error?.message || this.formatStageName(run.stage)}</dd>
            </div>
          </dl>
          ${run.error ? html`<p class="error-message">${run.error.message || run.error.code}</p>` : ""}
        </div>
      </details>
    `;
  }

  private renderStage(label: string, key: "stt" | "intent" | "tts", stage?: StageModel) {
    const status = this.getStageStatus(key, stage);
    const metadataMode = this.config.metadata_mode || DEFAULT_METADATA_MODE;
    const open = status === "running" || status === "error";
    const primary = this.maskText(stage?.output || stage?.input || "");

    return html`
      <details class="section" ?open=${open}>
        <summary>
          <span class="status ${status}">
            <ha-icon .icon=${this.getStatusIcon(status)}></ha-icon>
          </span>
          <span class="section-title">${label}</span>
          <span class="duration">${this.getStageDuration(key)}</span>
          <ha-icon class="chevron" icon="mdi:chevron-down"></ha-icon>
        </summary>
        <div class="section-body">
          ${primary ? html`<p class="stage-text">${primary}</p>` : html`<p class="muted">No data recorded for this stage.</p>`}
          ${metadataMode !== "hidden" && stage ? this.renderStageMetadata(key, stage, metadataMode) : ""}
        </div>
      </details>
    `;
  }

  private renderStageMetadata(key: "stt" | "intent" | "tts", stage: StageModel, mode: MetadataMode) {
    const rows: Array<[string, unknown]> = [
      ["Engine", stage.engine],
      ["Language", stage.language],
    ];

    if (key === "tts") {
      rows.push(["Voice", stage.voice]);
    }

    if (key === "intent" && mode === "full") {
      const intent = stage as RunModel["intent"];
      rows.push(["Prefer local", intent?.preferLocalIntents]);
      rows.push(["Processed locally", intent?.processedLocally]);
    }

    const visibleRows = rows.filter(([, value]) => value !== undefined && value !== null && value !== "");
    if (!visibleRows.length) {
      return "";
    }

    return html`
      <dl class=${mode === "full" ? "meta-grid full" : "meta-grid"}>
        ${visibleRows.map(
          ([label, value]) => html`
            <div>
              <dt>${label}</dt>
              <dd>${String(value)}</dd>
            </div>
          `
        )}
      </dl>
    `;
  }

  private renderThinking(run: RunModel) {
    if (!this.config.show_thinking) {
      return "";
    }

    const thinking = this.extractThinkingFromEvents(run.events);
    const waitingForThinking = run.stage === "intent" && !run.intent?.done && !thinking;

    if (!thinking && !waitingForThinking) {
      return "";
    }

    const isStreaming = this.isThinkingLive(run);
    this.syncThinkingDetailsOpen(run, isStreaming);
    const badge = isStreaming ? "Streaming…" : thinking ? `${thinking.length} chars` : "";

    return html`
      <details
        class="section thinking"
        ?open=${this.thinkingDetailsOpen}
        @toggle=${this.handleThinkingToggle}
      >
        <summary>
          <span class="status idle">
            <ha-icon icon="mdi:brain"></ha-icon>
          </span>
          <span class="section-title">Thinking</span>
          <span class="duration">${badge}</span>
          <ha-icon class="chevron" icon="mdi:chevron-down"></ha-icon>
        </summary>
        <pre
          class="thinking-content"
          @scroll=${this.handleThinkingScroll}
          .textContent=${thinking || "Waiting for model thinking…"}
        ></pre>
      </details>
    `;
  }

  private syncThinkingDetailsOpen(run: RunModel, isStreaming: boolean) {
    if (run.runId !== this.thinkingDetailsRunId) {
      this.thinkingDetailsRunId = run.runId;
      this.thinkingDetailsUserCollapsed = false;
      this.thinkingDetailsOpen = false;
    }

    if (isStreaming && !this.thinkingDetailsUserCollapsed) {
      this.thinkingDetailsOpen = true;
    }
  }

  private handleThinkingToggle(event: Event) {
    const details = event.currentTarget as HTMLDetailsElement;
    this.thinkingDetailsOpen = details.open;
    if (!details.open) {
      this.thinkingDetailsUserCollapsed = true;
    }
  }

  private handleThinkingScroll(event: Event) {
    const pre = event.currentTarget as HTMLElement;
    if (!this.runModel || !this.isThinkingLive(this.runModel)) {
      return;
    }

    const distanceFromBottom = pre.scrollHeight - pre.scrollTop - pre.clientHeight;
    this.thinkingAutoScrollEnabled = distanceFromBottom <= THINKING_SCROLL_BOTTOM_THRESHOLD;
  }

  private scrollThinkingToEnd() {
    const pre = this.renderRoot?.querySelector(".thinking-content") as HTMLElement | null;
    if (!pre) {
      return;
    }

    pre.scrollTop = pre.scrollHeight;
  }

  private maybeAutoScrollThinking() {
    const run = this.runModel;
    if (!run || !this.config.show_thinking || !this.thinkingDetailsOpen) {
      return;
    }

    if (run.runId !== this.thinkingScrollRunId) {
      this.thinkingScrollRunId = run.runId;
      this.thinkingLastScrolledLength = 0;
      this.thinkingAutoScrollEnabled = true;
    }

    if (!this.isThinkingLive(run)) {
      return;
    }

    const thinkingLength = this.extractThinkingFromEvents(run.events).length;
    if (thinkingLength <= this.thinkingLastScrolledLength || !this.thinkingAutoScrollEnabled) {
      return;
    }

    this.scrollThinkingToEnd();
    this.thinkingLastScrolledLength = thinkingLength;
  }

  private renderRaw(run: RunModel) {
    if (!this.config.show_raw) {
      return "";
    }

    const raw = {
      pipeline_id: run.pipelineId,
      pipeline_run_id: run.runId,
      events: this.config.mask_transcripts ? this.maskRaw(run.events) : run.events,
    };

    return html`
      <details class="section raw">
        <summary>
          <span class="status idle">
            <ha-icon icon="mdi:code-json"></ha-icon>
          </span>
          <span class="section-title">Raw payload</span>
          <span class="duration">${run.events.length} events</span>
          <ha-icon class="chevron" icon="mdi:chevron-down"></ha-icon>
        </summary>
        <pre>${JSON.stringify(raw, null, 2)}</pre>
      </details>
    `;
  }

  private async loadDebugData(force = false) {
    const loadKey = JSON.stringify({
      pipeline_id: this.config.pipeline_id || DEFAULT_PIPELINE_ID,
      run_count: this.config.run_count || DEFAULT_RUN_COUNT,
      refresh_entity: this.config.refresh_entity || "",
    });

    if (!force && loadKey === this.lastLoadKey && this.runModel) {
      return;
    }

    this.lastLoadKey = loadKey;
    const token = ++this.loadToken;
    this.loading = true;
    this.error = "";

    try {
      const pipelineResponse = (await (this.hass as any).callWS({
        type: "assist_pipeline/pipeline/list",
      })) as { pipelines: AssistPipeline[]; preferred_pipeline: string | null };

      if (token !== this.loadToken) {
        return;
      }

      this.pipelines = pipelineResponse.pipelines || [];
      const pipelineId = this.resolvePipelineId(pipelineResponse);
      this.resolvedPipelineId = pipelineId;

      if (!pipelineId) {
        this.runs = [];
        this.selectedRunId = "";
        this.runModel = undefined;
        return;
      }

      const runsResponse = (await (this.hass as any).callWS({
        type: "assist_pipeline/pipeline_debug/list",
        pipeline_id: pipelineId,
      })) as { pipeline_runs: AssistRunListing[] };

      if (token !== this.loadToken) {
        return;
      }

      const previousLatestRunId = this.runs[0]?.pipeline_run_id || "";
      const recentRuns = [...(runsResponse.pipeline_runs || [])]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, this.getRunCount());

      this.runs = recentRuns;
      const latestRunId = recentRuns[0]?.pipeline_run_id || "";
      const shouldFollowLatest =
        force && this.isLiveConversationMode() && (!this.selectedRunId || this.selectedRunId === previousLatestRunId);
      const selectedRunId =
        shouldFollowLatest || !recentRuns.some((run) => run.pipeline_run_id === this.selectedRunId)
          ? latestRunId
          : this.selectedRunId;
      this.selectedRunId = selectedRunId;

      if (!selectedRunId) {
        this.runModel = undefined;
        return;
      }

      await this.loadRun(pipelineId, selectedRunId, token);
    } catch (error) {
      if (token !== this.loadToken) {
        return;
      }

      this.error = this.formatError(error);
      this.runModel = undefined;
    } finally {
      if (token === this.loadToken) {
        this.loading = false;
      }
    }
  }

  private async loadRun(pipelineId: string, runId: string, token = this.loadToken) {
    const runResponse = (await (this.hass as any).callWS({
      type: "assist_pipeline/pipeline_debug/get",
      pipeline_id: pipelineId,
      pipeline_run_id: runId,
    })) as { events: PipelineRunEvent[] };

    if (token !== this.loadToken) {
      return;
    }

    const listing = this.runs.find((run) => run.pipeline_run_id === runId);
    this.runModel = this.buildRunModel(pipelineId, runId, runResponse.events || [], listing);
  }

  private buildRunModel(
    pipelineId: string,
    runId: string,
    events: PipelineRunEvent[],
    listing?: AssistRunListing
  ): RunModel {
    const model: RunModel = {
      pipelineId,
      pipelineName: this.getPipelineName(pipelineId),
      runId,
      stage: "ready",
      started: listing ? new Date(listing.timestamp) : undefined,
      events,
    };

    for (const event of events) {
      const data = event.data || {};

      if (event.type === "run-start") {
        model.run = data;
        model.language = String(data.language || "");
        model.started = new Date(event.timestamp);
        model.ttsAudio = this.extractTtsAudio(data.tts_output, event.timestamp) || model.ttsAudio;
      } else if (event.type === "stt-start") {
        model.stage = "stt";
        model.stt = {
          engine: String(data.engine || ""),
          language: data.metadata?.language,
          done: false,
          raw: data,
        };
      } else if (event.type === "stt-end") {
        model.stt = {
          ...(model.stt || { done: false }),
          output: data.stt_output?.text,
          done: true,
          raw: { ...(model.stt?.raw || {}), ...data },
        };
      } else if (event.type === "intent-start") {
        model.stage = "intent";
        model.intent = {
          engine: String(data.engine || ""),
          language: String(data.language || ""),
          input: data.intent_input,
          preferLocalIntents: data.prefer_local_intents,
          done: false,
          raw: data,
        };
      } else if (event.type === "intent-end") {
        model.intent = {
          ...(model.intent || { done: false }),
          output: this.extractSpeechFromIntentOutput(data.intent_output),
          processedLocally: data.processed_locally,
          done: true,
          raw: { ...(model.intent?.raw || {}), ...data },
        };
      } else if (event.type === "tts-start") {
        model.stage = "tts";
        model.tts = {
          engine: String(data.engine || ""),
          language: String(data.language || ""),
          voice: data.voice,
          input: data.tts_input,
          done: false,
          raw: data,
        };
      } else if (event.type === "tts-end") {
        model.tts = {
          ...(model.tts || { done: false }),
          done: true,
          raw: { ...(model.tts?.raw || {}), ...data },
        };
        model.ttsAudio = this.extractTtsAudio(data.tts_output, event.timestamp) || model.ttsAudio;
      } else if (event.type === "run-end") {
        model.stage = "done";
        model.finished = new Date(event.timestamp);
      } else if (event.type === "error") {
        model.stage = "error";
        model.finished = new Date(event.timestamp);
        model.error = {
          code: data.code,
          message: data.message,
        };
      }
    }

    return model;
  }

  private async selectRun(runId: string) {
    if (!this.resolvedPipelineId || runId === this.selectedRunId) {
      return;
    }

    const token = ++this.loadToken;
    this.selectedRunId = runId;
    this.loading = true;
    this.error = "";

    try {
      await this.loadRun(this.resolvedPipelineId, runId, token);
    } catch (error) {
      if (token === this.loadToken) {
        this.error = this.formatError(error);
      }
    } finally {
      if (token === this.loadToken) {
        this.loading = false;
      }
    }
  }

  private handleRefresh(event: Event) {
    event.stopPropagation();
    this.loadDebugData(true);
  }

  private async handleStartAudioVisualization(event: Event) {
    event.stopPropagation();

    if (!this.audioContext || !this.audioBuffer) {
      await this.syncAudioVisualization(true);
      return;
    }

    try {
      await this.audioContext.resume();
      this.audioNeedsUserStart = this.audioContext.state !== "running";

      if (!this.audioNeedsUserStart) {
        this.prepareAudioAnalyser();
        this.syncAudioAnimation();
      }
    } catch (error) {
      this.audioVisualizationError = this.formatError(error);
      this.audioNeedsUserStart = true;
    }
  }

  private syncConversationRefreshTimer() {
    if (!this.shouldLiveRefresh() || !this.hass) {
      this.clearConversationRefreshTimer();
      return;
    }

    if (this.conversationRefreshTimer !== undefined) {
      return;
    }

    this.conversationRefreshTimer = window.setInterval(() => {
      if (!this.loading) {
        this.loadDebugData(true);
      }
    }, CONVERSATION_REFRESH_MS);
  }

  private shouldLiveRefresh() {
    if (this.isLiveConversationMode()) {
      return true;
    }

    if (!this.config.show_thinking || !this.runModel) {
      return false;
    }

    if (!this.isLatestSelectedRun()) {
      return false;
    }

    return !this.isRunFinished(this.runModel);
  }

  private isLiveConversationMode() {
    return Boolean(this.config?.conversation_only || this.config?.show_conversation);
  }

  private isLatestSelectedRun() {
    const latestRunId = this.runs[0]?.pipeline_run_id || "";
    return Boolean(latestRunId && this.selectedRunId === latestRunId);
  }

  private isRunFinished(run: RunModel) {
    return run.stage === "done" || run.stage === "error";
  }

  private isThinkingLive(run: RunModel) {
    return Boolean(this.config.show_thinking) && this.isLatestSelectedRun() && !this.isRunFinished(run);
  }

  private extractThinkingFromEvents(events: PipelineRunEvent[]) {
    const sorted = [...events].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    let thinking = "";

    for (const event of sorted) {
      if (event.type !== "intent-progress") {
        continue;
      }

      const chunk = event.data?.chat_log_delta?.thinking_content;
      if (typeof chunk === "string" && chunk) {
        thinking += chunk;
      }
    }

    if (this.config.mask_transcripts && thinking) {
      return "[masked]";
    }

    return this.trimThinkingWhitespace(thinking);
  }

  private trimThinkingWhitespace(text: string) {
    return text
      .replace(/\r\n/g, "\n")
      .split("\n")
      .map((line) => line.trimStart())
      .join("\n")
      .trim();
  }

  private clearConversationRefreshTimer() {
    if (this.conversationRefreshTimer === undefined) {
      return;
    }

    window.clearInterval(this.conversationRefreshTimer);
    this.conversationRefreshTimer = undefined;
  }

  private setupAudioVisibilityTracking() {
    document.addEventListener("visibilitychange", this.handleDocumentVisibilityChange);

    if (!("IntersectionObserver" in window)) {
      this.audioIsVisible = !document.hidden;
      return;
    }

    this.intersectionObserver = new IntersectionObserver((entries) => {
      const entry = entries[0];
      this.audioIsVisible = Boolean(entry?.isIntersecting) && !document.hidden;
      this.syncAudioAnimation();
      this.syncUlysse31IdleAnimation();
    });
    this.intersectionObserver.observe(this);
  }

  private teardownAudioVisibilityTracking() {
    document.removeEventListener("visibilitychange", this.handleDocumentVisibilityChange);
    this.intersectionObserver?.disconnect();
    this.intersectionObserver = undefined;
  }

  private async syncAudioVisualization(force = false) {
    if (!this.config?.audio_visualization || !this.hass) {
      this.cleanupAudioVisualization();
      return;
    }

    if (!this.runModel?.ttsAudio?.url) {
      if (this.getAudioVisualizationType() === "ulysse31") {
        this.showUlysse31IdleVisualization();
      } else {
        this.cleanupAudioVisualization();
      }
      return;
    }

    const audioUrl = this.runModel.ttsAudio.url;
    const audioKey = `${this.runModel.runId}:${audioUrl}:${this.getAudioVisualizationType()}:${this.getAudioVisualizationPosition()}`;
    if (!force && audioKey === this.audioKey) {
      if (this.audioFetchUnavailable) {
        await this.updateComplete;
        this.drawFlatAudioVisualization();
        return;
      }

      if (this.audioBuffer) {
        if (this.audioSourceEnded) {
          this.drawFlatAudioVisualization();
          return;
        }

        this.syncAudioAnimation();
        return;
      }
    }

    this.cleanupAudioVisualization(false);
    this.audioKey = audioKey;
    this.audioFetchUnavailable = false;
    this.audioVisualizationPainted = false;
    this.audioVisualizationLoading = true;
    this.audioVisualizationError = "";
    this.audioNeedsUserStart = false;
    this.audioVisualizationStatus = "fetching audio";

    try {
      const audioContext = this.getAudioContext();
      const response = await this.fetchAudio(audioUrl);
      if (!response.ok) {
        if (audioKey !== this.audioKey) {
          return;
        }

        await this.showIdleAudioVisualization();
        return;
      }

      const audioBuffer = await audioContext.decodeAudioData(await response.arrayBuffer());
      if (audioKey !== this.audioKey) {
        return;
      }

      this.audioBuffer = audioBuffer;
      this.audioStaticData = this.createStaticWaveformData(audioBuffer);
      this.audioPlaybackData = this.createPlaybackWaveformData(audioBuffer);
      this.audioVisualizationLoading = false;
      this.audioVisualizationStatus = "decoded audio";
      await this.updateComplete;
      if (this.getAudioVisualizationPosition() === "background") {
        this.drawFlatAudioVisualization();
      } else if (this.getAudioVisualizationType() === "ulysse31") {
        this.drawStaticAudioVisualization();
        this.syncUlysse31IdleAnimation();
      } else {
        this.drawStaticAudioVisualization();
      }
      this.prepareAudioAnalyser();
      this.audioNeedsUserStart = false;

      if (this.shouldAnimateTtsAudio(this.runModel?.ttsAudio)) {
        this.scheduleAudioAnimationStart(audioKey);
      } else {
        this.audioSourceEnded = true;
        this.audioVisualizationStatus = "past tts";
        this.drawFlatAudioVisualization();
      }
    } catch (error) {
      if (audioKey !== this.audioKey) {
        return;
      }

      this.audioVisualizationLoading = false;
      this.audioVisualizationError = this.formatError(error);
      this.audioVisualizationStatus = "audio visualization error";
      this.audioNeedsUserStart = false;
    }
  }

  private async showIdleAudioVisualization() {
    this.audioVisualizationLoading = false;
    this.audioVisualizationError = "";
    this.audioNeedsUserStart = false;
    this.audioSourceEnded = true;
    this.audioFetchUnavailable = true;
    this.audioVisualizationStatus = "idle";
    await this.updateComplete;
    this.drawFlatAudioVisualization();
  }

  private getAudioContext() {
    if (this.audioContext) {
      return this.audioContext;
    }

    const AudioContextConstructor = window.AudioContext || (window as any).webkitAudioContext;
    this.audioContext = new AudioContextConstructor();
    return this.audioContext;
  }

  private async fetchAudio(url: string) {
    const resolvedUrl = new URL(url, window.location.origin);
    const fetchWithAuth = (this.hass as any).fetchWithAuth;

    if (fetchWithAuth && resolvedUrl.origin === window.location.origin) {
      return fetchWithAuth(`${resolvedUrl.pathname}${resolvedUrl.search}${resolvedUrl.hash}`);
    }

    return fetch(resolvedUrl.toString());
  }

  private shouldAnimateTtsAudio(ttsAudio?: TtsAudio) {
    if (!ttsAudio?.timestamp) {
      return false;
    }

    const ttsTimestamp = new Date(ttsAudio.timestamp).getTime();
    return Number.isFinite(ttsTimestamp) && ttsTimestamp >= this.sessionStartedAt;
  }

  private scheduleAudioAnimationStart(audioKey: string) {
    const startDelay = this.getAudioVisualizationStartDelay();
    if (this.audioStartDelayTimer !== undefined) {
      window.clearTimeout(this.audioStartDelayTimer);
      this.audioStartDelayTimer = undefined;
    }

    if (startDelay <= 0) {
      this.audioVisualizationStatus = "speaking";
      this.syncAudioAnimation();
      return;
    }

    this.audioVisualizationStatus = `waiting ${startDelay}ms`;
    this.audioStartDelayTimer = window.setTimeout(() => {
      this.audioStartDelayTimer = undefined;
      if (audioKey !== this.audioKey || this.audioSourceEnded) {
        return;
      }

      this.audioVisualizationStatus = "speaking";
      this.syncAudioAnimation();
    }, startDelay);
  }

  private prepareAudioAnalyser() {
    if (!this.audioContext || !this.audioBuffer) {
      return;
    }

    this.cleanupAudioNodes();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = this.getAudioVisualizationType() === "spectrum" ? 128 : 1024;
    this.audioData = new Uint8Array(
      this.getAudioVisualizationType() === "spectrum"
        ? this.analyser.frequencyBinCount
        : this.analyser.fftSize
    );

    this.silentGain = this.audioContext.createGain();
    this.silentGain.gain.value = 0;

    this.analyser.connect(this.silentGain);
    this.silentGain.connect(this.audioContext.destination);
    this.audioSourceEnded = false;
    this.audioAnimationStartedAt = 0;
  }

  private getAudioVisualizationCanvas() {
    return this.renderRoot.querySelector(
      `[data-audio-visualization-id="${this.audioVisualizationId}"]`
    ) as HTMLCanvasElement | null;
  }

  private syncAudioAnimation() {
    if (!this.config?.audio_visualization || !this.analyser || !this.audioBuffer) {
      this.cancelAudioAnimation();
      return;
    }

    if (!this.audioIsVisible || document.hidden) {
      this.cancelAudioAnimation();
      return;
    }

    if (this.audioSourceEnded) {
      this.drawFlatAudioVisualization();
      return;
    }

    if (this.audioAnimationFrame === undefined) {
      this.audioAnimationStartedAt = 0;
      this.drawAudioVisualization();
    }
  }

  private drawAudioVisualization() {
    const canvas = this.getAudioVisualizationCanvas();
    if (!canvas || !this.audioPlaybackData || !this.audioBuffer) {
      this.audioAnimationFrame = undefined;
      return;
    }

    const context = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    if (!context || rect.width === 0 || rect.height === 0) {
      this.audioAnimationFrame = window.requestAnimationFrame(() => this.drawAudioVisualization());
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    const width = Math.max(1, Math.floor(rect.width * dpr));
    const height = Math.max(1, Math.floor(rect.height * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    context.clearRect(0, 0, width, height);
    this.fillAudioVisualizationBackground(context, width, height);

    if (!this.audioAnimationStartedAt) {
      this.audioAnimationStartedAt = performance.now();
    }

    const elapsedMs = performance.now() - this.audioAnimationStartedAt;
    const progress = Math.min(1, elapsedMs / Math.max(1, this.audioBuffer.duration * 1000));
    const level = this.getAudioLevelAtProgress(this.audioPlaybackData, progress);
    const type = this.getAudioVisualizationType();
    if (type === "spectrum") {
      this.drawAnimatedSpectrum(context, width, height, level, progress);
    } else if (type === "meter") {
      this.drawMeter(context, width, height, this.scaleAudioFrame(this.audioStaticData || this.audioPlaybackData, level));
    } else if (type === "glow") {
      this.drawGlow(context, width, height, level);
    } else if (type === "ulysse31") {
      this.cancelUlysse31Animation();
      this.drawUlysse31Wireframe(context, width, height, level);
    } else {
      this.drawWaveform(context, width, height, this.scaleAudioFrame(this.audioStaticData || this.audioPlaybackData, level));
    }

    if (progress >= 1) {
      this.audioSourceEnded = true;
      this.audioVisualizationStatus = "audio ended";
      this.cancelAudioAnimation();
      this.drawFlatAudioVisualization();
      return;
    }

    this.audioAnimationFrame = window.requestAnimationFrame(() => this.drawAudioVisualization());
    this.markBackgroundVisualizationReady();
  }

  private markBackgroundVisualizationReady() {
    if (this.getAudioVisualizationPosition() !== "background" || this.audioVisualizationPainted) {
      return;
    }

    this.audioVisualizationPainted = true;
  }

  private drawStaticAudioVisualization() {
    const canvas = this.getAudioVisualizationCanvas();
    if (!canvas || !this.audioStaticData) {
      return;
    }

    const context = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    if (!context || rect.width === 0 || rect.height === 0) {
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    const width = Math.max(1, Math.floor(rect.width * dpr));
    const height = Math.max(1, Math.floor(rect.height * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    context.clearRect(0, 0, width, height);
    this.fillAudioVisualizationBackground(context, width, height);

    if (this.getAudioVisualizationType() === "meter") {
      this.drawMeter(context, width, height, this.audioStaticData);
      return;
    }

    if (this.getAudioVisualizationType() === "glow") {
      this.drawGlow(context, width, height, 0);
      return;
    }

    if (this.getAudioVisualizationType() === "ulysse31") {
      this.drawUlysse31Wireframe(context, width, height, this.getWaveformLevel(this.audioStaticData));
      return;
    }

    this.drawWaveform(context, width, height, this.audioStaticData);
  }

  private drawFlatAudioVisualization() {
    const canvas = this.getAudioVisualizationCanvas();
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    if (!context || rect.width === 0 || rect.height === 0) {
      if (this.getAudioVisualizationPosition() === "background" && !this.audioVisualizationPainted) {
        window.requestAnimationFrame(() => this.drawFlatAudioVisualization());
      }
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    const width = Math.max(1, Math.floor(rect.width * dpr));
    const height = Math.max(1, Math.floor(rect.height * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    context.clearRect(0, 0, width, height);
    this.fillAudioVisualizationBackground(context, width, height);

    const type = this.getAudioVisualizationType();
    if (type === "spectrum") {
      this.drawIdleSpectrum(context, width, height);
    } else if (type === "meter") {
      this.drawIdleMeter(context, width, height);
    } else if (type === "glow") {
      this.drawGlow(context, width, height, 0);
    } else if (type === "ulysse31") {
      this.drawUlysse31Wireframe(context, width, height, 0);
      this.markBackgroundVisualizationReady();
      this.syncUlysse31IdleAnimation();
      return;
    } else {
      this.drawIdleWaveform(context, width, height);
    }

    this.markBackgroundVisualizationReady();
  }

  private showUlysse31IdleVisualization() {
    this.clearAudioStartDelayTimer();
    this.cancelAudioAnimation();
    this.cleanupAudioNodes();
    this.audioBuffer = undefined;
    this.analyser = undefined;
    this.audioData = undefined;
    this.audioStaticData = undefined;
    this.audioPlaybackData = undefined;
    this.audioSourceEnded = true;
    this.audioAnimationStartedAt = 0;
    this.audioVisualizationLoading = false;
    this.audioVisualizationError = "";
    this.audioFetchUnavailable = false;
    this.audioNeedsUserStart = false;
    this.audioVisualizationStatus = "idle";
    this.audioKey = "";
    this.updateComplete.then(() => this.drawFlatAudioVisualization());
  }

  private createStaticWaveformData(audioBuffer: AudioBuffer) {
    const channelData = audioBuffer.getChannelData(0);
    const sampleCount = 512;
    const data = new Uint8Array(sampleCount);
    const blockSize = Math.max(1, Math.floor(channelData.length / sampleCount));

    for (let i = 0; i < sampleCount; i += 1) {
      let min = 1;
      let max = -1;
      const start = i * blockSize;
      const end = Math.min(start + blockSize, channelData.length);

      for (let j = start; j < end; j += 1) {
        const sample = channelData[j] || 0;
        min = Math.min(min, sample);
        max = Math.max(max, sample);
      }

      const peak = Math.max(Math.abs(min), Math.abs(max));
      data[i] = Math.round((peak * 0.5 + 0.5) * 255);
    }

    return data;
  }

  private createPlaybackWaveformData(audioBuffer: AudioBuffer) {
    const channelData = audioBuffer.getChannelData(0);
    const sampleCount = Math.max(512, Math.min(8192, Math.floor(audioBuffer.duration * 1200)));
    const data = new Uint8Array(sampleCount);

    for (let i = 0; i < sampleCount; i += 1) {
      const sourceIndex = Math.min(channelData.length - 1, Math.floor((i / sampleCount) * channelData.length));
      const sample = Math.max(-1, Math.min(1, channelData[sourceIndex] || 0));
      data[i] = Math.round((sample * 0.5 + 0.5) * 255);
    }

    return data;
  }

  private getAudioLevelAtProgress(data: Uint8Array, progress: number) {
    const frameSize = 96;
    const maxStart = Math.max(0, data.length - frameSize);
    const start = Math.min(maxStart, Math.floor(progress * maxStart));
    let sum = 0;

    for (let i = 0; i < frameSize; i += 1) {
      sum += Math.abs((data[start + i] ?? 128) - 128) / 128;
    }

    return Math.min(1, Math.max(0.08, (sum / frameSize) * 2.8));
  }

  private scaleAudioFrame(data: Uint8Array, level: number) {
    const output = new Uint8Array(data.length);

    for (let i = 0; i < data.length; i += 1) {
      const centered = (data[i] ?? 128) - 128;
      output[i] = Math.max(0, Math.min(255, Math.round(128 + centered * level)));
    }

    return output;
  }

  private fillAudioVisualizationBackground(context: CanvasRenderingContext2D, width: number, height: number) {
    const background = getComputedStyle(context.canvas).backgroundColor;
    if (!background || background === "transparent" || background === "rgba(0, 0, 0, 0)") {
      return;
    }

    context.fillStyle = background;
    context.fillRect(0, 0, width, height);
  }

  private getWaveformLevel(data?: Uint8Array) {
    if (!data?.length) {
      return 0;
    }

    const rms = Math.sqrt(
      data.reduce((sum, value) => {
        const normalized = (value - 128) / 128;
        return sum + normalized * normalized;
      }, 0) / data.length
    );

    return Math.min(1, Math.max(0, rms * 2.4));
  }

  private projectUlysse31Point(
    u: number,
    v: number,
    majorRadius: number,
    minorRadius: number,
    rotX: number,
    rotY: number,
    centerX: number,
    centerY: number,
    scale: number
  ) {
    let x = (majorRadius + minorRadius * Math.cos(v)) * Math.cos(u);
    let y = (majorRadius + minorRadius * Math.cos(v)) * Math.sin(u);
    let z = minorRadius * Math.sin(v);

    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);
    const yRotated = y * cosX - z * sinX;
    const zRotated = y * sinX + z * cosX;
    y = yRotated;
    z = zRotated;

    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    const xRotated = x * cosY + z * sinY;
    z = -x * sinY + z * cosY;
    x = xRotated;

    const perspective = 2.8 / (2.8 + z);
    return {
      x: centerX + x * scale * perspective,
      y: centerY + y * scale * perspective * 0.82,
      depth: z,
    };
  }

  private drawUlysse31Wireframe(
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
    level: number
  ) {
    const styles = getComputedStyle(context.canvas);
    const color = styles.color;
    const secondaryColor = styles.borderTopColor || color;
    const pulse = 0.08 + level * 0.92;
    const { rotX, rotY } = this.advanceUlysse31Rotation(level);
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = Math.min(width, height) * (0.24 + pulse * 0.08);
    const majorRadius = 1;
    const minorRadius = 0.34;
    const uSteps = 28;
    const vSteps = 14;

    this.drawUlysse31Backdrop(context, width, height, secondaryColor);

    context.save();
    context.strokeStyle = color;
    context.lineWidth = Math.max(1, width / 420);
    context.shadowBlur = 6 + pulse * 14;
    context.shadowColor = color;
    context.globalAlpha = 0.72 + pulse * 0.28;

    const drawRing = (fixedU: number | null, fixedV: number | null) => {
      context.beginPath();
      let started = false;

      if (fixedV !== null) {
        for (let ui = 0; ui <= uSteps; ui += 1) {
          const u = (ui / uSteps) * Math.PI * 2;
          const point = this.projectUlysse31Point(
            u,
            fixedV,
            majorRadius,
            minorRadius,
            rotX,
            rotY,
            centerX,
            centerY,
            scale
          );
          if (!started) {
            context.moveTo(point.x, point.y);
            started = true;
          } else {
            context.lineTo(point.x, point.y);
          }
        }
      } else if (fixedU !== null) {
        for (let vi = 0; vi <= vSteps; vi += 1) {
          const v = (vi / vSteps) * Math.PI * 2;
          const point = this.projectUlysse31Point(
            fixedU,
            v,
            majorRadius,
            minorRadius,
            rotX,
            rotY,
            centerX,
            centerY,
            scale
          );
          if (!started) {
            context.moveTo(point.x, point.y);
            started = true;
          } else {
            context.lineTo(point.x, point.y);
          }
        }
      }

      context.stroke();
    };

    for (let vi = 0; vi <= vSteps; vi += 1) {
      drawRing(null, (vi / vSteps) * Math.PI * 2);
    }

    for (let ui = 0; ui < uSteps; ui += 2) {
      drawRing((ui / uSteps) * Math.PI * 2, null);
    }

    context.globalAlpha = 0.45 + pulse * 0.35;
    context.lineWidth = Math.max(1, width / 520);
    context.beginPath();
    context.ellipse(centerX, centerY, scale * 0.34, scale * 0.22, rotY * 0.18, 0, Math.PI * 2);
    context.stroke();

    context.restore();
  }

  private advanceUlysse31Rotation(level: number) {
    const now = performance.now();
    if (!this.ulysse31LastFrameAt) {
      this.ulysse31LastFrameAt = now;
      return {
        rotX: this.ulysse31RotationX,
        rotY: this.ulysse31RotationY,
      };
    }

    const elapsedSeconds = Math.min(Math.max((now - this.ulysse31LastFrameAt) / 1000, 0), 0.1);
    const clampedLevel = Math.min(Math.max(level, 0), 1);
    const fullTurn = Math.PI * 2;
    this.ulysse31LastFrameAt = now;
    this.ulysse31RotationX = (this.ulysse31RotationX + elapsedSeconds * (0.35 + clampedLevel * 1.1)) % fullTurn;
    this.ulysse31RotationY = (this.ulysse31RotationY + elapsedSeconds * (0.52 + clampedLevel * 0.95)) % fullTurn;

    return {
      rotX: this.ulysse31RotationX,
      rotY: this.ulysse31RotationY,
    };
  }

  private drawUlysse31Backdrop(context: CanvasRenderingContext2D, width: number, height: number, secondaryColor: string) {
    context.save();
    context.strokeStyle = secondaryColor;
    context.globalAlpha = 0.08;
    context.lineWidth = 1;

    for (let y = 0; y < height; y += Math.max(3, Math.floor(height / 28))) {
      context.beginPath();
      context.moveTo(0, y + 0.5);
      context.lineTo(width, y + 0.5);
      context.stroke();
    }

    context.globalAlpha = 0.18;
    const starCount = 18;
    for (let index = 0; index < starCount; index += 1) {
      const seed = index * 7919;
      const x = ((seed * 37) % 1000) / 1000 * width;
      const y = ((seed * 53) % 1000) / 1000 * height;
      const size = 1 + ((seed * 17) % 100) / 100;
      context.fillStyle = secondaryColor;
      context.fillRect(x, y, size, size);
    }

    context.restore();
  }

  private syncUlysse31IdleAnimation() {
    if (this.getAudioVisualizationType() !== "ulysse31") {
      this.cancelUlysse31Animation();
      return;
    }

    if (this.audioAnimationFrame !== undefined || this.ulysse31AnimationFrame !== undefined) {
      return;
    }

    if (!this.audioIsVisible || document.hidden) {
      return;
    }

    this.ulysse31AnimationFrame = window.requestAnimationFrame(() => this.drawUlysse31IdleFrame());
  }

  private drawUlysse31IdleFrame() {
    this.ulysse31AnimationFrame = undefined;

    if (this.getAudioVisualizationType() !== "ulysse31" || this.audioAnimationFrame !== undefined) {
      return;
    }

    const canvas = this.getAudioVisualizationCanvas();
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    if (!context || rect.width === 0 || rect.height === 0) {
      this.syncUlysse31IdleAnimation();
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    const width = Math.max(1, Math.floor(rect.width * dpr));
    const height = Math.max(1, Math.floor(rect.height * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    context.clearRect(0, 0, width, height);
    this.fillAudioVisualizationBackground(context, width, height);
    this.drawUlysse31Wireframe(context, width, height, 0);
    this.markBackgroundVisualizationReady();

    if (!this.audioIsVisible || document.hidden) {
      return;
    }

    this.ulysse31AnimationFrame = window.requestAnimationFrame(() => this.drawUlysse31IdleFrame());
  }

  private cancelUlysse31Animation() {
    if (this.ulysse31AnimationFrame === undefined) {
      return;
    }

    window.cancelAnimationFrame(this.ulysse31AnimationFrame);
    this.ulysse31AnimationFrame = undefined;
  }

  private drawWaveform(context: CanvasRenderingContext2D, width: number, height: number, data: Uint8Array) {
    context.lineWidth = Math.max(2, width / 220);
    context.strokeStyle = getComputedStyle(context.canvas).color;
    context.beginPath();

    const sliceWidth = width / data.length;
    for (let i = 0; i < data.length; i += 1) {
      const x = i * sliceWidth;
      const y = (data[i] / 255) * height;
      if (i === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    }

    context.stroke();
  }

  private drawIdleWaveform(context: CanvasRenderingContext2D, width: number, height: number) {
    context.lineWidth = Math.max(2, width / 220);
    context.strokeStyle = getComputedStyle(context.canvas).color;
    context.beginPath();
    context.moveTo(0, height / 2);
    context.lineTo(width, height / 2);
    context.stroke();
  }

  private drawSpectrum(context: CanvasRenderingContext2D, width: number, height: number, data: Uint8Array) {
    const barGap = Math.max(1, width / 180);
    const barWidth = Math.max(2, width / data.length - barGap);
    const styles = getComputedStyle(context.canvas);
    const color = styles.color;
    const secondaryColor = styles.borderTopColor;
    const gradient = context.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, secondaryColor || color);
    context.fillStyle = gradient;

    data.forEach((value, index) => {
      const barHeight = Math.max(2, (value / 255) * height);
      const x = index * (barWidth + barGap);
      context.fillRect(x, height - barHeight, barWidth, barHeight);
    });
  }

  private drawIdleSpectrum(context: CanvasRenderingContext2D, width: number, height: number) {
    const styles = getComputedStyle(context.canvas);
    const barCount = 32;
    const barGap = Math.max(1, width / 180);
    const barWidth = Math.max(2, width / barCount - barGap);
    context.fillStyle = styles.borderTopColor || styles.color;
    context.globalAlpha = 0.35;

    for (let index = 0; index < barCount; index += 1) {
      const x = index * (barWidth + barGap);
      context.fillRect(x, height - 2, barWidth, 2);
    }

    context.globalAlpha = 1;
  }

  private drawAnimatedSpectrum(
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
    level: number,
    progress: number
  ) {
    const styles = getComputedStyle(context.canvas);
    const color = styles.color;
    const secondaryColor = styles.borderTopColor;
    const gradient = context.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, secondaryColor || color);
    context.fillStyle = gradient;

    const barCount = 34;
    const barGap = Math.max(1, width / 180);
    const barWidth = Math.max(2, width / barCount - barGap);

    for (let index = 0; index < barCount; index += 1) {
      const envelope = 0.35 + 0.65 * Math.sin((index / (barCount - 1)) * Math.PI);
      const shape = 0.72 + 0.28 * ((Math.sin(index * 1.7) + 1) / 2);
      const globalPulse = 0.92 + 0.08 * Math.sin(progress * Math.PI * 10);
      const barHeight = Math.max(3, height * (0.08 + level * envelope * shape * globalPulse));
      const x = index * (barWidth + barGap);
      context.fillRect(x, height - barHeight, barWidth, barHeight);
    }
  }

  private drawMeter(context: CanvasRenderingContext2D, width: number, height: number, data: Uint8Array) {
    const rms = Math.sqrt(
      data.reduce((sum, value) => {
        const normalized = (value - 128) / 128;
        return sum + normalized * normalized;
      }, 0) / data.length
    );
    const level = Math.min(1, rms * 2.4);
    const radius = height / 2;
    const styles = getComputedStyle(context.canvas);

    context.fillStyle = styles.borderTopColor;
    context.globalAlpha = 0.25;
    context.fillRect(0, height * 0.28, width, height * 0.44);
    context.globalAlpha = 1;
    context.fillStyle = styles.color;
    const meterWidth = Math.max(radius, width * level);
    context.fillRect((width - meterWidth) / 2, height * 0.28, meterWidth, height * 0.44);
  }

  private drawIdleMeter(context: CanvasRenderingContext2D, width: number, height: number) {
    const styles = getComputedStyle(context.canvas);
    const radius = height / 2;
    context.fillStyle = styles.borderTopColor;
    context.globalAlpha = 0.25;
    context.fillRect(0, height * 0.28, width, height * 0.44);
    context.globalAlpha = 1;
    context.fillStyle = styles.color;
    const meterWidth = Math.max(2, radius * 0.18);
    context.fillRect((width - meterWidth) / 2, height * 0.28, meterWidth, height * 0.44);
  }

  private drawGlow(context: CanvasRenderingContext2D, width: number, height: number, level: number) {
    const styles = getComputedStyle(context.canvas);
    const color = styles.color;
    const secondaryColor = styles.borderTopColor || color;
    const glowStrength = Math.min(1, Math.max(0, level));
    const centerX = width * 0.5;
    const centerY = height * 0.5;
    const radius = Math.max(width, height) * (0.45 + glowStrength * 0.25);
    const gradient = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);

    gradient.addColorStop(0, this.withAlpha(color, 0.1 + glowStrength * 0.72));
    gradient.addColorStop(0.52, this.withAlpha(secondaryColor, 0.05 + glowStrength * 0.24));
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
  }

  private withAlpha(color: string, alpha: number) {
    const trimmed = color.trim();
    const clampedAlpha = Math.min(Math.max(alpha, 0), 1);

    if (trimmed.startsWith("rgb(")) {
      return trimmed.replace("rgb(", "rgba(").replace(")", `, ${clampedAlpha})`);
    }

    if (trimmed.startsWith("rgba(")) {
      return trimmed.replace(/,\s*[\d.]+\)$/, `, ${clampedAlpha})`);
    }

    return trimmed;
  }

  private cancelAudioAnimation() {
    if (this.audioAnimationFrame === undefined) {
      return;
    }

    window.cancelAnimationFrame(this.audioAnimationFrame);
    this.audioAnimationFrame = undefined;
  }

  private clearAudioStartDelayTimer() {
    if (this.audioStartDelayTimer === undefined) {
      return;
    }

    window.clearTimeout(this.audioStartDelayTimer);
    this.audioStartDelayTimer = undefined;
  }

  private cleanupAudioVisualization(resetKey = true, closeContext = false) {
    this.clearAudioStartDelayTimer();
    this.cancelAudioAnimation();
    this.cancelUlysse31Animation();
    this.cleanupAudioNodes();
    this.audioBuffer = undefined;
    this.analyser = undefined;
    this.audioData = undefined;
    this.audioStaticData = undefined;
    this.audioPlaybackData = undefined;
    this.audioSourceEnded = false;
    this.audioAnimationStartedAt = 0;
    this.audioVisualizationStatus = "";
    this.audioVisualizationLoading = false;
    this.audioVisualizationError = "";
    this.audioFetchUnavailable = false;
    this.audioVisualizationPainted = false;
    this.audioNeedsUserStart = false;
    if (resetKey) {
      this.audioKey = "";
    }

    if (closeContext) {
      this.audioContext?.close();
      this.audioContext = undefined;
    }
  }

  private cleanupAudioNodes() {
    try {
      this.audioSource?.stop();
    } catch {
      // Stopping an already-ended source throws in some browsers.
    }

    this.audioSource?.disconnect();
    this.analyser?.disconnect();
    this.silentGain?.disconnect();
    this.audioSource = undefined;
    this.silentGain = undefined;
  }

  private openDebugPage(event: Event) {
    event.stopPropagation();

    if (!this.resolvedPipelineId) {
      return;
    }

    handleActionConfig(this, this.hass, {}, {
      action: "navigate",
      navigation_path: `/config/voice-assistants/debug/${this.resolvedPipelineId}`,
    } as any);
  }

  private resolvePipelineId(response: { pipelines: AssistPipeline[]; preferred_pipeline: string | null }) {
    const configured = this.config.pipeline_id || DEFAULT_PIPELINE_ID;

    if (configured && configured !== DEFAULT_PIPELINE_ID) {
      return configured;
    }

    return response.preferred_pipeline || response.pipelines?.[0]?.id || "";
  }

  private getRunCount() {
    const count = Number(this.config.run_count || DEFAULT_RUN_COUNT);
    return Number.isFinite(count) ? Math.min(Math.max(Math.round(count), 1), 20) : DEFAULT_RUN_COUNT;
  }

  private getPipelineName(pipelineId: string) {
    return this.pipelines.find((pipeline) => pipeline.id === pipelineId)?.name;
  }

  private getStageStatus(key: "stt" | "intent" | "tts", stage?: StageModel) {
    if (!stage) {
      return "idle";
    }

    if (this.runModel?.stage === "error" && !stage.done) {
      return "error";
    }

    if (stage.done) {
      return "done";
    }

    if (this.runModel?.stage === key) {
      return "running";
    }

    return "idle";
  }

  private getStageDuration(key: "stt" | "intent" | "tts") {
    const start = this.runModel?.events.find((event) => event.type === `${key}-start`)?.timestamp;
    const end = this.runModel?.events.find((event) => event.type === `${key}-end`)?.timestamp;
    return this.formatDuration(start ? new Date(start) : undefined, end ? new Date(end) : undefined);
  }

  private getStatusIcon(status: string) {
    switch (status) {
      case "done":
        return "mdi:check-circle";
      case "running":
        return "mdi:progress-clock";
      case "error":
        return "mdi:alert-circle";
      default:
        return "mdi:circle-outline";
    }
  }

  private formatDuration(start?: Date, end?: Date) {
    if (!start || !end) {
      return "";
    }

    const seconds = Math.max(0, (end.getTime() - start.getTime()) / 1000);
    return `${seconds.toFixed(seconds < 10 ? 2 : 1)}s`;
  }

  private formatTime(timestamp: string) {
    try {
      return new Intl.DateTimeFormat(this.hass?.locale?.language || navigator.language, {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(timestamp));
    } catch {
      return timestamp;
    }
  }

  private formatStageName(stage: RunModel["stage"]) {
    return stage.replace("_", " ");
  }

  private shortId(id: string) {
    return id.length > 12 ? `${id.slice(0, 6)}...${id.slice(-4)}` : id;
  }

  private maskText(value: string) {
    if (!value) {
      return "";
    }

    return this.config.mask_transcripts ? "[masked]" : value;
  }

  private getConversationMessages(run: RunModel) {
    return {
      userText: this.maskText(run.stt?.output || run.intent?.input || ""),
      assistantText: this.maskText(run.tts?.input || this.extractAssistantSpeech(run) || ""),
    };
  }

  private getConversationLoadingText(run: RunModel, isProcessing: boolean) {
    if (!isProcessing) {
      return "Waiting for reply...";
    }

    if (run.stage === "stt") {
      return "Listening...";
    }

    if (run.stage === "intent") {
      return "Thinking...";
    }

    if (run.stage === "tts") {
      return "Preparing reply...";
    }

    return "Processing...";
  }

  private extractTtsAudio(output: any, timestamp?: string): TtsAudio | undefined {
    if (!output?.url) {
      return undefined;
    }

    return {
      url: String(output.url),
      mimeType: output.mime_type,
      token: output.token,
      mediaId: output.media_id,
      timestamp,
    };
  }

  private maskRaw(value: unknown): unknown {
    if (Array.isArray(value)) {
      return value.map((item) => this.maskRaw(item));
    }

    if (value && typeof value === "object") {
      return Object.fromEntries(
        Object.entries(value as Record<string, unknown>).map(([key, entry]) => [
          key,
          TEXT_KEYS.has(key) ? "[masked]" : this.maskRaw(entry),
        ])
      );
    }

    return value;
  }

  private extractAssistantSpeech(run: RunModel) {
    return run.intent?.output || "";
  }

  private extractSpeechFromIntentOutput(output: any) {
    const speech =
      output?.response?.speech?.plain?.speech ||
      output?.response?.speech?.plain?.extra_data?.speech ||
      output?.response?.speech ||
      "";

    return typeof speech === "string" ? speech : "";
  }

  private formatError(error: unknown) {
    if (error && typeof error === "object") {
      const maybeError = error as { message?: string; code?: string };
      return maybeError.message || maybeError.code || "Home Assistant rejected the debug request.";
    }

    return "Home Assistant rejected the debug request.";
  }

  private localize(key: string) {
    try {
      return this.hass?.localize?.(key) || "";
    } catch {
      return "";
    }
  }

  private getAudioVisualizationType(): AudioVisualizationType {
    const type = this.config.audio_visualization_type;

    return type === "spectrum" ||
      type === "meter" ||
      type === "waveform" ||
      type === "glow" ||
      type === "ulysse31"
      ? type
      : DEFAULT_AUDIO_VISUALIZATION_TYPE;
  }

  private getAudioVisualizationPosition(): AudioVisualizationPosition {
    const position = this.config.audio_visualization_position;

    return position === "background" || position === "top" || position === "between" || position === "below_chat"
      ? position
      : DEFAULT_AUDIO_VISUALIZATION_POSITION;
  }

  private getAudioVisualizationHeight() {
    const height = Number(this.config.audio_visualization_height || 56);
    return Number.isFinite(height) ? Math.min(Math.max(Math.round(height), 24), 180) : 56;
  }

  private getAudioVisualizationOpacity() {
    const opacity = Number(this.config.audio_visualization_opacity ?? 0.75);
    return Number.isFinite(opacity) ? Math.min(Math.max(opacity, 0.05), 1) : 0.75;
  }

  private getAudioVisualizationStartDelay() {
    const delay = Number(this.config.audio_visualization_start_delay || 0);
    return Number.isFinite(delay) ? Math.min(Math.max(Math.round(delay), 0), 10000) : 0;
  }

  private getCssValue(name: string) {
    return getComputedStyle(this).getPropertyValue(name).trim();
  }

  private getCardStyles() {
    const visualizationType = this.getAudioVisualizationType();
    const ulysse31Defaults = visualizationType === "ulysse31";

    return {
      "--assist-debug-background": this.config.background_color || "#1d1d1d",
      "--assist-debug-surface": this.config.surface_color || "#2b2b2b",
      "--assist-debug-text": this.config.text_color || "var(--primary-text-color)",
      "--assist-debug-secondary-text": this.config.secondary_text_color || "#9b9b9b",
      "--assist-debug-accent": this.config.accent_color || "var(--primary-color)",
      "--assist-debug-user-chat": this.config.user_chat_color || "var(--primary-color)",
      "--assist-debug-user-chat-text": this.config.user_chat_text_color || "var(--text-primary-color, #fff)",
      "--assist-debug-assistant-chat": this.config.assistant_chat_color || "#2b2b2b",
      "--assist-debug-assistant-chat-text": this.config.assistant_chat_text_color || "var(--assist-debug-text)",
      "--assist-debug-audio-height": `${this.getAudioVisualizationHeight()}px`,
      "--assist-debug-audio-color":
        this.config.audio_visualization_color || (ulysse31Defaults ? ULYSSE31_AUDIO_COLOR : "var(--assist-debug-accent)"),
      "--assist-debug-audio-secondary-color":
        this.config.audio_visualization_secondary_color || "var(--assist-debug-secondary-text)",
      "--assist-debug-audio-background":
        this.config.audio_visualization_background ||
        (ulysse31Defaults ? ULYSSE31_AUDIO_BACKGROUND : "transparent"),
      "--assist-debug-audio-opacity": String(this.getAudioVisualizationOpacity()),
    };
  }

  static styles = css`
    ha-card {
      background: var(--assist-debug-background);
      border: 0;
      border-radius: 20px;
      overflow: hidden;
    }

    .card {
      background: var(--assist-debug-background);
      color: var(--assist-debug-text);
      display: grid;
      gap: 12px;
      padding: 12px;
      position: relative;
    }

    .visualization-only-card {
      min-height: var(--assist-debug-audio-height);
    }

    .visualization-only-spacer {
      min-height: var(--assist-debug-audio-height);
    }

    .card > :not(.audio-visualization-card-background) {
      position: relative;
      z-index: 1;
    }

    .header {
      align-items: start;
      display: flex;
      gap: 12px;
      justify-content: space-between;
    }

    .eyebrow {
      color: var(--assist-debug-secondary-text);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    h2,
    p {
      margin: 0;
    }

    h2 {
      color: var(--assist-debug-text);
      font-size: 14px;
      font-weight: 700;
      line-height: 1.2;
      margin-top: 3px;
    }

    .header p {
      color: var(--assist-debug-secondary-text);
      font-size: 12px;
      margin-top: 4px;
    }

    .actions {
      display: inline-flex;
      gap: 6px;
    }

    button {
      -webkit-tap-highlight-color: transparent;
      cursor: pointer;
      font: inherit;
    }

    .icon-button {
      align-items: center;
      background: var(--assist-debug-surface);
      border: 0;
      border-radius: 12px;
      color: var(--assist-debug-text);
      display: inline-flex;
      height: 42px;
      justify-content: center;
      padding: 0;
      width: 42px;
    }

    .icon-button ha-icon {
      --mdc-icon-size: 19px;
    }

    .state {
      align-items: center;
      background: var(--assist-debug-surface);
      border-radius: 16px;
      color: var(--assist-debug-secondary-text);
      display: flex;
      gap: 12px;
      padding: 14px;
    }

    .state strong,
    .state span {
      display: block;
    }

    .state strong {
      color: var(--assist-debug-text);
      font-size: 14px;
    }

    .state span {
      font-size: 12px;
      margin-top: 2px;
    }

    .state ha-icon {
      --mdc-icon-size: 22px;
      color: var(--assist-debug-accent);
    }

    .error-state ha-icon,
    .error-message {
      color: var(--error-color, #db4437);
    }

    .run-picker {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding-bottom: 2px;
      scrollbar-width: thin;
    }

    .run-chip {
      background: var(--assist-debug-surface);
      border: 1px solid transparent;
      border-radius: 999px;
      color: var(--assist-debug-text);
      display: grid;
      flex: 0 0 auto;
      gap: 1px;
      min-width: 78px;
      padding: 8px 11px;
      text-align: left;
    }

    .run-chip small {
      color: var(--assist-debug-secondary-text);
      font-size: 10px;
    }

    .run-chip.selected {
      background: var(--assist-debug-surface);
      border-color: var(--assist-debug-accent);
    }

    .conversation {
      display: grid;
      gap: 8px;
      position: relative;
      z-index: 1;
    }

    .conversation-shell {
      display: grid;
      gap: 8px;
      position: relative;
    }

    .conversation-shell.has-background-visualization {
      border-radius: 16px;
      overflow: hidden;
    }

    .bubble {
      border-radius: 16px;
      font-size: 13px;
      line-height: 1.35;
      max-width: 88%;
      padding: 10px 12px;
    }

    .bubble.user {
      background: var(--assist-debug-user-chat);
      color: var(--assist-debug-user-chat-text);
      justify-self: end;
    }

    .bubble.assistant {
      background: var(--assist-debug-assistant-chat);
      color: var(--assist-debug-assistant-chat-text);
      justify-self: start;
    }

    .conversation-only {
      min-height: 68px;
    }

    .bubble.loading {
      align-items: center;
      color: var(--assist-debug-secondary-text);
      display: inline-flex;
      gap: 8px;
    }

    .error-bubble {
      color: var(--error-color, #db4437);
    }

    .audio-visualization {
      background: var(--assist-debug-audio-background);
      border-radius: 16px;
      box-sizing: border-box;
      min-height: var(--assist-debug-audio-height);
      opacity: var(--assist-debug-audio-opacity);
      overflow: hidden;
      position: relative;
      width: 100%;
    }

    .audio-visualization-background {
      inset: 0;
      min-height: 100%;
      position: absolute;
      z-index: 0;
    }

    .audio-visualization-background.is-pending {
      opacity: 0;
    }

    .audio-visualization-card-background {
      border-radius: inherit;
      inset: 0;
      min-height: 100%;
      opacity: var(--assist-debug-audio-opacity);
      pointer-events: none;
      position: absolute;
      z-index: 0;
    }

    .audio-visualization-canvas {
      background: var(--assist-debug-audio-background);
      border-color: var(--assist-debug-audio-secondary-color);
      color: var(--assist-debug-audio-color);
      display: block;
      height: var(--assist-debug-audio-height);
      width: 100%;
    }

    .audio-visualization-background .audio-visualization-canvas {
      height: 100%;
    }

    .audio-visualization-card-background .audio-visualization-canvas {
      height: 100%;
    }

    .audio-visualization-between {
      min-height: calc(var(--assist-debug-audio-height) * 0.72);
    }

    .audio-visualization-between .audio-visualization-canvas {
      height: calc(var(--assist-debug-audio-height) * 0.72);
    }

    .audio-visualization-standalone {
      min-height: var(--assist-debug-audio-height);
    }

    .audio-visualization-overlay,
    .audio-start-button {
      align-items: center;
      background: rgba(0, 0, 0, 0.24);
      border: 0;
      border-radius: 999px;
      color: var(--assist-debug-text);
      display: inline-flex;
      font-size: 12px;
      gap: 6px;
      left: 50%;
      padding: 7px 10px;
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      white-space: nowrap;
    }

    .audio-start-button {
      background: var(--assist-debug-user-chat);
      color: var(--assist-debug-user-chat-text);
    }

    .typing-dots {
      align-items: center;
      display: inline-flex;
      gap: 3px;
    }

    .typing-dots span {
      animation: typing-dot 1.2s infinite ease-in-out;
      background: currentColor;
      border-radius: 50%;
      display: block;
      height: 5px;
      opacity: 0.45;
      width: 5px;
    }

    .typing-dots span:nth-child(2) {
      animation-delay: 0.15s;
    }

    .typing-dots span:nth-child(3) {
      animation-delay: 0.3s;
    }

    @keyframes typing-dot {
      0%,
      80%,
      100% {
        transform: translateY(0);
      }
      40% {
        opacity: 1;
        transform: translateY(-3px);
      }
    }

    .timeline {
      display: grid;
      gap: 10px;
    }

    .section {
      background: var(--assist-debug-surface);
      border: 0;
      border-radius: 16px;
      overflow: hidden;
    }

    summary {
      align-items: center;
      display: grid;
      gap: 10px;
      grid-template-columns: auto 1fr auto auto;
      list-style: none;
      min-height: 48px;
      padding: 0 12px;
    }

    summary::-webkit-details-marker {
      display: none;
    }

    .status {
      align-items: center;
      display: inline-flex;
      justify-content: center;
    }

    .status ha-icon {
      --mdc-icon-size: 18px;
    }

    .status.done {
      color: var(--success-color, #43a047);
    }

    .status.running {
      color: var(--assist-debug-accent);
    }

    .status.error {
      color: var(--error-color, #db4437);
    }

    .status.idle {
      color: var(--disabled-text-color);
    }

    .section-title {
      font-size: 14px;
      font-weight: 700;
      min-width: 0;
    }

    .duration {
      color: var(--assist-debug-secondary-text);
      font-size: 12px;
      white-space: nowrap;
    }

    .chevron {
      --mdc-icon-size: 18px;
      color: var(--assist-debug-secondary-text);
      transition: transform 160ms ease;
    }

    details[open] .chevron {
      transform: rotate(180deg);
    }

    .section-body {
      display: grid;
      gap: 12px;
      padding: 0 12px 12px 40px;
    }

    .stage-text,
    .muted,
    .error-message {
      font-size: 13px;
      line-height: 1.4;
      margin: 0;
    }

    .muted {
      color: var(--assist-debug-secondary-text);
    }

    .meta-grid {
      display: grid;
      gap: 8px 12px;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      margin: 0;
    }

    .meta-grid.full {
      grid-template-columns: 1fr;
    }

    .meta-grid div {
      min-width: 0;
    }

    dt {
      color: var(--assist-debug-secondary-text);
      font-size: 11px;
      font-weight: 600;
      margin-bottom: 2px;
    }

    dd {
      font-size: 12px;
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    pre {
      background: rgba(0, 0, 0, 0.18);
      border-radius: 12px;
      box-sizing: border-box;
      color: var(--assist-debug-text);
      font-size: 11px;
      line-height: 1.45;
      margin: 0 12px 12px;
      max-height: 320px;
      overflow: auto;
      padding: 12px;
    }

    .thinking pre.thinking-content {
      max-height: 420px;
      white-space: pre-wrap;
      word-break: break-word;
    }

    @media (max-width: 420px) {
      .card {
        padding: 12px;
      }

      .header {
        align-items: start;
      }

      .meta-grid {
        grid-template-columns: 1fr;
      }

      .section-body {
        padding-left: 12px;
      }
    }
  `;
}

class ConversationDebugCard extends AssistDebugCard {}

customElements.define("assist-debug-card", AssistDebugCard);

if (!customElements.get("conversation-debug-card")) {
  customElements.define("conversation-debug-card", ConversationDebugCard);
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: "assist-debug-card",
  name: "Assist Debug Card",
  description: "Modern debug view for Home Assistant Assist pipeline runs",
});
