import { NextFunction, Request, Response } from "express";
import { Hooks } from "./hooks";

export interface Query {
  [key: string]: any;
}

export const ROCKET_RESULT = "rocketResult";

export type TypeEntities = "Files" | "Directories";

export type Middleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any> | any;

export interface Pagination {
  default: number;
  max: number;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  size: number;
  page: string | number | undefined;
  nextPageToken: string | number | undefined;
  prevPageToken: string | number | undefined;
}

export interface FileEntity {
  name: string;
  stream: NodeJS.ReadableStream;
  fieldname: string;
  encoding: string;
  mimetype: string;
}

export interface DirectoryEntity extends Query {
  name: string;
}

export interface ResultEntity extends Query {
  /**
   * Identifier entity.
   */
  id: string;
  /**
   * Name of the entity.
   */
  name: string;
  /**
   * Entity size in bytes.
   */
  size: number;
  /**
   * Entity extension.
   */
  ext: string;
  /**
   * Url of the entity.
   */
  url: string;
  /**
   * Parent directory of the entity.
   */
  dir: string;
  /**
   * Date of creation of the entity.
   */
  createdAt: Date;
  /**
   * Date of last update of the entity.
   */
  updatedAt: Date;
}

export interface ServiceMethods<T = Partial<FileEntity>, K = Partial<ResultEntity>> {
  /**
   * Create a new entity.
   * @param data Data.
   * @param query Query.
   */
  create(data: T, query?: Query): Promise<K>;
  /**
   * Gets a list of entities.
   * @param query Query.
   */
  list(query?: Query): Promise<Paginated<K> | K[]>;
  /**
   * Remove a entity.
   * @param id Identifier.
   * @param query Query.
   */
  remove(id: string, query?: Query): Promise<K>;
}

export interface ControllerMethods {
  /**
   * Control the creation of an entity.
   */
  create(params?: Query): Middleware;
  /**
   * Control the list of entities.
   */
  list(params?: Query): Middleware;
  /**
   * Control the deletion of entities
   */
  remove(params?: Query): Middleware;
}

export type Service<T = FileEntity> = Partial<ServiceMethods<T, ResultEntity>>;

export interface UploadOptions {
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

export interface ServiceRouter {
  /**
   * Service name, this name replaces the original name 
   * of the service you are using.
  */
  name?: string;
  /**
   * Hooks are middlewares that are executed before or
   * after creating, listing or removing an entity.
   */
  hooks?: Partial<Hooks>;
  /**
   * A service is a class, or an object that allows the
   * administration of entities.
   */
  service: Partial<ServiceMethods<any, any>>;
}

export interface RouterParams {
  /** 
   * Root path.
   * */
  path: string;
  /**
   * Options. For more informarion visit the following
   * link: https://www.npmjs.com/package/busboy#busboy-methods
   */
  options?: UploadOptions;
  /** 
   * List of services.
   * */
  services: ServiceRouter[];
}
