type TryCatchSuccess<T> = { success: true; data: T };
type TryCatchError = { success: false; error: unknown };
type TryCatchResult<T> = TryCatchSuccess<T> | TryCatchError;

export const tryCatch = async <T>(
  operation: () => Promise<T>
): Promise<TryCatchResult<T>> => {
  try {
    const data = await operation();
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
};
