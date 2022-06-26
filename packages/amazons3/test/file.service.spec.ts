import { createReadStream, readdir } from 'fs'
import { promisify } from 'util'
import assert from 'assert'
import path from 'path'

import { environments } from './environments/environments'

import { FileService } from '../src/services/file.service'
import { InputEntity } from '@filesrocket/core/lib'

const readdirAsync = promisify(readdir)

const service = new FileService({
  Pagination: { default: 15, max: 50 },
  Bucket: environments.BUCKET as string,
  region: environments.REGION,
  credentials: {
    accessKeyId: environments.ACCESS_KEY_API as string,
    secretAccessKey: environments.SECRET_ACCESS_KEY as string
  }
})

describe('File Service of Amazon S3', () => {
  it('2 + 2 equal 4', () => {
    assert.equal(2 + 2, 4)
  })

  it('Upload files', async () => {
    const dir = path.resolve(__dirname, 'fixtures')

    const items = await readdirAsync(dir)

    const entities = items.map((item) => {
      const fullpath = path.resolve(dir, item)
      const entity = path.parse(fullpath)
      const readable = createReadStream(fullpath)

      return {
        name: entity.base,
        stream: readable,
        fieldname: 'files',
        mimetype: '',
        encoding: ''
      } as InputEntity
    })

    const files = await Promise.all(
      entities.map((entity) => service.create(entity))
    )

    assert.equal(files.length, items.length)
  })

  it('List files', async () => {
    const data = await service.list()

    const entity = data.items.find((item) => item.name === 'one.png')

    assert.ok(data.items.length > 0)
    assert.ok(typeof entity === 'object')
  })

  it('Get file', async () => {
    const data = await service.list({ size: 1 })

    const file = data.items.at(0)

    const entity = await service.get(file?.id as string)

    assert.deepEqual(entity, file)
  })

  it('Remove file', async () => {
    const data = await service.list()

    const keys = data.items.map((item) => item.id)

    const files = await Promise.all(
      keys.map((key) => service.remove(key))
    )

    assert.equal(files.length, keys.length)
  })
})
