/** Adjacent key for `onRestoreDecline: "remember"` markers. */
export const RESTORE_DECLINED_KEY_SUFFIX = ":__joc_restore_declined";

export function restoreDeclinedMarkerKey(storageKey: string): string {
  return `${storageKey}${RESTORE_DECLINED_KEY_SUFFIX}`;
}
