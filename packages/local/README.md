# filesrocket-local

[![npm version](https://badge.fury.io/js/filesrocket-local.svg)](https://badge.fury.io/js/filesrocket-local) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

[Filesrocket](https://github.com/Filesrocket/filesrocket-local) service to manage your files on your own server.

## Install

```
npm i filesrocket-local
```

## Usage

To use the service add the following content.

```ts
import { Filesrocket } from "filesrocket";
import { LocalFileService } from "filesrocket-local";

// Initialize filesrocket
const filesrocket = new Filesrocket();

// Setting service
const local = new LocalFileService({
  pagination: { default: 15, max: 50 },
  host: "http://localhost:3030",
  directory: "uploads"
});

// Register service
filesrocket.register("local", local);

// Recovering service
const fileService = filesrocket.service("local");

// Recovering controller
const fileController = filesrocket.controller("local");
```
