import { html, type TemplateResult } from "lit";
import { formatTime, type HomeAssistant } from "custom-card-helpers";
import { assistMessageStatusToLabel } from "../../shared/assist-labels";
import { formatAssistDuration, getAssistStageIcon } from "../../shared/assist-format";
import { renderAssistTypingDots } from "../../shared/assist-typing-dots";
import type { AssistToolCall, AssistProcessStageStatus } from "../../shared/assist-pipeline";
import {
  AssistChatMessage,
  AssistChatMessageStatus,
  hasResponse,
  isLoadingMessage,
} from "./assist-chat-messages";

export type ProcessStageDisplayStatus = AssistProcessStageStatus | "cancelled";

export type AssistChatRenderLabels = {
  cancelled: string;
  listening: string;
  thinking: string;
  preparing_reply: string;
  waiting_reply: string;
  thought_for_cancelled: (duration: string) => string;
  thought_for: (duration: string) => string;
  thought: string;
  thinking_summary: string;
  tool_arguments: string;
  tool_result: string;
};

export type AssistChatRenderContext = {
  showProcess: boolean;
  showMessageTime: boolean;
  showThinkingUntilResponse: boolean;
  labels: AssistChatRenderLabels;
  locale?: HomeAssistant["locale"];
  language?: string;
  formatToolCallJson: (value: unknown) => string;
  onThinkingScroll: (event: Event) => void;
};

export function getProcessStageDisplayStatus(
  status: AssistProcessStageStatus,
  cancelled?: boolean
): ProcessStageDisplayStatus {
  return cancelled && status === "running" ? "cancelled" : status;
}

