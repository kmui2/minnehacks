# Routes

Each subdirectory here is a new route. For example, `/api/book/` and `/user/`.

## Controllers

`*.controller.js` defines database function wrappers for that subdirectory's route. 

For example, `updateRating()` in [`book.controller.js`](./api/book/book.controller.js) is the function that will be called on an HTTP POST request for the endpoint `/api/book/update/rating/` as defined in [`index.js`](./api/book/index.js).

## Models

Models define a database schema for the table the controller is using. Typically, it will be an Object for MongoDB or a table for SQLite.
