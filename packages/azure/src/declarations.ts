import { Pagination } from '@filesrocket/core'

export interface Credentials {
  accountName: string;
  accountKey: string;
}

export interface Options {
  pagination: Pagination;
  containerName: string;
  credentials: Credentials;
}
