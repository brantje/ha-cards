import { css } from "lit";

/** Shared conversation bubble and typing-indicator styles. Cards map --assist-* vars in :host. */
export const assistConversationBubbleStyles = css`
  .bubble {
    border-radius: 16px;
    box-sizing: border-box;
    font-size: 14px;
    line-height: 1.45;
    max-width: 88%;
    min-width: 0;
    overflow-wrap: anywhere;
    padding: 10px 12px;
  }

  .message .bubble,
  .bubble.user,
  .bubble.assistant {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: hidden;
  }

  .user .bubble,
  .bubble.user {
    background: var(--assist-user-bubble);
    color: var(--assist-user-text);
  }

  .assistant .bubble,
  .bubble.assistant {
    background: var(--assist-assistant-bubble);
    color: var(--assist-assistant-text);
  }

  .assistant .bubble.loading,
  .assistant .bubble.cancelled-bubble,
  .bubble.loading {
    align-items: center;
    color: var(--assist-secondary-text, var(--secondary-text-color));
    display: inline-flex;
    flex-direction: row;
    gap: 8px;
  }

  .error-bubble {
    color: var(--error-color, #db4437);
  }

  .loading-status {
    align-items: center;
    display: inline-flex;
    gap: 8px;
  }
`;

export const assistTypingDotsStyles = css`
  .typing-dots {
    align-items: center;
    display: inline-flex;
    gap: 3px;
  }

  .typing-dots span {
    animation: assist-typing-dot 1.2s infinite ease-in-out;
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

  @keyframes assist-typing-dot {
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
`;
