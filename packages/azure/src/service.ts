import { InputEntity, OutputEntity, Paginated, Query, ServiceMethods } from '@filesrocket/core'
import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob'

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
    throw new Error('Method not implemented.')
  }

  async get (id: string, query?: Query | undefined): Promise<OutputEntity> {
    throw new Error('Method not implemented.')
  }

  async remove (id: string, query?: Query | undefined): Promise<OutputEntity> {
    throw new Error('Method not implemented.')
  }
}
