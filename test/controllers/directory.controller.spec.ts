import request from "supertest";
import express from "express";
import assert from "assert";

import {
  DirectoryController,
  DirectoryEntity,
  ServiceMethods,
  ResultEntity,
  ROCKET_RESULT
} from "../../src/index";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const items: Partial<ResultEntity>[] = [
  { name: "images" },
  { name: "videos" },
  { name: "audios" },
  { name: "documents" }
];

class Service implements Partial<ServiceMethods<DirectoryEntity>> {
  async create(data: DirectoryEntity) {
    return { name: data.name } as any;
  }

  async list() {
    return items;
  }
}

const controller = new DirectoryController(new Service());

const PATH: string = "/directories";

app.post(PATH, controller.create(), (req, res) => {
  const data = (req as any)[ROCKET_RESULT];
  res.status(200).json(data);
});

app.get(PATH, controller.list(), (req, res) => {
  const data = (req as any)[ROCKET_RESULT];
  res.status(200).json(data);
});

describe("Directory creation", () => {
  it("Create directory successfully", (done) => {
    request(app)
      .post(PATH)
      .set("Accept", "application/json")
      .send({ name: "images" })
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        assert.equal(typeof res.body, "object");
        assert.deepEqual(res.body, { name: "images" });

        done();
      });
  });

  it("Bad Request. The body is null or empty", (done) => {
    request(app)
      .post(PATH)
      .set("Accept", "application/json")
      .send({})
      .expect(400, done);
  });
});

describe("List directories", () => {
  it("Get many directories", (done) => {
    request(app)
      .get(PATH)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        assert.equal(res.body.length, items.length);
        done();
      });
  });
});
