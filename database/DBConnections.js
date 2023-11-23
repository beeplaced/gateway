
// console.log('db connection')
const mongoose = require('mongoose'); mongoose.set('strictQuery', true);
const Schema = mongoose.Schema;
const { connectToMongoDB } = require('./DBConnect');
const Table = 'gri_latest';
const db = connectToMongoDB();

const DBConnect = () => {
  if (!mongoose.connection.readyState) {
    return connectToMongoDB()
  }
  return db
}

const griContent = new Schema(
    {
      ident: {
        type: String,
        required: true,
      },
      sort: {
        type: Number,
        required: true
      },
      tab: {
        type: String,
        required: true,
      },
      standard: {
        type: String
      },
      identifier: {
        type: String,
        required: true
      },
      catalog: {
        type: Object,
        required: false
      },
      gri: {
        type: Object,
        required: true
      },
      status: { type: Object, required: true },
      packages: { type: Array, required: false },
      metadata: {
        type: {
          _id: false,
          lastUpdate: { type: Date, required: true },
          lang: { type: String, required: false },
          country: { type: String, required: false }
        },
        required: false
      },
  }, { strict: false }); griContent.index({ ident: 1 }, { unique: true })

// const token = new Schema({
//   _id: { type: mongoose.Schema.Types.ObjectId, required: true },
//   token: { type: String, required: true },
//   service: { type: String, required: true },
//   remark: { type: String, required: false },
//   }, { versionKey: false, collection: Table })
//   //packageMeta.index({ title: 1 }, { unique: true })

module.exports = class {
  useGRI = () => DBConnect().model(
    Table,
    griContent,
    Table)
}