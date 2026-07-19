import { ThemeToggle } from "./ThemeToggle.js";
import { getPlaygroundMetadata } from "../../config/app-metadata.js";
import { findNavigationItemByPath } from "../../constants/navigation.js";
import { usePlaygroundUi } from "../../hooks/usePlaygroundUi.js";
import { CloseIcon, MenuIcon } from "../../icons/AppIcons.js";

export interface HeaderProps {
  readonly classNames: {
    readonly eyebrow: string;
    readonly eyebrowRow: string;
    readonly header: string;
    readonly headerActions: string;
    readonly headerCopy: string;
    readonly headerTitleBlock: string;
    readonly iconButton: string;
    readonly packageName: string;
    readonly subtitle: string;
    readonly title: string;
  };
}

export function Header({ classNames }: HeaderProps) {
  const { currentPath, mobileSidebarOpen, toggleMobileSidebar } = usePlaygroundUi();
  const metadata = getPlaygroundMetadata();
  const currentItem = findNavigationItemByPath(currentPath);
  const pageTitle = currentItem?.label ?? "Page not found";
  const pageDescription =
    currentPath === "/"
      ? undefined
      : (currentItem?.description ?? "This route is not registered in the playground navigation.");

  return (
    <header className={classNames.header}>
      <div className={classNames.headerTitleBlock}>
        <div className={classNames.headerCopy}>
          <div className={classNames.eyebrowRow}>
            <span className={classNames.packageName}>{metadata.packageName}</span>
            <span className={classNames.eyebrow}>playground v{metadata.versions.playground}</span>
          </div>
          <h1 className={classNames.title}>{pageTitle}</h1>
          {pageDescription ? <p className={classNames.subtitle}>{pageDescription}</p> : null}
        </div>
      </div>
      <div className={classNames.headerActions}>
        <button
          aria-label={mobileSidebarOpen ? "Close navigation sidebar" : "Open navigation sidebar"}
          className={classNames.iconButton}
          onClick={toggleMobileSidebar}
          type="button"
        >
          {mobileSidebarOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
        <ThemeToggle className={classNames.iconButton} />
      </div>
    </header>
  );
}
