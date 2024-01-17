const fs = require('fs');
const path = require('path');
// const xlsx = require('xlsx');
const crypto = require('crypto');
const DBOPERATIONS = require('../database/DBOperations'); const _DB = new DBOPERATIONS();
const PARSER = require('./parser'); const _PARSER = new PARSER();
const AXIOS = require('../services/axios'); const _axios = new AXIOS();
const mongoose = require('mongoose');


const filesize = size => {
  const n = parseInt(size, 10) || 0
  const l = Math.floor(Math.log(n) / Math.log(1024))
  const unit = (l === 0) ? 'bytes' : (l === 1) ? 'KB' : (l === 2) ? 'MB' : (l === 3) ? 'GB' : 'TB'
  return (n / Math.pow(1024, l)).toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + unit
}

module.exports = class {
  /** @param {requestInput} requestInput */
  showAllFiles = async (requestInput) => {
    console.log(requestInput)
    const { param } = requestInput
    try {
      const allowed = ['.pdf', '.PDF']
      const folderPath = process.env.CONTENTFILEPATH
      const files = await fs.promises.readdir(folderPath);
      const _files = async () => {
        const fill = param?.max ? files.slice(0, param.max) : files
        const retFiles = []
        for (const f in fill) {
          const file = fill[f]
          const filePath = `${folderPath}/${file}`
          const fileparse = path.parse(filePath)
          if (allowed.includes(fileparse.ext)) {
            const stats = await fs.promises.stat(filePath);
            const m = new Date(stats.mtime)
            const filename = path.parse(filePath).name
            retFiles.push({
              file,
              //filePath,
              filename,
              size: filesize(stats.size),
              LastChanged: ('0' + m.getDate()).slice(-2) + '.' + ('0' + (m.getMonth() + 1)).slice(-2) + '.' + m.getFullYear()
            })
          }
        }
        return retFiles
      }
      const ret = await _files();
      /** @type {ApiResponseInner} */
      const ApiResponseInner = {
        data: ret,
        status: ret && ret.length > 0 ? 200 : 300,
        message: 'everything worked fine'
      }
      return ApiResponseInner
    } catch (e) { console.log(e) }
  }

  checkfornewfileandupload = async () => {
    const match = { _id: { $exists: true }, status: 0  }
    const con = 'files'
    const projects = {
      title: 1, sha: 1
    }
    const files = await _DB.findSpecificFields(match, con, projects)
    /** @type {ApiResponse} */
    let ApiResponse = {
      data: [],
      status: 200,
      message: ''
    }

    if (files.length === 0){
      ApiResponse.message = 'No files to upload'
      return ApiResponse
    }

    ApiResponse.data = await Promise.all(files.map(async file => {
      const { _id } = file;
      try {
        const upFile = await _axios.fileToPortal({
          apiUrl: `http://localhost:5000/gateway/upload`,
          body: { _id: _id.toString() }
        });
        return upFile.data
      } catch (err) {
        return { status: 300, err: err.message, file: file.title };
      }
    }));

  ApiResponse.status = 200
  ApiResponse.message = 'Upload to portal'
  return ApiResponse
  }

  checkfornewfileandparse = async() => {
    const match = { _id: { $exists: true }, status: { status: 0 } }
      const con = 'msdsd'
      const projects = {
        status: 1
      }
      const files = await _DB.findSpecificFields(match, con, projects)

    /** @type {ApiResponse} */
    let ApiResponse = {
      data: [],
      status: 200,
      message: ''
    }

    if (files.length === 0) {
      ApiResponse.message = 'No files to parse'
      return ApiResponse
    }

    ApiResponse.data = await Promise.all(files.map(async file => {
      const { _id } = file;
      try {
        const upFile = await _axios.fileToPortal({
          apiUrl: `http://localhost:5000/gateway/parse`,
          body: {
            rowID: _id.toString(),
            settings: { parserbackup: 1, simthresholdhigh: 1 } }
        });
        return upFile.data
      } catch (err) {
        return { status: 300, err: err.message, file: file.title };
      }
    }));

    ApiResponse.status = 200
    ApiResponse.message = 'Content Portal Parser API'
    return ApiResponse
  }

  checkforfilestoparse = async () => {
    const match = { _id: { $exists: true }, status: { status: 0 }
   }
    const con = 'msdsd'
    const projects = {
      _id: { $toString: "$_id" },
      index: 1, 
      status: 1 
    }
    const files = await _DB.findSpecificFields(match, con, projects)

    /** @type {ApiResponse} */
    let ApiResponse = {
      data: [],
      status: 200,
      message: ''
    }

    if (files.length === 0) {
      ApiResponse.message = 'No files to parse'
      return ApiResponse
    }

    ApiResponse.data = files

    ApiResponse.status = 200
    ApiResponse.message = 'Content Portal Parser API'
    return ApiResponse
  }

  longtask = async () => {
    /** @type {ApiResponse} */
    let ApiResponse = {
      data: [],
      status: 200,
      message: 'task already running'
    };
      const timeoutPromise = new Promise((resolve) => {
        setTimeout(() => {
          resolve(); // Resolve the promise after 10 seconds
        }, 5000); // 10 seconds in milliseconds

        // Make sure to clearTimeout if your existing logic completes before the timeout
        // Uncomment the line below if you need to clear the timeout when your logic finishes
        // clearTimeout(timeoutId);
      });

      try {
        // Start the timeout and wait for it to finish
        await timeoutPromise;
      } catch (error) {
        // Handle errors if necessary
      }
      ApiResponse.status = 200;
      ApiResponse.message = 'Task executed';
      return ApiResponse;
  };

}
