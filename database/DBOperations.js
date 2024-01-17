const { _con } = require('./DBConnections');
const mno = require('mongoose-operations')
const mongooseOperations = new mno();

module.exports = class {

  createOrUpdate = async(entry,con) => {
    let res = await mongooseOperations.create(entry, _con(con))
    if ('e' in res && res.e === 11000) {
      const set = { $set: entry }
      const updateID = res._id
      const { _id } = await _con(con).findByIdAndUpdate(updateID, set)
      return { status: 201, _id: _id.toString() }
    }
    return { status: 200, _id: res._id.toString() }
  }

  findAllFields = async (match, con) => {
    try {
      const AGGREGATE = [
        { $match: match },
        { $addFields: {} }
      ]
      return await _con(con).aggregate((AGGREGATE))
    } catch (error) {
      return { status: error.status || 500, error: error.message || "Internal Server Error" };
    }
  }

  findSpecificFields = async (match, con, projects) => {
    try {
      const AGGREGATE = [
        { $match: match },
        { $sort: { _id: -1 } },
        { $project: projects }
      ]
      return await _con(con).aggregate((AGGREGATE))
    } catch (error) {
      return { status: error.status || 500, error: error.message || "Internal Server Error" };
    }
  }


}
