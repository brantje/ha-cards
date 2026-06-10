export const LAST_USED_PIPELINE_KEY = "assist-chat-card:last-used-pipeline";
export const FOLLOW_UP_HINT_DISMISSED_KEY = "assist-chat-card:follow-up-hint-dismissed";

export function getLastUsedPipelineId(): string | null {
  try {
    return window.localStorage.getItem(LAST_USED_PIPELINE_KEY);
  } catch {
    return null;
  }
}

export function setLastUsedPipelineId(pipelineId: string) {
  try {
    window.localStorage.setItem(LAST_USED_PIPELINE_KEY, pipelineId);
  } catch {
    // Ignore storage failures in restricted contexts.
  }
}

export function isFollowUpHintDismissed(): boolean {
  try {
    return window.localStorage.getItem(FOLLOW_UP_HINT_DISMISSED_KEY) === "true";
  } catch {
    return false;
  }
}

export function dismissFollowUpHint() {
  try {
    window.localStorage.setItem(FOLLOW_UP_HINT_DISMISSED_KEY, "true");
  } catch {
    // Ignore storage failures in restricted contexts.
  }
}
