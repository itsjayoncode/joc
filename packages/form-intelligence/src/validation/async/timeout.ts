/**
 * Race a task against a timeout. Aborts via linked controller when timeout fires.
 */
export async function runWithTimeout<T>(
  timeoutMs: number | undefined,
  parentSignal: AbortSignal,
  task: (signal: AbortSignal) => Promise<T>,
): Promise<T> {
  if (timeoutMs === undefined || timeoutMs <= 0) {
    return task(parentSignal);
  }

  const controller = new AbortController();
  const onParentAbort = () => {
    controller.abort(parentSignal.reason);
  };
  if (parentSignal.aborted) {
    controller.abort(parentSignal.reason);
  } else {
    parentSignal.addEventListener("abort", onParentAbort, { once: true });
  }

  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);

  try {
    return await task(controller.signal);
  } catch (error) {
    if (timedOut && !parentSignal.aborted) {
      throw Object.assign(new Error("Validation timed out."), { name: "TimeoutError" });
    }
    throw error;
  } finally {
    clearTimeout(timer);
    parentSignal.removeEventListener("abort", onParentAbort);
  }
}
