import supertest from 'supertest'
import express from 'express'
import { resolve } from 'path'
import assert from 'assert'

import { Filesrocket, InputFile } from '../../src/index'

const filesrocket = new Filesrocket()

class FileService {
  items: Partial<InputFile>[] = [
    { name: 'one.jpg' },
    { name: 'two.jpg' },
    { name: 'three.jpg' }
  ]

  async create (data: InputFile, options: Record<string, unknown>): Promise<any> {
    this.items.push(data)

    data.stream.resume()

    return data
  }

  async list (query: Record<string, unknown>): Promise<any> {
    return items
  }

  async remove (id: string, query: Record<string, unknown>): Promise<any> {
    return this.items.filter((item) => item.name !== id)
  }
}

filesrocket.register('local', new FileService())

const service = filesrocket.controller('local')

export const items: Partial<InputFile>[] = [
  { name: 'image-one.jpg' },
  { name: 'image-two.jpg' },
  { name: 'image-three.jpg' }
]

const path: string = '/files'

const app = express()

app.post(path, async (req, res) => {
  const files = await service?.create(req, {})
  res.status(200).json(files)
})

app.get(path, async (req, res) => {
  const files = await service?.list(req.query)
  res.status(200).json(files)
})

app.delete(path, async (req, res) => {
  const { id } = req.query

  const file = await service?.remove(id as string, req.query)

  res.status(200).json(file)
})

const request = supertest(app)

describe.skip('POST /files', () => {
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

    it('Skip the request when it is different from multipart', (done) => {
      const name = 'Filesrocket'

      request
        .post(path)
        .send({ name })
        .expect(200)
        .expect('Content-type', /json/, done)
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

describe.skip('DELETE /files', () => {
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
