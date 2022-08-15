import {
  ServiceMethods,
  OutputEntity,
  InputEntity,
  Paginated,
  Query
} from '@filesrocket/core'
import { omitProps } from '@filesrocket/core/lib/utils'
import { NotFound } from 'http-errors'
import cloudinary from 'cloudinary'

import { convertToExpression, CustomFilename } from './utils'
import { CloudinaryOptions, FileResults } from './index'
import { BaseService } from './base'

export class CloudinaryService extends BaseService implements Partial<ServiceMethods> {
  constructor (private readonly options: CloudinaryOptions) {
    super()
    cloudinary.v2.config(options)
  }

  @CustomFilename()
  async create (data: InputEntity, query: Query = {}): Promise<OutputEntity> {
    const partialQuery = omitProps(query, ['path'])

    const props = {
      resource_type: 'auto',
      ...partialQuery,
      folder: query.path,
      public_id: data.name
    }

    return new Promise((resolve, reject) => {
      const writable = cloudinary.v2
        .uploader
        .upload_stream(props, (err, result) => {
          if (err) return reject(err)

          const entity = this.builder(result as any)

          return resolve(entity)
        })

      writable.on('error', (err) => reject(err))

      data.stream.pipe(writable)
    })
  }

  async list (query: Query = {}): Promise<Paginated<OutputEntity>> {
    const { pagination } = this.options
    const paginate: number = query.size <= pagination.max
      ? query.size
      : pagination.default

    const partialQuery = omitProps(query, ['size', 'page', 'path'])
    const exp: string = convertToExpression(
      { ...partialQuery, folder: query.path },
      ' AND '
    )

    const data = await cloudinary.v2.search
      .expression(exp)
      .max_results(paginate)
      .next_cursor(query.page)
      .execute()

    return this.pagination(data, this.builder) as any
  }

  async get (id: string, query: Query = {}): Promise<OutputEntity> {
    if (!id) throw new NotFound('Id is empty')

    const partialQuery = omitProps(query, ['path'])

    const exp: string = convertToExpression({
      ...partialQuery,
      folder: query.path,
      public_id: id
    }, ' AND ')

    const data: FileResults = await cloudinary.v2.search
      .expression(exp)
      .execute()

    if (!data.resources.length) {
      throw new NotFound('File does not exist')
    }

    return this.builder(data.resources[0])
  }

  async remove (path: string, query: Query = {}): Promise<OutputEntity> {
    const file = await this.get(path, {})

    const partialQuery = omitProps(query, ['path'])

    const params = {
      resource_type: file.resource_type,
      ...partialQuery,
      folder: query.path
    }

    await cloudinary.v2.api.delete_resources([path], params)

    return file
  }
}
