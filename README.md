![Filesrocket](https://user-images.githubusercontent.com/64434514/185008388-b73e0f07-7d2f-441c-9fb8-cf2fd0dd8f49.png)

# Manage your files with any Cloud Storage Services

**Filesrocket** is an package of **Node.js** that allows you to manage your files with any cloud storage service ([**Local**](https://github.com/Filesrocket/filesrocket-local), [**Cloudinary**](https://github.com/Filesrocket/filesrocket-cloudinary), [**Amazon S3**](https://github.com/Filesrocket/filesrocket-amazons3)) through the use of strategies called **Services**

> ⚠️ **Filesrocket** it is currently in **beta** phase. Note that it is not ready for production yet. Thanks for your understanding! ❤️
  
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
import { Service } from "@filesrocket/local";

// Initialize
const filesrocket = new Filesrocket();

// Config your service
const service = new Service({
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

> **Note**: By default there is no type of filter when uploading a file. Later we will see how to add validations, limit file sizes, fields and more...

We run the server

```bash
npx ts-node src/index.ts
```

With this simple example you can interact with the files, click on the following link: http://localhost:3030/files

## 📙 Documentation

The [Filesrocket docs]() are packed with awesome stuff and tell you everything you need to know about using and configuring Filesrocket.

## ❤️ Stay in touch

- 🐦 Twitter: [thebug404](https://twitter.com/thebug404)
- 📰 Blog: [thebug404](https://thebug.hashnode.dev)

## ⚖️ Licence

Filesrocket is [MIT Licenced](/LICENCE)
