const cuid = require('cuid')
const config = require('../config')
const httpStatus = require('../util/http-util').statusCode
const crypto = require('crypto')

class Signup {

    constructor(conn) {
        if(!conn) {
            throw new Error(`Signup construct failed: connection is null`)
        }
        this.conn = conn
        this.dbLink = `dbs/${config.database.name}`
        this.collectionLink = `${this.dbLink}/colls/${config.table.signups}`
    }

    getSignupInfosById(id) {
        if(!id) {
            return Promise.reject(new Error('id must not be empty'))
        }

        return new Promise((resolve, reject) => {
            const docLink = `${this.collectionLink}/docs/${id}`
            this.conn.readDocument(docLink, (err, doc) => {
                if(err){
                    if(err.code === httpStatus.not_found) {
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

    saveSignupInfos(infos) {
        if(!isSignupInfosValid(infos)) {
            return Promise.reject(new Error('invalid signup infos'))
        }

        return new Promise((resolve, reject) => {
            this.conn.readDocuments(this.collectionLink).toArray((err, docs) => {
                if(err) {
                    reject(err)
                } else {
                    let doc

                    if(Array.isArray(docs)) {
                        doc = docs.find(d => (d.email === infos.email && d.type === infos.type))
                    }

                    if(!doc) {
                        const id = cuid()
                        const hash = crypto.createHash('md5')
                        hash.update(infos.password)
                        this.conn.createDocument(this.collectionLink, Object.assign({}, infos, { id, password: hash.digest('base64') }), (err, doc) => {
                            if(err) {
                                reject(new Error(`saveSignupInfos failed: ${err.message}`))
                            } else {
                                resolve(doc)
                            }
                        })
                    } else {
                        reject(new Error(`the email '${infos.email}' has been signed up before for type: ${infos.type}`))
                    }
                }
            })
        })
    }
}

function isSignupInfosValid(infos) {
    if(!infos) {
        return false
    }

    return (
        infos.first_name &&
        infos.last_name &&
        infos.email &&
        infos.password &&
        infos.company &&
        infos.phone
    )
}

module.exports = Signup