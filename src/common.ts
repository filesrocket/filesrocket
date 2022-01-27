import { generateRandomFilename } from "./utils";
import { TypeEntities } from "./declarations";

import { DirectoryController } from "./controllers/directory.controller";
import { FileController } from "./controllers/file.controller";

export interface ServiceOptions {
  name: string;
  type: TypeEntities;
}

/**
 * Decorator that sets the controller to use to manage entities
 * based on their type (Files or Directories). In addition
 * to specifying the name of the service.
 *
 * **Note:** It is mandatory to decorate a class when you 
 * need to create a custom service. 
 * @param options Options.
 */
export function Service(options: ServiceOptions) {
  return (constructor: Function) => {
    const { type, name } = options;

    const controller = type !== "Directories" ? FileController : DirectoryController;

    constructor.prototype.entityType = type;
    constructor.prototype.serviceName = name;
    constructor.prototype.controller = controller;
  }
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
 export function Filename<T>(
  params?: Partial<GenerateFilenameParams<T>>
) {
  return function (
    target: Object,
    key: string | symbol,
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
