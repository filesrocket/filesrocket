import { generateRandomFilename } from './utils'
import { TypeEntities } from './declarations'

import { DirectoryController } from './controllers/directory.controller'
import { FileController } from './controllers/file.controller'

export interface ServiceOptions {
  type: TypeEntities;
}

type Constructor<T = {}> = new (...args: any[]) => T;

export function ApplyMixins<T extends Constructor> (target: T, ...constructors: any[]) {
  constructors.forEach(constructor => {
    const names: string[] = Object.getOwnPropertyNames(constructor.prototype)

    names.forEach(name => {
      const propertyDescriptor = Object.getOwnPropertyDescriptor(constructor.prototype, name) || Object.create(null)
      Object.defineProperty(target.prototype, name, propertyDescriptor)
    })
  })

  return target
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
export function Service (options: ServiceOptions) {
  return (Constructor: any) => {
    const { type } = options
    const controller = type !== 'Directories'
      ? FileController
      : DirectoryController

    // const Service = ApplyMixins(
    //   class extends Constructor {
    //     entityType = type
    //     controller = controller
    //   },
    //   EventEmitter
    // )

    return class extends Constructor {
      entityType = type
      controller = controller
    }
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
export function Filename<T> (
  params?: Partial<GenerateFilenameParams<T>>
) {
  return function (
    target: Object,
    key: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const original = descriptor.value

    descriptor.value = function (...args: any[]) {
      const { property, strategy } = params || {}
      const data = args[0]

      const filename: string = generateRandomFilename(data[property || 'name'])
      data[property || 'name'] = filename

      if (typeof strategy === 'function') {
        data[property || 'name'] = strategy(filename)
      }

      return original.apply(this, args)
    }
  }
}
