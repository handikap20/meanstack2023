const express = require('express');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const postRoutes = require('./routes/posts');

const app = express();

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://handika:L0HEZ1Es6VU6PDn1@ac-zjzctxk-shard-00-00.1jzliq1.mongodb.net:27017,ac-zjzctxk-shard-00-01.1jzliq1.mongodb.net:27017,ac-zjzctxk-shard-00-02.1jzliq1.mongodb.net:27017/test?ssl=true&replicaSet=atlas-10o3bx-shard-0&authSource=admin&retryWrites=true&w=majority")
  .then(() => {
    console.log('Connected to database');
  }).catch(() => {
    console.log('Connection failed');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-with, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, PUT, OPTIONS"
  );
  next();
});

app.use("/api/posts",postRoutes);


module.exports = app;
