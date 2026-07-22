/**
 * Decorate VitePress local search results with package/area badges and
 * group headers so developers can scan by library.
 *
 * Runs after each Vue render of the results list (query change). Avoids
 * fighting Vue by only mutating once per result-set signature.
 */

import { resolveSearchScope, type SearchScope } from "./search-scope.js";

const BADGE_ATTR = "data-joc-search-badge";
const GROUP_CLASS = "joc-search-group";
let installed = false;

function resultSetSignature(list: HTMLElement): string {
  return [...list.querySelectorAll<HTMLAnchorElement>("a.result")]
    .map((a) => a.getAttribute("href") ?? "")
    .join("|");
}

function ensureBadge(result: HTMLAnchorElement, scope: SearchScope): void {
  const existing = result.querySelector(`[${BADGE_ATTR}]`);
  if (existing) {
    existing.setAttribute(BADGE_ATTR, scope.id);
    existing.className = `joc-search-badge joc-search-badge--${scope.accent}`;
    existing.textContent = scope.label;
  } else {
    const badge = document.createElement("span");
    badge.setAttribute(BADGE_ATTR, scope.id);
    badge.className = `joc-search-badge joc-search-badge--${scope.accent}`;
    badge.textContent = scope.label;
    badge.title = scope.label;

    const titles = result.querySelector(".titles");
    if (titles) {
      titles.prepend(badge);
    } else {
      result.prepend(badge);
    }
  }

  // Drop redundant first breadcrumb when it duplicates the package badge.
  for (const crumb of result.querySelectorAll(".titles > .title:not(.main)")) {
    const textNode = crumb.querySelector(".text");
    const text = (textNode?.textContent ?? "").trim();
    if (text === scope.label) {
      crumb.remove();
    }
  }
}

function clearGroups(list: HTMLElement): void {
  for (const el of list.querySelectorAll(`.${GROUP_CLASS}`)) {
    el.remove();
  }
}

function groupAndDecorate(list: HTMLElement): void {
  const items = [...list.querySelectorAll<HTMLLIElement>(":scope > li[role='option']")];
  if (items.length === 0) {
    clearGroups(list);
    return;
  }

  type Row = { li: HTMLLIElement; scope: SearchScope; scoreIndex: number };
  const rows: Row[] = items.map((li, scoreIndex) => {
    const anchor = li.querySelector<HTMLAnchorElement>("a.result");
    const href = anchor?.getAttribute("href") ?? "";
    return { li, scope: resolveSearchScope(href), scoreIndex };
  });

  rows.sort((a, b) => {
    if (a.scope.order !== b.scope.order) {
      return a.scope.order - b.scope.order;
    }
    return a.scoreIndex - b.scoreIndex;
  });

  clearGroups(list);

  let lastScopeId: string | null = null;
  let optionIndex = 0;
  const frag = document.createDocumentFragment();

  for (const row of rows) {
    if (row.scope.id !== lastScopeId) {
      lastScopeId = row.scope.id;
      const group = document.createElement("li");
      group.className = GROUP_CLASS;
      group.setAttribute("role", "presentation");
      group.setAttribute("aria-hidden", "true");
      const label = document.createElement("span");
      label.className = `joc-search-group__label joc-search-badge--${row.scope.accent}`;
      label.textContent = row.scope.label;
      group.appendChild(label);
      frag.appendChild(group);
    }

    const anchor = row.li.querySelector<HTMLAnchorElement>("a.result");
    if (anchor) {
      ensureBadge(anchor, row.scope);
      anchor.dataset.index = String(optionIndex);
      row.li.id = `localsearch-item-${String(optionIndex)}`;
    }
    optionIndex += 1;
    frag.appendChild(row.li);
  }

  list.appendChild(frag);
}

function enhanceBox(box: HTMLElement): void {
  const list = box.querySelector<HTMLElement>("ul.results");
  if (!list) {
    return;
  }

  let lastSignature = "";
  let scheduled = false;

  const run = (): void => {
    scheduled = false;
    const signature = resultSetSignature(list);
    // Still decorate when empty → non-empty, or when Vue replaced nodes.
    if (signature === lastSignature && list.querySelector(`[${BADGE_ATTR}]`)) {
      return;
    }
    lastSignature = signature;
    groupAndDecorate(list);
  };

  const schedule = (): void => {
    if (scheduled) {
      return;
    }
    scheduled = true;
    requestAnimationFrame(run);
  };

  run();

  const observer = new MutationObserver(schedule);
  observer.observe(list, { childList: true, subtree: true });
}

export function installLocalSearchEnhance(): void {
  if (typeof document === "undefined" || installed) {
    return;
  }
  installed = true;

  const scan = (): void => {
    for (const box of document.querySelectorAll<HTMLElement>(".VPLocalSearchBox")) {
      if (box.dataset.jocSearchEnhanced === "1") {
        continue;
      }
      box.dataset.jocSearchEnhanced = "1";
      enhanceBox(box);
    }
  };

  scan();

  const rootObserver = new MutationObserver(scan);
  rootObserver.observe(document.body, { childList: true, subtree: true });
}
