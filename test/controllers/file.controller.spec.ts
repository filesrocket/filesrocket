import supertest from 'supertest'
import { resolve } from 'path'
import express from 'express'
import assert from 'assert'

import { FileEntity, Filesrocket } from '../../src/index'
import { FileService } from '../helpers/service'
import { handler } from '../helpers/common'

const filesrocket = new Filesrocket()

filesrocket.register('local', new FileService())

const service = filesrocket.service('local')

const controller = filesrocket.controller('local')

const items: Partial<FileEntity>[] = [
  { name: 'image-one.jpg' },
  { name: 'image-two.jpg' },
  { name: 'image-three.jpg' }
]

const path: string = '/files'

const app = express()

app.post(path, controller.create({ extnames: ['.png'] }), handler)

app.get(path, controller.list(), handler)

app.delete(path, controller.remove(), handler)

const request = supertest(app)

before(async () => {
  for (const item of items) {
    await service.create(item)
  }
})

describe('POST /files', () => {
  describe('when creating a file is successful', () => {
    it('Create file', (done) => {
      request
        .post(path)
        .set('Content-type', 'multipart/form-data')
        .set('Connection', 'keep-alive')
        .attach('file', resolve('test/fixtures/filesrocket.png'))
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) return done(err)
          assert.ok(res.body.name === 'filesrocket.png')
          done()
        })
    })
  })

  describe('when creating a file is failure', () => {
    it('When no field is sent', (done) => {
      request
        .post(path)
        .set('Content-type', 'multipart/form-data')
        .expect(500)
        .expect(/Multipart: Boundary not found/, done)
    })

    it('When sending a field other than file', (done) => {
      request
        .post(path)
        .attach('image', resolve('test/fixtures/filesrocket.png'))
        .expect(400)
        .expect(/BadRequestError: The file field does not exist./, done)
    })

    it('When the file extension is not allowed.', (done) => {
      request
        .post(path)
        .attach('file', resolve('test/fixtures/filesrocket.md'))
        .expect(400)
        .expect(/BadRequestError: The .md extension is not allowed./, done)
    })
  })
})

describe('GET /files', () => {
  it('Get many files', (done) => {
    request
      .get(path)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err)
        assert.ok(res.body.length > 1)
        done()
      })
  })
})

describe('DELETE /files', () => {
  describe('when deleting a file is successful', () => {
    it('Remove file', (done) => {
      const url = `${path}?id=image-one.jpg`
      request
        .delete(url)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) return done(err)
          assert.ok(typeof res.body === 'object')
          done()
        })
    })
  })

  describe('when deleting a file is failure', () => {
    it('Remove file when id is not sent', (done) => {
      request
        .delete(path)
        .expect(400)
        .expect(/BadRequestError: The id property is required./, done)
    })
  })
})
