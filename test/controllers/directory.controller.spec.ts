import request from "supertest";
import assert from "assert";

import { app, path, items } from "../api/directories.api";

describe("POST /directories", () => {
  describe("when creating a directory is successful", () => {
    it("Create new directory", (done) => {
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
  });

  describe("when creating a directory fails", () => {
    it("When the name property is not sent", (done) => {
      request(app)
        .post(path)
        .set("Accept", "application/json")
        .send({})
        .expect(400)
        .expect(/The body of the request is empty./, done);
    });
  });
});

describe("GET /directories", () => {
  describe("when getting directories is successful", () => {
    it("Get all directories", (done) => {
      request(app)
        .get(path)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          assert.equal(res.body.length, items.length);
          done();
        });
    });
  });
});

describe("DELETE /directories", () => {
  describe("when the directory removal is successful", () => {
    it("Remove directory successfully", (done) => {
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
  });

  describe("when directory removal fails", () => {
    it("When the directory id is not sent", (done) => {
      request(app)
        .delete(path)
        .query({})
        .expect(400)
        .expect(/The id property is required./, done);
    });
  });
});
