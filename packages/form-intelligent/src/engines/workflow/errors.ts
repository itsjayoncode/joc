export class WorkflowError extends Error {
  public constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "WorkflowError";
  }
}
