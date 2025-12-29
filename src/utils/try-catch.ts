type TryCatchSuccess<T> = { success: true; data: T };
type TryCatchError<E = unknown> = { success: false; error: E };
type TryCatchResult<T, E = unknown> = TryCatchSuccess<T> | TryCatchError<E>;

export const tryCatch = async <T, E = unknown>(
  fn: () => Promise<T>
): Promise<TryCatchResult<T, E>> => {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error as E };
  }
};
