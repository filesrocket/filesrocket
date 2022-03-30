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

export interface InputFile {
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

export interface ServiceMethods<T = Partial<InputFile>> {
  /**
   * Create a new entity.
   * @param data Data.
   * @param query Query.
   */
  create(data: T, query?: Query): Promise<OutputEntity>;
  /**
   * Gets a list of entities.
   * @param query Query.
   */
  list(query?: Query): Promise<Paginated<OutputEntity> | OutputEntity[]>;
  /**
   * Remove a entity.
   * @param id Identifier.
   * @param query Query.
   */
  remove(id: string, query?: Query): Promise<OutputEntity>;
}

export interface FileManager {
  file: ServiceMethods;
}

export interface Service<T> extends ServiceMethods<T> {}
