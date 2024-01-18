const DBOPERATIONS = require('../database/DBOperations'); const _DB = new DBOPERATIONS();

module.exports = class {

    checkfilestoparse = async () => {
        const match = {
            _id: { $exists: true }, 
            //status: { status: 0 }
        }
        const con = 'msdsd'
        const projects = {
            _id: { $toString: "$_id" },
            index: 1,
            status: 1,
            packages: 1
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
        ApiResponse.message = 'Content Portal - grab all files to parse (status: 0)'
        return ApiResponse
    }

    readparseres = async (requestInput) => {
        let match = { _id: { $exists: true } }
        console.log(requestInput)
        // match.status = 0
        if (requestInput.param) {
            Object.keys(requestInput.param).map(param => {
                match[`parserres.${param}`] = { $regex: requestInput.param[param], $options: 'i' }
            })
        }
        console.log(match)
        const con = 'presBackup'
        const projects = {
            _id: { $toString: "$_id" },
            parserres: 1,
            sha: 1,
            synced: 1 
        }
        const backups = await _DB.findSpecificFields(match, con, projects)
        /** @type {ApiResponse} */
        let ApiResponse = {
            data: [],
            status: 200,
            message: ''
        }

        if (backups.length === 0) {
            ApiResponse.message = 'No backups to available'
            return ApiResponse
        }

        ApiResponse.data = backups
        ApiResponse.status = 200
        ApiResponse.message = 'backups'
        return ApiResponse
    }

    newfiles = async (requestInput) => {
        let match = { _id: { $exists: true } }
        //match.status = 0
        if (requestInput.param) {
            Object.keys(requestInput.param).map(p => {
                match[p] = { $regex: requestInput.param[p], $options: 'i' }
            })
        }
        const con = 'files'
        const projects = {
            _id: 0,
            title: 1, sha: 1, size: 1
        }
        const files = await _DB.findSpecificFields(match, con, projects)
        /** @type {ApiResponse} */
        let ApiResponse = {
            data: [],
            status: 200,
            message: ''
        }

        if (files.length === 0) {
            ApiResponse.message = 'No files to available'
            return ApiResponse
        }

        ApiResponse.data = files
        ApiResponse.status = 200
        ApiResponse.message = 'New files waiting for upload'
        return ApiResponse
    }

}