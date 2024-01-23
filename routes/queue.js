const service = require('../services/axios'); const axios = new service();
const Files = require('../services/FileService'); const fileServices = new Files();
const Portal = require('../services/portalService'); const portalService = new Portal();
const status = require('../services/status'); const serviceStatus = new status();
const { parentPort } = require('worker_threads');

//assign different serviceInstance if needed
const serviceInstances = {
    status: serviceStatus,
    files: fileServices,
    portal: portalService
};

parentPort.on('message', async (requestInput) => {
    const { service, command } = requestInput

    let serviceInstance = serviceInstances[service] || axios;
    if (!serviceInstance[command]) {
        serviceInstance = serviceStatus
        requestInput.command = 'requestMissing'
    }
    try {
    console.log(command)
    const res = await serviceInstance[command](requestInput);
    parentPort.postMessage(res); 
    } catch (error) {
        console.log(error)
        parentPort.postMessage({ error: 'error', status: error.status || 300 });
    }
});