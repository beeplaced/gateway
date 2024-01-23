const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
const DBOPERATIONS = require('../database/DBOperations'); const _DB = new DBOPERATIONS();

const hostLocker = require('host-locker')
const hl = new hostLocker({
    maxCallThreshold: 10,
    secondsThreshold: 5,
    allowedOrigins
})

/**
 * @param {request} req - The request object from the API.
 * @param {ExpressResponse} res - The response object.
 */
exports.guard = async (req, res, next) => {
    const senderOrigin = req.headers.origin;
    if (!hl.check(senderOrigin)) {
      res.status(403).json({ status: 403, auth: 'access denied, too many requests' }) //Too many requestst
      return
    }
    next();
}

exports.cors = async (req, res, next) => {
    const origin = req.headers.origin;
    await _DB.createOrUpdate({
        log: {
            "req.headers": req.headers
        }
    }, 'gateway_logs')
    if (!allowedOrigins.includes(origin)) {
        res.status(403).json({ status: 403, auth: 'access denied' }) //Too many requestst
        return
    }
    
    res.header("Access-Control-Allow-Origin", origin);
    //res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, Accept, Accept-Version, Content-Length, Content-Type, Date, X-Api-Version, X-Response-Time, x-api-key"
    );
    res.header("Access-Control-Allow-Methods", "GET,POST");
    res.header("Content-Type", "application/json");
    res.header("Access-Control-Allow-Credentials", false);

    if (req.method === "OPTIONS") {
        res.status(200).end();
        return;
    }

    next();
}