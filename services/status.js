const { name, version, description } = require('../package.json')
// Record the start time when the service starts
const startTime = new Date();

// Function to calculate uptime
const calculateUptime = () => {
    const currentTime = new Date();
    const uptimeMilliseconds = currentTime - startTime;

    // Convert uptime to a human-readable format
    const uptimeInSeconds = Math.floor(uptimeMilliseconds / 1000);
    const hours = Math.floor(uptimeInSeconds / 3600);
    const minutes = Math.floor((uptimeInSeconds % 3600) / 60);
    const seconds = uptimeInSeconds % 60;

    return { hours, minutes, seconds };
}

// Example usage
const uptime = calculateUptime();

module.exports = class {

    test = async () => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    data: {},
                    status: 200,
                    message: 'data service reply timeout'
                })
            }, 200)
        })
    }

    /** @param {requestInput} requestInput */
    status = async () => {
        /** @type {ApiResponseInner} */
        return {
            data: { name, version, description, uptime: calculateUptime() },
            status: 200,
        }
    }

    /** @param {requestInput} requestInput */
    health = async () => {
        /** @type {ApiResponseInner} */
        return {
            message: 'health',
            status: 200,
        }
    }

    /** @param {requestInput} requestInput */
    error = async () => {
        /** @type {ApiResponseInner} */
        return {
            status: 500,
        }
    }

    // /** @param {requestInput} requestInput */
    // result = async () => {
    //     /** @type {ApiResponseInner} */
    //     return {
    //         data: [{result: true}],
    //         status: 200,
    //         message: 'Example result'
    //     }
    // }

    // /** @param {requestInput} requestInput */
    // requestMissing = async () => {
    //     /** @type {ApiResponseInner} */
    //     return {
    //         data: {},
    //         status: 405
    //     }
    // }
}