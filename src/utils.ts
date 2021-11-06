import uniquid from "uniqid";

/**
 * Generate a unique filename.
 * @param filename Filename.
 */
export function generateRandomFilename(filename: string): string {
  // Get name and extension.
  const [_, name, ext] = filename.match(/(.+?)(\.[^.]*$|$)/) || [];
  // Parse filename.
  const parseName: string | undefined = name.match(/([A-Za-z0-9])+/g)?.join("-");
  // Generate unique filename.
  return uniquid(`${ parseName }-`) + ext;
}

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
