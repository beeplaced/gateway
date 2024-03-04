const { customError } = require('../types/errorHandling')
const { grabConfig } = require('../config/readConfig')

const RELEASED_KEYS = "68bde212-039e-4247-9934-654e358fed18";
const PUBLIC_KEY = "7d0b2d51-ec70-4076-b02f-109244432a28"
const CRON_KEY = "15ecb123-9085-43ac-8dd4-510f34a06587"

const releasedKeys = RELEASED_KEYS.split(',')
const publicKey = PUBLIC_KEY
const cronKey = CRON_KEY // For Cron Task only
const configData = grabConfig()

/**
 * @param {request} req - The request object from the API.
 * @param {ExpressResponse} res - The response object.
 * @param {*} next
 */
exports.auth = async (req, res, next) => {
  const incomingApiKey = req.headers['x-api-key']
  const { auth } = req.authService
  try {
    let access = false
    switch (true) {
      case auth === 'cron_key' && cronKey === incomingApiKey:
      case auth === 'released_keys' && releasedKeys.includes(incomingApiKey):
      case auth === 'public_key' && publicKey === incomingApiKey:
      case auth === 'test':
        access = true
        break
    }
    if (!access) { throw await customError({ status: 401 }) }
    next()
  } catch (err) {
    const status = err.status || 500
    res.status(err.status || 500).json({ status, auth: false, error: err.message })
  }
}

/**
 * @param {request} req - The request object from the API.
 * @param {ExpressResponse} res - The response object.
 * @param {*} next
 */
exports.service = async (req, res, next) => {
  try {
    const pathname = req._parsedUrl.pathname
    const urlParts = pathname.split('/')
    const request = urlParts[1]
    let authService = {} // Authenticated Service Route
    const contentRoute = configData.routes.find(route => route.path === request)
    if (!contentRoute) throw await customError({ status: 401 }) // Unauthorized status code
    if (urlParts[2] && contentRoute.services[urlParts[2]]) authService = contentRoute.services[urlParts[2]] //Combined URL
    if (contentRoute.services && !urlParts[2]) authService = contentRoute.services.def
    if (!authService.command) authService.command = request
    req.authService = authService
    req.param = {}
    if (authService.parameter) {
      const params = authService.parameter
      params.map(param => {
        if (req.query[param]) {
          req.param[param] = req.query[param]
        }
      })
    }
    next()
  } catch (err) {
    const status = err.status || 500
    res.status(err.status || 500).json({ status, auth: false, error: err.message })
  }
}
