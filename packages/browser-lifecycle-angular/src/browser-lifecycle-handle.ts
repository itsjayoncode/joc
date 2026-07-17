import { signal, type DestroyRef, type Signal, type WritableSignal } from "@angular/core";

import type { BrowserLifecycle, BrowserLifecycleSnapshot } from "@jayoncode/browser-lifecycle";

import {
  resolveBrowserLifecycleBinding,
  type BrowserLifecycleAdapterOptions,
} from "./resolve-binding.js";

import type { BrowserLifecycleHandle } from "./tokens.js";

export class BrowserLifecycleHandleImpl implements BrowserLifecycleHandle {
  readonly lifecycle: BrowserLifecycle;
  readonly snapshot: Signal<Readonly<BrowserLifecycleSnapshot>>;

  private readonly snapshotSignal: WritableSignal<Readonly<BrowserLifecycleSnapshot>>;
  private readonly unsubscribe: () => void;
  private readonly owns: boolean;
  private destroyed = false;

  public constructor(options: BrowserLifecycleAdapterOptions = {}, destroyRef?: DestroyRef) {
    const binding = resolveBrowserLifecycleBinding(options);
    this.lifecycle = binding.lifecycle;
    this.owns = binding.owns;
    this.snapshotSignal = signal(this.lifecycle.getSnapshot());
    this.snapshot = this.snapshotSignal.asReadonly();

    this.unsubscribe = this.lifecycle.subscribe(() => {
      this.snapshotSignal.set(this.lifecycle.getSnapshot());
    });

    if (typeof document !== "undefined" && !this.lifecycle.isRunning()) {
      this.lifecycle.start();
    }

    destroyRef?.onDestroy(() => {
      this.destroy();
    });
  }

  public destroy(): void {
    if (this.destroyed) {
      return;
    }
    this.destroyed = true;
    this.unsubscribe();
    if (this.owns) {
      this.lifecycle.dispose();
    }
  }
}
