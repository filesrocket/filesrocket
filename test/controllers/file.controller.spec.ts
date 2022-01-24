import request from "supertest";
import express from "express";
import assert from "assert";

import { FileController } from "../../src/controllers/file.controller";
import { FileEntity, ResultEntity, ROCKET_RESULT, ServiceMethods } from "../../src";

const items: Partial<ResultEntity>[] = [
  { id: "1", name: "filesrocket.png", size: 12345 },
  { id: "2", name: "filesrocket-local.png", size: 54321 },
  { id: "3", name: "filesrocket-client.png", size: 52413 }
];

class Service implements Partial<ServiceMethods> {
  async create(data: Partial<FileEntity>): Promise<Partial<ResultEntity>> {
    return data;
  }

  async list(): Promise<Partial<ResultEntity>[]> {
    return items;
  }

  async remove(id: string): Promise<Partial<ResultEntity>> {
    const index: number = items.findIndex(item => item.id === id);

    const data = items[index];
    items.splice(index, 1);

    return data;
  }
}

const controller = new FileController(new Service());
const PATH: string = "/files";

const app = express();

app.post(PATH, controller.create(), (req, res) => {
  const data = (req as any)[ROCKET_RESULT];
  res.status(200).json(data);
});

app.get(PATH, controller.list(), (req, res) => {
  const data = (req as any)[ROCKET_RESULT];
  res.status(200).json(data);
});

app.delete(PATH, controller.remove(), (req, res) => {
  const data = (req as any)[ROCKET_RESULT];
  res.status(200).json(data);
});

describe("File controller.", () => {
  it("Remove file", (done) => {
    request(app)
      .delete(PATH)
      .query({ id: "1" })
      .expect(200)
      .expect("Content-Type", /json/)
      .end((err, res) => {
        if (err) return done(err);
        assert.deepEqual(res.body, {
          id: "1",
          name: "filesrocket.png",
          size: 12345
        });
        done();
      });
  });

  it("Fail to remove a file", (done) => {
    request(app).delete(PATH).expect(400, done);
  });
});
