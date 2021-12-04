import { NextFunction, Request, Response } from "express";
import { Hooks } from "./hooks";

export interface Query {
  [key: string]: any;
}

export const PROPERTY_UPLOADED = "uploaded";

export type TypeEntities = "Files" | "Directories";

export type Middleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

export interface Paginated<T> {
  items: T[];
  total: number;
  page: string | number | null;
  nextPageToken: string | null;
  prevPageToken: string | null;
}

export interface Entity extends Query {
  name: string;
  size: number;
  ext: string;
  dir: string;
  stream: NodeJS.ReadStream;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceMethods<T> {
  /**
   * Create a new entity.
   * @param data Data.
   * @param query Query.
   */
  create(data: Partial<T>, query?: Query): Promise<T>;
  /**
   * Gets a list of entities.
   * @param query Query.
   */
  list(query?: Query): Promise<Paginated<T> | T[]>;
  /**
   * Remove a entity.
   * @param id Identifier.
   * @param query Query.
   */
  remove(id: string, query?: Query): Promise<T>;
}

export interface ControllerMethods {
  /**
   * Control the creation of an entity.
   */
  create(): Middleware;
  /**
   * Control the list of entities.
   */
  list(): Middleware;
  /**
   * Control the deletion of entities
   */
  remove(): Middleware;
}

export interface RouterParams {
  path: string;
  services: {
    name: string;
    service: ServiceMethods<any>;
    hooks?: Hooks;
  }[];
}
