export type AssistStageIconStatus = "idle" | "running" | "done" | "error" | "cancelled";

export type FormatAssistErrorOptions = {
  fallback?: string;
  micDenied?: string;
  micNotFound?: string;
  micHttps?: string;
};

export function formatAssistDuration(start?: string | Date, end?: string | Date): string {
  if (!start || !end) {
    return "";
  }

  const startMs = start instanceof Date ? start.getTime() : new Date(start).getTime();
  const endMs = end instanceof Date ? end.getTime() : new Date(end).getTime();

  if (!Number.isFinite(startMs) || !Number.isFinite(endMs)) {
    return "";
  }

  const seconds = Math.max(0, (endMs - startMs) / 1000);
  return `${seconds.toFixed(seconds < 10 ? 2 : 1)}s`;
}

export function getAssistStageIcon(status: AssistStageIconStatus | string): string {
  switch (status) {
    case "done":
      return "mdi:check-circle";
    case "error":
      return "mdi:alert-circle";
    case "cancelled":
      return "mdi:stop-circle-outline";
    case "running":
      return "mdi:progress-clock";
    case "idle":
      return "mdi:circle-outline";
    default:
      return "mdi:progress-clock";
  }
}

export function formatAssistError(error: unknown, options: FormatAssistErrorOptions = {}): string {
  const fallback = options.fallback ?? "Request rejected.";

  if (error instanceof DOMException) {
    if (error.name === "NotAllowedError") {
      return options.micDenied ?? (error.message || error.name);
    }

    if (error.name === "NotFoundError") {
      return options.micNotFound ?? (error.message || error.name);
    }

    if (error.name === "NotSupportedError" || error.name === "SecurityError") {
      return options.micHttps ?? (error.message || error.name);
    }

    return error.message || error.name;
  }

  if (error && typeof error === "object") {
    const maybeError = error as { message?: string; code?: string };
    return maybeError.message || maybeError.code || fallback;
  }

  return fallback;
}
