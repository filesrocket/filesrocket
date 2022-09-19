import { InputEntity, OutputEntity, Query, ServiceMethods } from '../../src/index'
import { NotFound } from '../../src/errors'

export class FileService implements ServiceMethods {
  items: Partial<InputEntity>[] = [
    { name: 'one.jpg' },
    { name: 'two.jpg' },
    { name: 'three.jpg' }
  ]

  async create (data: InputEntity, options: Record<string, unknown>): Promise<any> {
    this.items.push(data)

    data.stream.resume()

    return data
  }

  async list (query: Record<string, unknown>): Promise<any> {
    return this.items
  }

  async get (id: string, query?: Query): Promise<OutputEntity> {
    const entity = this.items.find(
      (item) => item.name === id
    )

    if (!entity) throw new NotFound('File does not exist')

    return entity as any
  }

  async remove (id: string, query: Record<string, unknown>): Promise<any> {
    const entity = await this.get(id, query)

    const index = this.items.indexOf(entity)

    this.items.splice(index, 1)

    return entity
  }
}
