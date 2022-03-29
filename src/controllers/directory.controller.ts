// import { NotImplemented } from 'http-errors'

// import { InputDirectory, Query, ServiceMethods } from '../declarations'
// import { BaseController } from './base.controller'

// type Service = Partial<ServiceMethods<InputDirectory>>

// export class DirectoryController extends BaseController {
//   constructor (protected readonly service: Service) {
//     super(service)
//   }

//   async create (data: InputDirectory, query: Query) {
//     if (typeof this.service.create !== 'function') {
//       throw new NotImplemented('Method not implemented')
//     }

//     return this.service.create(data, query)
//   }
// }
