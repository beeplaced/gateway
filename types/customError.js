// customError.js
/**
 * Custom error class that extends Error and includes a status code.
 */
class CustomError extends Error {
    /**
     * Create a custom error.
     * @param {string} message - The error message.
     * @param {number} [status=500] - The HTTP status code (default is 500).
     */
    constructor(message, status = 500) {
        super(message);
        this.status = status;
        this.name = this.constructor.name; // Set the error name to the class name
        Error.captureStackTrace(this, this.constructor); // Capture the stack trace
    }
    /**
     * @typedef {Object} apiCustomerError
     * @property {object} headers
     * @property {string|number} code
     * @property {object} [response]
     * @property {number} [response.status]
     * @property {string} [response.statusText]
     */

    /**
     * The HTTP response status setter function.
     *
     * @function
     * @name apiCustomerError
     * @param {apiCustomerError} error - The HTTP status code to set.
     * @returns {Object} - The response object with the updated status code.
     * @throws {TypeError} - If the provided code is not a number or is not a valid HTTP status code.
     */
    static apiCustomerError(error) {
        //console.log(error.code)
        let status = 500
        let statusText = 'apiCustomerError'
        switch (error.code) {
            case "ECONNREFUSED":
                statusText = 'Service not available | Server Not Running'
                break;
            default:
            if (error.response?.status) status = error.response.status;
            if (error.response?.statusText) statusText = error.response.statusText;
            break;
        }
        throw new CustomError(statusText, status);
    }

}

module.exports = CustomError;