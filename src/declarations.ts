import { NextFunction, Request, Response } from "express";
import { RocketService, Hooks } from "./index";

export interface Payload {
  /**
   * Filename. For example: picture.png, songs.mp3 and more...
   */
  filename: string;
  /**
   * Name of the form input.
   */
  fieldname: string;
  /**
   * File in ReadableStream
   */
  file: NodeJS.ReadableStream;
  /**
   * Encoding type.
   */
  encoding: string;
  /**
   * Type of file. For example: image/jpg
   */
  mimetype: string;
}

export interface Result {
  /**
   * File name.
   */
  name: string;
  /**
   * File size.
   */
  size: number;
  /**
   * File extension.
   */
  ext: string;
  /**
   * Directory where the file is located.
   */
  dir: string;
  /**
   * URL file.
   */
  url: string;
  /**
   * File creation date.
   */
  createdAt: Date;
  /**
   * File update date.
   */
  updatedAt: Date;
}

export type Id = string | number;

export interface Pagination {
  /**
   * Items by default.
   */
  default: number;
  /**
   * Maximun items.
   */
  max: number;
}

export interface Paginated<T> {
  /**
   * List of resources.
   */
  items: T[];
  /**
   * Recources delivered.
   */
  size: number;
  /**
   * Total resources.
   */
  total: number;
  /**
   * Current page.
   */
  pageToken: Id | null;
  /**
   * Next page.
   */
  nextPageToken: Id | null;
  /**
   * Previous page.
   */
  prevPageToken: Id | null;
}

export interface Query {
  [key: string]: any;
}

export type Middleware<T> = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<T> | T;

export interface ServiceMethods<T = Payload, K = Result> {
  /**
   * Create a new resource.
   * @param data Payload.
   * @param query Parameters.
   */
  create(data: T, query: Query): Promise<K>;
  /**
   * Get a list of resources.
   * @param query Parameters.
   */
  list(query: Query): Promise<Paginated<K> | K[]>;
  /**
   * Get a resource.
   * @param id Resource identity.
   * @param query Parameters.
   */
  get(id: Id, query: Query): Promise<K>;
  /**
   * Delete a file.
   * @param id Resource identity.
   * @param query Parameters.
   */
  remove(id: Id, query: Query): Promise<K>;
}

export interface Options {
  highWaterMark: number | undefined;
  fileHwm: number | undefined;
  defCharset: string | undefined;
  preservePath: boolean | undefined;
  limits: {
    fieldNameSize?: number | undefined;
    fieldSize?: number | undefined;
    fields?: number | undefined;
    fileSize?: number | undefined;
    files?: number | undefined;
    parts?: number | undefined;
    headerPairs?: number | undefined;
  } | undefined;
}

export interface RouterOptions {
  /**
   * Options of Busboy.
   */
  options?: Partial<Options>;
  /**
   * Added hooks.
   */
  hooks?: Partial<Hooks>;
  /**
   * Add RocketService.
   */
  rocket: RocketService;
  /**
   * Route. Example: /storage
   */
  path: string;
}