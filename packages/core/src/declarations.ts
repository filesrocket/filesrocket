import { BusboyConfig } from 'busboy'

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
   * URL to get the following results.
   */
  nextPage: string | number | null;
  /**
   * URL to get previous results.
   */
  prevPage: string | number | null;
}

export interface InputEntity {
  /**
   * File name (including extension)
   */
  name: string;
  /**
   * Represent a Readable of Node.js. For more information visit:
   * https://nodejs.org/api/stream.html#readable-streams
   */
  // eslint-disable-next-line no-undef
  stream: NodeJS.ReadableStream;
  /**
   * Form field name.
   */
  fieldname: string;
  encoding: string;
  /**
   * Specifies the type of data such as text, image, audio, etc.
   * which files contain.
   */
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
  createdAt: Date | null;
  /**
   * Date of last update of the entity.
   */
  updatedAt: Date | null;
}

export interface UploadOptions extends BusboyConfig {
  /**
   * List of allowed file extensions.
   * For example: `.jpg .png .mp4`
   */
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
