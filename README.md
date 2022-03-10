![Filesrocket](https://user-images.githubusercontent.com/64434514/148323581-1afc535f-fb2b-4e81-808a-19afe5b4c7c9.png)
# Manage your files and directories with any cloud services
 
Filesrocket is an package of Node.js that allows you to manage your files and directories with any cloud service (Local, Cloudinary, Amazon S3) through the use of strategies called [services](#services).
 
> ⚠️ **Filesrocket** it is currently in **beta** phase. Note that it is not ready for production yet. Thanks for your understanding! ❤️
 
## Tutorial
We create a project.
 
```
mkdir my-filesrocket-example
cd my-filesrocket-example
```
 
We configure the work environment.
 
```
npm i typescript ts-node -g
npm init -y
tsc --init
```
 
We install the packages necessaries for start using **Filesrocket**
 
```
npm i express filesrocket filesrocket-local
npm i @types/express -D
```
 
Create a file **src/index.ts** in the root of the project.
 
1. Initialize app
 
```ts
import express from "express";
 
const app = express();
 
app.listen(3030, () => {
  console.log("App execute in port:3030");
});
```
 
2. Register the services you are going to use
 
```ts
import { Filesrocket } from "filesrocket";
import { LocalService } from "filesrocket-local";
 
const filesrocket = new Filesrocket();
 
const local = new LocalService({
  pagination: { default: 15, max: 50 },
  host: "http://localhost:3030",
  directory: "uploads",
});
 
// Registers the service to manage files locally.
filesrocket.register("local", local.file);
```
 
3. Register your endpoints.
 
```ts
const Controller = filesrocket.controller("local");
 
// Create/Upload files.
app.post("/files", Controller.create(), (req, res) => {
  const results = (req as any)[ROCKET_RESULT]
  res.status(200).json(results)
})
 
// List files.
app.get("/files", Controller.list(), (req, res) => {
  const results = (req as any)[ROCKET_RESULT]
  res.status(200).json(results)
})
 
// Remove files.
app.delete("/files", Controller.remove(), (req, res) => {
  const results = (req as any)[ROCKET_RESULT]
  res.status(200).json(results)
})
```
 
Expose static files.
 
```ts
app.use("/uploads", express.static(path.resolve("uploads")));
```
 
> Note: By default only one file can be uploaded at a time. Later we will address how to upload multiple files, validations, etc,
 
We run our development server
```
ts-node src/index.ts
```
 
To be able to interact with the files we access to the following endpoint.
 
- Files: http://localhost:3030/files
 
With this simple example we are ready to interact with the files.

## Filesrocket
 
Filesrocket is a class that is in charge of orchestrating all the available functionalities; like registering services, getting them, forming controllers, etc.

### Register services
 
Adding a service in is so easy, see the example below.
 
```ts
const filesrocket = new Filesrocket()
 
filesrocket.register("service-name", new MyService({...}))
```
 
### Recovering a service
 
To obtain a service, you do it in the following way.
 
```ts
const Service = filesrocket.service("service-name")

Service.create()

Service.list()

Service.remove()
```
 
### Recovering a controller
 
This is very useful when we want to add it as a [middleware](https://expressjs.com/en/guide/using-middleware.html)
 
```ts
const Controller = filesrocket.controller("service-name")
 
// Register enpoints.
app.post("/files", Controller.create(), (req, res) => {
  // ...
})
 
app.get("/files", Controller.list(), (req, res) => {
  // ...
})
 
app.remove("/files", Controller.remove(), (req, res) => {
  // ...
})
```
 
## Decorators
Below is a complete list of decorators that are currently available.
 
| Name | Type | Description |
| ---- | ---- | ----------- |
| `@Service()` | Class | This decorator allows us to define the **name** and **type** of entities (Files or Directories) that our services will handle. |
| `@Filename()` | Method | This decorator adds a hash to a file name. |
 
## Services <a name="services"></a>
A service is a predefined class that allows you to manage an entity either files or directories. This classes are composed by a decorator names `@Service` and interface named `ServiceMethods`.
 
Currently there are 3 services, but this is only the tip of the iceberg, later we will incorporate many more with your help.
 
| Service | Description |
| ------- | ----------- |
| [filesrocket-local](https://github.com/IvanZM123/filesrocket-local) | Manage your files and directories on your own server. |
| [filesrocket-cloudinary](https://github.com/IvanZM123/filesrocket-cloudinary) | Manage your files and directories with [Cloudinary](https://cloudinary.com/documentation/node_integration) service. |
| [filesrocket-s3](https://github.com/IvanZM123/filesrocket-s3) | Manage your file with [Amazon S3](https://aws.amazon.com/s3) service. |
 
### Creating my first service
 
The official services may not meet your needs, but don't worry, Filesrocket is thinking for you to create your own services. So let's get to it. But before, it is necessary to take into account some considerations.
 
When creating a service, we recommend that each response from the different `create`, `list` or `remove` actions always return a template as shown in Structure. This will guarantee consistency and avoid unexpected behavior in your client application.
 
```js
{
  "id": "http://domain.com/image.png",
  "name": "image.jpg",
  "ext": ".jpg",
  "url": "http://domain.com/image.png",
  "size": 12345,
  "dir": "",
  "createdAt": "2022-03-08T20:09:07.958Z",
  "updatedAt": "2022-03-08T20:09:07.958Z"
}
```
 
Obviously you can send more properties than are found, take this example as a base that will be present in each service. We do this to avoid unexpected results when we get files or directories from different services, in this way we keep consistency.
 
We define a class.
 
```ts
@Service({
  type: "Files"
})
export class MyService implements ServiceMethods {
  async create(data: Data, query: Query): Promise<any> {
    // ...
  }
 
  async list(query: Query): Promise<any> {
    // ...
  }
 
  async remove(id: string, query: Query): Promise<any> {
    // ...
  }
}
```

## File API

For this example we will be using the [filesrocket-local](https://github.com/Filesrocket/filesrocket-local) service

```ts
const filesrocket = new Filesrocket()

const local = new LocalService({
  pagination: { default: 15, max: 50 },
  host: "http://localhost:3030",
  directory: "uploads"
})

filesrocket.register("local", local.file)

const service = filesrocket.service("local")

const controller = filesrocket.controller("local")
```
 
## Upload files
 
This section will cover how to upload files to your server.
 
### Properties
 
These properties are the ones that are present when you want to upload a file
 
| Property | Description | Type |
| -------- | ----------- | ---- |
| files    | FormData. **Required** | **Body** |
| path     | Sets to the directory where the file is to be stored. For example `?path=images` **Note**: Directories are created recursively. **Optional** | **Query** |
 
> **Note**: These properties will be present in all services. But there will be other exclusive properties depending on the service you are using.

**Using the service**

```ts
service.create({
  name: "image.jpg",
  stream: createReadStream("<Path>"),
  fieldname: "files", // Optional
  encoding: "", // Optional
  mimetype: "image/jpg" // Optional
})
```

**Using controller**

```ts
app.post("/files", controller.create(), (req, res) => {
  const results = (req as any)[ROCKET_RESULT]
  res.json(results)
})
```

**Response**

```js
{
  id: "http://localhost:3030/uploads/image-kxshf742.jpg",
  name: "image-kxshf742.jpg",
  size: 12345,
  url: "http://localhost:3030/uploads/image-kxshf742.jpg",
  dir: "",
  createdAt: "2022-03-08T20:09:07.958Z",
  updatedAt: "2022-03-08T20:09:07.958Z"
}
```
 
## List files

This section will cover how to list files.
 
### Properties
 
| Property | Description | Type |
| -------- | ----------- | ---- |
| path     | Sets to the directory where the file is to be stored. For example `?path=images` **Optional** | **Query** |
| size | This property conditions the number of entities to return. **Optional** | **Query** |
| page | This property is useful when you want to paginate the results of a request. **Optional** | **Query** |
 
> **Note**: These properties will be present in all services. But there will be other exclusive properties depending on the service you are using.

**Using the service**

```ts
service.list()
```

**Using controller**

`GET /files`

```ts
app.post("/files", controller.list(), (req, res) => {
  const results = (req as any)[ROCKET_RESULT]
  res.json(results)
})
```

**Response**

```js
{
  items: [
    {
      id: "http://localhost:3030/uploads/image-kxshf742.jpg",
      name: "image-kxshf742.jpg",
      size: 12345,
      url: "http://localhost:3030/uploads/image-kxshf742.jpg",
      dir: "",
      createdAt: "2022-03-08T20:09:07.958Z",
      updatedAt: "2022-03-08T20:09:07.958Z"
    }
  ],
  size: 1,
  total: 10,
  page: 2,
  nextPageToken: 3,
  prevPageToken: 1
}
```
 
## Remove files

This section will cover how to delete files. 
 
### Properties
 
| Property | Description | Type |
| -------- | ----------- | ---- |
| id       | Specifies the identifier of the entity (file or directory). For example: `/?id=abc` **Required** | **Query** |
 
> **Note**: These properties will be present in all services. But there will be other exclusive properties depending on the service you are using.

**Using service**

```ts
service.remove("http://localhost:3030/uploads/image-kxshf742.jpg")
```

**Using controller**

`DELETE /?id=http://localhost:3030/uploads/image-kxshf742.jpg`

```ts
app.delete("/files", controller.remove(), (req, res) => {
  const results = (req as any)[ROCKET_RESULT]
  res.json(results)
})
```

**Response**

```js
{
  id: "http://localhost:3030/uploads/image-kxshf742.jpg",
  name: "image-kxshf742.jpg",
  size: 12345,
  url: "http://localhost:3030/uploads/image-kxshf742.jpg",
  dir: "",
  createdAt: "2022-03-08T20:09:07.958Z",
  updatedAt: "2022-03-08T20:09:07.958Z"
}
```

> **Note**: The file identifier will change depending on the service you are using.
> **Note**: For security reasons only one file can be uploaded at a time.

## Examples
We have also created many repositories with the most popular frameworks for you to play around with, to help as example guides.
 
| Framework | Repository |
| --------- | ---------- |
| Express | [filesrocket-express-app](https://github.com/IvanZM123/filesrocket-express-app) |
