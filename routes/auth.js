const CustomError = require('../types/customError')
const { grabConfig } = require('../config/readConfig');
const hostLocker = require('host-locker');
const hl = new hostLocker({
    maxCallThreshold: 5,
    secondsThreshold: 5,
    allowedHosts: ['localhost']
});

const { parse } = require('url');

const configData = grabConfig();

const decodeAuth = async (encodedCredentials) => {
    if (!encodedCredentials) {
        throw new CustomError('Authentication failed', 401);
    }
    const encodedCredentialSplit = encodedCredentials.split(' ')
    if (!encodedCredentialSplit[1]) {
        throw new CustomError('use base64Credentials', 401);
    }
    const base64Credentials = encodedCredentials.split(' ')[1];
    const decodedCredentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [decodedUsername, decodedPassword] = decodedCredentials.split(':');

    // Check the values
    console.log('Decoded Username:', decodedUsername);
    console.log('Decoded Password:', decodedPassword);

    if (decodedUsername !== 'test' || decodedPassword !== '123'){
      //  throw new CustomError('Authentication failed', 401);
    }
}

/**
 * @param {request} req - The request object from the API.
 * @param {ExpressResponse} res - The response object.
 * @param {*} next
 */
exports.host = async (req, res, next) => {
    const host = req.get('Host');
    const { hostname } = parse(`http://${host}`);

    if (!hl.check(hostname)) {
        res.status(403).json({ status: 403, auth: 'access denied' });
        return
    }
    next();
};

/**
 * @param {request} req - The request object from the API.
 * @param {ExpressResponse} res - The response object.
 * @param {*} next
 */
exports.auth = async (req, res, next) => {
    try {
        if (!req.headers || !req.headers.authorization) {
            throw new CustomError('Authentication failed', 401); // Unauthorized status code
        }
        const encodedCredentials = req.headers.authorization;
        await decodeAuth(encodedCredentials)
        next();
    } catch (err) {
        console.log(err)
        const status = err.status || 500
        res.status(err.status || 500).json({ status, auth: false, error: err.message });
    }
};

/**
 * @param {request} req - The request object from the API.
 * @param {ExpressResponse} res - The response object.
 * @param {*} next
 */
exports.service = async (req, res, next) => {
    try {
        const urlParts = req.url.split('/'); //CHECK ALL REQ !!!!!!!!!!!!!!!
        const request = urlParts[1];
        let authService = {} //Authenticated Service Route
        const contentRoute = configData.routes.find(route => route.path === request);

        if (!contentRoute) {
            throw new CustomError('request Missing', 401); // Unauthorized status code
        }

        if (urlParts[2] && contentRoute.services[urlParts[2]]) {
            console.log('many', contentRoute.services[urlParts[2]])
            authService = contentRoute.services[urlParts[2]]
        }

        if (contentRoute.services && !urlParts[2]) {
            //console.log('one', contentRoute.services.def)
            authService = contentRoute.services.def
        }

        if (!authService) {
            throw new CustomError('request Missing', 401); // Unauthorized status code
        }

        if (authService.title) req.title = authService.title;
        req.curl = authService.curl || false;
        req.command = authService.command || false;
        req.service = authService.serviceInstance || 'axios';
        req.transformations = authService.transformations || {};
        next();
    } catch (err) {
        console.log(err)
        const status = err.status || 500
        res.status(err.status || 500).json({ status, auth: false, error: err.message });
    }
}