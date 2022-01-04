![filesrocket new logo](https://user-images.githubusercontent.com/64434514/148064916-cfa6d14e-35cc-4d45-a683-d54333996e4a.png)

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

### Upload files.
This section shows the properties to upload a file.

#### Required Parameters.
| Parameter | Type | Description |
| --------- | ---- | ----------- |
| File | File | Represent a file (Buffer). multipart/form-data |

#### Optional Parameters.
| Parameter | Type | Description |
| --------- | ---- | ----------- |
| Path | String | You can specify the path where the file is saved. Please note that directories are created recursively. |

### List files.
This section shows the properties to list a files.

#### Optional Parameters.
| Parameter | Type | Description |
| --------- | ---- | ----------- |
| path | String | Specify the folder where you want to get the files. |
| size | String | Specify the number of files or directories to be obtained. |
| page | String | When a request has more results to return than **size**, the **size** value is returned as part of the response. You can then specify this value as the **page** parameter of the following request. Note that the values change according to the service you are using. |

### Remove file.
This section shows the properties to list a files.

#### Required parameters.
| Parameter | Type | Description |
| --------- | ---- | ----------- |
| id | String | Represents the identifier of the file. |

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

### Customized services.
You may want to create your own services. For this it is very important to take into account the following.

**Step 1**: Create a class that implements the following interface.

```ts
export class MyCustomizeService implements ServiceMethods {}
```

**Step 2**: We are add the *Service* decorator.

```ts
@Service({
  type: "Files",
  name: "dropbox"
})
export class MyCustomizeService implements ServiceMethods {}
```

As you can see, this service will handle files and its name is dropbox. When this service is added to the routes, it will be accessed as follows: `/dropbox/files`

### Parameters that the events receive.

**Upload File**. When you want to upload a file, keep in mind that the following parameters will always be sent to you.

```ts
{
  /**
   * Filename. For example: picture.png, songs.mp3 and more...
   */
  name: string;
  /**
   * Name of the form input.
   */
  fieldname: string;
  /**
   * File in ReadableStream.
   */
  stream: NodeJS.ReadableStream;
  /**
   * Encoding type.
   */
  encoding: string;
  /**
   * Type of file. For example: image/jpg
   */
  mimetype: string;
}
```

**List files**: When you want to list files you will always receive a **query**, this is obtained from `req.query`

**Remove file**: When you want to delete files you will always receive the **id** of the file to delete (this can be a url, or any way to identify the file) and a **query**, this is obtained from `req.query`

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

```td
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
    from: "support@filesrocket.com",
    to: req.user.email,
    subject: "Uploaded file",
    html: "<h1>You have uploaded a file!</h1>"
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
