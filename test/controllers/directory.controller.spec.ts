import request from "supertest";
import assert from "assert";

import { app, path, items } from "../api/directories.api";

describe("Directory controller", () => {
  it("Create directory", (done) => {
    request(app)
      .post(path)
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
      .post(path)
      .set("Accept", "application/json")
      .send({})
      .expect(400, done);
  });

  
  it("Get many directories", (done) => {
    request(app)
      .get(path)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        assert.equal(res.body.length, items.length);
        done();
      });
  });


  it("Remove successfully", (done) => {
    request(app)
      .delete(path)
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
    request(app).delete(path).expect(400, done);
  });
});
