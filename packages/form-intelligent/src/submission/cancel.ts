export class SubmissionController {
  private controller = new AbortController();
  private active = false;
  private pendingCancel = false;

  public begin(): AbortSignal {
    this.controller.abort();
    this.controller = new AbortController();
    this.active = true;

    if (this.pendingCancel) {
      this.controller.abort();
      this.pendingCancel = false;
    }

    return this.controller.signal;
  }

  public cancel(): void {
    this.pendingCancel = true;
    if (this.active) {
      this.controller.abort();
    }
    this.active = false;
  }

  public end(): void {
    this.active = false;
    this.pendingCancel = false;
  }

  public get signal(): AbortSignal {
    return this.controller.signal;
  }

  public get isActive(): boolean {
    return this.active;
  }

  public get isCancelled(): boolean {
    return this.pendingCancel || this.controller.signal.aborted;
  }
}
