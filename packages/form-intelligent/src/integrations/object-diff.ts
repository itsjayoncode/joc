import type { DiffOptions, DiffResult } from "@jayoncode/object-diff";

import type { FormDiffOptions, FormDiffResult, FormPlugin } from "../types/index.js";

type ObjectDiffModule = typeof import("@jayoncode/object-diff");

let objectDiffImport: Promise<ObjectDiffModule> | undefined;

function loadObjectDiff(): Promise<ObjectDiffModule> {
  objectDiffImport ??= import("@jayoncode/object-diff");
  return objectDiffImport;
}

function toFormDiffResult(result: DiffResult, hasChanges: boolean): FormDiffResult {
  return {
    changes: result.changes.map((change) => ({
      path: change.path,
      type: change.type,
      ...(change.previous !== undefined ? { previous: change.previous } : {}),
      ...(change.current !== undefined ? { current: change.current } : {}),
      ...(change.from !== undefined ? { from: change.from } : {}),
    })),
    hasChanges,
    metadata: {
      durationMs: result.metadata.durationMs,
      changeCount: result.metadata.changeCount,
      addedCount: result.metadata.addedCount,
      removedCount: result.metadata.removedCount,
      changedCount: result.metadata.changedCount,
      unchangedCount: result.metadata.unchangedCount,
      movedCount: result.metadata.movedCount,
    },
  };
}

function resolveDiffOptions(options?: FormDiffOptions): DiffOptions | undefined {
  if (!options) {
    return undefined;
  }

  return {
    ...(options.maxDepth !== undefined ? { maxDepth: options.maxDepth } : {}),
    ...(options.includeUnchanged !== undefined
      ? { includeUnchanged: options.includeUnchanged }
      : {}),
    ...(options.treatUndefinedAsMissing !== undefined
      ? { treatUndefinedAsMissing: options.treatUndefinedAsMissing }
      : {}),
  };
}

export async function computeFormDiff(
  before: Record<string, unknown>,
  after: Record<string, unknown>,
  options?: FormDiffOptions,
): Promise<FormDiffResult> {
  const { diff, hasChanges } = await loadObjectDiff();
  const resolved = resolveDiffOptions(options);
  const result = diff(before, after, resolved);

  return toFormDiffResult(result, hasChanges(before, after, resolved));
}

export interface ObjectDiffIntegrationOptions<TValues extends Record<string, unknown>> {
  readonly auditOnSubmit?: boolean;
  readonly onSubmitDiff?: (diff: FormDiffResult, values: TValues) => void | Promise<void>;
  readonly diffOptions?: FormDiffOptions;
}

interface ObjectDiffCapableForm<TValues extends Record<string, unknown>> {
  on(event: "submit", listener: () => void): () => void;
  getValues(): TValues;
  diffFromDefaults(options?: FormDiffOptions): Promise<FormDiffResult>;
}

export function createObjectDiffPlugin<TValues extends Record<string, unknown>>(
  options: ObjectDiffIntegrationOptions<TValues> = {},
): FormPlugin<TValues> {
  const auditOnSubmit = options.auditOnSubmit !== false;

  return {
    name: "object-diff",
    setup(form, _api) {
      if (!auditOnSubmit || !options.onSubmitDiff) {
        return undefined;
      }

      const capable = form as ObjectDiffCapableForm<TValues>;

      return capable.on("submit", () => {
        void capable.diffFromDefaults(options.diffOptions).then((diff) => {
          void options.onSubmitDiff?.(diff, capable.getValues());
        });
      });
    },
  };
}
