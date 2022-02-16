import { NextFunction, Request, Response } from 'express'
import Busboy from 'busboy'

import {
  ControllerMethods,
  Service,
  FileEntity,
  ROCKET_RESULT,
  UploadOptions
} from '../declarations'
import { BaseController } from './base.controller'
import { BadRequest, NotImplemented } from '../errors'
import { Middleware } from '..'

/**
 * Controller methods will need to be modified.
 */
export class FileController extends BaseController implements ControllerMethods {
  constructor (protected readonly service: Service<FileEntity>) {
    super(service)
  }

  create (options?: UploadOptions): Middleware {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const busboy = new Busboy({
          ...options,
          headers: req.headers,
          limits: { files: 1 }
        })

        busboy.on('field', (fieldname, value) => {
          req.body = Object.assign(req.body, { [fieldname]: value })
        })

        busboy.on('file', async (fieldname, stream, name, encoding, mimetype) => {
          const exts: string[] = options?.allowedExts || []
          const payload: FileEntity = {
            fieldname,
            stream,
            name,
            encoding,
            mimetype
          }

          if (typeof this.service.create !== 'function') {
            return next(new NotImplemented('The create method not implemented.'))
          }

          if (fieldname !== 'file') {
            return next(new BadRequest('The file field does not exist.'))
          }

          if (!name) {
            return next(new BadRequest('The file field is empty.'))
          }

          if (!exts.length) {
            const data = await this.service.create(payload, req.query)
            req = Object.defineProperty(req, ROCKET_RESULT, { value: data })
            return next()
          }

          const [ext]: string[] = name.match(/\.([0-9a-z]+)(?:[?#]|$)/g) || []

          if (!exts.includes(ext)) {
            const extensions = exts.join(', ')
            return next(new BadRequest(`The ${ext} extension is not allowed. Consider using: ${extensions}`))
          }

          const data = await this.service.create(payload, req.query)
          req = Object.defineProperty(req, ROCKET_RESULT, { value: data })
          next()
        })

        req.on('error', (err) => next(err))

        req.pipe(busboy)
      } catch (error) {
        next(error)
      }
    }
  }
}
