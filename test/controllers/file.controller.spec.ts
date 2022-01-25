import express, { Request, Response } from "express";
import { createWriteStream } from "fs";
import request from "supertest";
import { resolve } from "path";
import assert from "assert";

import { FileController } from "../../src/controllers/file.controller";
import { FileEntity, ResultEntity, ROCKET_RESULT, ServiceMethods } from "../../src";

const app = express();

const items: Partial<ResultEntity>[] = [
  { id: "1", name: "filesrocket.png", size: 12345 },
  { id: "2", name: "filesrocket-local.png", size: 54321 },
  { id: "3", name: "filesrocket-client.png", size: 52413 }
];

class Service implements Partial<ServiceMethods> {
  async create(data: FileEntity): Promise<Partial<ResultEntity>> {
    const writable = createWriteStream(resolve(`uploads/${data.name}`));

    data.stream.pipe(writable);

    return { name: data.name };
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

const handler = (req: Request, res: Response) => {
  const data = (req as any)[ROCKET_RESULT];
  res.status(200).json(data);
}

app.post(PATH, controller.create(), handler);
app.get(PATH, controller.list(), handler);
app.delete(PATH, controller.remove(), handler);

const supertest = request(app);

describe("File controller.", () => {
  it("Create file", (done) => {
    supertest
      .post(PATH)
      .set('Content-type', 'multipart/form-data')
      .attach("file", resolve("test/fixtures/filesrocket.png"))
      .set('Connection', 'keep-alive')
      .expect(200)
      .expect("Content-Type", /json/)
      .end((err, res) => {
        if (err) return done(err);
        assert.equal(res.body.name, "filesrocket.png");
        return done();
      });
  });

  it("Get files", (done) => {
    supertest
      .get(PATH)
      .expect(200)
      .expect("Content-Type", /json/)
      .end((err, res) => {
        if (err) return done(err);
        assert.equal(res.body.length, items.length);
        done();
      });
  });

  it("Remove file", (done) => {
    supertest
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

  it("Remove file when email is not sent", (done) => {
    supertest.delete(PATH).expect(400, done);
  });
});
