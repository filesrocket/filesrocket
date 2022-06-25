import assert from 'assert'

import { FileController } from '../src/controllers/file.controller'
import { Filesrocket } from '../src/index'

const filesrocket = new Filesrocket()

class OneService {}

class TwoService {}

filesrocket.register('serviceOne', new OneService())

filesrocket.register('serviceTwo', new TwoService())

describe('Filesrocket service', () => {
  it('Check the existence of services', () => {
    assert.ok(filesrocket.services.length > 1)
    assert.ok(filesrocket.services.length === 2)
  })

  it('Get a service', () => {
    const service = filesrocket.service('serviceOne')
    assert.ok(typeof service !== 'undefined')
    assert.ok(service instanceof OneService)
  })

  it('Get a controller', () => {
    const controller = filesrocket.controller('serviceOne')
    assert.ok(typeof controller !== 'undefined')
    assert.ok(controller instanceof FileController)
  })

  it('Get a service list', () => {
    const items = filesrocket.services
    assert.ok(items.length === 2)
  })

  it('Get a service that does not exist', () => {
    const service = filesrocket.service('random')
    assert.ok(typeof service === 'undefined')
  })

  it('Get a controller that does not exist', () => {
    const controller = filesrocket.controller('random')
    assert.ok(typeof controller === 'undefined')
  })
})
