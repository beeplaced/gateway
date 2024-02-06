const axios = require('axios');

const { customError } = require('../types/errorHandling')

module.exports = class {

    /** @param {requestInput} requestInput */
    fileToPortal = async requestInput => {
        //console.log('requestInput', requestInput)
        const { body, apiUrl } = requestInput
        const headers = { 'x-api-key': `68bde212-039e-4247-9934-654e358fed18` };
        try {
            /** @type {object} */
            let response = {}
            const postData = body || {};
            response = await axios.post(apiUrl, postData, { headers });
            /** @type {ApiResponseInner} */
            const ApiResponseInner = {
                data: response.data || false,
                status: response.status || 300,
            }
            if (response.message) ApiResponseInner.message = response.message
            return ApiResponseInner
        } catch (err) {
            const msg = err.code || 'An error occurred while processing the request.'
            throw new Error(msg);
        }
    }

    /** @param {requestInput} requestInput */
    suppliermail = async requestInput => {
        //connect Content Service
        //Later to be build as an own service
        const { body } = requestInput
        console.log(body)
        const data = await Content.init(body)
        //if false!!!
        /** @type {ApiResponseInner} */
        return {
            data: {},
            status: 200,
            message: 'mail maybe send ;-)'
        }
    }

    /** @param {requestInput} requestInput */
    content = async requestInput => {
        //connect Content Service
        //Later to be build as an own service     
        const data = await Content.grab(requestInput)
        //if false!!!
        /** @type {ApiResponseInner} */
        return {
            data,
            status: 200,
            message: 'data service reply'
        }
    }

    /** @param {requestInput} requestInput */
    default = async requestInput => {
        const message = 'no api route defined yet'
        /** @type {ApiResponseInner} */
        return {
            data: {},
            status: 301,
            message
        }
    }

    /** @param {requestInput} requestInput */
    status = async requestInput => {
        const message = 'the status request of the API-Gateway was successful.'
        /** @type {ApiResponseInner} */
        return {
            data: {},
            status: 200,
            message
        }
    }

        //When sending data in a POST request using Axios, 
        //you typically use the data option instead of params.
        //The data option is used to send the request body data, 
        //while the params option is typically used for query parameters in GET requests.

    /** @param {requestInput} requestInput */
    forward = async requestInput => {//GET //POST
        //console.log('requestInput', requestInput)
        const { curl, method, body=false } = requestInput
        if (!curl || !method) throw new CustomError('parameter missing', 405)
        const apiUrl = curl
        const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"//j.buildJWT();
        const headers = { Authorization: `Bearer ${authToken}` };
        try {
            /** @type {object} */
            let response = {}
            switch (method.toLowerCase()) {
                case 'get':
                const params = { param: 'param' }
                response = await axios.get( apiUrl, { headers, params } );
                break;
                case 'post':
                const postData = body || {};
                response = await axios.post( apiUrl, postData, { headers } );
                break;
            }

            /** @type {ApiResponseInner} */
            const ApiResponseInner = {
                data: response.data || false,
                status: response.status || 300,
            }
            if (response.message) ApiResponseInner.message = response.message
            return ApiResponseInner
        } catch (err) { throw await customError(err) }
    }

}