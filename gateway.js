require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./openapi/swagger-generated.json');
const authenticate = require('./routes/auth');
const dist = require('./routes/distribution');
const end = require('./routes/output');
const access = require('./routes/access');
const app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));// Serve Swagger documentation at /api-docs
// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(access.cors); //CORS and Rate Limiting middleware
app.use(access.guard); // Rate Limiting middleware
app.use(authenticate.service); // Authentication middleware - Select and align Service for Request
app.use(authenticate.auth); // Authentication middleware - Authenticate on Basic or x-api-key
app.use(dist.services); // Distribution middleware - Apply Services and return value
app.use(end.output); // Output middleware - Apply Services and return value

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`CONTENT GATEWAY @ PORT ${PORT}`);
    console.log("commands: npm run generate - swagger");
    console.log("open Swagger UI: http://localhost:3000/api-docs/");
});
