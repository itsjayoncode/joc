import { expect } from "vitest";

import { createForm } from "../../src/index.js";

import type { FormInstance } from "../../src/index.js";

/**
 * Framework adapter contract: subscribe + getSnapshot identity for external stores.
 */
export function runFrameworkSubscribeContract(
  create: () => FormInstance<Record<string, unknown>> = () =>
    createForm({ initialValues: { x: 1 } }),
): void {
  const form = create();
  const first = form.getSnapshot();
  expect(form.getSnapshot()).toBe(first);

  let notified = 0;
  const unsubscribe = form.subscribe(() => {
    notified += 1;
  });

  form.setValue("x", 2);
  expect(notified).toBeGreaterThan(0);
  const second = form.getSnapshot();
  expect(second).not.toBe(first);
  expect(second.values.x).toBe(2);

  unsubscribe();
  form.setValue("x", 3);
  // Unsubscribed listener must not keep firing.
  const afterUnsub = notified;
  form.setValue("x", 4);
  expect(notified).toBe(afterUnsub);

  form.destroy();
}
