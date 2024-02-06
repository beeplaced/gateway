const DBOPERATIONS = require('../database/DBOperations'); const _DB = new DBOPERATIONS()
const { customError } = require('../types/errorHandling')
const { statusTitles } = require('../types/statusTitles')

/**
 * @param {request} req - The request object from the API.
 * @param {ExpressResponse} res - The response object.
 */
exports.output = async (req, res) => {
  const { command, rawdata } = req
  switch (command) {
    default:
      res.status(rawdata.status).json(rawdata)
      break
  }
}

exports.prepOutput = async (response) => {
  /** @type {ApiResponse} */ const { data, status, message, elapsedTime } = response
  const statusText = status && statusTitles[status] ? statusTitles[status] : statusTitles[500]
  let ret = {}
  switch (status) {
    case 200:
    case 201:
    case 409:
      /** @type {ApiReturn} */ ret = {
        status,
        duration: elapsedTime, // \u{1F60A}
        message: message ? `${message} - ${statusText}` : statusText
      }
      if (Array.isArray(data)) {
        ret.amount = data.length
      }
      ret.result = data
      return ret
    default:
      throw await customError({ status: status || 500, message: statusText })
  }
}

/**
 * @param {apiOutputError} err
 * @param {ExpressResponse} res
*/
exports.outputError = async (err, res) => {
  await _DB.createOrUpdate({ log: { err } }, 'gateway_logs')
  const message = err.message
  res.status(err?.status).json({
      status: err?.status,
      message: emptyString(message) ? 'Internal Server Error' : message
  })
}

/** @param {string} string */
const emptyString = (string) => {
  return (string === undefined || string === '')
}