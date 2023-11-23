
/** @type {string} */
const ENVIRONMENT = 'dev';
const DATABASE = process.env.MONGODATABASE;

const dbURI = ENVIRONMENT === 'live'
  ? `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_SERVER}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=admin`
  : `mongodb://localhost:${process.env.MONGOPORT}/${DATABASE}`;

let attempts = 0; const Maxattempts = 20; const ConnectTimeout = 10000;

/**
 * @typedef {Object} ConnectionOptions
 * @property {boolean} useNewUrlParser - Whether to use the new URL parser.
 * @property {boolean} useUnifiedTopology - Whether to use the new Server Discovery and Monitoring engine.
 */

const connectionOptions /** @type {ConnectionOptions} */ = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

const mongoose = require('mongoose'); mongoose.set('strictQuery', true);

const connectToMongoDB = () => {
  try {
    mongoose.connect(dbURI, connectionOptions)
    return mongoose.connection
  } catch (error) {
    console.error('Error connecting to MongoDB:', error); attempts++
    if (attempts >= Maxattempts) {
      console.error(`Failed to connect to MongoDB after ${Maxattempts} attempts. Exiting...`)
      process.exit(1)
    }
    setTimeout(connectToMongoDB, ConnectTimeout)
  }
}

exports.connectToMongoDB = connectToMongoDB;