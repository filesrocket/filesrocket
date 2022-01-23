import request from "supertest";
import express from "express";
import assert from "assert";

import { ControllerMethods, Middleware, ResultEntity, ROCKET_RESULT } from "../src";
import { serviceHandler } from "../src/hooks";
import { Unauthorized } from "../src/errors";

const app = express();

const items: Partial<ResultEntity>[] = [
  {
    name: "filesrocket.png",
    size: 1234567890,
    dir: "images"
  },
  {
    name: "filesrocket-client.png",
    size: 1234567890,
    dir: "images"
  },
  {
    name: "filesrocket-local",
    size: 1234567890,
    dir: "images"
  }
];

class Controller implements ControllerMethods {
  create(): Middleware {
    return (req, _, next) => {
      req = Object.defineProperty(req, ROCKET_RESULT, { value: items[0] });
      return next();
    }
  }

  list(): Middleware {
    return (req, _, next) => {
      req = Object.defineProperty(req, ROCKET_RESULT, { value: items });
      next();
    }
  }

  remove(): Middleware {
    return () => {}
  }
}

describe("Hooks for entity creation", () => {
  const isLoggedIn: Middleware = (req, _, next) => {
    const { authorization = "" } = req.headers;
    
    if (!authorization) {
      return next(new Unauthorized("You need an access token"));
    }

    return next();
  };

  const assingUsername: Middleware = (req, _, next) => {
    (req as any)[ROCKET_RESULT].username = "IvanZM123";
    next();
  }

  app.post("/files", serviceHandler({
    controller: new Controller(),
    method: "create",
    hooks: {
      before: [isLoggedIn],
      after: [assingUsername]
    }
  }));

  it("Unauthorized", (done) => {
    request(app).post("/files").expect(401, done);
  });

  it("Assing username to data", (done) => {
    request(app)
    .post("/files")
    .set("authorization", "Bearer aklxbwqiy28")
    .expect(200)
    .end((err, res) => {
      if (err) return done(err);
      assert.deepEqual(res.body, { ...items[0], username: "IvanZM123" });
      done();
    });
  });
});

describe("List hook", () => {
  // app.get("/files", serviceHandler({
  //   controller: new Controller(),
  //   method: "list",
  //   hooks: {
  //     before: [],
  //     after: []
  //   }
  // }));
});

describe("Remove hook", () => {
  // ...
});
