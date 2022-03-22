import { NextFunction, Request, Response } from 'express'
import { Readable } from 'stream'
import typeis from 'type-is'
import busboy from 'busboy'
import path from 'path'

import {
  ControllerMethods,
  FileEntity,
  ROCKET_RESULT,
  UploadOptions,
  ServiceMethods
} from '../declarations'
import { NotImplemented, BadRequest } from '../errors'
import { BaseController } from './base.controller'
import { Middleware } from '../index'

export class FileController extends BaseController implements ControllerMethods {
  constructor (protected readonly service: Partial<ServiceMethods>) {
    super(service)
  }

  create (options: Partial<UploadOptions> = {}): Middleware {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!typeis(req, ['multipart'])) return next()

        if (typeof this.service.create !== 'function') {
          throw new NotImplemented('The method is not implemented')
        }

        const service = this.service as ServiceMethods

        const items = await this.parse(req, options)

        const files = await Promise.all(
          items.map(item => service.create(item, req.query))
        )

        req = Object.defineProperty(req, ROCKET_RESULT, { value: files })

        next()
      } catch (error) {
        next(error)
      }
    }
  }

  async parse (req: Request, config: Partial<UploadOptions>): Promise<FileEntity[]> {
    return new Promise((resolve, reject) => {
      const files: FileEntity[] = []
      const buffers: Record<string, any> = {}

      const bb = busboy({
        ...config,
        headers: req.headers as any
      })

      bb.on('field', (name, value, info) => {
        req.body = Object.assign(req.body, { [name]: value })
      })

      bb.on('file', (fieldname, stream, { filename, encoding, mimeType }) => {
        if (!filename) throw new BadRequest('The content is empty')

        const extnames = config.extnames || []

        if (extnames.length > 0) {
          const { ext } = path.parse(filename)

          if (!extnames.includes(ext)) {
            return reject(
              new BadRequest(`The ${ext} is not allowed`)
            )
          }
        }

        buffers[filename] = []

        stream.on('data', (chunk) => {
          buffers[filename].push(chunk)
        })

        stream.on('end', () => {
          files.push({
            fieldname,
            stream: Readable.from(buffers[filename]),
            name: filename,
            encoding,
            mimetype: mimeType
          })
        })
      })

      bb.on('finish', () => resolve(files))

      bb.on('error', (error) => reject(error))

      req.pipe(bb)
    })
  }
}
