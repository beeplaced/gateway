const dbURIDef = process.env.ENVIRONMENT === 'live'
  ? `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_SERVER}:${process.env.MONGO_PORT}/${process.env.MONGODATABASE}?authSource=admin`
  : `mongodb://localhost:${process.env.MONGOPORT}/${process.env.MONGODATABASE}`;

let attempts = 0; const Maxattempts = 20; const ConnectTimeout = 10000;
//const connectionOptions = { useNewUrlParser: true, useUnifiedTopology: true };
const connectionOptions = {}
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

const connections = {}

exports.connectToMongoDB = (database = process.env.MONGODATABASE) => {
  try {
    if (!Object.keys(connections).includes(database)) {
    connections[database] = mongoose.createConnection(dbURIDef, connectionOptions);
    }
    return connections
  } catch (error) {
    console.error('Error connecting to MongoDB:', error); attempts++
    if (attempts >= Maxattempts) {
      console.error(`Failed to connect to MongoDB after ${Maxattempts} attempts. Exiting...`)
      process.exit(1)
    }
    setTimeout(connectToMongoDB, ConnectTimeout)
  }
}