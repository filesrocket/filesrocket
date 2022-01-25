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
  { id: "123", name: "images" },
  { id: "321", name: "videos" },
  { id: "231", name: "audios" },
  { id: "132", name: "documents" }
];

class Service implements Partial<ServiceMethods<DirectoryEntity>> {
  async create(data: DirectoryEntity) {
    return { name: data.name } as any;
  }

  async list() {
    return items;
  }

  async remove(id: string): Promise<Partial<ResultEntity>> {
    const index = items.findIndex(item => item.id === id);

    const data = items[index];
    items.splice(index, 1);

    return data;
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

app.delete(PATH, controller.remove(), (req, res) => {
  const data = (req as any)[ROCKET_RESULT];
  res.status(200).json(data);
});

describe("Directory controller", () => {
  it("Create directory", (done) => {
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


  it("Remove successfully", (done) => {
    request(app)
      .delete(PATH)
      .query({ id: "123" })
      .expect(200)
      .end((err, res) => {
        if (err) return done();
        
        assert.equal(typeof res.body, "object");
        assert.equal(res.body.id, "123");
        
        done();
      })
  });
  
  it("Remove failure", (done) => {
    request(app).delete(PATH).expect(400, done);
  });
});
