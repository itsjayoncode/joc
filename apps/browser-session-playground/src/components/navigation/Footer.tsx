import { getPlaygroundMetadata } from "../../config/app-metadata.js";

export interface FooterProps {
  readonly classNames: {
    readonly footer: string;
  };
}

export function Footer({ classNames }: FooterProps) {
  const metadata = getPlaygroundMetadata();

  return (
    <footer className={classNames.footer}>
      <span>
        <strong>{metadata.applicationName}</strong> · v{metadata.versions.playground}
      </span>
      <span>Official shell for module validation and integration QA</span>
    </footer>
  );
}
