import { Pagination, Query } from '@filesrocket/core'
import S3 from 'aws-sdk/clients/s3'

export type Operation = 'getObject' | 'putObject';

export interface AmazonConfig extends S3.ClientConfiguration {
  Pagination: Pagination;
  Bucket: string;
}

export interface ParamsUrl extends Query {
  Expires: number;
  Bucket: string;
  Key: string;
}
