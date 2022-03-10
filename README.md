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

Expose static files and execute server.

```ts
app.use("/uploads", express.static(path.resolve("uploads")));

app.listen(3030, () => {
  console.log("App execute in port:3030");
});
```

> Note: By default only one file can be uploaded at a time. Later we will address how to upload multiple files, validations, etc,

We run our development server
```
ts-node src/index.ts
```

To be able to interact with the files we access to the following endpoint.

- Files: http://localhost:3030/files

With this simple example we are ready to interact with the files.

## Examples
We have also created many repositories with the most popular frameworks for you to play around with, to help as example guides.

| Framework | Repository |
| --------- | ---------- |
| Express | [filesrocket-express-app](https://github.com/IvanZM123/filesrocket-express-app) |

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
  "id": "",
  "name": "",
  "ext": "",
  "url": "",
  "size": 0,
  "dir": "",
  "createdAt": "",
  "updatedAt": ""
}
```

Obviously you can send more properties than are found, take this example as a base that will be present in each service.

We define a class.
```ts
@Service({
  type: "Files"
})
export class MyService implements ServiceMethods {
  async create(): Promise<any> {
    // ...
  }
  
  async list(): Promise<any> {
    // ...
  }
  
  async remove(): Promise<any> {
    // ...
  }
}
```

### Upload files

Every time you want to upload a file, you will receive this data in the `create` method. Receive the followings parameters

- **Data**: This is obtained by [busboy](https://github.com/mscdex/busboy#readme)
- **query**: this is obtained by querystring.

For example:

```ts
// Browser -> https://domain.com/files/?path=images
// Query -> { path: "images" }
```

```ts
interface Data {
  name: string;
  stream: NodeJS.ReadableStream;
  fieldname: string;
  encoding: string;
  mimetype: string;
}

interface Query {
  [key: string]: any;
}

@Service({
  type: "Files"
})
export class MyService implements ServiceMethods {
  async create(data: Data, query: Query): Promise<any> {
    // ...
  }
}
```

### List files

When you want to list your files, the method receives a parameter

- **query**: This is obtained through the querystring.

```ts
interface Query {
  [key: string]: any;
}

@Service({
  type: "Files"
})
export class MyService implements ServiceMethods {
  async list(query: Query): Promise<any> {
    // ...
  }
}
```

### Remove files

When you want to remove a file you will get the following parameters.

- **id**: This is obtained through the querystring. For example: `DELETE domain.com/files/?id=image.jpg`
- **query**: This is obtained through the querystring.

```ts
interface Query {
  [key: string]: any;
}

@Service({
  type: "Files"
})
export class MyService implements ServiceMethods {
  async remove(id: string, query: Query): Promise<any> {
    // ...
  }
}
```

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

// Listening events.
Service.on("created", (data) => {
  console.log(data)
})

Service.on("removed", (data) => {
  console.log(data)
})
```

> **Note**: Events will only be executed by controllers.

### Recovering a controller

This is very useful when we want to add it as a middleware.

> Note: To know more about **Middlewares** visit [here](https://expressjs.com/en/guide/using-middleware.html)

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
