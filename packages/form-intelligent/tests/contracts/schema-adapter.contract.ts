import { expect } from "vitest";

import { createForm, isSchemaAdapter } from "../../src/index.js";

import type { SchemaAdapter } from "../../src/adapters/index.js";

export interface SchemaAdapterContractFixture<
  TValues extends Record<string, unknown> = Record<string, unknown>,
> {
  readonly name: string;
  readonly adapter: SchemaAdapter<TValues>;
  readonly validValues: TValues;
  readonly invalidValues: TValues;
  readonly expectedInvalidPath: string;
}

/**
 * Shared SchemaAdapter contract — import from adapter packages (Zod, Yup, …).
 */
export async function runSchemaAdapterContract<TValues extends Record<string, unknown>>(
  fixture: SchemaAdapterContractFixture<TValues>,
): Promise<void> {
  expect(isSchemaAdapter(fixture.adapter)).toBe(true);

  const invalid = await fixture.adapter.validate(fixture.invalidValues);
  expect(invalid[fixture.expectedInvalidPath]).toBeTypeOf("string");

  const valid = await fixture.adapter.validate(fixture.validValues);
  expect(valid).toEqual({});

  const form = createForm({
    initialValues: fixture.invalidValues,
    schema: fixture.adapter,
  });
  expect(await form.validate()).toBe(false);
  expect(form.errors(fixture.expectedInvalidPath)).toBeTypeOf("string");

  form.reset({ values: fixture.validValues });
  expect(await form.validate()).toBe(true);
  form.destroy();
}
