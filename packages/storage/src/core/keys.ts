import { ConfigurationError } from "../errors/index.js";

export function assertNamespace(namespace: string): string {
  const trimmed = namespace.trim();
  if (!trimmed) {
    throw new ConfigurationError("createStorage requires a non-empty namespace.");
  }
  if (trimmed.includes(":")) {
    throw new ConfigurationError('Namespace must not contain ":" (used as the key separator).');
  }
  return trimmed;
}

export function assertPolicyName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) {
    throw new ConfigurationError("definePolicy requires a non-empty policy name.");
  }
  return trimmed;
}

export function namespacedKey(namespace: string, key: string): string {
  if (!key || key.includes(":")) {
    throw new ConfigurationError('Storage key must be non-empty and must not contain ":".');
  }
  return `${namespace}:${key}`;
}
