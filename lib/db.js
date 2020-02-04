const debug = require('debug')('root:db');

const mongoose = require('mongoose');
const { URL } = require('url');

// Disable deprecated options
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);

const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/wallaclone';

// Funcion para conectarme a la BBDD
function connect() {
  debug('connect', new URL(uri).host);
  mongoose.connect(uri, err => {
    if (err) {
      console.log('error');
      debug(
        'error',
        'Failed to connect to mongo on startup - retrying in 5 sec',
        err.message
      );
      setTimeout(connect, 5000);
    }
  });
}

// Funcion para desconectarme de la BBDD
function disconnect() {
  debug('disconnect');
  mongoose.connection.close();
}

// Debugo cada estado de la conexion
mongoose.connection.on('disconnected', () => debug('disconnected'));
mongoose.connection.on('connected', () => debug('connected'));
mongoose.connection.on('connecting', () => debug('connecting'));
mongoose.connection.on('disconnecting', () => debug('disconnecting'));

module.exports = {
  connect,
  disconnect,
  connection: mongoose.connection
};
