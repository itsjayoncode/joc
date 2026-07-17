import type { TimelineEntry } from "./types.js";

/**
 * Fixed-capacity ring buffer. Append is O(1); overflow drops the oldest entry.
 */
export class TimelineRingBuffer {
  private readonly slots: Array<TimelineEntry | undefined>;
  private head = 0;
  private length = 0;

  public constructor(private readonly capacity: number) {
    if (!Number.isInteger(capacity) || capacity < 1) {
      throw new RangeError("Timeline maxEvents must be a positive integer.");
    }
    this.slots = Array.from({ length: capacity });
  }

  public get size(): number {
    return this.length;
  }

  public get maxEvents(): number {
    return this.capacity;
  }

  /**
   * Pushes an entry. Returns the dropped oldest entry when overflowing.
   */
  public push(entry: TimelineEntry): TimelineEntry | undefined {
    if (this.length < this.capacity) {
      const index = (this.head + this.length) % this.capacity;
      this.slots[index] = entry;
      this.length += 1;
      return undefined;
    }

    const dropped = this.slots[this.head];
    this.slots[this.head] = entry;
    this.head = (this.head + 1) % this.capacity;
    return dropped;
  }

  public clear(): void {
    this.slots.fill(undefined);
    this.head = 0;
    this.length = 0;
  }

  /** Oldest → newest. */
  public toArray(): readonly TimelineEntry[] {
    if (this.length === 0) {
      return [];
    }

    const result: TimelineEntry[] = [];
    for (let offset = 0; offset < this.length; offset += 1) {
      const entry = this.slots[(this.head + offset) % this.capacity];
      if (entry !== undefined) {
        result.push(entry);
      }
    }
    return result;
  }
}
