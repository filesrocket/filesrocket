import { InputEntity } from '@filesrocket/core/lib'
import { readdir, createReadStream } from 'fs'
import { promisify } from 'util'
import assert from 'assert'
import path from 'path'

import { environments } from '../environments/environments'

import { FileService } from '../../src/services/file.service'

const readdirAsync = promisify(readdir)

const service = new FileService({
  pagination: { default: 15, max: 50 },
  cloud_name: environments.CLOUD_NAME,
  api_key: environments.API_KEY,
  api_secret: environments.API_SECRET
})

const FOLDER_CLOUDINARY = 'filesrocket-test'

describe('File Service with Cloduinary', () => {
  it('Upload files', async () => {
    const dir = path.resolve(__dirname, '../fixtures')

    const items = await readdirAsync(dir)

    const entities = items.map((item) => {
      const fullpath = path.resolve(dir, item)

      const entity = path.parse(fullpath)

      const readable = createReadStream(fullpath)

      return {
        name: entity.base,
        fieldname: 'files',
        stream: readable,
        encoding: '',
        mimetype: ''
      } as InputEntity
    })

    const values = await Promise.all(
      entities.map((entity) => service.create(entity, {
        path: FOLDER_CLOUDINARY
      }))
    )

    assert.equal(values.length, entities.length)
  })

  it('List files', async () => {
    const data = await service.list({ path: FOLDER_CLOUDINARY })

    assert.ok(data.items.length > 0)
  })

  it('Get file', async () => {
    const data = await service.list({ path: FOLDER_CLOUDINARY })

    const file = data.items.at(0)

    const entity = await service.get(file?.id as string)

    assert.equal(entity.id, file?.id)
  })

  it('Remove file', async () => {
    const data = await service.list({ path: FOLDER_CLOUDINARY })

    const files = await Promise.all(
      data.items.map((item) => service.remove(item.id))
    )

    assert.ok(files.length > 0)
  })
})
