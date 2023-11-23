const fs = require('fs');
// const path = require('path');
// const xlsx = require('xlsx');
// const crypto = require('crypto');

// const filesize = size => {
//   const n = parseInt(size, 10) || 0
//   const l = Math.floor(Math.log(n) / Math.log(1024))
//   const unit = (l === 0) ? 'bytes' : (l === 1) ? 'KB' : (l === 2) ? 'MB' : (l === 3) ? 'GB' : 'TB'
//   return (n / Math.pow(1024, l)).toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + unit
// }

module.exports = class {

  async openShaFromServer (sha) {
    try {
      const FILEPATH = `${process.env.UPLOADPATH}/${sha}.pdf`
      return await new Promise((resolve, reject) => {
        fs.readFile(FILEPATH, function (err, res) {
          if (err) {
            reject(err)
          }
          resolve(res)
        })
      })
    } catch (e) { console.log(e) }
  }

}
