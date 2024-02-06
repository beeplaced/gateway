const DBOPERATIONS = require('../database/DBOperations'); const _DB = new DBOPERATIONS();

const service = require('shaify-upload')
const _service = new service({
  uploadPath: process.env.UPLOADPATHTEMP,
  allowedMimeTypes: ['application/pdf'],
  mb: 8 //max filesize in mb (default 8)
})

/**
 * @param {request} req - The request object from the API.
 * @param {ExpressResponse} res - The response object.
 */
module.exports.uploadFileChunk = async (req, res) => {
  try {
  return new Promise((resolve, reject) => {
    _service.upload.single('file')(req, res, async (err) => {
      try {
      if (err) {
        console.log(err)
        return reject({
          data: {},
          status: 300,
          message: 'upload DB_buffer failed'
        });
      }
      const shaify = await _service.shaify(req.file)
      const filename = shaify.originalname
      const sha = shaify.sha
      const size = shaify.size
      const extension = shaify.mimetype
      const filebody = shaify.buffer
      const meta = {}
        if (req.headers.crawler) meta.crawler = req.headers.crawler
        if (req.headers.url) meta.url = req.headers.url

      const upload = await _DB.createOrUpdate({
        title: filename,
        sha,
        size,
        meta,
        file: {
          data: filebody,
          contentType: extension, // Adjust the content type as needed
        }
      }, 'files')

      /** @type {ApiResponse} */ const ApiResponse = {
        data: { filename, sha, size, extension, upload },
        status: 200,
        message: 'upload DB_buffer'
      }
      resolve(ApiResponse);

      } catch (err) {
        reject (err)
      }
    });
  });
  } catch (error) {
    return error
  }
  }

