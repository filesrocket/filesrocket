import { FileEntity, ResultEntity } from '../../src'
import { Service } from '../../src/common'

abstract class BaseService<T> {
  readonly items: Partial<ResultEntity>[] = []

  async create (data: T): Promise<ResultEntity> {
    this.items.push(data)
    return data as any
  }

  async list (): Promise<ResultEntity[]> {
    return this.items as ResultEntity[]
  }

  async remove (id: string): Promise<ResultEntity> {
    const index: number = this.items.findIndex(item => item.name === id)

    const data = this.items.at(index)
    this.items.splice(index, 1)

    return data as ResultEntity
  }
}

@Service({
  type: 'Files'
})
export class FileService extends BaseService<FileEntity> {}

@Service({
  type: 'Directories'
})
export class DirectoryService extends BaseService<DirectoryService> {}
