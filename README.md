# CONTENT API GATEWAY

V 0.0.2

## Overview

The content gateway dynamically directs incoming API calls to specific microservices, ensuring efficient routing and returning the [defined result](#result). Service definitions are specified in the `services.json` file. Currently, [adding a new Services](#adding-services) requires manual entry into the `services.json` file.


## Table of Contents

- [CONTENT API GATEWAY](#content-api-gateway)
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Usage Examples](#usage-examples)
    - [Get Service Status](#get-service-status)
  - [API Documentation](#api-documentation)
    - [result](#result)
    - [Adding Services](#adding-services)
    - [Example Service](#example-service)


## Usage Examples

Here are some examples demonstrating how to make requests to the API using different endpoints:

### Get Service Status

```bash
###
curl -X GET http://localhost:3000/status -H "Authorization: Basic $API_AUTH"
```

## API Documentation

List any prerequisites that users need to have installed before they can use your API gateway.

### result

Example result from 

```bash
###
curl -X GET http://localhost:3000/result -H "Authorization: Basic $API_AUTH"
```

```
{
  "status": 200,
  "statusText": "OK",
  "duration": "(0 ms) 😊",
  "message": "Example result",
  "data": [
    {
      "result": true
    }
  ]
}
```

### Adding Services

To add a new service to the Gateway, follow these steps:

Open the services.json file in the root of your project.

Add a new entry for your service, specifying the necessary details such as path, title, method, serviceInstance, command, curl, and transformations.

### Example Service
```
{
   "path": "many_requests",
   "services": {
       "one": {
           "title": "grab what",
           "method": "GET",
           "serviceInstance": "axios",
           "command": "content",
           "curl": "internal",
           "transformations": {
               "output": "xlsx"
           }
       }
   }
}
```

