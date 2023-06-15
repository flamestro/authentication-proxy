## Description

A proxy application that allows you to authenticate requests before proxying to your real applications.

## Installation

```bash
$ yarn
```

## Running the app

```bash
$ yarn start
```

## Using Mongo as persistence layer

create a .env file with the following env variables.
```text
MODE=MONGO
MONGO_DB_URL=<YOUR_MONGO_URL>
MONGO_DB_DATABASE=DB_NAME
MONGO_DB_COLLECTION=COLLECTION_NAME
```
