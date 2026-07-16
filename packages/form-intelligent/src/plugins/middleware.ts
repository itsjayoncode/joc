export type PluginMiddleware<TContext> = (
  context: TContext,
  next: () => Promise<void>,
) => void | Promise<void>;

export function composeMiddleware<TContext>(
  middlewares: readonly PluginMiddleware<TContext>[],
): (context: TContext) => Promise<void> {
  return async (context) => {
    let index = 0;

    const next = async (): Promise<void> => {
      const middleware = middlewares[index];
      index += 1;
      if (!middleware) {
        return;
      }

      await middleware(context, next);
    };

    await next();
  };
}

export async function runMiddlewareChain<TContext>(
  middlewares: readonly PluginMiddleware<TContext>[],
  context: TContext,
): Promise<void> {
  await composeMiddleware(middlewares)(context);
}
