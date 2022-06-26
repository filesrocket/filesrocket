import assert from 'assert'

import { DirectoryService } from '../../src/services/directory.service'

const service = new DirectoryService({
  pagination: { default: 15, max: 50 },
  directory: 'uploads',
  host: 'http://localhost:3030'
})

const items = [
  'one',
  'two',
  'three',
  'four',
  'five'
]

describe('Directory Service', () => {
  it('Create directories', async () => {
    const directories = await Promise.all(
      items.map((item) => service.create({ name: item }))
    )

    assert.equal(directories.length, items.length)
  })

  it('List directories', async () => {
    const data = await service.list()

    assert.ok(data.items.length > 0)
    assert.equal(data.items.length, items.length)
  })

  it('Get directory', async () => {
    const data = await service.list()

    const item = data.items.at(0)

    const entity = await service.get(item?.id as string)

    assert.ok(entity)
    assert.deepStrictEqual(entity, item)
  })

  it('Remove directories', async () => {
    const data = await service.list()

    const keys = data.items.map((item) => item.id)

    const items = await Promise.all(
      keys.map((key) => service.remove(key))
    )

    const ids = items.map((item) => item.id)

    assert.equal(items.length, keys.length)
    assert.ok(ids.includes(keys.at(0) as string))
  })
})
