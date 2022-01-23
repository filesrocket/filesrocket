import request from "supertest";
import express from "express";
import assert from "assert";

import { ControllerMethods, Middleware, ResultEntity, ROCKET_RESULT } from "../src";
import { serviceHandler, Hook } from "../src/hooks";
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
    name: "filesrocket-local.png",
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
      req = Object.defineProperty(req, ROCKET_RESULT, { value: items.slice() });
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

  it("Before: Unauthorized", (done) => {
    request(app).post("/files").expect(401, done);
  });

  it("After: Assing username to data", (done) => {
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

describe("Hooks to list entities", () => {
  const pushFile: Hook = (req, _, next) => {
    (req as any)[ROCKET_RESULT].push({
      name: "filesrocket-cloudinary.png",
      size: 1234567890,
      dir: "images"
    });

    next();
  }

  const checkAccessToken: Hook = (req, _, next) => {
    const { access_token } = req.query;
    if (!access_token) return next(new Unauthorized("You need access_token"));
    return next();
  }

  app.get("/files", serviceHandler({
    controller: new Controller(),
    method: "list",
    hooks: {
      before: [checkAccessToken],
      after: [pushFile]
    }
  }));

  it("Before: Unautorized", (done) => {
    request(app)
      .get("/files")
      .expect(401, done)
  });

  it("After: Enter an entity in items", (done) => {
    request(app)
      .get("/files")
      .query({access_token: "kxabweiu"})
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        assert.ok(res.body.length > items.length)
        done();
      });
  });
});

describe("Remove hook", () => {
  // ...
});
