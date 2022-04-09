![Filesrocket](https://user-images.githubusercontent.com/64434514/148323581-1afc535f-fb2b-4e81-808a-19afe5b4c7c9.png)

# Manage your Files with any Cloud Storage Services

[![npm version](https://badge.fury.io/js/filesrocket.svg)](https://badge.fury.io/js/filesrocket) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
 
**Filesrocket** is an package of **Node.js** that allows you to manage your files with any cloud storage service ([**Local**](https://github.com/Filesrocket/filesrocket-local), [**Cloudinary**](https://github.com/Filesrocket/filesrocket-cloudinary), [**Amazon S3**](https://github.com/Filesrocket/filesrocket-amazons3)) through the use of strategies called [**Services**](#services)
 
> ⚠️ **Filesrocket** it is currently in **beta** phase. Note that it is not ready for production yet. Thanks for your understanding! ❤️

## 🌈 Features

- 🔭 Manage your files with multiple cloud storage services (Cloudinary, Amazon S3, Local)
- ✅ Validations (validate extensions, file sizes and more)
- ⚡ Easy to configure and integrate
- 🛡️ Written in Typescript
- 👨🏻‍💻 Community driven
 
## 📖 Tutorial

Create a project
 
```
mkdir my-filesrocket-example

cd my-filesrocket-example
```
 
Configure the work environment
 
```
npm install typescript ts-node -g

npm init -y

tsc --init
```
 
Install the packages necessaries for start using **Filesrocket**
 
```
npm install express filesrocket filesrocket-local

npm install @types/express -D
```
 
Create a file `src/index.ts` in the root of the project
 
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

import { LocalFileService } from "filesrocket-local";
 
// Initialize
const filesrocket = new Filesrocket();

// Config your service
const service = new LocalFileService({
  pagination: { default: 15, max: 50 },
  host: "http://localhost:3030",
  directory: "uploads",
});
 
// We register the service
filesrocket.register("local", service);
```
 
3. Register your endpoints.

```ts
const controller = filesrocket.controller("local");
 
// Create/Upload files.
app.post("/files", async (req, res) => {
  const files = await controller.create(req, {});
  res.status(200).json(files);
})
 
// List files.
app.get("/files", async (req, res) => {
  const query = req.query;

  const files = await controller.list(query);
  
  res.status(200).json(files);
})
 
// Remove files.
app.delete("/files", async (req, res) => {
  const query = req.query;
  const { id } = query;

  const files = await controller.remove(id, query)
  
  res.status(200).json(files)
})
```
 
Expose static files.
 
```ts
app.use("/uploads", express.static(path.resolve("uploads")));
```
 
> **Note**: By default there is no type of filter when uploading a file. Later we will see how to add validations, limit file sizes, fields and more...
 
We run the server

```
ts-node src/index.ts
```

With this simple example you can interact with the files, click on the following link: http://localhost:3030/files

## 🚀 Filesrocket <a name="filesrocket"></a>
 
Filesrocket is a class that is in charge of orchestrating all the available functionalities; like registering services, getting them, forming controllers, etc.

### Register services
 
In Filesrocket you can register multiple services to manage your files, the following example shows how to do it.
 
```ts
const filesrocket = new Filesrocket()
 
filesrocket.register("service-one", new MyOneService({...}))

filesrocket.register("service-two", new MyTwoService({...}))
```
 
### Recovering a service
 
To obtain a service, you do it in the following way. For more information about [Services](#services)
 
```ts
const service = filesrocket.service("service-name")
```
 
### Recovering a controller

To obtain a controller, you do it in the following way. For more information about [Controller](#controller)
 
```ts
const controller = filesrocket.controller("service-name")
```

### Recovering all services

This property lists all the services that are registered

```ts
filesrocket.services 
// [{ name, controller, service }]
```
 
## 🛎️ Services <a name="services"></a>

Services are the heart of Filesrocket. In this chapter we will dive more into services.

In general, a service is an object or instance of a class that implements certain methods. Services provide a uniform, interface for how to interact with files.
 
Currently there are **3 services**, but this is only the tip of the iceberg, later we will incorporate many more with your help.
 
| Service | Description |
| ------- | ----------- |
| [filesrocket-local](https://github.com/Filesrocket/filesrocket-local) | Manage your files on your own server. |
| [filesrocket-cloudinary](https://github.com/Filesrocket/filesrocket-cloudinary) | Manage your files with [Cloudinary](https://cloudinary.com/documentation/node_integration) |
| [filesrocket-amazons3](https://github.com/Filesrocket/filesrocket-amazons3) | Manage your files with [Amazon S3](https://aws.amazon.com/s3) |
 
### Creating my first service
 
The official services may not meet your needs, but don't worry, **Filesrocket** is thinking for you to create your own services. So let's get to it. But before, it is necessary to take into account some considerations.
 
When you `upload`, `list` or `delete` a file, you will always get an entity with the following properties regardless of the service you are using
 
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
 
Of course they open additional properties depending on the service, but these will be present at all times to avoid consistency problems or unexpected results.
 
Define a class
 
```ts
class MyService implements ServiceMethods {
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
Register your service

```ts
filesrocket.register("my-service", new MyService({...}))
```

Use via service

```ts
const service = filesrocket.service("my-service")
```

> **Note**: When you interact directly with the service, you have to parse the entire request, generate unique filenames.

Use via controller

```ts
const controller = filesrocket.controller("my-service")
```

## 🚩 Controller <a name="controller"></a>

A controller in [**Filesrocket**](#filesrocket) is a class that is in charge of parsing the requests before invoking the [**Service**](#services). It basically works as an intermediary point for requests. Its responsibilities are the following:

- Interpret `multipart/form-data` requests.
- Validate extensions, sizes, file numbers and other properties.
- Generate unique filenames.

### Methods

Following is the list of methods on the class.

#### Create

This method is responsible for uploading the files to a certain service

```ts
const files = await controller.create(req, {});
```

>  Every time you upload a file, Filesrocket will automatically generate unique filenames to avoid conflicts. For example: `one.jpg -> one-xakbsfak.jpg` To generate unique filenames, use [**Uniqid**](https://github.com/adamhalasz/uniqid#readme)

**Results**

This method will return an array of the files that were just uploaded

```json
[
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
]
```

#### List

This method is responsible for listing files of a certain service

```ts
const files = await controller.list({});
```

> These properties will be present in all the services you use. There will be other properties that will be present depending on the service you are using.

**Results**

All official services will return paginated data.

```json
{
  "items": [],
  "total": 0,
  "size": 0,
  "page": 1,
  "nextPageToken": 2,
  "prevPageToken": undefined
}
```

#### Remove

This method is responsible for deleting files from a certain service. In order to delete a file, you have to send the **id**

```ts
const file = await controller.remove("abc");
```

**Result**

In all official services the following structure will be returned. There will be additional properties depending on the service you are using

```json
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

## ✅ Validations

You can also validate the file by specifying the rules for the extension, number and size of the files, and Filesrocket will perform the validations.

> That validations will only be available in the controller. All properties except the `extnames` belongs to [Busboy](https://github.com/mscdex/busboy#api), so we recommend you visit the documentation

```ts
const files = await controller.create(req, {
  limits: { files: 5 },
  extnames: [".jpg", ".png", ".jpeg"]
})
```

> When you upload files whose extension is not valid, **Filesrocket** will filter the files that do meet the extension.

## 👀 Examples

We've created some examples so you can clone it to your computer and get playing.
 
| Framework | Repository |
| --------- | ---------- |
| Express | [filesrocket-express-app](https://github.com/Filesrocket/filesrocket-express-app) |
