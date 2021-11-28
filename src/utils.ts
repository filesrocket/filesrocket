/**
 * Managenment promise.
 * @param promise Promise.
 */
export async function handlerPromise<T>(
  promise: Promise<T>
): Promise<[T | null, any]> {
  try {
    return [await promise, null];
  } catch (error) {
    return [null, error];
  }
}
