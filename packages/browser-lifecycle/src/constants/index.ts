/**
 * Default activity events used when idle detection is enabled without a custom event list.
 */
export const DEFAULT_ACTIVITY_EVENTS = [
  "pointerdown",
  "keydown",
  "touchstart",
  "visibilitychange",
  "focus",
] as const;

/**
 * Default debounce applied to activity signals.
 */
export const DEFAULT_ACTIVITY_DEBOUNCE = 250;

/**
 * Default event buffer size when diagnostics are disabled.
 */
export const DEFAULT_EVENT_BUFFER_SIZE = 0;

/**
 * Default cross-tab channel name.
 */
export const DEFAULT_CROSS_TAB_CHANNEL_NAME = "jayoncode:browser-lifecycle";

/**
 * Default heartbeat interval for cross-tab coordination.
 */
export const DEFAULT_CROSS_TAB_HEARTBEAT_INTERVAL = 1_000;

/**
 * Default leader timeout for cross-tab coordination.
 */
export const DEFAULT_CROSS_TAB_LEADER_TIMEOUT = 3_000;
