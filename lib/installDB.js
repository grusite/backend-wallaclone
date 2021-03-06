'use strict'

require('dotenv').config() // loading environment variables from .env file
const debug = require('debug')('nodepop:installDB')
const db = require('./db')
const Ad = require('../models/Advertisement')
const initAds = require('./initAds.json')

db.connect()

db.connection.once('open', async () => {
  try {
    debug('deleting rows')
    await Ad.deleteMany()
    debug('deleted rows')
    debug('inserting rows')
    await Ad.insertMany(initAds.anuncios)
    debug('inserted rows')
    db.disconnect()
  } catch (err) {
    debug('error', err)
  }
})
