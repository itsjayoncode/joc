import type {
  FieldController,
  FieldPath,
  FormConfig,
  FormController,
  FormInstance,
  FormSelector,
  FormState,
} from "@jayoncode/form-intelligence";

export interface FormElementProps {
  readonly ref: FormInstance<Record<string, unknown>>["ref"];
  readonly noValidate: true;
}

/** Native-friendly props: `name` + `aria-*` (DOM enhancer owns values when using `form.ref`). */
export interface FieldElementProps {
  readonly name: FieldPath;
  readonly "aria-invalid"?: boolean;
  readonly "aria-required"?: boolean;
  readonly "aria-describedby"?: string;
  /** Derived UI projection status (`idle` | `validating` | `error` | `success`). */
  readonly "data-fi-status"?: "validating" | "error" | "success" | "idle";
}

export interface SubmitButtonProps {
  readonly type: "submit";
  readonly disabled?: boolean;
  readonly "aria-busy"?: boolean;
}

export interface UseFormReturn<TValues extends Record<string, unknown>> {
  readonly instance: FormInstance<TValues>;
  /** Thin FormController façade over the same instance. */
  readonly controller: FormController<TValues>;
  readonly state: FormState<TValues>;
  readonly ref: FormInstance<TValues>["ref"];
  form(): FormElementProps;
  /** Spread onto inputs — `name` + `aria-*` from FieldController. */
  field(path: FieldPath): FieldElementProps;
  /** Full FieldController (`bind()`, `aria`, `setAriaIds`, …). */
  fieldController(path: FieldPath): FieldController<TValues>;
  submit(): SubmitButtonProps;
  submitButton(): SubmitButtonProps;
  focusFirstInvalid(): FieldPath | undefined;
}

export type UseFormConfig<TValues extends Record<string, unknown>> = FormConfig<TValues>;

export type UseFormStateSelector<TValues extends Record<string, unknown>, TSelected> = FormSelector<
  TValues,
  TSelected
>;
