const CustomError = require('../types/customError')
const WorkerPool = require('worker-pool-task-queue')
const TaskPool = new WorkerPool(poolSize = 2, './routes/queue.js', maxWorkers = 10, returnWorker = true)
const { uploadFileChunk } = require('./upload')
const running = { longtask: false }

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

exports.services = async function (req, res, next) {

  const { command } = req

  if (command in running) {
    switch (true) {
      case running[command] === true:
        req.rawdata = {
          status: 409
        }
      next();
      return;
    
      default:
        running[command] = true
        break;
    }
  }

  if (!req || !res) throw new CustomError('nope!', 401)
  /** @type {string} */
  if (emptyString(req.command)) throw new CustomError('command missing', 401)

  switch (true) {
    case req.command === 'filestorage':
      try {
        const startTime = new Date()
        /** @type {ApiResponse} */ const innerResponse = await uploadFileChunk(req, res)
        const endTime = new Date()
        innerResponse.elapsedTime = `${endTime - startTime} ms`
        /** @type {ApiReturn} */ const prep = prepOutput(innerResponse)
        output(prep, req.command, res)
      } catch (err) {
        outputError(err, res)
      }
      break
    default:
    /** @type {requestInput} */
      const requestInput = {
        headers: req.headers,
        method: req.method,
        service: req.service,
        command: req.command
      }

      if (req.body && !isEmptyObject(req.body)) requestInput.body = req.body
      if (!isEmptyObject(req.param)) requestInput.param = req.param
      if (req.curl) requestInput.curl = req.curl
      if (req.command === 'forward') requestInput.request = req.url

      const _inner = async () => {
        try {
          const startTime = new Date() // Record start time
          /** @type {ApiResponse} */ const innerResponse = await TaskPool.runTask(requestInput)
          console.log(innerResponse)
          const endTime = new Date() // Record end time
          innerResponse.elapsedTime = `${endTime - startTime} ms`
          return prepOutput(innerResponse)
        } catch (err) {
          /** @type {*} */
          console.log(err)
          const error = err
          throw new CustomError(error.message, error.status || 500)
        }
      }
      _inner()
        .then(rawdata => {
          req.rawdata = rawdata
          if (command in running) running[command] = false
          next()
        })
        .catch(err => { outputError(err, res) })
      break
  }
}

const prepOutput = (response) => {
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
  return (string === undefined || string === '')
}

/** @param {object} obj */
const isEmptyObject = (obj) => {
  for (const key in obj) {
    if (key in obj) {
      return false
    }
  }
  return true
}
