![Filesrocket](https://user-images.githubusercontent.com/64434514/148323581-1afc535f-fb2b-4e81-808a-19afe5b4c7c9.png)
# Manage your files and directories with any cloud services.

**Filesrocket** is an package of **Node.js** that allows you to manage your files and directories with any cloud service (Local, Cloudinary, AWS S3) through the use of strategies called [services](#services). We have also created a package so you can elegantly manipulate it from the client-side [filesrocket-client](https://github.com/IvanZM123/filesrocket-client), this is compatible with any Framework **Angular**, **React**, **Vue** and others.

> ⚠️ Filesrocket it is currently in **beta** phase. Note that it is not ready for production yet. Thanks for your understanding! ❤️

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
```ts
import { resolve } from "path";
import express from "express";

import { RocketRouter } from "filesrocket";
import { LocalFileService, LocalDirectoryService } from "filesrocket-local";

// Initialize app.
const app = express();

const config = {
  directory: "uploads",
  pagination: { default: 15, max: 50 },
  host: "http://localhost:3030"
}

// Setting services.
app.use(RocketRouter.forRoot({
  path: "storage",
  services: [
    { service: new LocalFileService(config) },
    { service: new LocalDirectoryService(config) }
  ]
}));

// Enable static files.
app.use("/uploads", express.static(resolve("uploads")));

app.listen(3030, () => {
  console.log(`🚀 App execute in ${ config.host }`);
});
```

We run our development server
```
ts-node src/index.ts
```

To be able to interact with the files and directories we access to the followings endpoints.

- Files: http://localhost:3030/storage/local/files

- Directories: http://localhost:3030/storage/local/directories

With this simple example we are ready to interact with our entities.

## Examples.
We have also created many repositories with the most popular frameworks for you to play around with, to help as example guides.

| Framework | Repository |
| --------- | ---------- |
| Vue | [filesrocket-vue-app](https://github.com/IvanZM123/filesrocket-vue-app) |
| Angular | [filesrocket-angular-app](https://github.com/IvanZM123/filesrocket-angular-app) |
| React | [filesrocket-react-app](https://github.com/IvanZM123/filesrocket-react-app)|
| Express | [filesrocket-express-app](https://github.com/IvanZM123/filesrocket-express-app) |

## File API.
To be able to interact with the Files API is done in the following format:

URL: `http://<my-domain>/:path/:service/:entity`

For example, the endpoints will vary based on the service you are using, in the follow table, shows how the variation occurs.

| Service | Endpoint | Available |
| ------- | -------- | --------- |
| [filesrocket-local](https://github.com/IvanZM123/filesrocket-local)   | `http://<my-domain>://:path/local/files` | ✅ |
| [filesrocket-cloudinary](https://github.com/IvanZM123/filesrocket-cloudinary)   | `http://<my-domain>://:path/cloudinary/files` | ✅ |
| [filesrocket-s3](https://github.com/IvanZM123/filesrocket-s3)   | `http://<my-domain>://:path/s3/files` | ✅ |

### Response structure
To save the consistence of each request, in **Filesrocket** we make sure that all the actions "CRUD" have a response template defined, so regardless of whether you want `create/upload`, `list` or `remove` you will always get this structure.

```js
{
  // File identifier.
  id: "http://localhost:3030/uploads/image.png",
  // File name.
  name: "image-ahbka28.png",
  // File extension.
  ext: ".png",
  // File size (bytes)
  size: 243562,
  // File directory.
  dir: "images",
  // File URL
  "http://localhost:3030/uploads/image.png",
  // Created at.
  createdAt: "2022-01-22T03:10:32.293Z",
  // Updated at.
  updatedAt: "2022-01-22T03:10:32.293Z"
}
```

> Note: Keep in mind, that depending on the service you are going to use, other properties will be present, apart from those shown in the previous example, this means that there will be more properties than those shown in the base schema.

During the example we will be supporting the service [filesrocket-local](https://github.com/IvanZM123/filesrocket-local), therefore our URL will be as follows.

URL: `http://localhost:3030/:path/local/files`

## Upload files.
The required and optional parameters for uploading files are listed below.

**POST**: `http://localhost:3030/:path/local/files`

### Required parameters.
| Params | Type | Description |
| --------- | ---- | ----------- |
| file      | File | Represent a file (Buffer) multipart/form-data |

### Optionals parameters.
| Params | Type | Description |
| --------- | ---- | ----------- |
| path      | String | Represents the path where you want to save the file. remember that folders are generated recursively (**Query**) |

> **Note**: To avoid filename conflicts, **Filesrocket** adds a hash before the extension name. For example: `filesrocket.png -> filesrocket-kshaw8a.png`

> **Note**: The parameters present in the table will be found in each of the services you use. In case you want to send special parameters, you need to visit the official documentation of the service you are using.

## Getting files.
The required and optional parameters for getting files are listed below.

**GET**: `http://localhost:3030/:path/local/files`

### Optionals parameters.
| Params | Type | Description |
| --------- | ---- | ----------- |
| path      | String | represents the path where you want to save the file. remember that folders are generated recursively (**Query**) |
| size | Number | Specify the number of files to be obtained (**Query**) |
| page | String | This parameter specifies the page we want to access, it is useful when we want to paginate our results (**Query**) |

> **Note**: The parameters present in the table will be found in each of the services you use. In case you want to send special parameters, you need to visit the official documentation of the service you are using.

## Deleting files.
The required and optional parameters for removing files are listed below.

**DELETE**: `http://localhost:3030/:path/local/files`

### Required parameters.
| Params | Type | Description |
| --------- | ---- | ----------- |
| id      | String | Represent the identifier file (**Query**) |

> **Note**: The parameters present in the table will be found in each of the services you use. In case you want to send special parameters, you need to visit the official documentation of the service you are using.

So far we have seen how to perform "CRUD" operations without our specialized package [filesrocket-client](https://github.com/IvanZM123/filesrocket-client), we strongly recommend that you use it, as it will make your job. In addition to being compatible with any framework on the client side, be it Angular, React, Vue and others.

## Directory API.
To be able to interact with the Directory API is done in the following format:

URL: `http://<my-domain>/:path/:service/:entity`

For example, the endpoints will vary based on the service you are using, in the follow table, shows how the variation occurs.

| Service | Endpoint | Available |
| ------- | -------- | ------ |
| [filesrocket-local](https://github.com/IvanZM123/filesrocket-local)   | `http://<my-domain>://:path/local/directories` | ✅ |
| [filesrocket-cloudinary](https://github.com/IvanZM123/filesrocket-cloudinary)   | `http://<my-domain>://:path/cloudinary/directories` | ✅ | 
| [filesrocket-s3](https://github.com/IvanZM123/filesrocket-s3) |  | ⛔ | 

#### Response structure.
To save the consistence of each request, in **Filesrocket** we make sure that all the actions "CRUD" have a response template defined, so regardless of whether you want `create`, `list` or `remove` you will always get this structure.

```js
{
  // Directory identifier.
  id: "http://localhost:3030/uploads/images",
  // Directory name.
  name: "images",
  // Directory size (bytes)
  size: 0,
  // Directory.
  dir: "",
  // Directory URL.
  url: "http://localhost:3030/uploads/images",
  // Created at.
  createdAt: "2022-01-22T03:10:32.293Z",
  // Updated at.
  updatedAt: "2022-01-22T03:10:32.293Z"
}
```

> **Note**: Keep in mind, that depending on the service you are going to use, other properties will be present, apart from those shown in the previous example, this means that there will be more properties than those shown in the base schema.

During the example we will be supporting the service [filesrocket-local](https://github.com/IvanZM123/filesrocket-local), therefore our URL will be as follows.

URL: `http://localhost:3030/:path/local/directories`

#### Create directories.
The required and optional parameters for creating directories are listed below.

**POST**: `http://localhost:3030/:path/local/directories`

#### Required parameters.
| Params | Type | Description |
| --------- | ---- | ----------- |
| name      | String | Represent a name directory (**Body**) |

> Note: The parameters present in the table will be found in each of the services you use. In case you want to send special parameters, you need to visit the official documentation of the service you are using.

### Getting directories.
The required and optional parameters for getting directories are listed below.

**GET**: `http://localhost:3030/:path/local/directories`

#### Optionals parameters.
| Params | Type | Description |
| --------- | ---- | ----------- |
| path      | String | represents the path where you want to save the directory. remember that folders are generated recursively (**Query**) |
| size | Number | Specify the number of files to be obtained (**Query**) |
| page | String | This parameter specifies the page we want to access, it is useful when we want to paginate our results (**Query**) |

### Removing directories.
The required and optional parameters for removing directories are listed below.

**DELETE**: `http://localhost:3030/:path/local/directories`

### Required parameters.
| Params | Type | Description |
| --------- | ---- | ----------- |
| id      | String | Represent the identifier directory (**Query**) |

> Note: The parameters present in the table will be found in each of the services you use. In case you want to send special parameters, you need to visit the official documentation of the service you are using.

> Note: For security reasons, folders cannot be deleted until they are empty. We do this to avoid accidentally deleting a folder that contained many files.

## Services.
A service is a predefined class that allows you to manage an entity either files or directories. This classes are composed by a decorator names `@Service` and interface named `ServiceMethods`

Currently there are 3 services, but this is only the tip of the iceberg, later we will incorporate many more with your help.

| Service | Description |
| ------- | ----------- |
| [filesrocket-local](https://github.com/IvanZM123/filesrocket-local) | Manage your files and directories on your own server. |
| [filesrocket-cloudinary](https://github.com/IvanZM123/filesrocket-cloudinary) | 	Manage your files and directories on your [Cloudinary](https://cloudinary.com/documentation/node_integration) |
| [filesrocket-s3](https://github.com/IvanZM123/filesrocket-s3) | Manage your files and directories with [Amazon S3](https://aws.amazon.com/s3) |

### Creating my first service.
The official services may not meet your needs, but don't worry, Filesrocket is thinking for you to create your own services. So let's get to it. But before, it is necessary to take into account some considerations.

- When creating a service, we recommend that each response from the different `create/upload`, `list` or `remove` actions always return a template as shown in [Response structure](#schema-response). This will guarantee consistency and avoid unexpected behavior in your client application.

We define a class.
```ts
export class DropboxFileService implements ServiceMethods {}
```

We add the `@Service` decorator to our class.
```ts
@Service({
  type: "Files",
  name: "dropbox"
})
export class DropboxFileService implements ServiceMethods {}
```

> Note: When this class is defined in the Filesrocket router, to interact with the service you will have to access the following endpoint `http://<my-domain>/:path/dropbox/files`

## Router.
**Filesrocket**'s router is a class called `RocketRouter`, this class contains a static method `forRoot` which allows us to define our services, add bindings, additional configuration and more. We can say that this class is in charge of exposing our services so that the client can consume them.

```ts
RocketRouter.forRoot({
  path: "storage",
  services: [
    // Manage your files.
    // Route: /storage/local/files
    { service: new LocalFileService(config.get("local")) },
    // Manage your Files.
    // Route: /storage/cloudinary/files
    { service: new CloudinaryFileService(config.get("cloudinary")) }
  ]
});
```

Parameters.
```ts
{
  /**
   * Represent the route base.
   */
  path: string;
  /**
   * A list of all available services.
   */
  services: {
    /**
     * This property allows you to change
     * the name of the service. Optional.
     */
    name?: string;
    /**
     * Class that implement the interface **ServiceMethods**
     * and decorator **Service**
     */
    service: Partial<ServiceMethods>;
    /**
     * Functions that run before or after an event is performed.
     * For more informations: https://github.com/IvanZM123/filesrocket#hooks
     */
    hooks: Hooks;
  }[];
}
```

> Note: The `forRoot` method return the object [Router](https://expressjs.com/es/api.html#router) of express.

## Hooks.
Hooks are **middleware functions** that are executed before or after executing an action, these actions are: `create`, `list` or `delete` an entity, be it files or directories.

This is what the **hooks** look like, in **Filesrocket**
```ts
function myHook(req: Request, res: Response, next: NextFunction) {
  console.log("I'm a hook!");
  next();
}
```

As you have just seen, a hook is nothing more than a simple function, which receives 3 parameters:

- `Request`: It is an object that represent the information of the request HTTP. For more information click [here](https://expressjs.com/en/4x/api.html#req)
- `Response`: It is an object that represents the HTTP response. For more information click [here](https://expressjs.com/en/4x/api.html#res)
- `NextFunction`: It is an function that represent the cycle `request-response`

> **Note**: To facilitate the adoption of the tool, the hooks are based on express middleware functions, visit [here](https://expressjs.com/en/guide/using-middleware.html) for more information.

### Creating my first hook.
As we visualized in the previous example, creating a hook is quite simple, since it is nothing more than a Javascript function that is executed at a certain moment. But before creating a hook, it is necessary to take into account some considerations.

1. When we add a hook, it is mandatory to execute the `next` function otherwise the thread will be frozen.
2. Please note that each service can have its own hooks depending on your needs.
3. Hooks are only present at the router level, so if you want to use services outside of the router, hooks will not be present.

Taking into account the above, we are going to create a few examples to make it clearer.

We create a hook `src/hooks/isLoggedIn.ts` to validate if a user sends an access token in the **Authorization** header of the request.
```ts
export function isLoggedIn(req: Request, res: Response, next: NextFunction) {
  const { authorization = "" } = req.headers;

  const token: string = authorization.replace(/Bearer/, "").trim();

  if (!token) {
    return res.status(401).json({
      name: "Unauthorized",
      message: "You need to authenticate to perfom this action"
    });
  }

  next();
}
```

We create a hook in `src/hooks/sendEmail.ts` to send an email when a user uploads a file.
```ts
import { NextFunction, Request, Response } from "express";
import { createTransport } from "nodemailer";
import { ROCKET_RESULT } from "filesrocket";

// Set config nodemailer.
const transport = createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "<Your user>",
    pass: "<Your pass>"
  }
});

export async function sendEmail(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const data = (req as any)[ROCKET_RESULT];

  transport.sendMail({
    from: "support@filesrocket.com",
    to: "abc@domain.com",
    subject: "Uploaded file!",
    text: "A few seconds ago you uploaded a file",
    html: `<h1>The ${data.name} file has been successfully uploaded 🚀</h1>`
  })
    .then(() => console.log("Sent email"))
    .catch(console.error);

  next();
}
```

The only thing we need is to add our hooks to the service or services that we want to have this functionality.

```ts
import { isLoggedIn } from "src/hooks/isLoggedIn.ts";
import { sendEmail } from "src/hooks/sendEmail.ts";

const service = new LocalFileService({
  pagination: {
    default: 15,
    max: 35
  },
  directory: "uploads",
  host: "http://localhost:3030"
});

const hooks = {
  before: {
    create: [isLoggedIn],
    list: [isLoggedIn],
    remove: [isLoggedIn]
  },
  after: {
    create: [sendEmail]
  }
}

const routes = RocketRouter.forRoot({
  path: "storage",
  services: [
    { service, hooks }
  ]
});

app.use(routes);
```

To recap, what we just did is create two hooks, the first one that is in charge of validating if a user sends an access token **before** `creating/uploading`, `listing` or `deleting` a file, and the second one sends an email **after** `creating/uploading` a file.

Perfect, with these examples you already know how hooks work, from now on you just have to give rein to your imagination.
