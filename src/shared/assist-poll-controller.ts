export type AssistPollControllerOptions = {
  intervalMs: number;
  maxBackoffMs?: number;
  shouldPoll: () => boolean;
  onPoll: () => Promise<boolean>;
};

export function isStaleLoadToken(token: number, currentToken: number): boolean {
  return token !== currentToken;
}

export class AssistPollController {
  private timer?: number;
  private active = false;
  private delay: number;
  private readonly intervalMs: number;
  private readonly maxBackoffMs: number;
  private readonly shouldPoll: () => boolean;
  private readonly onPoll: () => Promise<boolean>;

  constructor(options: AssistPollControllerOptions) {
    this.intervalMs = options.intervalMs;
    this.maxBackoffMs = options.maxBackoffMs ?? options.intervalMs * 30;
    this.shouldPoll = options.shouldPoll;
    this.onPoll = options.onPoll;
    this.delay = this.intervalMs;
  }

  sync() {
    if (!this.shouldPoll()) {
      this.stop();
      return;
    }

    if (this.active) {
      return;
    }

    if (this.timer !== undefined) {
      window.clearTimeout(this.timer);
      this.timer = undefined;
    }

    this.delay = this.intervalMs;
    this.schedule(0);
  }

  stop() {
    if (this.timer !== undefined) {
      window.clearTimeout(this.timer);
      this.timer = undefined;
    }
  }

  reset() {
    this.stop();
    this.delay = this.intervalMs;
  }

  /** Schedule the next poll soon, clearing any backed-off timer. */
  requestSoon(delay = 0) {
    if (!this.shouldPoll() || this.active) {
      return;
    }

    if (this.timer !== undefined) {
      window.clearTimeout(this.timer);
      this.timer = undefined;
    }

    this.delay = this.intervalMs;
    this.schedule(delay);
  }

  private schedule(delay: number) {
    this.timer = window.setTimeout(() => {
      void this.runPoll();
    }, delay);
  }

  private async runPoll() {
    this.timer = undefined;

    if (!this.shouldPoll()) {
      return;
    }

    this.active = true;
    let success = true;
    try {
      success = await this.onPoll();
    } finally {
      this.active = false;
    }

    if (!this.shouldPoll() || this.timer !== undefined) {
      return;
    }

    this.delay = success ? this.intervalMs : Math.min(this.delay * 2, this.maxBackoffMs);
    this.schedule(this.delay);
  }
}
