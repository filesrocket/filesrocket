import { NotFound } from 'http-errors'
import supertest from 'supertest'
import { resolve } from 'path'
import express from 'express'
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
    return this.items
  }

  async remove (id: string, query: Record<string, unknown>): Promise<any> {
    const index = this.items.findIndex((item) => item.name === id)

    if (index < 0) throw new NotFound('The file not exist')

    const entity = this.items.at(index)

    this.items.splice(index, 1)

    return entity
  }
}

filesrocket.register('local', new FileService())

const service = filesrocket.controller('local')

const path: string = '/files'

const app = express()

app.post(path, async (req, res, next) => {
  try {
    const files = await service?.create(req, {
      extnames: ['.png']
    })

    res.status(200).json(files)
  } catch (error) {
    next(error)
  }
})

app.get(path, async (req, res, next) => {
  try {
    const files = await service?.list(req.query)
    res.status(200).json(files)
  } catch (error) {
    next(error)
  }
})

app.delete(path, async (req, res, next) => {
  try {
    const { id } = req.query

    const file = await service?.remove(id as string, req.query)

    res.status(200).json(file)
  } catch (error) {
    next(error)
  }
})

const request = supertest(app)

describe('POST /files', () => {
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
        assert.ok(res.body.length > 0)
        assert.ok(res.body[0].name === 'filesrocket.png')
        done()
      })
  })

  it('Upload a file when the extension is not allowed', (done) => {
    request
      .post(path)
      .set('Content-type', 'multipart/form-data')
      .set('Connection', 'keep-alive')
      .attach('file', resolve('test/fixtures/filesrocket.md'))
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err)
        assert.ok(res.body.length === 0)
        done()
      })
  })

  it('Send different request to multipart', (done) => {
    request
      .post(path)
      .set('Content-Type', 'application/json')
      .send({})
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err)

        assert.ok(res.body.length === 0)

        done()
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
      const url = `${path}?id=one.jpg`
      request
        .delete(url)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) return done(err)

          assert.ok(typeof res.body === 'object')
          assert.ok(res.body.name === 'one.jpg')

          done()
        })
    })
  })

  describe('when deleting a file is failure', () => {
    it('Remove file when not exist', (done) => {
      request
        .delete(path)
        .expect(404)
        .expect(/NotFoundError: The file not exist/, done)
    })
  })
})
