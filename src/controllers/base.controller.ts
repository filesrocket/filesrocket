import {
  ServiceMethods,
  OutputEntity,
  Paginated,
  Params,
  Query
} from '../declarations'
import { NotImplemented } from '../errors'

type GetParams = Pick<Params, 'path'> & Query;

export class BaseController {
  constructor (protected service: Partial<ServiceMethods<any>>) {}

  async list (query: Partial<Params> = {}): Promise<Paginated<OutputEntity> | OutputEntity[]> {
    if (typeof this.service.list !== 'function') {
      throw new NotImplemented('Method has not been implemented')
    }

    return this.service.list(query)
  }

  get (id: string, query: Partial<GetParams> = {}): Promise<OutputEntity> {
    if (typeof this.service.get !== 'function') {
      throw new NotImplemented('Method has not been implemented')
    }

    return this.service.get(id, query)
  }

  async remove (id: string, query: Query = {}): Promise<OutputEntity> {
    if (typeof this.service.remove !== 'function') {
      throw new NotImplemented('Method has not been implemented')
    }

    return this.service.remove(id, query)
  }
}
