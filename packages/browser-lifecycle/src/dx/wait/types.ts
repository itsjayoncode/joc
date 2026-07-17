export interface WaitOptions {
  readonly timeoutMs?: number;
  readonly signal?: AbortSignal;
}

export interface WaitApi {
  untilVisible(options?: WaitOptions): Promise<void>;
  untilHidden(options?: WaitOptions): Promise<void>;
  untilFocused(options?: WaitOptions): Promise<void>;
  untilBlurred(options?: WaitOptions): Promise<void>;
  untilOnline(options?: WaitOptions): Promise<void>;
  untilOffline(options?: WaitOptions): Promise<void>;
  /**
   * Rejects all pending waits and prevents new ones.
   * Does not dispose the underlying session.
   */
  dispose(): void;
}
