import { ControllerMethods, TypeEntities } from "./declarations";
import { generateRandomFilename } from "./utils";

import { DirectoryController } from "./controllers/directory.controller";
import { FileController } from "./controllers/file.controller";

export interface ServiceOptions {
  type: TypeEntities;
  controller?: ControllerMethods;
}

/**
 * Decorator that marks a class as a filesrocket service 
 * and provides configuration metadata that determines 
 * how the service should be processed, instantiated, 
 * and used at run time.
 * 
 * **Note:** It is mandatory to decorate a class when you 
 * need to create a custom service.
 * @param options Options.
 */
export function Service(options: ServiceOptions) {
  return (constructor: Function) => {
    const { type } = options;

    const controller = type === "Directories"
      ? new DirectoryController(constructor.prototype)
      : new FileController(constructor.prototype);

    constructor.prototype.type = type;
    constructor.prototype.controller = controller;
  };
}

export type FunctionStrategy<T> = (data: T) => T;

export interface GenerateFilenameParams<T> {
  property: keyof T;
  strategy: FunctionStrategy<string>;
}

/**
 * Generates a unique filename.
 * @param strategy Function that customizes the creation of the filename.
 */
 export function GenerateFilename<T>(
  params?: Partial<GenerateFilenameParams<T>>
) {
  return function (
    _: Object,
    __: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    let original = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const { property, strategy } = params || {};
      const data = args[0];

      const filename: string = generateRandomFilename(data[property || "name"]);
      data[property || "name"] = filename;

      if (typeof strategy === "function") {
        data[property || "name"] = strategy(filename);
      }

      return original.apply(this, args);
    };
  };
}
