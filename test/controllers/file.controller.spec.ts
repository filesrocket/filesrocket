import supertest from 'supertest'
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

app.post(path, controller.create(), handler)

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
    it('Create file', () => {})
  })

  describe('when creating a file is failure', () => {
    it('When no field is sent', () => {})

    it('When sending a field other than file', () => {})

    it('When the file extension is not allowed.', () => {})
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
        assert.equal(res.body.length, items.length)
        done()
      })
  })
})

describe('DELETE /files', () => {
  describe('when deleting a file is successful', () => {
    it('Remove file', () => {})
  })

  describe('when deleting a file is failure', () => {
    it('Remove file when id is not sent', () => {})
  })
})
