const cuid = require('cuid')
const config = require('../config')
const httpStatus = require('../util/http-util').statusCode

class GeneralSetting {

    constructor(conn) {
        if (!conn) {
            throw new Error(`GeneralSetting construct failed: connection is null`)
        }
        this.conn = conn
        this.dbLink = `dbs/${config.database.name}`
        this.collectionLink = `${this.dbLink}/colls/${config.table.general_settings}`
    }

    getGeneralSettingsById(id) {
        if (!id) {
            return Promise.reject(new Error('id must not be empty'))
        }

        return new Promise((resolve, reject) => {
            const docLink = `${this.collectionLink}/docs/${id}`
            this.conn.readDocument(docLink, (err, doc) => {
                if (err) {
                    if (err.code === httpStatus.not_found) {
                        resolve({})
                    } else {
                        reject(err)
                    }
                } else {
                    resolve(doc)
                }
            })
        })
    }

    saveGeneralSettings(settings) {
        if (!isSettingsValid(settings)) {
            return Promise.reject(new Error('invalid general settings'))
        }

        return new Promise((resolve, reject) => {
            const docLink = `${this.collectionLink}/docs/${settings.id}`
            this.conn.readDocument(docLink, (err, docs) => {
                if (err) {
                    if (err.code === httpStatus.not_found) {
                        this.conn.createDocument(this.collectionLink, Object.assign({}, settings), (err, doc) => {
                            if (err) {
                                reject(new Error(`saveGeneralSettings failed: ${err.message}`))
                            } else {
                                resolve(doc)
                            }
                        })
                    } else {
                        reject(err)
                    }
                } else {
                    this.conn.replaceDocument(docLink, Object.assign({}, settings), (err, doc) => {
                        if (err) {
                            reject(new Error(`updateGeneralSettings failed: ${err.message}`))
                        } else {
                            resolve(doc)
                        }
                    })
                }
            })
        })
    }
}

function isSettingsValid(settings) {
    if (!settings) {
        return false
    }

    return (
        settings.jpcHost &&
        settings.jpcPort &&
        settings.ccHost &&
        settings.ccPort &&
        settings.clientId &&
        settings.clientKey
    )
}

module.exports = GeneralSetting