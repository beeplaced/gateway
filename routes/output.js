const CustomError = require('../types/customError')

/**
 * @param {request} req - The request object from the API.
 * @param {ExpressResponse} res - The response object.
 */
exports.output = async (req, res) => {

  const { command, rawdata } = req

  switch (command) {
    default:
      res.status(rawdata.status).json(rawdata)
      break
  }

}
