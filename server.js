const express = require("express");
const expressGraphQL = require("express-graphql");
const createError = require("http-errors");
const stock = require("./schema/Stock");

const Task = require("./tasks/fetchTask");

const app = express();

const dotenv = require("dotenv");
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

Task.fetchNew();

app.use(
  "/graphql",
  expressGraphQL({
    schema: stock,
    graphiql: true
  })
);

app.use(function(req, res, next) {
  next(createError(404));
});

app.listen(4000, () => {
  console.log("Server started on port 4000...");
});
