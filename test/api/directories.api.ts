import express from 'express'

import { DirectoryController } from '../../src/controllers/directory.controller'
import { DirectoryEntity, ResultEntity, ServiceMethods } from '../../src'
import { handler } from '../utils/common'

const _app = express()

_app.use(express.json())
_app.use(express.urlencoded({ extended: true }))

export const items: Partial<ResultEntity>[] = [
  { id: '123', name: 'images' },
  { id: '321', name: 'videos' },
  { id: '231', name: 'audios' },
  { id: '132', name: 'documents' }
]
export const path: string = '/directories'

class Service implements Partial<ServiceMethods<DirectoryEntity>> {
  async create (data: DirectoryEntity) {
    return { name: data.name } as any
  }

  async list () {
    return items as ResultEntity[]
  }

  async remove (id: string): Promise<ResultEntity> {
    const index = items.findIndex(item => item.id === id)

    const data = items[index]
    items.splice(index, 1)

    return data as ResultEntity
  }
}

const controller = new DirectoryController(new Service())

_app.post(path, controller.create(), handler)
_app.get(path, controller.list(), handler)
_app.delete(path, controller.remove(), handler)

export const app = _app
