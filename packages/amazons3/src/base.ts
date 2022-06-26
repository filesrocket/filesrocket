import { Paginated, OutputEntity } from '@filesrocket/core'
import S3 from 'aws-sdk/clients/s3'
import { parse } from 'path'

import { AmazonConfig, ParamsUrl, Operation } from './declarations'

export class BaseAmazonRocket {
  protected s3: S3

  constructor (protected readonly options: AmazonConfig) {
    this.s3 = new S3(options)
  }

  /**
   * Create a Bucket Amazon S3. Amazon S3 buckets, which are
   * similar to file folders, store objects, which consist
   * of data and its descriptive metadata.
   * @param name Bucket name.
   */
  protected async createBucket (name: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.s3.createBucket({ Bucket: name }, (err, data) => {
        if (!data?.Location || err) return reject(err)
        resolve(data.Location)
      })
    })
  }

  protected paginate (data: S3.ListObjectsV2Output): Paginated<OutputEntity> {
    const items: any[] =
      data.Contents?.map((item) =>
        this.builder(item, {
          Bucket: data.Name,
          Key: item.Key
        })
      ) || []

    return {
      items,
      size: items.length,
      total: data.KeyCount as number,
      page: data.ContinuationToken,
      nextPage: data.NextContinuationToken || null,
      prevPage: null
    }
  }

  /**
   * Generate a url for the files.
   * @param operation Operation.
   * @param params Params.
   */
  protected generateUrl (operation: Operation, params: Partial<ParamsUrl>): string {
    const Bucket: string = this.options.Bucket
    return this.s3.getSignedUrl(operation, { Bucket, ...params })
  }

  protected builder (
    payload: S3.Object,
    query: Partial<ParamsUrl>
  ) {
    const { ext, base: name, dir } = parse(payload.Key as string)

    return {
      ...payload,
      id: payload.Key as string,
      name,
      dir,
      ext,
      size: payload.Size as number,
      url: this.generateUrl('getObject', query),
      updatedAt: new Date(payload.LastModified as Date)
    } as OutputEntity
  }
}
