const express = require('express')
const cookieParser = require('cookie-parser')
const expressDeliver = require('express-deliver')
const logger = require('morgan')
const isDev = process.env.NODE_ENV === 'development'
const exceptionPool = require('./lib/exceptionPool')
const cors = require('cors')
const bodyParser = require('body-parser')
const db = require('./lib/db')
const { printDeliverError, getMorganConfig } = require('./lib/utils')

const userController = require('./controllers/userController')
const userRouter = require('./routes/user')
const adsRouter = require('./routes/apiv1/advertisements')

const app = express()

// I enable Access-Control-Allow-Origin: * in header
app.use(cors())
// support parsing of application/json type post data
app.use(bodyParser.json())
// Static files
app.use(express.static('public'))

if (isDev) {
  app.use(logger('dev', getMorganConfig()))
}
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

expressDeliver(app, {
  printErrorStack: false,
  printInternalErrorData: isDev,
  exceptionPool,
  onError: printDeliverError,
})

app.use(function(req, res, next) {
  if (db.connection.readyState !== 1) throw new exceptionPool.NoDatabase()
  next()
})

/**
 * Rutas de mi API
 */
app.use('/', userController.loadUser)
app.get('/', async () => 'It works')
app.use('/user', userRouter)
app.use('/apiv1/anuncios', adsRouter)

expressDeliver.errorHandler(app)

module.exports = app
