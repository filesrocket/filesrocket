import {
  ServiceMethods,
  OutputEntity,
  Paginated,
  InputEntity,
  Query
} from '@filesrocket/core'
import { createWriteStream, unlink, readdir, statSync } from 'fs'
import { NotFound } from 'http-errors'
import { promisify } from 'util'
import path from 'path'

import { DirectoryService } from './directory.service'
import { BaseService } from './base.service'
import { paginate } from '../helpers'
import { Options } from '../index'

const readdirAsync = promisify(readdir)
const unlinkAsync = promisify(unlink)

export class FileService extends BaseService implements Partial<ServiceMethods> {
  protected directoryService: DirectoryService

  constructor (protected readonly options: Options) {
    super(options)
    this.directoryService = new DirectoryService(options)
  }

  async create (data: InputEntity, query: Query = {}): Promise<OutputEntity> {
    const { path: root = '' } = query
    await this.directoryService.create({ name: root })

    // Fullpath.
    const { directory: folder } = this.options
    const fullpath: string = path.resolve(folder, root, data.name)

    return new Promise((resolve, reject) => {
      const writable = createWriteStream(fullpath)

      writable.on('finish', async () => {
        const data = await this.get(fullpath)
        resolve(data)
      })

      writable.on('error', (err) => reject(err))

      data.stream.pipe(writable)
    })
  }

  async list (query: Query = {}): Promise<Paginated<OutputEntity>> {
    const { pagination, directory } = this.options
    const { size, page, path: root = '' } = query

    const dir: string = path.resolve(`${directory}/${root}`)

    const isExist = await this.hasExist(dir)

    if (!isExist) return paginate([], 0)

    const items: string[] = await readdirAsync(dir)

    const filtered: string[] = items.filter((item) => {
      const stat = statSync(`${dir}/${item}`)
      return stat.isFile()
    })

    const length: number = pagination.max >= size ? size : pagination.default
    const paginatedItems: Paginated<unknown> = paginate(filtered, length, page)

    const files: OutputEntity[] = await Promise.all(
      paginatedItems.items.map((item) => this.get(`${dir}/${item}`))
    )

    return Object.defineProperty(
      paginatedItems,
      'items',
      { value: files }
    ) as Paginated<OutputEntity>
  }

  async get (id: string, query: Query = {}): Promise<OutputEntity> {
    const fullpath = this.resolvePath(id)

    const isExist = await this.hasExist(fullpath)

    if (!isExist) throw new NotFound('File does not exist')

    return this.builder(fullpath)
  }

  async remove (id: string, query: Query = {}): Promise<OutputEntity> {
    const fullpath = this.resolvePath(id)

    // Get file before remove.
    const file = await this.get(id)

    await unlinkAsync(fullpath)

    return file
  }
}
