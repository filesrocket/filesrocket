![Filesrocket](https://user-images.githubusercontent.com/64434514/148323581-1afc535f-fb2b-4e81-808a-19afe5b4c7c9.png)
# Manage your files and directories with any cloud services

Filesrocket is an package of Node.js that allows you to manage your files and directories with any cloud service (Local, Cloudinary, Amazon S3) through the use of strategies called [services](#services). We have also created a package so you can elegantly manipulate it from the client-side [filesrocket-client](https://github.com/IvanZM123/filesrocket-client), this is compatible with any Framework **Angular**, **React**, **Vue** and others.

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

Create a file **src/index.ts** in the root of the project and add the following content.

Register the services you are going to use

```ts
import { Filesrocket } from "@filesrocket/filesrocket";
import { LocalService } from "@filesrocket/local";

const filesrocket = new Filesrocket();

const local = new LocalService({
  pagination: { default: 15, max: 50 },
  host: "http://localhost:3030",
  directory: "uploads",
});

// Registers the service to manage files locally.
filesrocket.register("local-file", local.file);
```

Register your endpoints.

```ts
// Create/Upload files.
app.post("/files", FileController.create(), (req, res) => {
  const results = (req as any)[ROCKET_RESULT]
  res.status(200).json(results)
})

// List files.
app.get("/files", FileController.list(), (req, res) => {
  const results = (req as any)[ROCKET_RESULT]
  res.status(200).json(results)
})

// Remove files.
app.delete("/files", FileController.remove(), (req, res) => {
  const results = (req as any)[ROCKET_RESULT]
  res.status(200).json(results)
})
```

> Note: By default only one file can be uploaded at a time.

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
| Vue | [filesrocket-vue-app](https://github.com/IvanZM123/filesrocket-vue-app) |
| Angular | [filesrocket-angular-app](https://github.com/IvanZM123/filesrocket-angular-app) |
| React | [filesrocket-react-app](https://github.com/IvanZM123/filesrocket-react-app)|
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

- When creating a service, we recommend that each response from the different `create`, `list` or `remove` actions always return a template as shown in [Response structure](#schema-response). This will guarantee consistency and avoid unexpected behavior in your client application.

We define a class.
```ts
@Service({
  type: "Files"
})
export class DropboxFileService implements ServiceMethods {
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
