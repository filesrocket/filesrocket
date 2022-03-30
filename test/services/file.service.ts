import { InputFile } from '../../src/index'
import { NotFound } from 'http-errors'

export class FileService {
  items: Partial<InputFile>[] = [
    { name: 'one.jpg' },
    { name: 'two.jpg' },
    { name: 'three.jpg' }
  ]

  async create (data: InputFile, options: Record<string, unknown>): Promise<any> {
    this.items.push(data)

    data.stream.resume()

    return data
  }

  async list (query: Record<string, unknown>): Promise<any> {
    return this.items
  }

  async remove (id: string, query: Record<string, unknown>): Promise<any> {
    const index = this.items.findIndex((item) => item.name === id)

    if (index < 0) throw new NotFound('The file not exist')

    const entity = this.items.at(index)

    this.items.splice(index, 1)

    return entity
  }
}
