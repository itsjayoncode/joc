import { NavLink } from "react-router-dom";

import { APP_NAVIGATION_GROUPS } from "../../constants/navigation.js";
import { usePlaygroundUi } from "../../hooks/usePlaygroundUi.js";
import { OBJECT_DIFF_DOCS_URL } from "../../lib/playground-links.js";
import { classNames } from "../../utils/class-names.js";
import { playgroundAssetUrl } from "../../utils/playground-asset-url.js";

export interface SidebarProps {
  readonly classNames: {
    readonly brand: string;
    readonly brandBlock: string;
    readonly brandCaption: string;
    readonly brandLabel: string;
    readonly brandMark: string;
    readonly brandTitle: string;
    readonly docsLink: string;
    readonly navCopy: string;
    readonly navDescription: string;
    readonly navGroup: string;
    readonly navGroupTitle: string;
    readonly navIcon: string;
    readonly navLabel: string;
    readonly navLink: string;
    readonly navLinkActive: string;
    readonly navPill: string;
    readonly navScroll: string;
    readonly overlay: string;
    readonly plannedLink: string;
    readonly sidebar: string;
    readonly sidebarCompact: string;
    readonly sidebarFooter: string;
    readonly sidebarFooterText: string;
    readonly sidebarOpen: string;
  };
}

export function Sidebar({ classNames: classes }: SidebarProps) {
  const { closeMobileSidebar, mobileSidebarOpen, sidebarCollapsed } = usePlaygroundUi();

  return (
    <>
      {mobileSidebarOpen ? (
        <button
          aria-label="Close navigation overlay"
          className={classes.overlay}
          onClick={closeMobileSidebar}
          type="button"
        />
      ) : null}
      <aside className={classNamesForSidebar(classes, sidebarCollapsed, mobileSidebarOpen)}>
        <div className={classes.brandBlock}>
          <div className={classes.brand}>
            <img
              alt="JayOnCode"
              className={classes.brandMark}
              src={playgroundAssetUrl("jayoncode-profile-logo-opt.png")}
            />
            <div className={classes.brandLabel}>
              <p className={classes.brandTitle}>JayOnCode</p>
              <p className={classes.brandCaption}>Object Diff playground</p>
            </div>
          </div>
          <a
            className={classes.docsLink}
            href={OBJECT_DIFF_DOCS_URL}
            onClick={closeMobileSidebar}
            rel="noreferrer"
            target="_blank"
          >
            ← Back to Document
          </a>
        </div>

        <div className={classes.navScroll}>
          {APP_NAVIGATION_GROUPS.map((group) => {
            const items = group.items.filter((item) => !item.disabled);

            if (items.length === 0) {
              return null;
            }

            return (
              <nav key={group.id} aria-label={`${group.label} routes`} className={classes.navGroup}>
                <p className={classes.navGroupTitle}>{group.label}</p>
                {items.map((item) => {
                  if (item.intent === "planned" || !item.path) {
                    return (
                      <div key={item.id} className={classes.plannedLink}>
                        <item.icon className={classes.navIcon} />
                        <span className={classes.navCopy}>
                          <span className={classes.navLabel}>{item.label}</span>
                          <span className={classes.navDescription}>{item.description}</span>
                        </span>
                        <span className={classes.navPill}>{item.badge?.label ?? "Soon"}</span>
                      </div>
                    );
                  }

                  return (
                    <NavLink
                      key={item.id}
                      className={({ isActive }) =>
                        classNames(classes.navLink, isActive && classes.navLinkActive)
                      }
                      end={item.path === "/"}
                      onClick={closeMobileSidebar}
                      title={item.description}
                      to={item.path}
                    >
                      <item.icon className={classes.navIcon} />
                      <span className={classes.navCopy}>
                        <span className={classes.navLabel}>{item.shortLabel ?? item.label}</span>
                      </span>
                    </NavLink>
                  );
                })}
              </nav>
            );
          })}
        </div>

        <div className={classes.sidebarFooter}>
          <p className={classes.sidebarFooterText}>
            Interactive QA shell for @jayoncode/object-diff modules.
          </p>
        </div>
      </aside>
    </>
  );
}

function classNamesForSidebar(
  classNameMap: SidebarProps["classNames"],
  sidebarCollapsed: boolean,
  mobileSidebarOpen: boolean,
): string {
  return classNames(
    classNameMap.sidebar,
    sidebarCollapsed && classNameMap.sidebarCompact,
    mobileSidebarOpen && classNameMap.sidebarOpen,
  );
}
