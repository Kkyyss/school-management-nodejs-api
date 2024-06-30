const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const errorhandler = require('errorhandler');

const api = require('./routes');
const { ZodError } = require('zod');
const { errorMessageHelper } = require('./utils/message');

const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(errorhandler());

app.use(api);

app.use((err, req, res, next) => {
  let message;
  res.status(err.status || 500);
  if (err instanceof ZodError) {
    // zod error handling
    message = err.flatten().fieldErrors;
    res.status(400);
  } else if (err.errors) {
    // sequelize error handling
    message = errorMessageHelper(err.errors);
    res.status(400);
  } else if (err instanceof Error) {
    // general error handling
    message = err.message;
  }
  console.log(err.stack);
  res.json({
    message: message,
    error: err,
  });
});

module.exports = app;
