const CustomError = require('../types/customError');
const DBOPERATIONS = require('../database/DBOperations'); const _DB = new DBOPERATIONS();

/** @type {statusTitles} */
const statusTitles = {
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  204: 'No Content',
  205: 'No Files available',
  300: 'An error occured',
  301: 'No API Route defined',
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  409: 'already running',
  500: 'Internal Server Error'
}

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

exports.prepOutput = (response) => {
  /** @type {ApiResponse} */ const { data, status, message, elapsedTime } = response
  const statusText = status && statusTitles[status] ? statusTitles[status] : statusTitles[500]
  let ret = {}
  switch (status) {
    case 200:
    case 201:
    case 409:
      /** @type {ApiReturn} */ ret = {
        status,
        duration: `${elapsedTime} \u{1F60A}`,
        message: message ? `${statusText} - ${message}` : statusText,
      }
      if (Array.isArray(data)) {
        ret.amount = data.length
      }
      ret.result = data
      return ret
    default:
      throw new CustomError(statusText, status || 500)
  }
}


/**
 * @param {apiOutputError} err
 * @param {ExpressResponse} res
*/
exports.outputError = async (err, res) => {
  await _DB.createOrUpdate({
    log: {
      err
    }
  }, 'gateway_logs')
  const message = err.message
  res.status(err?.status).json({
    data: {
      status: err?.status,
      error: emptyString(message) ? 'Internal Server Error' : message
    }
  })
}

/** @param {string} string */
const emptyString = (string) => {
  return (string === undefined || string === '')
}


