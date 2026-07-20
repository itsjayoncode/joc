// @vitest-environment jsdom

import { render } from "@testing-library/react";
import axe from "axe-core";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";

import { HtmlConstraintsPage } from "../pages/HtmlConstraintsPage.js";
import { ValidationPage } from "../pages/ValidationPage.js";

async function expectNoSeriousAxeViolations(container: HTMLElement): Promise<void> {
  const results = await axe.run(container, {
    runOnly: {
      type: "tag",
      values: ["wcag2a", "wcag2aa"],
    },
    // jsdom lacks canvas — color-contrast needs a real browser
    rules: {
      "color-contrast": { enabled: false },
    },
  });

  const blocking = results.violations.filter(
    (violation) => violation.impact === "critical" || violation.impact === "serious",
  );

  expect(
    blocking,
    blocking
      .map((v) => `${v.id} (${v.impact}): ${v.help} — ${v.nodes.map((n) => n.target.join(" ")).join("; ")}`)
      .join("\n"),
  ).toEqual([]);
}

describe("playground a11y smoke", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("HtmlConstraintsPage has no critical/serious WCAG 2 A/AA issues", async () => {
    const { container } = render(
      <MemoryRouter>
        <main>
          <h1>HTML Constraints</h1>
          <HtmlConstraintsPage />
        </main>
      </MemoryRouter>,
    );

    await expectNoSeriousAxeViolations(container);
  });

  it("ValidationPage has no critical/serious WCAG 2 A/AA issues", async () => {
    const { container } = render(
      <MemoryRouter>
        <main>
          <h1>Validation</h1>
          <ValidationPage />
        </main>
      </MemoryRouter>,
    );

    await expectNoSeriousAxeViolations(container);
  });
});
