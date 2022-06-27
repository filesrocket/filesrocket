import { exts } from './constants'
import { parse } from 'path'

export function convertToExpression<T> (payload: T, join: string) {
  const keys: string[] = Object.keys(payload)
  if (!keys.length) return ''

  const items: string[] = []

  keys.forEach((key: string): void => {
    const value = payload[key as keyof T] as any
    if (!value) return

    if (key.match(/^_/)) {
      items.push(value)
      return
    }

    items.push(`${key}=${value}`)
  })

  return items.join(join)
}

function formatFilename (filename: string): string {
  const items = exts.map(item => ({ [item]: item }))
  const dictionary: Record<string, string> = Object.assign({}, ...items)

  const { name, ext } = parse(filename)
  if (dictionary[ext]) filename = name

  return filename
}

/**
 * Generate a random filename with or without an
 * extension depending on the file type
 *
 * **Example**
 * - history.pptx -> history-186dgs.pptx
 * - image.jpg -> image-326gds
 * - video.mp4 -> video-434gas
 * - audio.jpg -> audio-149gds
 *
 * For more information visit: https://cloudinary.com/documentation/image_upload_api_reference#upload_optional_parameters
 */
export function CustomFilename () {
  return function (
    target: Object,
    key: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const original = descriptor.value

    descriptor.value = function (...args: any[]) {
      const data = args[0]

      data.name = formatFilename(data.name)

      return original.apply(this, args)
    }
  }
}
