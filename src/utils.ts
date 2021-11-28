import uniqid from "uniqid";

/**
 * Generate a unique filename.
 * @param filename Filename.
 */
 export function generateRandomFilename(filename: string): string {
  const [_, name, ext] = filename.match(/(.+?)(\.[^.]*$|$)/) || [];

  const parseName: string | undefined = name.match(/([A-Za-z0-9])+/g)?.join("-");

  return uniqid(`${ parseName }-`) + ext;
}

export type FunctionPredicate<T, K extends keyof T> = (entity: T, value: any, key: K) => Partial<boolean>;

function transform<T, K extends keyof T>(
  value: T,
  predicate: FunctionPredicate<T, K>
): Partial<T> {
  const target = Object.assign({}, value);
  
  return Object.keys(target).reduce((memo, key) => {
    const item = key as K;
    const entity = memo as T;

    if(predicate(entity, entity[item], item)) entity[item] = entity[item];
    return memo;
  }, {});
}

/**
 * Omit properties.
 * @param payload Payload
 * @param properties Properties to omit.
 * @returns 
 */
export const omitProps = <T, K extends keyof T>(entity: T, properties: K[]) =>
  transform(entity, (_, __, key) => properties.includes(key as K));

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
