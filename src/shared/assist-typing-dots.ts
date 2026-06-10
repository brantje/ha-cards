import { html, type TemplateResult } from "lit";

export function renderAssistTypingDots(): TemplateResult {
  return html`
    <span class="typing-dots" aria-hidden="true">
      <span></span>
      <span></span>
      <span></span>
    </span>
  `;
}
