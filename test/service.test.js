const { services } = require('../routes/distribution');

// Mock the 'worker-pool-task-queue' module
jest.mock('worker-pool-task-queue', () => {
    return {
        __esModule: true,
        default: jest.fn().mockImplementation(() => ({
            runTask: jest.fn().mockResolvedValue({/* mock response from TaskPool */ }),
            // other methods and properties can be mocked here
        })),
    };
});

const WorkerPool = require('worker-pool-task-queue')
const TaskPool = new WorkerPool(poolSize = 2, '../routes/queue.js', maxWorkers = 10, returnWorker = true)

describe('services', () => {
    // Helper function to set up and run the test
    const setupAndRunTest = async (command) => {
        // ... your existing setup code

        // Call the services function
        await services(req, res, next);

        // Return relevant data for further assertions if needed
        return { req, res, next, TaskPool };
    };

    it('should handle default command with TaskPool.runTask', async () => {
        const { TaskPool } = await setupAndRunTest('defaultCommand');

        // Assert that TaskPool.runTask was called once
        expect(TaskPool.runTask).toHaveBeenCalledTimes(1);
        // Add more assertions based on your expectations
    });

    // Add more test cases for other scenarios if needed

    afterEach(() => {
        jest.clearAllMocks();
    });
});