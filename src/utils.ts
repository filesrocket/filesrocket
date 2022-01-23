import uniqid from "uniqid";
import { parse } from "path";

/**
 * Generate a unique filename.
 * @param filename Filename.
 */
export function generateRandomFilename(filename: string): string {
  const { name, ext } = parse(filename);
  return uniqid(`${ name }-`) + ext;
}

export type FunctionPredicate<T, K> = (
  entity: T,
  value: any,
  key: K
) => Boolean;

function transform<T, K extends keyof T>(
  obj: T,
  predicate: FunctionPredicate<T, K>
) {
  return Object.keys(obj).reduce((prev, curr) => {
    const key = curr as K;
    const memo = prev as T;

    if (predicate(obj, obj[key], key)) {
      memo[key] = obj[key];
    }

    return memo;
  }, {});
}

/**
 * Omit properties.
 * @param obj Entity.
 * @param items Properties.
 */
export const omitProps = <T, K extends keyof T>(obj: T, items: K[]): Partial<T> =>
  transform(obj, (_, __, key) => !items.includes(key as K));
