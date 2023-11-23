const swaggerJsdoc = require('swagger-jsdoc');
const fs = require('fs');

// Your Swagger annotations
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Gateway Swagger',
            version: '1.0.0',
            description: 'API Gateway documentation',
        },
    },
    apis: ['./openapi/doc.js'], // Adjust the path to your doc.js file
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Write the Swagger JSON to a file
const outputFilePath = './openapi/swagger-generated.json'; // Adjust the file path
fs.writeFileSync(outputFilePath, JSON.stringify(swaggerSpec, null, 2));

console.log(`Swagger JSON file generated at: ${outputFilePath}`);