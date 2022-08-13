import { Request } from 'express'
import busboy from 'busboy'
import path from 'path'

import {
  ServiceMethods,
  UploadOptions,
  OutputEntity,
  InputEntity,
  Query
} from '../declarations'
import { NotImplemented, BadRequest, BandwidthLimitExceeded } from 'http-errors'
import { BaseController } from './base.controller'
import { generateRandomFilename } from '../utils'
import { Counter } from '../helpers/counter'

interface Params extends UploadOptions {
  query: { path?: string } & Query;
}

export class FileController extends BaseController {
  constructor (protected readonly service: Partial<ServiceMethods>) {
    super(service)
  }

  async create (req: Request, params: Partial<Params> = {}): Promise<OutputEntity[]> {
    return new Promise((resolve, reject) => {
      const contentType = req.headers['content-type']

      if (!contentType || !contentType.includes('multipart')) {
        return resolve([])
      }

      const bb = busboy({ ...params, headers: req.headers })
      const counter = new Counter()

      const uploadedFiles: OutputEntity[] = []
      let isReadingFinished = false

      req.body = Object.create(null)

      function done (err?: any) {
        if (!err && counter.isZero && isReadingFinished) {
          req.unpipe(bb)
          bb.removeAllListeners()

          return resolve(uploadedFiles)
        }

        if (err) {
          req.unpipe(bb)
          bb.removeAllListeners()

          return reject(err)
        }
      }

      const saveFile = async (payload: InputEntity) => {
        if (typeof this.service.create !== 'function') {
          return reject(new NotImplemented('Method has not been implemented'))
        }

        const file = await this.service.create(payload, params.query)

        uploadedFiles.push(file)

        counter.decrement()

        done()
      }

      // Manage text fields
      bb.on('field', (fieldname, value, { nameTruncated, valueTruncated }) => {
        if (!fieldname) {
          return done(new BadRequest('MISSING_FIELDNAME'))
        }

        if (nameTruncated) {
          return done(new BandwidthLimitExceeded('FIELDNAME_LIMIT_EXCEEDED'))
        }

        if (valueTruncated) {
          return done(new BandwidthLimitExceeded('VALUE_LIMIT_EXCEEDED'))
        }

        req.body = Object.assign(req.body, { [fieldname]: value })
      })

      // Manage files
      bb.on('file', async (fieldname, stream, { filename, encoding, mimeType }) => {
        if (!filename) return stream.resume()

        const payload: InputEntity = {
          fieldname,
          name: generateRandomFilename(filename),
          stream,
          encoding,
          mimetype: mimeType
        }

        counter.increment()

        const extnames: string[] = params.extnames || []

        // Not required extension
        if (!extnames.length) {
          return saveFile(payload)
        }

        const { ext } = path.parse(filename)

        // Extension not allowed
        if (!extnames.includes(ext)) {
          counter.decrement()
          return stream.resume()
        }

        return saveFile(payload)
      })

      bb.on('finish', () => {
        isReadingFinished = true
        done()
      })

      bb.on('error', (err) => done(err))

      bb.on('fieldsLimit', () =>
        done(new BandwidthLimitExceeded('FIELDS_LIMIT_EXCEEDED'))
      )

      bb.on('filesLimit', () =>
        done(new BandwidthLimitExceeded('FILES_LIMIT_EXCEEDED'))
      )

      bb.on('partsLimit', () =>
        done(new BandwidthLimitExceeded('PARTS_LIMIT_EXCEEDED'))
      )

      req.pipe(bb)
    })
  }
}
