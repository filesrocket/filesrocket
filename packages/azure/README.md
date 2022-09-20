![Filesrocket](https://user-images.githubusercontent.com/64434514/185008388-b73e0f07-7d2f-441c-9fb8-cf2fd0dd8f49.png)

# Manage your files with any Cloud Storage Services

[**Filesrocket**](https://filesrocket.com/) is an package of [Node.js](https://nodejs.org/en/) that allows you to manage your files with any cloud storage service ([Local](https://filesrocket.com/services/local.html), [Cloudinary](https://filesrocket.com/services/cloudinary.html), [Amazon S3](https://filesrocket.com/services/amazon-s3.html)) through the use of strategies called [Services](https://filesrocket.com/overview/services.html)

## 📙 Documentation

The [Filesrocket Docs](https://filesrocket.com/) are packed with awesome stuff and tell you everything you need to know about using and configuring Filesrocket.
  
## 🚀 Getting started

You can start using **Filesrocket** in easy steps.

```bash
$ mkdir filesrocket-example
$ cd filesrocket-example
$ npm init -y && tsc --init
$ npm install express @filesrocket/core @filesrocket/local
$ npm install @types/express typescript ts-node -D
```

Create `src/index.ts` and copy following content.

1. Initialize app

```ts
import express from "express";

const app = express();

app.listen(3030, ()  => {
  console.log("App execute in port:3030");
});
```

2. Register the services you are going to use

```ts
import { Filesrocket } from "@filesrocket/core";
import { LocalService } from "@filesrocket/local";

// Initialize
const filesrocket = new Filesrocket();

// Config your service
const service = new LocalService({
  pagination: { default: 15, max: 50 },
  host: "http://localhost:3030",
  directory: "uploads"
});

// We register the service
filesrocket.register("local", service);
```

3. Register your endpoints.

```ts
const controller = filesrocket.controller("local");

// Create/Upload files.
app.post("/files", async (req,  res) => {
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

We run the server

```bash
npx ts-node src/index.ts
```

With this simple example you can interact with the files, click on the following link: [`http://localhost:3030/files`](http://localhost:3030/files)

## ❤️ Stay in touch

- 🐦 Twitter - [Ivan Zaldivar](https://twitter.com/thebug404)
- 🌐 Website - [filesrocket.com](https://filesrocket.com/)
- 📝 Blog - [thebug.hashnode.dev](https://thebug.hashnode.dev/)

## ⚖️ Licence

Filesrocket is [MIT Licenced](LICENCE)
