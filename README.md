![Filesrocket](https://user-images.githubusercontent.com/64434514/148323581-1afc535f-fb2b-4e81-808a-19afe5b4c7c9.png)
# Manage your files with any cloud services
 
**Filesrocket** is an package of **Node.js** that allows you to manage your files with any cloud service (**Local**, **Cloudinary**, **Amazon S3**) through the use of strategies called [services](#services)
 
> ⚠️ **Filesrocket** it is currently in **beta** phase. Note that it is not ready for production yet. Thanks for your understanding! ❤️

## Features

- 🚀 Single API for all file service (Cloudinary, Amazon S3, Local)
- 🎉 Compatible with all frameworks (Express.js, Feathers.js)
- ✅ Validations (validate extensions, file sizes and more)
- 🛡️ Written in Typescript
- 👨🏻‍💻 Community driven
 
## Tutorial

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
 
Create a file **src/index.ts** in the root of the project
 
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
 
> Note: By default there is no type of filter when uploading a file. Later we will see how to add validations, limit file sizes, fields and more...
 
We run our development server
```
ts-node src/index.ts
```
 
To be able to interact with the files we access to the following endpoint.
 
- **Files**: http://localhost:3030/files
 
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
const service = filesrocket.service("service-name")

service.create()

service.list()

service.remove()
```

> **Note**: When you interact directly with the service, you have to parse the entire request, generate unique filenames.
 
### Recovering a controller

The controllers are a step prior to communication with the service, this is so, since they are responsible for passing the requests.

**Features**

- When you upload a file, it takes care of passing requests, validating file extensions, limiting the number of fields, files, etc.
- Every time you upload a file, a unique file name is generated, this in order not to cause conflicts. For example: `one.jpg -> one-xakbsfak.jpg` **Note**: To generate unique filenames, use [uniqid](https://github.com/adamhalasz/uniqid)
 
```ts
const controller = filesrocket.controller("service-name")
 
controller.create()

controller.list()

controller.remove()
```
 
## Services <a name="services"></a>

A service is a predefined class that allows you to manage an entity either files.
 
Currently there are **3 services**, but this is only the tip of the iceberg, later we will incorporate many more with your help.
 
| Service | Description |
| ------- | ----------- |
| [filesrocket-local](https://github.com/Filesrocket/filesrocket-local) | Manage your files and directories on your own server. |
| [filesrocket-cloudinary](https://github.com/Filesrocket/filesrocket-cloudinary) | Manage your files and directories with [Cloudinary](https://cloudinary.com/documentation/node_integration) service. |
| [filesrocket-amazons3](https://github.com/Filesrocket/filesrocket-amazons3) | Manage your file with [Amazon S3](https://aws.amazon.com/s3) service. |
 
### Creating my first service
 
The official services may not meet your needs, but don't worry, **Filesrocket** is thinking for you to create your own services. So let's get to it. But before, it is necessary to take into account some considerations.
 
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
filesrocket.register("my-service", new MyService())
```

Use via service

```ts
const service = filesrocket.service("my-service")
```

Use via controller

```ts
const controller = filesrocket.controller("my-service")
```

## Examples

We have also created many repositories with the most popular frameworks for you to play around with, to help as example guides.
 
| Framework | Repository |
| --------- | ---------- |
| Express | [filesrocket-express-app](https://github.com/Filesrocket/filesrocket-express-app) |
