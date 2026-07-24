import type { FormEvent } from "../types/index.js";

type EventListener = (payload?: unknown) => void;

export class FormEventBus {
  private readonly listeners = new Map<FormEvent, Set<EventListener>>();

  public on(event: FormEvent, listener: EventListener): () => void {
    const bucket = this.listeners.get(event) ?? new Set<EventListener>();
    bucket.add(listener);
    this.listeners.set(event, bucket);

    return () => {
      bucket.delete(listener);
    };
  }

  public emit(event: FormEvent, payload?: unknown): void {
    const bucket = this.listeners.get(event);
    if (!bucket) {
      return;
    }

    for (const listener of bucket) {
      listener(payload);
    }
  }

  public clear(): void {
    this.listeners.clear();
  }
}
