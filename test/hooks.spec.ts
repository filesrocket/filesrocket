import request from "supertest";
import express from "express";
import assert from "assert";

import { ControllerMethods, Middleware, ResultEntity, ROCKET_RESULT } from "../src";
import { serviceHandler } from "../src/hooks";
import { Unauthorized } from "../src/errors";

const app = express();

const data: Partial<ResultEntity> = {
  name: "filesrocket.png",
  size: 123456,
  url: "http://localhost:3030/uploads/filesrocket.png"
}

class Controller implements ControllerMethods {
  create(): Middleware {
    return (req, _, next) => {
      req = Object.defineProperty(req, ROCKET_RESULT, { value: data });
      return next();
    }
  }

  list(): Middleware {
    return () => {}
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
      before: {
        create: [isLoggedIn]
      },
      after: {
        create: [assingUsername]
      }
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
      assert.deepEqual(res.body, { ...data, username: "IvanZM123" });
      done();
    });
  });
});

describe("List hook", () => {
  // ...
});

describe("Remove hook", () => {
  // ...
});
