/** Swagger annotations
 * @swagger
 * /jsonplaceholder/comments:
 *   get:
 *     summary: Get comments from jsonplaceholder.
 *     description: |
 *       Retrieve comments from the jsonplaceholder API.
 *
 *       **Example Authorization Header:**
 *       ```
 *       x-api-key: 68bde212-039e-4247-9934-654e358fed18 (universal key with limited access)
 *       ```
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 // Define properties based on your response
 */

/**
 * @swagger
 * /jsonplaceholder/albums:
 *   get:
 *     summary: Get albums from jsonplaceholder.
 *     description: |
 *       Retrieve albums from the jsonplaceholder API.
 * 
 *       **Example Authorization Header:**
 *       ```
 *       x-api-key: 68bde212-039e-4247-9934-654e358fed18 (universal key with limited access)
 *       ```
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 // Define properties based on your response
 */

/**
 * @swagger
 * /jsonplaceholder/photos:
 *   get:
 *     summary: Get photos from jsonplaceholder.
 *     description: Retrieve photos from the jsonplaceholder API.
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 // Define properties based on your response
 */

/**
 * @swagger
 * /status:
 *   get:
 *     summary: Get health of Content Gateway as status.
 *     description: |
 *       Retrieve status information.
 *
 *       **Example Authorization Header:**
 *       ```
 *       x-api-key: 68bde212-039e-4247-9934-654e358fed18 (universal key with limited access)
 *       ```
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the operation
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: A description of the error
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                   example: 401
 *                 auth:
 *                   type: boolean
 *                   description: Authentication status
 *                   example: false
 *                 error:
 *                   type: string
 *                   description: Details about the unauthorized request
 *                   example: Authentication failed
 *       '404':
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Details about the resource not being found
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Details about the internal server error
 *     security:
 *       - apiKeyAuth: []
 */


// Additional routes can be added based on your actual routes
