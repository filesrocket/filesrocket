import { NextFunction, Request, Response } from "express";
import { Hooks } from "./hooks";

export const PROPERTY_UPLOADED = "filesUploaded";

export type TypeServices = "Files" | "Directories";

export interface Query {
  [key: string]: any;
}

export type Id = string | number;

export interface DataDir extends Query {
  name: string;
}

export interface DataFile {
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

export interface DataResult extends Query {
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

export interface RocketMethods<T = void> {
  create(): Middleware<T>;
  list(): Middleware<T>;
  remove(): Middleware<T>;
}

export interface ServiceMethods<T = DataFile, K = DataResult> {
  /**
   * Create a new resource.
   * @param data Payload.
   * @param query Parameters.
   */
  create(data: T, query?: Query): Promise<K>;
  /**
   * Get a list of resources.
   * @param query Parameters.
   */
  list(query?: Query): Promise<Paginated<K> | K[]>;
  /**
   * Get a resource.
   * @param id Resource identity.
   * @param query Parameters.
   */
  get(id: string, query?: Query): Promise<K>;
  /**
   * Delete a file.
   * @param id Resource identity.
   * @param query Parameters.
   */
  remove(id: string, query?: Query): Promise<K>;
}

export interface RouterParams<T, K> {
  service: Partial<ServiceMethods<T, K>>;
  controller: RocketMethods;
  hooks?: Hooks;
}

export type Middleware<T> = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<T> | T;
