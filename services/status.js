module.exports = class {

    apistatus = async () => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    data: {},
                    status: 200,
                    message: 'data service reply'
                })
            }, 200)
        })
    }

    /** @param {requestInput} requestInput */
    status = async (requestInput) => {
        const message = 'the status request of the API-Gateway was successful.'
        /** @type {ApiResponseInner} */
        return {
            data: {},
            status: 200,
            message
        }
    }

    /** @param {requestInput} requestInput */
    result = async (requestInput) => {
        const message = 'Example result'
        /** @type {ApiResponseInner} */
        return {
            data: [{result: true}],
            status: 200,
            message
        }
    }

    /** @param {requestInput} requestInput */
    requestMissing = async (requestInput) => {
        /** @type {ApiResponseInner} */
        return {
            data: {},
            status: 405
        }
    }
}