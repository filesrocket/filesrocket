import assert from "assert";

import { ServiceMethods } from "../src/index";
import { RocketRouter } from "../src/index";
import { Service } from "../src/common";

@Service({
  type: "Files",
  name: "filesrocket"
})
export class FileService implements Partial<ServiceMethods> {}

describe("Router", () => {
  it("Instantiate the router", () => {
    const routes = RocketRouter.forRoot({
      path: "storage",
      services: []
    });

    assert.equal(typeof routes, "function");
  });

  it("The number of routes is greater than zero", () => {
    const routes = RocketRouter.forRoot({
      path: "storage",
      services: [
        { service: new FileService() }
      ]
    });

    assert.equal(typeof routes, "function");
    assert.ok(routes.stack.length > 0);
  });

  it("Validate the format of the url", () => {
    const routes = RocketRouter.forRoot({
      path: "storage",
      services: [
        { service: new FileService() }
      ]
    });

    const stack = routes.stack[0];
    const route = stack.route;

    assert.equal(route.path, "/storage/filesrocket/files");
  });
});
