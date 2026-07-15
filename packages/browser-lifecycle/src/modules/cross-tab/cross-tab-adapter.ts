/* v8 ignore next */
import { noop } from "../../utils/index.js";

import type {
  CrossTabAdapter,
  CrossTabAdapterEnvironment,
  CrossTabBroadcastChannelConstructor,
  CrossTabChannelLike,
  CrossTabMessagePayload,
  CrossTabStorageLike,
} from "./types.js";

const STORAGE_KEY_PREFIX = "jayoncode:browser-lifecycle:cross-tab:";

export function createCrossTabAdapter(
  channelName: string,
  environment: CrossTabAdapterEnvironment = getDefaultEnvironment(),
): CrossTabAdapter {
  const BroadcastChannelRef = environment.BroadcastChannel;
  const storageRef = environment.localStorage;
  let channel: CrossTabChannelLike | undefined;

  return {
    isSupported(): boolean {
      return BroadcastChannelRef !== undefined || storageRef !== undefined;
    },
    publish(message: CrossTabMessagePayload): void {
      if (BroadcastChannelRef) {
        channel ??= new BroadcastChannelRef(channelName);
        channel.postMessage(message);
      }

      if (storageRef) {
        storageRef.setItem(`${STORAGE_KEY_PREFIX}${channelName}`, JSON.stringify(message));
      }
    },
    subscribe(listener: (message: CrossTabMessagePayload) => void): () => void {
      const cleanups: Array<() => void> = [];

      if (BroadcastChannelRef) {
        channel ??= new BroadcastChannelRef(channelName);
        const onMessage = (event: { readonly data: unknown }): void => {
          const payload = parseMessage(event.data);

          if (payload) {
            listener(payload);
          }
        };

        channel.addEventListener("message", onMessage);
        cleanups.push(() => {
          channel?.removeEventListener("message", onMessage);
        });
      }

      if (storageRef && typeof globalThis.addEventListener === "function") {
        const onStorage = (event: StorageEvent): void => {
          if (event.key !== `${STORAGE_KEY_PREFIX}${channelName}` || !event.newValue) {
            return;
          }

          const payload = parseMessage(event.newValue);

          if (payload) {
            listener(payload);
          }
        };

        globalThis.addEventListener("storage", onStorage);
        cleanups.push(() => {
          globalThis.removeEventListener("storage", onStorage);
        });
      }

      if (cleanups.length === 0) {
        return noop;
      }

      return (): void => {
        for (const cleanup of cleanups) {
          cleanup();
        }
        channel?.close();
        channel = undefined;
      };
    },
  };
}

function getDefaultEnvironment(): CrossTabAdapterEnvironment {
  const runtime = globalThis as {
    readonly BroadcastChannel?: CrossTabBroadcastChannelConstructor;
    readonly localStorage?: CrossTabStorageLike;
  };

  return {
    ...(runtime.BroadcastChannel ? { BroadcastChannel: runtime.BroadcastChannel } : {}),
    ...(runtime.localStorage ? { localStorage: runtime.localStorage } : {}),
  };
}

function parseMessage(value: unknown): CrossTabMessagePayload | undefined {
  if (typeof value === "string") {
    try {
      return parseMessage(JSON.parse(value));
    } catch {
      return undefined;
    }
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "senderId" in value &&
    "timestamp" in value &&
    "type" in value
  ) {
    return value as CrossTabMessagePayload;
  }

  return undefined;
}
