require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./openapi/swagger-generated.json');
const authenticate = require('./routes/auth');
const dist = require('./routes/distribution');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));


// const rateLimit = require('express-rate-limit');

// const app = express();

// // Enable rate limiting middleware
// const apiLimiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, // Limit each IP to 100 requests per windowMs
//     message: 'Too many requests from this IP, please try again after some time.',
// });

// // Apply rate limiter to all routes or specific routes
// app.use(apiLimiter);

//_________________

// const rateLimit = require('express-rate-limit');

// const app = express();

// // Custom rate limiting middleware based on URL host
// const hostRateLimiter = (req, res, next) => {
//     // Extract the host from the incoming request
//     const host = req.get('Host');

//     // Customize rate limiting based on the host
//     // For example, limit to 100 requests per 15 minutes for each host
//     const rateLimitConfig = {
//         windowMs: 15 * 60 * 1000, // 15 minutes
//         max: 100, // Limit each host to 100 requests per windowMs
//         message: 'Too many requests from this host, please try again after some time.',
//     };

//     // Apply rate limiting only for specific hosts
//     if (host === 'allowedhost1.com' || host === 'allowedhost2.com') {
//         const limiter = rateLimit(rateLimitConfig);
//         limiter(req, res, next);
//     } else {
//         // Allow requests for other hosts without rate limiting
//         next();
//     }
// };

// // Apply the custom rate limiter to all routes or specific routes
// app.use(hostRateLimiter);


app.use(express.json());
app.use(authenticate.host);
app.use(authenticate.auth);
app.use(authenticate.service);
app.use(dist.routes);
app.listen(process.env.PORT, () => console.log(`CONTENT GATEWAY @ PORT ${process.env.PORT}`));