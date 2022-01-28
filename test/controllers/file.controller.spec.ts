import request from 'supertest'
import { resolve } from 'path'
import assert from 'assert'
import { mkdir } from 'fs'

import { app, path, items } from '../api/files.api'
const supertest = request(app)

before(() => {
  mkdir(resolve('uploads'), (err) => {
    if (err) return console.error(err)
    console.log('Create uploads directory')
  })
})

describe('POST /files', () => {
  describe('when creating a file is successful', () => {
    it('Create file', (done) => {
      supertest
        .post(path)
        .set('Content-type', 'multipart/form-data')
        .set('Connection', 'keep-alive')
        .attach('file', resolve('test/fixtures/filesrocket.png'))
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) return done(err)
          assert.equal(res.body.name, 'filesrocket.png')
          return done()
        })
    })
  })

  describe('when creating a file is failure', () => {
    it('When no field is sent', (done) => {
      request(app)
        .post(path)
        .set('Content-type', 'multipart/form-data')
        .expect(500)
        .expect(/Multipart: Boundary not found/, done)
    })

    it('When sending a field other than file', (done) => {
      request(app)
        .post(path)
        .attach('image', resolve('test/fixtures/filesrocket.png'))
        .expect(400)
        .expect(/BadRequestError: The file field does not exist./, done)
    })

    it('When the file extension is not allowed.', (done) => {
      request(app)
        .post(path)
        .attach('file', resolve('test/fixtures/readme.txt'))
        .expect(400)
        .expect(/BadRequestError: The .txt extension is not allowed./, done)
    })
  })
})

describe('GET /files', () => {
  it('Get many files', (done) => {
    supertest
      .get(path)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err)
        assert.equal(res.body.length, items.length)
        done()
      })
  })
})

describe('DELETE /files', () => {
  describe('when deleting a file is successful', () => {
    it('Remove file', (done) => {
      supertest
        .delete(path)
        .query({ id: '1' })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) return done(err)
          assert.deepEqual(res.body, {
            id: '1',
            name: 'filesrocket.png',
            size: 12345
          })
          done()
        })
    })
  })

  describe('when deleting a file is failure', () => {
    it('Remove file when id is not sent', (done) => {
      supertest
        .delete(path)
        .expect(400)
        .expect(/BadRequestError: The id property is required./, done)
    })
  })
})
