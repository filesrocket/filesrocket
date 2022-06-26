import { InputEntity } from '@filesrocket/core'
import { createReadStream, readdir } from 'fs'
import { promisify } from 'util'
import assert from 'assert'
import path from 'path'

import { FileService } from '../../src/services/file.service'

const readdirAsync = promisify(readdir)

const service = new FileService({
  pagination: { default: 15, max: 50 },
  directory: 'uploads',
  host: 'http://localhost:3030'
})

describe('File Service', () => {
  it('Create files', async () => {
    const dir = path.resolve(__dirname, '../fixtures')

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

    const values = await Promise.all(
      entities.map((entity) => service.create(entity))
    )

    assert.equal(values.length, items.length)
  })

  it('List file', async () => {
    const items = await service.list({})
    assert.ok(items.items.length > 0)
  })

  it('Get file', async () => {
    const fullpath = path.resolve(
      __dirname,
      '../../uploads',
      'rocket-1.png'
    )

    const entity = await service.get(fullpath)

    assert.ok(entity)
    assert.equal(entity.name, 'rocket-1.png')
    assert.equal(entity.ext, '.png')
  })

  it('Remove file', async () => {
    const data = await service.list({})

    const keys = data.items.map((item) => item.id)

    const items = await Promise.all(
      keys.map((key) => service.remove(key))
    )

    assert.equal(items.length, keys.length)
  })
})
