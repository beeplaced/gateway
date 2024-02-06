const DBOPERATIONS = require('../database/DBOperations'); const _DB = new DBOPERATIONS()
const { statusTitles } = require('./statusTitles')

exports.customError = async (error) => {
    console.log('error', error)

    const { status, message } = error;
    await _DB.createOrUpdate({ log: { error } }, 'gateway_logs')
    if (status) {
        const errMessage = message ? message : (statusTitles[status] || 'An error occurred');
        const cError = new Error(errMessage);
        cError.status = status; // Set the desired status code

        throw cError;
    } else {
        throw error; // Rethrow the original error if status and message are not available
    }
};