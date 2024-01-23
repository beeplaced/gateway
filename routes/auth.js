const CustomError = require('../types/customError')
const { grabConfig } = require('../config/readConfig')

const releasedKeys = process.env.RELEASED_KEYS.split(',')
const publicKey = process.env.PUBLIC_KEY
const cronKey = process.env.CRON_KEY // For Cron Task only
const configData = grabConfig()

// /** Decodes and validates Basic Authentication credentials.
//  * @param {string} encodedCredentials - The encoded credentials in the format 'Basic base64(username:password)'.
//  * @throws {CustomError} Throws a CustomError with a 401 status if authentication fails.
//  * @returns {Promise<boolean>} Returns a Promise that resolves to true if authentication is successful.
//  */
// const decodeAuth = async (encodedCredentials) => {
//   if (!encodedCredentials) {
//     throw new CustomError('Authentication failed', 401)
//   }
//   const [authType, base64Credentials] = encodedCredentials.split(' ')

//   console.log(authType)
//   console.log(base64Credentials)

//   if (authType !== 'Basic' || !base64Credentials) {
//     throw new CustomError('Use Basic Authentication', 401)
//   }

//   if (base64Credentials !== 'SWAGGER') {
//     const decodedCredentials = Buffer.from(base64Credentials, 'base64').toString('utf-8')
//     const [decodedUsername, decodedPassword] = decodedCredentials.split(':')

//     // Check the values
//     console.log('Decoded Username:', decodedUsername)
//     console.log('Decoded Password:', decodedPassword)

//     if (decodedUsername !== 'sds-parser' || decodedPassword !== '9T21IFCoJzU4NyR759OQ3zwvMvhMP49R') {
//       throw new CustomError('Authentication failed', 401)
//     }
//   }
//   return true
// }

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
    // case incomingAuth && !incomingApiKey:
    //   auth = await decodeAuth(incomingAuth)
    //   break;
    }
    if (!access) {
      throw new CustomError('Authentication failed', 401) // Unauthorized status code
    }
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
    if (!contentRoute) throw new CustomError('request Missing', 401) // Unauthorized status code
    if (urlParts[2] && contentRoute.services[urlParts[2]]) authService = contentRoute.services[urlParts[2]]
    if (contentRoute.services && !urlParts[2]) authService = contentRoute.services.def
    req.authService = authService
    console.log('authService', authService)
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
