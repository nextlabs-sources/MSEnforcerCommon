const cuid = require('cuid')
const config = require('../config')
const httpStatus = require('../util/http-util').statusCode

class UserAttribute {

    constructor(conn) {
        if (!conn) {
            throw new Error(`UserAttribute construct failed: connection is null`)
        }
        this.conn = conn
        this.dbLink = `dbs/${config.database.name}`
        this.collectionLink = `${this.dbLink}/colls/${config.table.user_attributes}`
    }

    getUserAttributesById(id) {
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

    getEnforcedUserAttributesById(id) {
        if (!id) {
            return Promise.reject(new Error('id must not be empty'))
        }
        
        return new Promise((resolve, reject) => {
            const docLink = `${this.collectionLink}/docs/${id}`
            this.conn.readDocument(docLink, (err, doc) => {
                if(err) {
                    if(err.code === httpStatus.not_found){
                        resolve([])
                    } else {
                        reject(err)
                    }
                } else {
                    resolve(doc.attributes)
                }
            })
        })
    }

    saveUserAttributes(infos) {
        if (!isAttrsValid(infos)) {
            return Promise.reject(new Error('invalid user attributes'))
        }

        return new Promise((resolve, reject) => {
            const docLink = `${this.collectionLink}/docs/${infos.id}`
            this.conn.readDocument(docLink, (err, docs) => {
                if (err) {
                    if (err.code === httpStatus.not_found) {
                        this.conn.createDocument(this.collectionLink, Object.assign({}, infos), (err, doc) => {
                            if (err) {
                                reject(new Error(`create user_attributes failed: ${err.message}`))
                            } else {
                                resolve(doc)
                            }
                        })
                    } else {
                        reject(err)
                    }
                } else {
                    this.conn.replaceDocument(docLink, Object.assign({}, infos), (err, doc) => {
                        if (err) {
                            reject(new Error(`update user_attributes failed: ${err.message}`))
                        } else {
                            resolve(doc)
                        }
                    })
                }
            })
        })
    }
}

function isAttrsValid(infos) {
    if (!infos.id || !Array.isArray(infos.attributes)) {
        return false
    } else {
        return true
    }
}

module.exports = UserAttribute