import { Outlet } from "react-router-dom";

import styles from "./AppShell.module.css";
import { Footer } from "../components/navigation/Footer.js";
import { Header } from "../components/navigation/Header.js";
import { Sidebar } from "../components/navigation/Sidebar.js";
import { StatusBar } from "../components/navigation/StatusBar.js";
import { usePlaygroundUi } from "../hooks/usePlaygroundUi.js";

export function AppShell() {
  const { currentPath } = usePlaygroundUi();
  const getClassName = (className: keyof typeof styles): string => styles[className] ?? "";
  const headerClasses = {
    eyebrow: getClassName("eyebrow"),
    header: getClassName("header"),
    headerActions: getClassName("headerActions"),
    headerCopy: getClassName("headerCopy"),
    headerTitleBlock: getClassName("headerTitleBlock"),
    iconButton: getClassName("iconButton"),
    subtitle: getClassName("subtitle"),
    title: getClassName("title"),
  };
  const sidebarClasses = {
    brand: getClassName("brand"),
    brandCaption: getClassName("brandCaption"),
    brandLabel: getClassName("brandLabel"),
    brandMark: getClassName("brandMark"),
    brandTitle: getClassName("brandTitle"),
    navCopy: getClassName("navCopy"),
    navDescription: getClassName("navDescription"),
    navGroup: getClassName("navGroup"),
    navGroupTitle: getClassName("navGroupTitle"),
    navIcon: getClassName("navIcon"),
    navLabel: getClassName("navLabel"),
    navLink: getClassName("navLink"),
    navLinkActive: getClassName("navLinkActive"),
    navPill: getClassName("navPill"),
    navScroll: getClassName("navScroll"),
    overlay: getClassName("overlay"),
    plannedLink: getClassName("plannedLink"),
    sidebar: getClassName("sidebar"),
    sidebarCompact: getClassName("sidebarCompact"),
    sidebarFooter: getClassName("sidebarFooter"),
    sidebarFooterText: getClassName("sidebarFooterText"),
    sidebarOpen: getClassName("sidebarOpen"),
  };
  const statusBarClasses = {
    statusBar: getClassName("statusBar"),
    statusChip: getClassName("statusChip"),
    statusChipAccent: getClassName("statusChipAccent"),
  };
  const footerClasses = {
    footer: getClassName("footer"),
  };

  return (
    <div className={styles.shell} data-route-path={currentPath}>
      <div className={styles.frame}>
        <Sidebar classNames={sidebarClasses} />
        <div className={styles.mainColumn}>
          <Header classNames={headerClasses} />
          <StatusBar classNames={statusBarClasses} />
          <main className={styles.content}>
            <Outlet />
          </main>
          <Footer classNames={footerClasses} />
        </div>
      </div>
    </div>
  );
}
