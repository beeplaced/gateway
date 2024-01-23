const CustomError = require('../types/customError')
const WorkerPool = require('worker-pool-task-queue')
const TaskPool = new WorkerPool(poolSize = 2, './routes/queue.js', maxWorkers = 10, returnWorker = true)
const { uploadFileChunk } = require('./upload')
const running = { longtask: false }
const { output, prepOutput, outputError } = require('./output')
const DBOPERATIONS = require('../database/DBOperations'); const _DB = new DBOPERATIONS()

/**
 * @param {request} req - The request object from the API.
 * @param {ExpressResponse} res - The response object.
 */
exports.services = async function (req, res, next) {
  const { headers, authService, body = false, param = false } = req
  const { method, serviceInstance, command, curl } = authService
  const service = serviceInstance || 'axios'

  if (command in running) {
    switch (true) {
      case running[command] === true:
        req.rawdata = {
          status: 409
        }
        next()
        return
      default:
        running[command] = true
        break
    }
  }

  if (!req || !res) throw new CustomError('nope!', 401)
  /** @type {string} */ if (emptyString(command)) throw new CustomError('command missing', 401)

  switch (true) {
    case command === 'filestorage':
      try {
        const startTime = new Date()
        /** @type {ApiResponse} */ const innerResponse = await uploadFileChunk(req, res)
        console.log('innerResponse', innerResponse)
        const endTime = new Date()
        innerResponse.elapsedTime = `${endTime - startTime} ms`
        /** @type {ApiReturn} */ req.rawdata = prepOutput(innerResponse)
        output(req, res)
      } catch (err) {
        outputError(err, res)
      }
      break
    default:
    /** @type {requestInput} */ const requestInput = { headers, method, service, command }
      if (body && !isEmptyObject(body)) requestInput.body = body
      if (param && !isEmptyObject(param)) requestInput.param = param
      if (command === 'forward') requestInput.curl = curl

      const _inner = async () => {
        try {
          const startTime = new Date() // Record start time
          /** @type {ApiResponse} */ const innerResponse = await TaskPool.runTask(requestInput)
          const endTime = new Date() // Record end time
          innerResponse.elapsedTime = `${endTime - startTime} ms`
          return prepOutput(innerResponse)
        } catch (err) {
          /** @type {*} */
          console.log(err)
          await _DB.createOrUpdate({
            log: {
              err
            }
          }, 'gateway_logs')
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