export function formatAssistChatMessageTime(
  timestamp: string,
  locale?: Locale,
  language?: string
): string {
  try {
    const date = new Date(timestamp);
    if (locale) {
      return formatTime(date, locale);
    }

    return new Intl.DateTimeFormat(language || navigator.language, {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return timestamp;
  }
}

function getLoadingLabel(status: AssistChatMessageStatus, labels: AssistChatRenderLabels) {
  return assistMessageStatusToLabel(status, {
    listening: labels.listening,
    thinking: labels.thinking,
    preparing: labels.preparing_reply,
    waiting: labels.waiting_reply,
    cancelled: labels.cancelled,
  });
}

function shouldOpenThinking(message: AssistChatMessage, showThinkingUntilResponse: boolean) {
  return Boolean(showThinkingUntilResponse && !hasResponse(message) && message.status !== "cancelled");
}

function getThinkingSummary(
  message: AssistChatMessage,
  thinkDuration: string,
  labels: AssistChatRenderLabels
) {
  if (message.status === "cancelled") {
    return thinkDuration ? labels.thought_for_cancelled(thinkDuration) : labels.cancelled;
  }

  if (hasResponse(message)) {
    return thinkDuration ? labels.thought_for(thinkDuration) : labels.thought;
  }

  return labels.thinking_summary;
}

export function renderAssistChatLoadingStatus(
  message: AssistChatMessage,
  labels: AssistChatRenderLabels
): TemplateResult {
  const label = getLoadingLabel(message.status, labels);
  const dotsFirst = message.status === "listening";

  return html`
    <div class="loading-status">
      ${dotsFirst ? renderAssistTypingDots() : ""}
      ${label ? html`<span>${label}</span>` : ""}
      ${dotsFirst ? "" : renderAssistTypingDots()}
    </div>
  `;
}

export function renderAssistChatThinkingSection(
  message: AssistChatMessage,
  ctx: AssistChatRenderContext
): TemplateResult | string {
  if (message.role !== "assistant" || !message.thinking || message.status === "cancelled") {
    return "";
  }

  const thinkDuration = formatAssistDuration(
    message.process?.stages.intent.started,
    message.process?.stages.intent.ended
  );

  return html`
    <details class="thinking" ?open=${shouldOpenThinking(message, ctx.showThinkingUntilResponse)}>
      <summary>${getThinkingSummary(message, thinkDuration, ctx.labels)}</summary>
      <pre class="thinking-content" @scroll=${ctx.onThinkingScroll}>${message.thinking}</pre>
    </details>
  `;
}

export function renderAssistChatToolCall(
  toolCall: AssistToolCall,
  ctx: AssistChatRenderContext
): TemplateResult {
  const argsText = ctx.formatToolCallJson(toolCall.tool_args);
  const resultText = ctx.formatToolCallJson(toolCall.tool_result);
  const hasDetails = Boolean(argsText || resultText);

  if (!hasDetails) {
    return html`
      <span class="process-chip tool">
        <ha-icon icon="mdi:tools"></ha-icon>
        ${toolCall.tool_name}
      </span>
    `;
  }

  return html`
    <details class="tool-call-chip">
      <summary class="process-chip tool">
        <ha-icon icon="mdi:tools"></ha-icon>
        ${toolCall.tool_name}
      </summary>
      <div class="tool-call-panel">
        ${argsText
          ? html`
              <div class="tool-call-section">
                <span class="tool-call-label">${ctx.labels.tool_arguments}</span>
                <pre>${argsText}</pre>
              </div>
            `
          : ""}
        ${resultText
          ? html`
              <div class="tool-call-section">
                <span class="tool-call-label">${ctx.labels.tool_result}</span>
                <pre>${resultText}</pre>
              </div>
            `
          : ""}
      </div>
    </details>
  `;
}

export function renderAssistChatProcess(
  message: AssistChatMessage,
  ctx: AssistChatRenderContext
): TemplateResult | string {
  if (!ctx.showProcess || !message.process) {
    return "";
  }

  const cancelled = message.status === "cancelled";
  const stages = Object.values(message.process.stages).filter((stage) => stage.status !== "idle");
  const toolCalls = message.process.toolCalls.filter((toolCall) => toolCall.tool_name);

  if (!stages.length && !toolCalls.length) {
    return "";
  }

  return html`
    <div class="process">
      ${stages.map((stage) => {
        const displayStatus = getProcessStageDisplayStatus(stage.status, cancelled);
        const ended =
          stage.ended || (displayStatus === "cancelled" ? message.process?.finished : undefined);
        const duration = formatAssistDuration(stage.started, ended);

        return html`
          <span class=${`process-chip ${displayStatus}`}>
            <ha-icon icon=${getAssistStageIcon(displayStatus)}></ha-icon>
            ${stage.label}${duration ? html` · ${duration}` : ""}
          </span>
        `;
      })}
      ${toolCalls.map((toolCall) => renderAssistChatToolCall(toolCall, ctx))}
    </div>
  `;
}

export function renderAssistChatMessage(
  message: AssistChatMessage,
  ctx: AssistChatRenderContext
): TemplateResult {
  const isLoading = isLoadingMessage(message);
  const bubbleClass =
    message.status === "error"
      ? "bubble error-bubble"
      : message.status === "cancelled"
        ? "bubble cancelled-bubble"
        : isLoading
          ? "bubble loading"
          : "bubble";

  return html`
    <div class=${message.role === "user" ? "message user" : "message assistant"}>
      <div class=${bubbleClass}>
        ${renderAssistChatThinkingSection(message, ctx)}
        ${isLoading
          ? renderAssistChatLoadingStatus(message, ctx.labels)
          : message.text
            ? message.status !== "error" && message.status !== "cancelled"
              ? html`<ha-markdown .content=${message.text}></ha-markdown>`
              : html`<span>${message.text}</span>`
            : message.status === "cancelled"
              ? html`<span>${ctx.labels.cancelled}</span>`
              : html`<div class="loading-status">${renderAssistTypingDots()}</div>`}
        ${message.process ? renderAssistChatProcess(message, ctx) : ""}
        ${ctx.showMessageTime && message.timestamp && !isLoading
          ? html`<span class="message-time">${formatAssistChatMessageTime(
              message.timestamp,
              ctx.locale,
              ctx.language
            )}</span>`
          : ""}
      </div>
    </div>
  `;
}
