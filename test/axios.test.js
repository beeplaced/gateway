const axios = require('axios');
const service = require('../services/axios'); const { forward } = new service();
const { customError } = require('../types/errorHandling')
// Mock the axios module
jest.mock('axios');

describe('forward function', () => {
    it('should handle GET request successfully', async () => {
        const apiUrl = 'https://example.com/api';
        const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
        const headers = { Authorization: `Bearer ${authToken}` };

        // Mock the axios.get method to return a response
        axios.get.mockResolvedValue({
            data: { exampleData: 'some data' },
            status: 200,
        });

        const requestInput = {
            curl: apiUrl,
            method: 'GET',
        };

        const result = await forward(requestInput);

        expect(result).toEqual({
            data: { exampleData: 'some data' },
            status: 200,
        });

        // Ensure axios.get was called with the correct arguments
        expect(axios.get).toHaveBeenCalledWith(apiUrl, { headers, params: { param: 'param' } });
    });

    it('should handle POST request successfully', async () => {
        const apiUrl = 'https://example.com/api';
        const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
        const headers = { Authorization: `Bearer ${authToken}` };

        // Mock the axios.post method to return a response
        axios.post.mockResolvedValue({
            data: { exampleData: 'some data' },
            status: 201,
        });

        const requestInput = {
            curl: apiUrl,
            method: 'POST',
            body: { postData: 'some data' },
        };

        const result = await forward(requestInput);

        expect(result).toEqual({
            data: { exampleData: 'some data' },
            status: 201,
        });

        // Ensure axios.post was called with the correct arguments
        expect(axios.post).toHaveBeenCalledWith(apiUrl, requestInput.body, { headers });
    });

    it('should handle a 500 error and throw a CustomError with status 500', async () => {
        const apiUrl = 'https://example.com/api';

        // Mock the axios.post method to throw a 500 error
        axios.post.mockRejectedValue({ response: { status: 500 } });

        const requestInput = {
            curl: apiUrl,
            method: 'POST',
            body: { postData: 'some data' },
        };

        try {
            await forward(requestInput);
            // If the function did not throw, fail the test explicitly
            expect(true).toBe(false);
        } catch (error) {
            // Check if the error has a response property
            const status = error.response ? error.response.status : undefined;

            // Use the customError function to process and rethrow the error
            try {
                customError({ status });
            } catch (customError) {
                console.log(Object.keys(customError), customError)
                // Check if the rethrown error has the expected status
                expect(customError.status).toBe(500);
            }
        }
    });
});



