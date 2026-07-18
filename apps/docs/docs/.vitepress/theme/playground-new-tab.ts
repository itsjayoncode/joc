/**
 * Interactive playground SPAs live under /playground/<package>/ and must open
 * in a new tab so VitePress client routing does not swallow them.
 */
const PLAYGROUND_SPA_PATH =
  /\/playground\/(browser-lifecycle|object-diff|form-intelligence)(?:\/|$)/i;

export function isPlaygroundSpaPath(pathname: string): boolean {
  return PLAYGROUND_SPA_PATH.test(pathname);
}

let installed = false;

export function installPlaygroundNewTabLinks(): void {
  if (typeof document === "undefined" || installed) {
    return;
  }
  installed = true;

  const markLink = (anchor: HTMLAnchorElement): void => {
    let pathname = "";
    try {
      pathname = new URL(anchor.href, window.location.origin).pathname;
    } catch {
      return;
    }

    if (!isPlaygroundSpaPath(pathname)) {
      return;
    }

    if (anchor.target !== "_blank") {
      anchor.target = "_blank";
    }

    const rel = new Set((anchor.rel || "").split(/\s+/).filter(Boolean));
    rel.add("noreferrer");
    rel.add("noopener");
    anchor.rel = [...rel].join(" ");
  };

  const scan = (root: ParentNode = document): void => {
    for (const anchor of root.querySelectorAll<HTMLAnchorElement>("a[href]")) {
      markLink(anchor);
    }
  };

  scan();

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof Element)) {
          continue;
        }
        if (node instanceof HTMLAnchorElement) {
          markLink(node);
        }
        scan(node);
      }
    }
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });

  // Capture-phase click so VitePress router cannot keep SPA playgrounds in-tab.
  document.addEventListener(
    "click",
    (event) => {
      if (event.defaultPrevented || event.button !== 0) {
        return;
      }
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) {
        return;
      }

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.origin);
      } catch {
        return;
      }

      if (url.origin !== window.location.origin || !isPlaygroundSpaPath(url.pathname)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      window.open(url.href, "_blank", "noopener,noreferrer");
    },
    true,
  );
}
