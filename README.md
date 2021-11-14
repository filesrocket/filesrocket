# An package that allows you to manage your files with any cloud service.

Filesrocket is a Node.js package that allows you to obtain, upload and delete files from any cloud service, in general, it allows you to manage your files.

With filesrocket you can use it with almost any frontend framework such as Angular, Vue.js, React,

## Install.
`npm install filesrocket`

## Basic usage.
Filesrocket uses the concept of strategy so that you can manage your files. In any cloud service, whether locally, Cloudinary, Amazon and others. This can be implemented in a very simple way, follow the example below.

```ts
// Imports modules.
import { RocketService, RocketRouter, Pagination } from "filesrocket";
import { LocalRocketService } from "filesrocket-local";

// Initialize service.
const rocket = new RocketService();

// Register local service.
rocket.register("local", new LocalRocketService({
  pagination: { default: 15, max: 35 },
  directory: "uploads",
  host: "http://localhost:3030"
}));

app.use(RocketRouter({ path: "/storage", rocket }));
```

### Consulting files.

When you want to list files you have to add a query to the endpoint.

`GET http://my-app.com/<Path>`

| Parameters | Description |
|------------|-------------|
| service    | This is the name of the service you want to consume. Keep in mind, that the name wants to match the rockets registered on your server. **Required** |
| size | This property will limit the number of files returned. **Optional** |
| page | This property allows positioning on a certain page. Note that this property may vary in value depending on the rocket you are using. **Optional** |
| path |  This property allows you to get files from a specific directory. This property allows you to get files from a specific directory. **Optional** |

> Note: These properties will be present in all rockets. The other properties will depend on the rocket you are using, in that case you will have to consult the official documentation of the file storage provider, such as Cloudinary, AWS S3 and others.

### Uploading files.
This section lists the properties required to upload files.

> Note: Filesrocket does not allow multiple files to be uploaded, this is for fine handling with the progress bar. Later we will see an example of how to simulate this behavior.

`POST http://my-app.com/<Path>`

| Parameters | Description |
|------------|-------------|
| service    | This is the name of the service you want to consume. Keep in mind, that the name wants to match the rockets registered on your server. **Required** |
| path |  Specifies the directory where you want to save the file. **Optional** |

### Deleting files.
This section lists the properties required to remove files.

`DELETE http://my-app.com/<Path>`

| Parameters | Description |
|------------|-------------|
| service    | This is the name of the service you want to consume. Keep in mind, that the name wants to match the rockets registered on your server. **Required** |
| path |  Specifies the path where the file is located. Note that the value will change depending on the rocket you are using, so it is necessary to visit the official rocket documentation. **Required** |

### Client.
So far we have seen how to make requests, either from a browser, postman, or axios. But we have a specialized package for this type of operations, and it is compatible with any frontend framework. Click in the following link:  [filesrocket-client](https://github.com/IvanZM123/filesrocket-client)

### Services.
"Services" are the heart of Filesrocket. Services are JavaScript objects (or instances of ES6 classes) that implement certain methods.

Service methods are pre-defined "CRUD" methods that your service object can implement (create, list, get and remove). Below is an example of a service using async/await as a TypeScript object or class:

```ts
// My customize service.
export class MyServiceRocket implements ServiceMethods {
  async create() {
    return {} as any;
  }

  async get() {
    return {} as any;
  }

  async list() {
    return {} as any;
  }

  async remove() {
    return {} as any;
  }
}

const rocket = new RocketService();

// Register my service.
rocket.register("my-service-name", new MyServiceRocket());
```

Or you can set as object.

```ts
const rocket = new RocketService();

// Register my service.
rocket.register("my-service-name", {
  async create() {
    return {} as any;
  },
  
  async get() {
    return {} as any;
  },

  async list() {
    return {} as any;
  },

  async remove() {
    return {} as any;
  }
});
```

### Customize service.

It is possible that at some point you need to adapt a service to your needs, do not worry that this is possible. Follow the example below:

```ts
import { PackageRandom } from "package";

export class MyRocket implements Partial<ServiceMethods> {
  private package: PackageRandom;
  
  constructor(private options: any) {
    this.package = new PackageRandom(options);
  }
  
  async create(payload: Payload, query: Query) {
    return this.package.upload(payload)
  }
}
```

> Recommendations: When creating a custom rocket, it is good practice to return the paginated files if they are listed.

When you need to customize a service, you always receive a property **payload** in the method **create** with the following properties.

```ts
{
  /**
   * Filename. For example: picture.png, songs.mp3 and more...
   */
  filename: string;
  /**
   * Name of the form input.
   */
  fieldname: string;
  /**
   * File in ReadableStream
   */
  file: NodeJS.ReadableStream;
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

It is mandatory that you always return the following properties in all methods (Create, Get, List and Remove) for consistency reasons.

```ts
async create() {
  return {
    name: "my-image.png",
    size: 12345,
    ext: ".ppg",
    dir: "images",
    url: "http://myapp.com",
    createdAt: "2021-11-12T17:02:56.699Z",
    updatedAt: "2021-11-12T17:02:56.699Z"
  }
}
```

Of course you can send all the properties you want, but those will be mandatory. It may seem cumbersome to you, but consistency in your applications is vital.

### Router.

Router already configures routes, hooks, basePath, and other options. This will be the central point where requests will be made to manage our files.

```ts
import { RocketService, RocketRouter } from "filesrocket";

// Initialize service.
const rocket = new RocketService();

// Configuring router.
const router = RocketRouter({
 // URI - Required
  path: "/storage",
  // Main Service - Required
  rocket,
  // Hooks
  hooks: {},
  // Other configurations.
  options: {}
});

// Use router.
app.use(router);
```

### Hooks.
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

// Add your hooks.
RocketRouter({ hooks });
```

> Note: Hooks are defined at the router and not at the services level. It is possible that this will change in the future, but for the moment it is.

> Note: When you add your hooks you need to execute `next`, otherwise it will not go to the next hook.

### More Rockets.

The rockets are pre-made classes for you to manage your files with various cloud storage services, such as `Cloudinary`, `AWS S3` and other providers.

> At the moment, these are the existing rockets, but with your help they will be more and more 🚀

| Rocket name | Description | Repository |
|-------------|-------------|------------|
| filesrocket-local | Manage your files locally. | https://github.com/IvanZM123/filesrocket-local |
| filesrocket-cloudinary | Manage your files in cloudinary. | https://github.com/IvanZM123/filesrocket-cloudinary |
| filesrocket-s3 | Manage your files on AWS S3. | https://github.com/IvanZM123/filesrocket-s3 |

## Example.

In the event that its operation has not been clear to you, or you have problems implementing it, we have created a repository so that you can clone it and play with it. Visit the following repositories:

| Name | Repository |
|------|------------|
| filesrocket-vue-app | https://github.com/IvanZM123/filesrocket-vue-app |
| filesrocket-angular-app | https://github.com/IvanZM123/filesrocket-angular-app |
| filesrocket-react-app | https://github.com/IvanZM123/filesrocket-react-app |
| filesrocket-server-app | https://github.com/IvanZM123/filesrocket-server-app |
