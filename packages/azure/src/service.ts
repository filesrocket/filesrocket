import { InputEntity, OutputEntity, Paginated, Query, ServiceMethods } from '@filesrocket/core'
import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob'
import path from 'path'

import { Options } from './declarations'

export class AzureService implements ServiceMethods {
  blobServiceClient: BlobServiceClient

  constructor (private readonly options: Options) {
    const { credentials, containerName } = options

    const azureURL = `https://${credentials.accountName}.blob.core.windows.net`

    const sharedkey = new StorageSharedKeyCredential(
      credentials.accountName,
      credentials.accountKey
    )

    this.blobServiceClient = new BlobServiceClient(azureURL, sharedkey)

    this.blobServiceClient.createContainer(containerName)
      .then(() => console.log('Container created successfully'))
      .catch((err) => console.error(err))
  }

  async create (data: Partial<InputEntity>, query?: Query | undefined): Promise<OutputEntity> {
    const { containerName } = this.options

    const containerClient = this.blobServiceClient.getContainerClient(query?.containerName || containerName)

    const blockBlobClient = containerClient.getBlockBlobClient(data.name as string)

    return blockBlobClient.uploadStream(data.stream as any) as any
  }

  async list (query?: Query | undefined): Promise<Paginated<OutputEntity> | OutputEntity[]> {
    const { containerName } = this.options

    const containerClient = this.blobServiceClient.getContainerClient(query?.containerName || containerName)

    const iterator = containerClient.listBlobsFlat().byPage({ maxPageSize: query?.size })

    const res = (await iterator.next()).value

    console.log(res)

    console.log('block blob client: ', await containerClient.getBlockBlobClient('Avril_Lavigne_-_Ums_click2music-63ezffsl8dy08bi.jpg').getProperties())

    return res as any
  }

  async get (id: string, query: Query = {}): Promise<OutputEntity> {
    const containerName = query.containerName || this.options.containerName

    const container = this.blobServiceClient.getContainerClient(containerName)

    const blob = container.getBlockBlobClient(id)

    const res = await blob.getProperties()

    const chunks = id.split('/')
    const dir = chunks.slice(0, chunks.length - 1).join('/')
    const name = chunks.at(-1) as string

    const { ext } = path.parse(id)

    return {
      id,
      name,
      dir,
      ext,
      url: res._response.request.url as string,
      size: res.contentLength as number,
      createdAt: res.createdOn as Date,
      updatedAt: res.lastModified as Date
    }
  }

  async remove (id: string, query?: Query | undefined): Promise<OutputEntity> {
    throw new Error('Method not implemented.')
  }
}
