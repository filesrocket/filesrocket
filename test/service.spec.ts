import { Filesrocket } from '../src/service'
import { Service } from '../src/common'
import assert from 'assert'

const filesrocket = new Filesrocket()

@Service({
  type: 'Files'
})
class OneService {}

@Service({
  type: 'Directories'
})
class TwoService {}

filesrocket.register('serviceOne', new OneService())

filesrocket.register('serviceTwo', new TwoService())

describe('Filesrocket service', () => {
  it('Check the existence of services', () => {
    assert.ok(filesrocket.services.length > 1)
    assert.ok(filesrocket.services.length === 2)
  })
})
