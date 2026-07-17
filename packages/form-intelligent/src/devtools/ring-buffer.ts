/**
 * Bounded ring buffer — newest entries retained when capacity is exceeded.
 */
export class RingBuffer<T> {
  private readonly items: T[] = [];

  public constructor(private readonly capacity: number) {
    if (capacity < 1) {
      throw new Error("RingBuffer capacity must be >= 1");
    }
  }

  public push(entry: T): void {
    this.items.push(entry);
    if (this.items.length > this.capacity) {
      this.items.splice(0, this.items.length - this.capacity);
    }
  }

  public toArray(): readonly T[] {
    return this.items;
  }

  public clear(): void {
    this.items.length = 0;
  }

  public get size(): number {
    return this.items.length;
  }

  public get max(): number {
    return this.capacity;
  }
}

/** @deprecated Prefer `RingBuffer` — kept for session migration helpers. */
export function capLog<T>(entries: T[], maxEntries: number, entry: T): T[] {
  const buffer = new RingBuffer<T>(Math.max(1, maxEntries));
  for (const existing of entries) {
    buffer.push(existing);
  }
  buffer.push(entry);
  return [...buffer.toArray()];
}
