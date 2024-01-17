require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./openapi/swagger-generated.json');
const authenticate = require('./routes/auth');
const dist = require('./routes/distribution');
const end = require('./routes/output');

const app = express();

// Middleware
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(authenticate.host); // Host Control
app.use(authenticate.path); // get Request path
app.use(authenticate.auth); // Authenticate on Basic or x-api-key
app.use(authenticate.service); // Select and align Service for Request
app.use(dist.services); // Apply Services and return value
app.use(end.output); // Apply Services and return value

// Server Setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`CONTENT GATEWAY @ PORT ${PORT}`);
    console.log("commands: npm run generate - swagger");
    console.log("open Swagger UI: http://localhost:3000/api-docs/");
});