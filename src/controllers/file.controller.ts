import { NextFunction, Request, Response } from 'express'
import typeis from 'type-is'
import Busboy from 'busboy'
import path from 'path'

import {
  ControllerMethods,
  FileEntity,
  ROCKET_RESULT,
  UploadOptions,
  ServiceMethods
} from '../declarations'
import { BadRequest, NotImplemented } from '../errors'
import { BaseController } from './base.controller'
import { Middleware } from '../index'

export class FileController extends BaseController implements ControllerMethods {
  constructor (protected readonly service: Partial<ServiceMethods>) {
    super(service)
  }

  create (options?: Partial<UploadOptions>): Middleware {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!typeis(req, ['multipart'])) return next()

        const busboy = new Busboy({
          limits: { files: 1 },
          headers: req.headers,
          ...options
        })

        busboy.on('field', (fieldname, value) => {
          req.body = Object.assign(req.body, { [fieldname]: value })
        })

        busboy.on(
          'file',
          async (fieldname, stream, name, encoding, mimetype) => {
            const exts: string[] = options?.extnames || []
            const payload: FileEntity = {
              fieldname,
              stream,
              name,
              encoding,
              mimetype
            }

            if (typeof this.service.create !== 'function') {
              return next(
                new NotImplemented('The create method not implemented.')
              )
            }

            if (!name) {
              return next(new BadRequest('The content is empty'))
            }

            if (!exts.length) {
              const data = await this.service.create(payload, req.query)
              req = Object.defineProperty(req, ROCKET_RESULT, { value: data })
              return next()
            }

            const { ext } = path.parse(name)

            if (!exts.includes(ext)) {
              const extensions = exts.join(', ')
              return next(
                new BadRequest(
                  `The ${ext} extension is not allowed. Consider using: ${extensions}`
                )
              )
            }

            const data = await this.service.create(payload, req.query)

            req = Object.defineProperty(req, ROCKET_RESULT, { value: data })

            next()
          }
        )

        req.on('error', (err) => next(err))

        req.pipe(busboy)
      } catch (error) {
        next(error)
      }
    }
  }
}
