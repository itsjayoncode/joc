export type ConditionHandler = () => void;

export interface ConditionHandle {
  unsubscribe(): void;
}

export interface ConditionsApi {
  visible(handler: ConditionHandler): ConditionHandle;
  hidden(handler: ConditionHandler): ConditionHandle;
  focused(handler: ConditionHandler): ConditionHandle;
  online(handler: ConditionHandler): ConditionHandle;
  /**
   * Unsubscribe all active condition handlers.
   * Does not dispose the underlying session.
   */
  dispose(): void;
}

export interface CreateConditionsApiOptions {
  /** Invoked when a condition handler throws (session continues). */
  readonly onHandlerError?: (error: unknown) => void;
}
