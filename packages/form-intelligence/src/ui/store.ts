import { resolveUiPolicies } from "./policies.js";

import type { ResolvedUiPolicies, UiPolicyOptions } from "./types.js";
import type { FormInstance } from "../types/index.js";

const policyStore = new WeakMap<object, ResolvedUiPolicies>();
const registeredStore = new WeakMap<object, true>();

export function setUiPolicies(
  form: FormInstance<Record<string, unknown>> | object,
  options: UiPolicyOptions = {},
): ResolvedUiPolicies {
  const resolved = resolveUiPolicies(options);
  policyStore.set(form, resolved);
  registeredStore.set(form, true);
  return resolved;
}

export function getUiPolicies(
  form: FormInstance<Record<string, unknown>> | object,
): ResolvedUiPolicies | undefined {
  return policyStore.get(form);
}

export function hasUiPoliciesRegistered(
  form: FormInstance<Record<string, unknown>> | object,
): boolean {
  return registeredStore.has(form);
}

export function clearUiPolicies(form: FormInstance<Record<string, unknown>> | object): void {
  policyStore.delete(form);
  registeredStore.delete(form);
}

export function resolvePoliciesForForm(
  form: FormInstance<Record<string, unknown>> | object,
): ResolvedUiPolicies {
  return getUiPolicies(form) ?? resolveUiPolicies();
}
