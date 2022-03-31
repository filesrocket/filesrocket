import { Filesrocket } from '../src/index'
import { FileService } from './services/file.service'

const filesrocket = new Filesrocket()

filesrocket.register('local', new FileService())

export default filesrocket
