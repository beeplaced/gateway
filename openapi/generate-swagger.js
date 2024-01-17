const swaggerJsdoc = require('swagger-jsdoc');
const fs = require('fs');

// const swaggerOptions = {
//     definition: {
//         openapi: '3.0.0',
//         info: {
//             title: 'API Gateway Swagger',
//             version: '1.0.0',
//             description: 'API Gateway documentation',
//         },
//         components: {
//             securitySchemes: {
//                 bearerAuth: {
//                     type: 'http',
//                     scheme: 'bearer',
//                 },
//             },
//         },
//     },
//     apis: ['./openapi/doc.js'], // Adjust the path to your doc.js file
// };

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Gateway Swagger',
            version: '1.0.0',
            description: 'API Gateway documentation',
        },
        components: {
            securitySchemes: {
                apiKeyAuth: {
                    type: 'apiKey',
                    in: 'header', // or 'query' depending on how you pass the API key
                    name: 'x-api-key', // the name of the header or query parameter
                },
            },
        },
        security: [{ apiKeyAuth: [] }], // Security requirement for all endpoints
    },
    apis: ['./openapi/doc.js'], // Adjust the path to your doc.js file
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Write the Swagger JSON to a file
const outputFilePath = './openapi/swagger-generated.json'; // Adjust the file path
fs.writeFileSync(outputFilePath, JSON.stringify(swaggerSpec, null, 2));

console.log(`Swagger JSON file generated at: ${outputFilePath}`);