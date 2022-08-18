import assert from 'assert'

import { FileController } from '../src/controllers/file.controller'
import { Filesrocket } from '../src/index'

const filesrocket = new Filesrocket()

class OneService {}

class TwoService {}

class ThreeService {}

filesrocket.register('serviceOne', new OneService())

filesrocket.register('serviceTwo', new TwoService())

filesrocket.register('serviceThree', new ThreeService())

describe('Filesrocket service', () => {
  it('Register a service that already exists', () => {
    assert.throws(
      () => filesrocket.register('serviceOne', new ThreeService()),
      /The serviceOne service already exists./
    )
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
    assert.ok(filesrocket.services.length > 1)
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
