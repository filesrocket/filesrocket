import FormData from 'form-data'
import { resolve } from 'path'
import assert from 'assert'
import fs from 'fs'

import { submit, middleware } from '../utils'
import filesrocket from '../config'

const service = filesrocket.controller('local')

describe('POST /files', () => {
  describe('Success handling', () => {
    it('Create file', (done) => {
      const formdata = new FormData()

      const image = fs.createReadStream(
        resolve('test/fixtures/filesrocket.png')
      )

      formdata.append('files', image)

      submit(middleware(), formdata, (err, files) => {
        if (err) return done(err)

        assert.ok(files.length > 0)

        done()
      })
    })

    it('Upload a file when the extension is not allowed', (done) => {
      const formdata = new FormData()

      const file = fs.createReadStream(
        resolve('test/fixtures/filesrocket.md')
      )

      formdata.append('files', file)

      const handler = middleware({ extnames: ['.png'] })

      submit(handler, formdata, (err, files) => {
        if (err) return done(err)

        assert.ok(files.length === 0)

        done()
      })
    })
  })

  describe('Error handling', () => {
    it('When you exceed the number of files', (done) => {
      const formdata = new FormData()

      const imageOne = fs.createReadStream(
        resolve('test/fixtures/filesrocket-banner.png')
      )

      const imageTwo = fs.createReadStream(
        resolve('test/fixtures/filesrocket.png')
      )

      formdata.append('one', imageOne)
      formdata.append('one', imageTwo)

      const func = middleware({
        limits: { files: 1 }
      })

      submit(func, formdata, (err) => {
        const { statusCode, message } = err

        assert.ok(statusCode === 509)
        assert.ok(message === 'FILES_LIMIT_EXCEEDED')

        done()
      })
    })

    it('When you exceed the number of fields', (done) => {
      const formdata = new FormData()

      formdata.append('one', 'one')
      formdata.append('two', 'two')
      formdata.append('three', 'three')

      const handler = middleware({
        limits: { fields: 1 }
      })

      submit(handler, formdata, (err) => {
        const { statusCode, message } = err

        assert.ok(statusCode === 509)
        assert.ok(message === 'FIELDS_LIMIT_EXCEEDED')

        done()
      })
    })

    it('When you exceed the number of parts', (done) => {
      const formdata = new FormData()

      formdata.append('one', 'one')
      formdata.append('two', 'two')
      formdata.append('three', 'three')

      const handler = middleware({
        limits: { parts: 2 }
      })

      submit(handler, formdata, (err) => {
        const { statusCode, message } = err

        assert.ok(statusCode === 509)
        assert.ok(message === 'PARTS_LIMIT_EXCEEDED')

        done()
      })
    })

    it('when the size of the field value is exceeded', (done) => {
      const formdata = new FormData()

      formdata.append('banner', 'filesrocket.jpg')

      const handler = middleware({
        limits: { fieldSize: 4 }
      })

      submit(handler, formdata, (err) => {
        const { statusCode, message } = err

        assert.ok(statusCode === 509)
        assert.ok(message === 'VALUE_LIMIT_EXCEEDED')

        done()
      })
    })
  })
})

describe('GET /files', () => {
  it('Get many files', (done) => {
    service?.list()
      .then((value) => {
        const files = Array.isArray(value) ? value : [value]

        assert.ok(files.length > 0)

        done()
      })
      .catch((err) => done(err))
  })
})

describe('DELETE /files', () => {
  describe('when deleting a file is successful', () => {
    it('Remove file', (done) => {
      service?.remove('one.jpg')
        .then((file) => {
          assert.ok(typeof file === 'object')
          assert.ok(file.name === 'one.jpg')

          done()
        })
        .catch((err) => done(err))
    })
  })

  describe('when deleting a file is failure', () => {
    it('Remove file when not exist', (done) => {
      service?.remove('random')
        .catch((error) => {
          const { statusCode, message } = error

          assert.ok(statusCode === 404)
          assert.ok(message === 'The file not exist')

          done()
        })
    })
  })
})
