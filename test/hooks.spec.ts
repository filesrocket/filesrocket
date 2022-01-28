import request from 'supertest'
import express from 'express'
import assert from 'assert'

import { ControllerMethods, Middleware, ResultEntity, ROCKET_RESULT } from '../src'
import { serviceHandler, Hook } from '../src/hooks'
import { Unauthorized } from '../src/errors'

const app = express()

const items: Partial<ResultEntity>[] = [
  {
    id: '1',
    name: 'filesrocket.png',
    size: 1234567890,
    dir: 'images'
  },
  {
    id: '2',
    name: 'filesrocket-client.png',
    size: 1234567890,
    dir: 'images'
  },
  {
    id: '3',
    name: 'filesrocket-local.png',
    size: 1234567890,
    dir: 'images'
  }
]

class Controller implements ControllerMethods {
  create (): Middleware {
    return (req, _, next) => {
      req = Object.defineProperty(req, ROCKET_RESULT, { value: items[0] })
      return next()
    }
  }

  list (): Middleware {
    return (req, _, next) => {
      req = Object.defineProperty(req, ROCKET_RESULT, { value: items.slice() })
      next()
    }
  }

  remove (): Middleware {
    return (req, _, next) => {
      const { id } = req.query

      const index = items.findIndex(item => item.id === id)
      const entity = items[index]
      items.splice(index, 1)

      req = Object.defineProperty(req, ROCKET_RESULT, { value: entity })
      next()
    }
  }
}

const isLoggedIn: Middleware = (req, _, next) => {
  const { authorization = '' } = req.headers

  if (!authorization) {
    return next(new Unauthorized('You need an access token'))
  }

  return next()
}

const assingUsername: Middleware = (req, _, next) => {
  (req as any)[ROCKET_RESULT].username = 'IvanZM123'
  next()
}

describe('Hooks for entity creation', () => {
  app.post('/files', serviceHandler({
    controller: new Controller(),
    method: 'create',
    hooks: {
      before: [isLoggedIn],
      after: [assingUsername]
    }
  }))

  it('Before: Unauthorized', (done) => {
    request(app).post('/files').expect(401, done)
  })

  it('After: Assing username to data', (done) => {
    request(app)
      .post('/files')
      .set('authorization', 'Bearer aklxbwqiy28')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        assert.deepEqual(res.body, { ...items[0], username: 'IvanZM123' })
        done()
      })
  })
})

describe('Hooks to list entities', () => {
  const pushFile: Hook = (req, _, next) => {
    (req as any)[ROCKET_RESULT].push({
      name: 'filesrocket-cloudinary.png',
      size: 1234567890,
      dir: 'images'
    })

    next()
  }

  app.get('/files', serviceHandler({
    controller: new Controller(),
    method: 'list',
    hooks: {
      before: [isLoggedIn],
      after: [pushFile]
    }
  }))

  it('Before: Unautorized', (done) => {
    request(app)
      .get('/files')
      .expect(401, done)
  })

  it('After: Enter an entity in items', (done) => {
    request(app)
      .get('/files')
      .set('authorization', 'Bearer lnoqw84ns')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        assert.ok(res.body.length > items.length)
        done()
      })
  })
})

describe('Remove hook', () => {
  app.delete('/files', serviceHandler({
    controller: new Controller(),
    method: 'remove',
    hooks: {
      before: [isLoggedIn],
      after: [assingUsername]
    }
  }))

  it('Before: Remove entity without token', (done) => {
    request(app).delete('/files').expect(401, done)
  })

  it('After: Remove file with token', (done) => {
    request(app)
      .delete('/files')
      .set('authorization', 'Bearer cow84cjbjas')
      .query({ id: '1' })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)

        assert.deepEqual(res.body, {
          id: '1',
          name: 'filesrocket.png',
          size: 1234567890,
          dir: 'images',
          username: 'IvanZM123'
        })

        done()
      })
  })
})
