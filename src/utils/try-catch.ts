type TryCatchSuccess<T> = { success: true; data: T };
type TryCatchError<E = unknown> = { success: false; error: E };
type TryCatchResult<T, E = unknown> = TryCatchSuccess<T> | TryCatchError<E>;

export const tryCatch = async <T, E = unknown>(
  operation: () => Promise<T>
): Promise<TryCatchResult<T, E>> => {
  try {
    const data = await operation();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error as E };
  }
};

type TryCatchChain<T> = {
  catch<E = unknown>(
    handler?: (error: E) => void | Promise<void>
  ): Promise<TryCatchResult<T, E>>;
};

export const promise = {
  try<T>(
    operation: () => Promise<T>
  ): Promise<TryCatchChain<T> & TryCatchResult<T, unknown>> {
    return (async () => {
      try {
        const data = await operation();
        const result: TryCatchSuccess<T> = { success: true, data };
        return {
          ...result,
          catch: async <E = unknown>(
            handler?: (error: E) => void | Promise<void>
          ) => {
            return result as TryCatchResult<T, E>;
          },
        };
      } catch (error) {
        const result: TryCatchError<unknown> = { success: false, error };
        return {
          ...result,
          catch: async <E = unknown>(
            handler?: (error: E) => void | Promise<void>
          ) => {
            if (handler) {
              await handler(error as E);
            }
            return result as TryCatchResult<T, E>;
          },
        };
      }
    })();
  },
};
