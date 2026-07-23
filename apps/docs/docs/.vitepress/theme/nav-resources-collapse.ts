/**
 * At ≤900px, move Resources out of the top nav row into the ⋯ Extra flyout.
 * Below 768px the hamburger screen menu still lists Resources from theme.nav.
 */

import { docsHref } from "./docs-href.js";

const RESOURCES = [
  {
    text: "Draft Desk ↗",
    link: "https://jayoncode.com/draft-desk",
    external: true,
  },
  { text: "Playground", link: "/playground/" },
  { text: "Roadmap", link: "/roadmap/" },
  { text: "Contribute", link: "/guides/contribution" },
] as const;

let installed = false;
let observer: MutationObserver | null = null;

function normalizeLabel(text: string | null | undefined): string {
  return (text ?? "").replace(/\s+/g, " ").trim();
}

function markResourcesMenuItem(): void {
  for (const flyout of document.querySelectorAll<HTMLElement>(".VPNavBarMenu .VPFlyout")) {
    const label = normalizeLabel(flyout.querySelector(".button .text")?.textContent);
    if (label.startsWith("Resources")) {
      flyout.classList.add("joc-nav-resources");
    }
  }
}

function ensureExtraResources(): void {
  const menu = document.querySelector(".VPNavBarExtra .VPMenu");
  if (!(menu instanceof HTMLElement)) {
    return;
  }

  let group = menu.querySelector<HTMLElement>(".joc-nav-extra-resources");
  if (!group) {
    group = document.createElement("div");
    group.className = "group joc-nav-extra-resources";
    group.setAttribute("data-joc-nav-extra-resources", "1");

    const title = document.createElement("p");
    title.className = "joc-nav-extra-resources__title";
    title.textContent = "Resources";
    group.appendChild(title);

    for (const item of RESOURCES) {
      const row = document.createElement("div");
      row.className = "VPMenuLink joc-nav-extra-resources__link";

      const anchor = document.createElement("a");
      anchor.className = "VPLink link";
      anchor.href = docsHref(item.link);
      anchor.textContent = item.text;
      if ("external" in item) {
        anchor.target = "_blank";
        anchor.rel = "noreferrer";
      }
      row.appendChild(anchor);
      group.appendChild(row);
    }

    menu.insertBefore(group, menu.firstChild);
  }
}

function sync(): void {
  markResourcesMenuItem();
  ensureExtraResources();
}

export function installNavResourcesCollapse(): void {
  if (typeof document === "undefined" || installed) {
    return;
  }
  installed = true;

  sync();
  observer = new MutationObserver(sync);
  observer.observe(document.body, { childList: true, subtree: true });
}
