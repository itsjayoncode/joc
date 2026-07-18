/** Copy text with Clipboard API + execCommand fallback (keeps user-gesture reliability). */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    const writeText = globalThis.navigator.clipboard.writeText.bind(globalThis.navigator.clipboard);
    await writeText(text);
    return true;
  } catch {
    // Clipboard API missing or blocked — try legacy path below.
  }

  if (typeof document === "undefined") {
    return false;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "-9999px";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, text.length);

  let ok = false;
  try {
    // Legacy fallback when Clipboard API is unavailable or blocked.
    // eslint-disable-next-line @typescript-eslint/no-deprecated -- intentional clipboard fallback
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  document.body.removeChild(textarea);
  return ok;
}

/** Trigger a file download in the browser. */
export function downloadTextFile(
  filename: string,
  contents: string,
  mime = "application/json",
): void {
  const blob = new Blob([contents], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

const SHARE_HASH_PREFIX = "sandbox=";

export function encodeSandboxShareHash(payload: unknown): string {
  const json = JSON.stringify(payload);
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return `${SHARE_HASH_PREFIX}${btoa(binary)}`;
}

export function decodeSandboxShareHash(hash: string): unknown {
  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!raw.startsWith(SHARE_HASH_PREFIX)) {
    return null;
  }
  try {
    const encoded = raw.slice(SHARE_HASH_PREFIX.length);
    const binary = atob(encoded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    return JSON.parse(json) as unknown;
  } catch {
    return null;
  }
}

export function buildSandboxShareUrl(payload: unknown): string {
  const url = new URL(window.location.href);
  url.hash = encodeSandboxShareHash(payload);
  return url.toString();
}
