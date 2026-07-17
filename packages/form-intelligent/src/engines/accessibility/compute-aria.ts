import type { ComputeFieldAriaInput, FieldAriaAttributes, FieldAriaResult } from "./types.js";

/**
 * Pure ARIA computation from field state — no DOM queries (Phase 16 / Spec 27).
 */
export function computeFieldAria(input: ComputeFieldAriaInput): FieldAriaResult {
  const ariaInvalid = Boolean(input.error);
  const ariaRequired = input.required === true;

  const tokens: string[] = [];
  if (input.ids?.descriptionId) {
    tokens.push(input.ids.descriptionId);
  }
  if (input.ids?.errorId && ariaInvalid) {
    tokens.push(input.ids.errorId);
  }

  const ariaDescribedBy = tokens.length > 0 ? tokens.join(" ") : undefined;

  const aria = {
    ariaInvalid,
    ariaRequired,
    ariaDescribedBy,
  };

  const attributes: FieldAriaAttributes = {
    "aria-invalid": ariaInvalid,
    "aria-required": ariaRequired ? true : undefined,
    "aria-describedby": ariaDescribedBy,
  };

  return { aria, attributes };
}
