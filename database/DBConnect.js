const ENVIRONMENT = 'dev'

const dbURI = {
  live: (database) => {
    return `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_SERVER}:${process.env.MONGO_PORT}/${database}?authSource=admin`
  },
  dev: (database) => {
    return `mongodb://localhost:${process.env.MONGOPORT}/${database}`
  }
}
let attempts = 0; const Maxattempts = 20; const ConnectTimeout = 10000;
const connectionOptions = {}
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const connections = {}
exports.DBConnect = () => {
  const database = process.env.MONGODATABASE || 'init'
  try {
    if (!Object.keys(connections).includes(database)) {
      connections[database] = mongoose.createConnection(dbURI[ENVIRONMENT](database), connectionOptions);
    }
    return connections[database]
  } catch (error) {
    console.error('Error connecting to MongoDB:', error); attempts++
    if (attempts >= Maxattempts) {
      console.error(`Failed to connect to MongoDB after ${Maxattempts} attempts. Exiting...`)
      process.exit(1)
    }
    setTimeout(DBConnect, ConnectTimeout)
  }
}