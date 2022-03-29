// import supertest from 'supertest'
// import express from 'express'
// import assert from 'assert'

// import { DirectoryEntity, Filesrocket } from '../../src/index'
// import { DirectoryService } from '../helpers/service'
// import { handler } from '../helpers/common'

// const items: Partial<DirectoryEntity>[] = [
//   { name: 'images' },
//   { name: 'videos' },
//   { name: 'audios' },
//   { name: 'documents' }
// ]

// const path = '/directories'

// const filesrocket = new Filesrocket()

// filesrocket.register('local', new DirectoryService())

// const service = filesrocket.service('local')

// const controller = filesrocket.controller('local')

// // Initialize app.
// const app = express()

// app.use(express.json())
// app.use(express.urlencoded({ extended: false }))

// // Defining routes.
// app.post(path, controller.create(), handler)

// app.get(path, controller.list(), handler)

// app.delete(path, controller.remove(), handler)

// const request = supertest(app)

// before(async () => {
//   for (const item of items) {
//     await service.create(item)
//   }
// })

// describe('GET /directories', () => {
//   describe('when creating a directory is successful', () => {
//     it('Get all directories', (done) => {
//       request
//         .get(path)
//         .expect(200)
//         .expect('Content-Type', /json/)
//         .end((err, res) => {
//           if (err) return done(err)
//           assert.equal(res.body.length, items.length)
//           done()
//         })
//     })
//   })
// })

// describe('POST /directories', () => {
//   describe('when creating a directory is successful', () => {
//     it('create new directory', (done) => {
//       request
//         .post(path)
//         .set('Accept', 'application/json')
//         .send({ name: 'icons' })
//         .expect(200)
//         .expect('Content-Type', /json/)
//         .end((err, res) => {
//           if (err) return done(err)

//           assert.equal(typeof res.body, 'object')
//           assert.deepEqual(res.body, { name: 'icons' })

//           done()
//         })
//     })
//   })

//   describe('when creating a directory fails', () => {
//     it('When the name property is not sent', (done) => {
//       request
//         .post(path)
//         .set('Accept', 'application/json')
//         .send({})
//         .expect(400)
//         .expect(/The body of the request is empty./, done)
//     })
//   })
// })

// describe('DELETE /directories', () => {
//   describe('when the directory removal is successful', () => {
//     it('Remove directory successfully', (done) => {
//       request
//         .delete(path)
//         .query({ id: 'videos' })
//         .expect(200)
//         .expect('Content-Type', /json/)
//         .end((err, res) => {
//           if (err) return done()

//           assert.equal(typeof res.body, 'object')
//           assert.deepEqual(res.body, { name: 'videos' })

//           done()
//         })
//     })
//   })

//   describe('when directory removal fails', () => {
//     it('When the directory id is not sent', (done) => {
//       request
//         .delete(path)
//         .query({})
//         .expect(400)
//         .expect(/The id property is required./, done)
//     })

//     it('When you deleted a directory that does not exist', (done) => {
//       const url = `${path}?id=random`

//       request
//         .delete(url)
//         .expect(404)
//         .expect(/NotFoundError: Entity does not exist./, done)
//     })
//   })
// })
