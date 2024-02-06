// console.log('db connection')
const mongoose = require('mongoose'); mongoose.set('strictQuery', true);
const Schema = mongoose.Schema;
const { connectToMongoDB } = require('./DBConnect');
const connections = connectToMongoDB();
const DBConnect = (database = process.env.MONGODATABASE) => {
  if (!Object.keys(connections).includes(database)){
    return connectToMongoDB(database)[database]
  }
  return connections[database]
}

const schemata = {}

const definitions = {
  files: () => {
    return {
      sch: {
        title: { type: String, required: true },
        status: { type: Number, required: true, default: 0 }, //def. uploaded, new
        sha: { type: String, required: true, unique: true },
        lastUpdate: { type: Date, required: true, default: Date.now  },
        size: { type: Number, required: false },
        meta: { type: Object, required: false },
        file: {
          data: Buffer,
          contentType: String
        }
      }, index: { sha: 1 }
    }
  },
  gateway_logs: () => {
    return {
      sch: {
        log: { type: Object, required: true },
        lastUpdate: { type: Date, required: true, default: Date.now },
      }
    }
  },
  msdsd: () => {
    return {
      sch: {
        index: { type: String, required: true },
        status: { type: Object, required: true }
      }
    }
  },
  presBackup: () => {
    return {
      sch: {
        parserres: {
          type: Object,
          required: true
        },
        sha: {
          type: String,
          required: true,
          unique: true
        },
        synced: {
          type: Date,
          required: false
        }
      }, index: { sha: 1 }
    }
  }

}

exports._con = (collection) => {
    if (!schemata[collection]) {
      const { sch, index } = definitions[collection]()
      schemata[collection] = new Schema(sch, { collection, versionKey: false, strict: false });
      if (index) schemata[collection].index(index, { unique: true })
    }
    return DBConnect().model(
      `${collection}`,
      schemata[collection],
      `${collection}`,)  
    }