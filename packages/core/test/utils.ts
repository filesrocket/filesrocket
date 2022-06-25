import FormData from 'form-data'
import stream from 'stream'

import { UploadOptions } from '../src/declarations'
import filesrocket from './config'

type CallbackFunction = (err?: any, results?: any) => void

export function submit (controller: any, form: FormData, cb: CallbackFunction) {
  form.getLength((err, length) => {
    if (err) return cb(err)

    const req: any = new stream.PassThrough()
    const boundary = form.getBoundary()

    req.headers = {
      'content-type': `multipart/form-data; boundary=${boundary}`,
      'content-length': length
    }

    controller(req)
      .then((files: any) => cb(null, files))
      .catch((err: any) => cb(err))

    form.pipe(req)
  })
}

export function middleware (options: Partial<UploadOptions> = {}) {
  return (req: any) => {
    const service = filesrocket.controller('local')

    if (!service) return

    return service.create(req, options)
  }
}
