const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const expressDeliver = require('express-deliver');
const logger = require('morgan');
const isDev = process.env.NODE_ENV === 'development';
const exceptionPool = require('./lib/exceptionPool');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./lib/db');
const { printDeliverError, getMorganConfig } = require('./lib/utils');

const indexRouter = require('./routes/index');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const adsRouter = require('./routes/apiv1/advertisements');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('pug').__express);
app.set('view engine', 'html');

// I enable Access-Control-Allow-Origin: * in header
app.use(cors());
// support parsing of application/json type post data
app.use(bodyParser.json());

if (isDev) {
  app.use(logger('dev', getMorganConfig()));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

expressDeliver(app, {
  printErrorStack: false,
  printInternalErrorData: isDev,
  exceptionPool,
  onError: printDeliverError
});

app.use(function(req, res, next) {
  if (db.connection.readyState !== 1) throw new exceptionPool.NoDatabase();
  next();
});

/**
 * Rutas de mi API
 */
app.use('/', indexRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/apiv1/anuncios', adsRouter);

expressDeliver.errorHandler(app);

module.exports = app;
