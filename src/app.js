const express = require("express");
const dotenv = require("dotenv");

dotenv.config({ path: `${__dirname}/../.env` });
const app = express();
app.use(express.static(`${__dirname}/public`));
app.use(express.json());

app.set("view engine", "pug");
app.set("views", `${__dirname}/public/views`);
app.use(require("morgan")("dev"));

app.use("/esatech", require(`${__dirname}/router/router`));

module.exports = app;
// strin