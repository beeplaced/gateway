const fs = require('fs');

const grabConfig = () => {
    try {
        const filePath = './config/services.json';
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading/parsing JSON file:', error);
        throw error;
    }
};

exports.grabConfig = grabConfig;