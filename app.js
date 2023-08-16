const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();
const bodyParser = require('body-parser');
const CustomerDB = require('./database');  // adjust path as needed

const db = new CustomerDB();

app.use(async (req, res, next) => {
  try {

    await db.initialize();

    req.db = db;
    next();
  } catch (err) {
    next(err);
  }
});

app.get('/data', async (req, res) => {
  const data = await req.db.findAllCustomers();
  res.json(data);
});


const mainRouter = require('./routes/main');
const uploadRouter = require('./routes/uploadinfo');
const viewRouter = require('./routes/viewdata');

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static('public/styles'));
app.use(express.static('public'));

app.set('view engine', 'pug');

app.locals.pretty = true;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.use('/', mainRouter);
app.use('/', uploadRouter);
app.use('/', viewRouter);

module.exports = app;