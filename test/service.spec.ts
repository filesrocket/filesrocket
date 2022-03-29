import assert from 'assert'

import { Filesrocket } from '../src/service'

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
})
