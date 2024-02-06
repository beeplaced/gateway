jest.mock('../routes/auth');

const { auth } = require('../routes/auth');

const CustomError = require('../types/customError');

// Mock external dependencies
const cronKey = process.env.CRON_KEY

describe('auth function', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            headers: {},
            authService: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    it('should allow access with valid cron key', async () => {
        req.headers['x-api-key'] = cronKey;
        req.authService.auth = 'cron_key';

        auth.mockImplementation((req, res, next) => {
            console.log(access)
            req.access = true; // Simulate modifying the access variable
            next();
        });

        const a = await auth(req, res, next);

        console.log(a)

        // Expect that the access variable has the expected value
        //expect(access).toBe(true);

       // console.log('Next function arguments:', next.mock);

        // // Ensure the next function was called
        // //expect(next).toHaveBeenCalled();
        // expect(next).toHaveBeenCalledWith(req, res);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });
});












// Mock external dependencies
// const cronKey = 'someCronKey';

// describe('auth function', () => {
//     let req, res, next;

//     beforeEach(() => {
//         req = {
//             headers: {},
//             authService: {}
//         };
//         res = {
//             status: jest.fn().mockReturnThis(),
//             json: jest.fn()
//         };
//         next = jest.fn();
//     });

//     it('should allow access with valid cron key', async () => {
//         req.headers['x-api-key'] = cronKey;
//         req.authService.auth = 'cron_key';

//         await expect(auth(req, res, next)).resolves.toBeUndefined();

//         expect(next).toHaveBeenCalled();
//     });


//     afterEach(() => {
//         jest.restoreAllMocks();
//     });
// });


// it('should deny access with invalid cron key', async () => {
//     req.headers['x-api-key'] = 'invalidKey';
//     req.authService.auth = 'cron_key';

//     await auth(req, res, next);

//     expect(res.status).toHaveBeenCalledWith(401);
//     expect(res.json).toHaveBeenCalledWith(expect.anything());
// });

// More tests for other keys and scenarios

// it('should handle errors', async () => {
//     req.authService.auth = 'test';
//     const error = new CustomError('Error occurred', 500);

//     // Simulate an error
//     jest.spyOn(global, 'next').mockImplementation(() => { throw error; });

//     await auth(req, res, next);

//     expect(res.status).toHaveBeenCalledWith(500);
//     expect(res.json).toHaveBeenCalledWith(expect.anything());
// });
