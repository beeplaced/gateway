const Connection = require('./DBConnections');
const _con = new Connection();
const mongoose = require('mongoose');
// const DATES = require('../Dates');
// const DT = new DATES();
const mno = require('mongoose-operations')
const mongooseOperations = new mno()

module.exports = class {

  createToken = async () => await mongooseOperations.create({ token: '123', service: 'first API'}, _con.useMongo())
  
  /** @param {object} match*/
  find = async (match) => await mongooseOperations.findAllFields(match, _con.useMongo())

  /**
   * @param {Object} params - The parameters object.
   * @param {Object} params.match - The match criteria for the query.
   * @param {Object} params.projects - The project details.
   */
  findOneByProject = async ({ match, projects }) => await mongooseOperations.findOneByProject(match, projects, _con.useMongo())
  
  findGRIContent = async ({ match, projects }) => await mongooseOperations.findManyByProject(match, projects, _con.useGRI())

}
