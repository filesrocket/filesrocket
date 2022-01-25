import request from "supertest";
import { resolve } from "path";
import assert from "assert";

import { app, path, items } from "../api/files.api";
const supertest = request(app);

describe("POST /files", () => {
  describe("when creating a file is successful", () => {
    it("Create file", (done) => {
      supertest
        .post(path)
        .set('Content-type', 'multipart/form-data')
        .set('Connection', 'keep-alive')
        .attach("file", resolve("test/fixtures/filesrocket.png"))
        .expect(200)
        .expect("Content-Type", /json/)
        .end((err, res) => {
          if (err) return done(err);
          assert.equal(res.body.name, "filesrocket.png");
          return done();
        });
    });
  });

  describe("when creating a file is failure", () => {
    it("When no field is sent", (done) => {
      // ...
    });

    it("When sending a field other than file", (done) => {
      // ...
    });

    it("When the faithful field is sent empty", (done) => {
      // ...
    });

    it("When the file extension is not allowed.", (done) => {
      // ...
    });
  });
});

describe("GET /files", () => {
  it("Get many files", (done) => {
    supertest
      .get(path)
      .expect(200)
      .expect("Content-Type", /json/)
      .end((err, res) => {
        if (err) return done(err);
        assert.equal(res.body.length, items.length);
        done();
      });
  });
});

describe("DELETE /files", () => {
  describe("when deleting a file is successful", () => {
    it("Remove file", (done) => {
      supertest
        .delete(path)
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
  });

  describe("when deleting a file is failure", () => {
    it("Remove file when email is not sent", (done) => {
      supertest.delete(path).expect(400, done);
    });
  });
});
