import { Result, ServiceMethods, Payload } from "./index";

type Service = ServiceMethods<Payload, Result>;

export class BaseRocket {
  /**
   * Represents all registered rockets.
   */
  protected readonly rockets: Map<string, Partial<Service>> = new Map();

  /**
   * Responsible method of register new rocket.
   * @param name Rocket name.
   * @param rocket Class that implementes the interface ServiceMethods
   */
  register(name: string, rocket: Partial<Service>) {
    this.rockets.set(name, rocket);
  }

  /**
   * Get rocket.
   * @param name Rocket name
   */
  getRocket(name: string): Partial<Service> | undefined {
    return this.rockets.get(name);
  }
}
