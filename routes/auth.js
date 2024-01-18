const CustomError = require('../types/customError')
const { grabConfig } = require('../config/readConfig')
const hostLocker = require('host-locker')
const hl = new hostLocker({
  maxCallThreshold: 10,
  secondsThreshold: 5,
  allowedHosts: process.env.ALLOWED_HOSTS.split(',')
})

const releasedKeys = process.env.RELEASED_KEYS.split(',')
const publicKey = process.env.PUBLIC_KEY
const cronKey = process.env.CRON_KEY //For Cron Task only
const { URL } = require('url')
const configData = grabConfig()

/** Decodes and validates Basic Authentication credentials.
 * @param {string} encodedCredentials - The encoded credentials in the format 'Basic base64(username:password)'.
 * @throws {CustomError} Throws a CustomError with a 401 status if authentication fails.
 * @returns {Promise<boolean>} Returns a Promise that resolves to true if authentication is successful.
 */
const decodeAuth = async (encodedCredentials) => {
  if (!encodedCredentials) {
    throw new CustomError('Authentication failed', 401)
  }
  const [authType, base64Credentials] = encodedCredentials.split(' ')

  console.log(authType)
  console.log(base64Credentials)

  if (authType !== 'Basic' || !base64Credentials) {
    throw new CustomError('Use Basic Authentication', 401)
  }

  if (base64Credentials !== 'SWAGGER') {
    const decodedCredentials = Buffer.from(base64Credentials, 'base64').toString('utf-8')
    const [decodedUsername, decodedPassword] = decodedCredentials.split(':')

    // Check the values
    console.log('Decoded Username:', decodedUsername)
    console.log('Decoded Password:', decodedPassword)

    if (decodedUsername !== 'sds-parser' || decodedPassword !== '9T21IFCoJzU4NyR759OQ3zwvMvhMP49R') {
      throw new CustomError('Authentication failed', 401)
    }
  }
  return true
}

/**
 * @param {request} req - The request object from the API.
 * @param {ExpressResponse} res - The response object.
 * @param {*} next
 */
exports.host = async (req, res, next) => {
  const host = req.get('Host')
  const { hostname } = new URL(`http://${host}`)

  if (!hl.check(hostname)) {
    res.status(403).json({ status: 403, auth: 'access denied' }) //Too many requestst
    return
  }
  next();
}

/**
 * @param {request} req - The request object from the API.
 * @param {ExpressResponse} res - The response object.
 * @param {*} next
 */
exports.auth = async (req, res, next) => {
  const incomingApiKey = req.headers['x-api-key']
  const incomingAuth = req.headers.authorization

  try {
  console.log('req.auth',req.auth)
  console.log(incomingApiKey)
  let auth = false

  switch (true) {
    case req.auth === 'cron_key' && cronKey === incomingApiKey:
    case req.auth === 'released_keys' && releasedKeys.includes(incomingApiKey):
    case req.auth === 'public_key' && publicKey === incomingApiKey:
      auth = true
      break;
    case incomingAuth && !incomingApiKey:
      auth = await decodeAuth(incomingAuth)
      break;
  }
    if (!auth) {
      throw new CustomError('Authentication failed', 401) // Unauthorized status code
    }
    next()
  } catch (err) {
    console.log(err)
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
    if (!contentRoute) throw new CustomError('request Missing', 401) // Unauthorized status code
    if (urlParts[2] && contentRoute.services[urlParts[2]]) authService = contentRoute.services[urlParts[2]]
    if (contentRoute.services && !urlParts[2]) authService = contentRoute.services.def
    //Empty Object????????????????!!!!!!!!!!!!!!!!!
    if (!authService) throw new CustomError('request Missing', 401) // Unauthorized status code
    if (authService.title) req.title = authService.title
    if (authService.curl) req.curl = authService.curl
    req.auth = authService.auth || 'released_keys'
    req.command = authService.command || contentRoute.path || false
    req.service = authService.serviceInstance || 'axios'
    req.transformations = authService.transformations || {}
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
    console.log(err)
    const status = err.status || 500
    res.status(err.status || 500).json({ status, auth: false, error: err.message })
  }
}
