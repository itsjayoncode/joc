import type {
  FieldPath,
  FormConfig,
  FormInstance,
  FormSelector,
  FormState,
} from "@jayoncode/form-intelligence";

import type { Ref } from "vue";

export interface FormElementProps {
  readonly ref: Ref<HTMLFormElement | null>;
  readonly noValidate: true;
}

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
  readonly state: Ref<FormState<TValues>>;
  readonly ref: FormInstance<TValues>["ref"];
  form(): FormElementProps;
  field(path: FieldPath): FieldElementProps;
  submit(): SubmitButtonProps;
  submitButton(): SubmitButtonProps;
}

export type UseFormConfig<TValues extends Record<string, unknown>> = FormConfig<TValues>;

export type UseFormStateSelector<TValues extends Record<string, unknown>, TSelected> = FormSelector<
  TValues,
  TSelected
>;
