export interface FooterProps {
  readonly classNames: {
    readonly footer: string;
  };
}

export function Footer({ classNames }: FooterProps) {
  return (
    <footer className={classNames.footer}>
      <span>
        <strong>Browser Lifecycle Playground</strong> · v1.0.0
      </span>
      <span>Official shell for module validation and integration QA</span>
    </footer>
  );
}
