import { Query, ServiceMethods, OutputEntity, Paginated } from '../declarations'
import { NotImplemented } from '../errors'

export interface Params extends Query {
  path: string;
  size: number;
  page: string | number;
}

export class BaseController {
  constructor (protected service: Partial<ServiceMethods<any>>) {}

  async list (query: Partial<Params> = {}): Promise<Paginated<OutputEntity> | OutputEntity[]> {
    if (typeof this.service.list !== 'function') {
      throw new NotImplemented('The list method not implemented')
    }

    return this.service.list(query)
  }

  async remove (id: string, query: Query = {}): Promise<OutputEntity> {
    if (typeof this.service.remove !== 'function') {
      throw new NotImplemented('The remove method not implemented')
    }

    return this.service.remove(id, query)
  }
}
