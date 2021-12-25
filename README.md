![Filesrocket Banner](https://res.cloudinary.com/dlkfpx8lb/image/upload/v1639523151/wallpaper_rbiss8.png)

## Filesrocket allows you to manage your files and directories with any cloud service.

Filesrocket is a Node.js package that allows you to obtain, upload and delete files from any cloud service, in general, it allows you to manage your files and directories.

With filesrocket you can use it with almost any frontend framework such as Angular, Vue.js, React.

## Installation.
`npm i filesrocket`

## Tutorial.
Now that we are ready to roll we can create our first files application using filesrocket. In this quick start guide we'll create our first server. It will show how easy it is to get started with filesrocket for management our files and directories.

Let's create new folder.

```
mkdir my-first-app-filesrocket
cd my-first-app-filesrocket
```

Initialize configuration for any Node.js project.

```
npm i typescript ts-node -g
npm init -y
tsc --init
```

Install dependencies.

```
npm i express filesrocket filesrocket-local
```

Create new file `src/index.ts` and copy the following content.

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

Run server.
`ts-node src/index.ts`

To interact with the entities, enter the following routes:

- Files: http://localhost:3030/storage/local/files
- Directories: http://localhost:3030/storage/local/directories

With this simple example, your can management your files and directories of form locally.

#### Examples.
In the event that its operation has not been clear to you, or you have problems implementing it, we have created a repository so that you can clone it and play with it. Visit the following repositories:

| Name | Repository |
| ---- | ---------- |
| filesrocket-vue-app | https://github.com/IvanZM123/filesrocket-vue-app |
| filesrocket-angular-app | https://github.com/IvanZM123/filesrocket-angular-app |
| filesrocket-react-app | https://github.com/IvanZM123/filesrocket-react-app |
| filesrocket-server-app | https://github.com/IvanZM123/filesrocket-server-app |

## Services.
A service is a predefined class that allows you to manage an entity either files or directories. This classes are composed by a decorator names *Service* and interface named *ServiceMethods* To understand better, follow the example below.

```ts
@Service({
  // This property allow know the entity (Files | Directories) type that want management.
  type: "Files",
  // This property set service name.
  name: "myService"
})
export class MyService implements ServiceMethods<any> {
  /**
  * Create a new files.
  */
  async create(): promise<any> {}
  
  /**
  * List a files.
  */
  async list(): promise<any> {}
  
  /**
  * Remove a file.
  */
  async remove(): promise<any> {}
}
```

> **Note**: Note that when you create a service and set the type and its name, this is how the routes are formed. For example: If the type of service has entity **files** and name **azure**, its path will be **/azure/files**

#### More services.
The rockets are pre-made classes for you to manage your files with various cloud storage services, such as Cloudinary, AWS S3 and other providers.

| Rocket name | Description |
| ----------- | ----------- |
| [filesrocket-local](https://github.com/IvanZM123/filesrocket-local) | Manage your files locally |
| [filesrocket-cloudinary](https://github.com/IvanZM123/filesrocket-cloudinary) | Manage your files in cloudinary |
| [filesrocket-s3](https://github.com/IvanZM123/filesrocket-s3) | Manage your files on AWS S3 |

> At the moment, these are the existing rockets, but with your help they will be more and more 🚀

## Router.
In filesrocket router, it is a class that allows you to create the routes, add configurations, hooks and others.

```ts
RocketRouter.forRoot({
  path: "storage",
  services: [
    { service: new LocalFileService(config.get("local")) },
    { service: new CloudinaryFileService(config.get("cloudinary")) }
  ]
});
```

#### Params.

| property | description                              | Format |
| -------- | ---------------------------------------- | ------ |
| path     | Represents the base path of your service | String |
| services | This a list of all your services         | Array  |

## Hooks.
The hooks in filesrocket, are functions that are executed **before** or **after** performing an action **create**, **list** or **remove**

This is useful because it allows you to add extra functionality independently. Either how to send emails when a file is uploaded, validate that the user is logged in, etc.

```ts
function isLoggedIn(req, res, next) {
  if (!req.user) return next(new Error("User is not logged in."));
  return next();
}

function sendMail(req, res, next) {
  MailService.send({
    to: req.user.email,
    html: "You have uploaded a file"
  });
  return next();
}

const hooks: Hooks = {
  before: {
    create: [],
    list: [isLoggedIn],
    remove: []
  },
  after: {
    create: [sendMail],
    list: [],
    remove: []
  }
}

RocketRouter.forRoot({
  path: "storage",
  services: [
    {
      service: new LocalFileService(config.get("local")),
      hooks
    }
  ]
});
```

> **Note**: Keep in mind that each service can have its own hooks based on your needs.

> **Note**: When you add your hooks you need to execute `next`, otherwise it will not go to the next hook.
