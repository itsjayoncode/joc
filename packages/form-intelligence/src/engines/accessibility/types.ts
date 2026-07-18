export interface FieldAriaIds {
  readonly errorId?: string;
  readonly descriptionId?: string;
}

/**
 * CamelCase ARIA snapshot for adapters and FieldController.
 */
export interface FieldAria {
  readonly ariaInvalid: boolean;
  readonly ariaRequired: boolean;
  readonly ariaDescribedBy: string | undefined;
}

/**
 * Spread-friendly DOM attributes (`{...field.aria.attributes}`).
 */
export interface FieldAriaAttributes {
  readonly "aria-invalid": boolean;
  readonly "aria-required": boolean | undefined;
  readonly "aria-describedby": string | undefined;
}

export interface ComputeFieldAriaInput {
  readonly error?: string | undefined;
  /** True when presentation/UI marks the field required. */
  readonly required?: boolean | undefined;
  readonly ids?: FieldAriaIds | undefined;
}

export interface FieldAriaResult {
  readonly aria: FieldAria;
  readonly attributes: FieldAriaAttributes;
}
