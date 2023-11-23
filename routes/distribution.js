const service = require('../services/axios'); const axios = new service();
const status = require('../services/status'); const serviceStatus = new status();
const CustomError = require('../types/customError')

/** @type {statusTitles} */
const statusTitles = {
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  204: 'No Content',
  301: 'No API Route defined',
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  500: 'Internal Server Error'
}
//assign different serviceInstance if needed
const serviceInstances = {
  status: serviceStatus,
};

/**
 * @param {request} req - The request object from the API.
 * @param {ExpressResponse} res - The response object.
 */

exports.routes = async function (req, res) {

  if (!req || !res) throw new CustomError('nope!', 401);
  /** @type {string} */

  if (emptyString(req.command)) throw new CustomError('command missing', 401);

  /** @type {requestInput} */
  const requestInput = { headers: req.headers, method: req.method }

  if (req.body && !isEmptyObject(req.body)) requestInput.body = req.body
  if (req.curl) requestInput.curl = req.curl
  if (req.command === 'forward') requestInput.request = req.url

  const serviceInstance = serviceInstances[req.service] || axios;

  if (!serviceInstance[req.command]) {
    serviceInstance = serviceStatus
    req.command = 'requestMissing'
  }

  const _inner = async () => {
    try {
      const startTime = new Date(); // Record start time
      /** @type {ApiResponse} */
      const { data, status, message } = await serviceInstance[req.command](requestInput)
      const statusText = status && statusTitles[status] ? statusTitles[status] : statusTitles[500]
      switch (status) {
        case 200:
        case 201:
        const endTime = new Date(); // Record end time
        const elapsedTime = endTime - startTime;
        return {
            status,
            statusText,
            duration: `(${elapsedTime} ms) \u{1F60A}`,
            message: req.title ? `${message} | ${req.title}` : message,
            data: !isEmptyObject(data) ? data : undefined
          }
        default:
          throw new CustomError(statusText, status || 500)
      }
    } catch (err) {
      /** @type {*} */
      console.log(err)
      const error = err
      throw new CustomError(error.message, error.status || 500)
    }
  }

  _inner()
    .then(rawdata => { output(rawdata, req.command, res) })
    .catch(err => { outputError(err, res) })
}

/**
 * @param {apiOutputData} data
 * @param {string} command
 * @param {ExpressResponse} res
 */
const output = (data, command, res) => {

  switch (command) {
    default:
      res.status(data.status).json(data)
      break
  }
}

/**
 * @param {apiOutputError} err
 * @param {ExpressResponse} res
*/
const outputError = (err, res) => {

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
  return (string === undefined || string === '');
}

/** @param {object} obj */
const isEmptyObject = (obj) => {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}
