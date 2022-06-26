import { OutputEntity } from '@filesrocket/core'
import { stat, access } from 'fs'
import { promisify } from 'util'
import path from 'path'

import { Options } from '../declarations'

const statAsync = promisify(stat)

export class BaseService {
  constructor (protected readonly options: Options) {}

  /**
   * Method responsible for constructing the entities (Files)
   * @param root Path
   */
  protected async builder (root: string): Promise<OutputEntity> {
    const fullpath: string = path.resolve(root)
    const { directory: folder, host } = this.options
    const { base: name, ext, dir } = path.parse(fullpath)

    const regex = new RegExp(`${folder}.+`, 'g')
    const [directory] = dir.match(regex) || [folder]
    const chunks: string[] = directory.split(path.sep)

    const stat = await statAsync(fullpath)
    const url: string = `${host}/${chunks.join('/')}/${name}`

    const items: string[] = chunks.slice(1, chunks.length)
    stat.isDirectory() && items.push(name)

    return {
      id: url,
      name,
      ext,
      url,
      size: stat.size,
      dir: items.join('/'),
      createdAt: stat.birthtime,
      updatedAt: stat.atime
    }
  }

  /**
   * Method responsible for parsing the HTTP URL to path
   *
   * For example: `http://domain.com/uploads/images/filesrocket.png` -> `uploads/images/filesrocket.png`
   *
   * @param root Path or URL
   */
  protected resolvePath (root: string): string {
    const { directory } = this.options
    const regex = new RegExp(`${directory}.+`, 'g')

    const [dir] = root.match(regex) || ['']

    return path.resolve(dir)
  }

  /**
   * Responsible method if entity exists (Files or Directories)
   * @param root Path
   */
  protected async hasExist (root: string): Promise<boolean> {
    return new Promise((resolve) => {
      const fullpath = path.resolve(root)
      access(fullpath, (err) =>
        (err ? resolve(false) : resolve(true))
      )
    })
  }
}
