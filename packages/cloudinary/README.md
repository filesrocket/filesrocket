# filesrocket-cloudinary

[![npm version](https://badge.fury.io/js/filesrocket-cloudinary.svg)](https://badge.fury.io/js/filesrocket-cloudinary) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

[**Filesrocket**](https://github.com/IvanZM123/filesrocket) service to manage your files with [**Cloudinary**](https://cloudinary.com/)

## Install

```
npm i filesrocket-cloudinary
```

## Usage

To use the service add the following content

```ts
import { Filesrocket } from "filesrocket";
import { CloudinaryFileService } from "filesrocket-cloudinary";

// Initialize filesrocket
const filesrocket = new Filesrocket();

// Setting service
const cloudinary = new CloudinaryFileService({
  pagination: { default: 15, max: 50 },
  cloud_name: "<Your CLOUD NAME>",
  api_key: "<Your API KEY>",
  api_secret: "<Your API SECRET>"
});

// Register services
filesrocket.register("cloudinary", cloudinary);

// Recovering service
const service = filesrocket.service("cloudinary");

// Recovering controller
const controller = filesrocket.controller("cloudinary");
```

> **Note**: To use this service, you need to have an account, enter [here](https://cloudinary.com/documentation/how_to_integrate_cloudinary#1_create_and_set_up_your_account) and follow the steps.
