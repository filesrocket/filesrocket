import { generateRandomFilename } from "./utils";
import { DataFile } from "./index";

export type FunctionStrategy<T> = (filename: T) => T;

/**
 * Generates a unique filename.
 * @param strategy Function that customizes the creation of the filename.
 */
export function ParseFilename(strategy?: FunctionStrategy<string>) {
  return function (
    _: Object,
    __: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    let original = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const data = args[0] as DataFile;

      const filename: string = generateRandomFilename(data.filename);
      data.filename = typeof strategy !== "function" ? filename : strategy(filename);

      args[0] = data;
      return original.apply(this, args);
    }
  }
}
