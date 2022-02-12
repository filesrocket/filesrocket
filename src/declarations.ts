import { NextFunction, Request, Response } from 'express'
import { ObjectHooks } from './hooks'

export interface Query {
  [key: string]: any;
}

export const ROCKET_RESULT = 'rocketResult'

export type TypeEntities = 'Files' | 'Directories';

export type Middleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any> | any;

export interface Pagination {
  /**
   * Represents the number of entities that can be obtained
   * by default in a request.
   */
  default: number;
  /**
   * Represents the maximum number of entities that can be
   * listed in a request.
   */
  max: number;
}

export interface Paginated<T> {
  /**
   * Represents a list of entities.
   */
  items: T[];
  /**
   * Represents the total of the entities
   */
  total: number;
  /**
   * Represents the number of entities obtained in the request.
   */
  size: number;
  /**
   * Represents the current page.
   */
  page: string | number | undefined;
  /**
   * Represents if there are more pages to display, keep in mind
   * that this property will only be present when there are more
   * entities to return.
   */
  nextPageToken?: string | number;
  /**
   * Represents the previous page.
   */
  prevPageToken?: string | number;
}

export interface FileEntity {
  name: string;
  /**
   * Represent a Readable of Node.js. For more information visit:
   * https://nodejs.org/api/stream.html#readable-streams
   */
  // eslint-disable-next-line no-undef
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
   * Middleware reponsible of the creation of an entity.
   */
  create: Middleware;
  /**
   * Middleware reponsible of the list of entities.
   */
  list: Middleware;
  /**
   * Middleware reponsible of the deletion of entities.
   */
  remove: Middleware;
}

export type Service<T = FileEntity> = Partial<ServiceMethods<T, Partial<ResultEntity>>>;

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
  allowedExts: string[];
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
  hooks?: Partial<ObjectHooks>;
  /**
   * A service is a class, or an object that allows the
   * administration of entities.
   */
  service: Partial<ServiceMethods<any, any>>;
    /**
   * Options. For more informarion visit the following
   * link: https://www.npmjs.com/package/busboy#busboy-methods
   */
  options?: Partial<UploadOptions>;
}

export interface RouterParams {
  /**
   * Root path.
   * */
  path: string;
  /**
   * List of services.
   * */
  services: ServiceRouter[];
}
