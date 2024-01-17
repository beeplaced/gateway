// jsdocs

/**
 * @typedef {Object} ApiResponse
 * @property {object|Array<any>} data - The response data (you can specify a more specific type here if known).
 * @property {number} status - The HTTP status code.
 * @property {string} [message] - The HTTP status text.
 * @property {string} [elapsedTime]
 */

/**
 * @typedef {Object} ApiReturn
 * @property {number} status
 * @property {Array<any>} result
 * @property {string} message
 * @property {string} [worker]
 * @property {number} [amount]
 * @property {string} [duration]
*/

/**
 * @typedef {Object} request
 * @property {object} headers
 * @property {object} headers.authorization
 * @property {string} command
 * @property {string} method
 * @property {string} service
 * @property {string} url
 * @property {string} request
 * @property {ApiReturn} rawdata
 * @property {object} [urlParts]
 * @property {object} [body]
 * @property {string} [curl]
 * @property {object} [param]
 * @property {string} [title]
 * @property {object} [transformations]
 */


/**
 * @typedef {Object} requestInput
 * @property {object} headers
 * @property {string} method
 * @property {object} [body]
 * @property {string} [curl]
 * @property {string} [request]
 * @property {string} [command]
 * @property {string} [service]
 */

/**
 * The HTTP response status setter function.
 *
 * @function
 * @name responseStatusSetter
 * @param {number} code - The HTTP status code to set.
 * @returns {Object} - The response object with the updated status code.
 * @throws {TypeError} - If the provided code is not a number or is not a valid HTTP status code.
 */

/**
 * @typedef {Object} ExpressResponse
 * @property {*} status - The HTTP response status setter function.
 * @property {*} json - The HTTP response status setter function.
 */

/**
* @typedef { Object.<number, string> } statusTitles - Object containing error titles for different HTTP statuses.
*/

/**
 * @typedef {Object} apiOutputError
 * @property {number} [status=500]
 * @property {string} message
*/