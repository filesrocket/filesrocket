export type Query = Record<string, any>

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

export interface Params extends Query {
  /**
   * Specifies the directory where you want to get the entities.
   */
  path: string;
  /**
   * Specifies the number of entities to get.
   */
  size: number;
  /**
   * This property is useful when paginating the results, it
   * specifies the next page of results.
   */
  page: string | number;
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

export interface InputEntity {
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

export interface OutputEntity extends Query {
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
  extnames: string[];
}

export interface ServiceMethods<T = Partial<InputEntity>> {
  /**
   * Create a new entity.
   * @param data Data.
   * @param query Query.
   */
  create(data: T, query?: Query): Promise<OutputEntity>;
  /**
   * Get a list of entities.
   * @param query Query.
   */
  list(query?: Query): Promise<Paginated<OutputEntity> | OutputEntity[]>;
  /**
   * Get an entity.
   * @param id Identifier.
   * @param query Query.
   */
  get(id: string, query?: Query): Promise<OutputEntity>;
  /**
   * Remove a entity.
   * @param id Identifier.
   * @param query Query.
   */
  remove(id: string, query?: Query): Promise<OutputEntity>;
}
