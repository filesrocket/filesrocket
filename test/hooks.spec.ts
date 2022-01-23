import request from "supertest";
import assert from "assert";

import { ControllerMethods, Middleware } from "../src";
import { serviceHandler } from "../src/hooks";
import app from "./utils/app";

class Controller implements ControllerMethods {
  create(): Middleware {
    return () => {}
  }

  list(): Middleware {
    return () => {}
  }

  remove(): Middleware {
    return () => {}
  }
}

describe("Service handler", () => {
  const handler = serviceHandler({
    controller: new Controller(),
    method: "create"
  });

  it("Mount the middlewares", () => {
    assert.ok(handler.length > 0);
  });

  it("GET /users", (done) => {
    request(app)
      .get("/users")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        console.log(res.body);
        done();
      });
  });
});
