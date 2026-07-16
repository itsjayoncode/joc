export interface SubmissionLoadingSnapshot {
  readonly isSubmitting: boolean;
  readonly attempt: number;
}

export class SubmissionLoadingTracker {
  private submitting = false;
  private attempt = 0;

  public begin(): void {
    this.submitting = true;
    this.attempt = 1;
  }

  public setAttempt(attempt: number): void {
    this.attempt = attempt;
  }

  public end(): void {
    this.submitting = false;
    this.attempt = 0;
  }

  public snapshot(): SubmissionLoadingSnapshot {
    return {
      isSubmitting: this.submitting,
      attempt: this.attempt,
    };
  }
}
