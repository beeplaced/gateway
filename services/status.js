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
            data: {},
            status: 200,
            message: 'the status request of the API-Gateway was successful.'
        }
    }

    /** @param {requestInput} requestInput */
    result = async () => {
        /** @type {ApiResponseInner} */
        return {
            data: [{result: true}],
            status: 200,
            message: 'Example result'
        }
    }

    /** @param {requestInput} requestInput */
    requestMissing = async () => {
        /** @type {ApiResponseInner} */
        return {
            data: {},
            status: 405
        }
    }
}