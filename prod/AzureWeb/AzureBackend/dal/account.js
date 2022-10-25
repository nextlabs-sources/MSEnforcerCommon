const cuid = require('cuid')
const config = require('../config')
const httpStatus = require('../util/http-util').statusCode

class Account {

    constructor(conn) {
        if (!conn) {
            throw new Error(`Account construct failed: connection is null`)
        }
        this.conn = conn
        this.dbLink = `dbs/${config.database.name}`
        this.collectionLink = `${this.dbLink}/colls/${config.table.accounts}`
    }

    getAccountsByClientId(id) {
        if (!id) {
            return Promise.reject(new Error('id must not be empty'))
        }

        return new Promise((resolve, reject) => {
            const docLink = `${this.collectionLink}/docs/${id}`
            this.conn.readDocument(docLink, (err, doc) => {
                if (err) {
                    if (err.code === httpStatus.not_found) {
                        reject(new Error(`accounts of ${id} not found`))
                    } else {
                        reject(err)
                    }
                } else {
                    resolve(doc)
                }
            })
        })
    }

    saveAccount(account) {
        if (!isAccountValid(account)) {
            return Promise.reject(new Error('invalid account'))
        }

        return new Promise((resolve, reject) => {
            const { id, server, proxy, name, password } = account
            const docLink = `${this.collectionLink}/docs/${id}`

            this.conn.readDocument(docLink, (err, doc) => {
                if (err) {
                    if (err.code === httpStatus.not_found) {
                        this.conn.createDocument(this.collectionLink, {
                            id,
                            servers: [
                                { name: server, proxy, user: name, password, }
                            ]
                        }, (err, doc) => {
                            if (err) {
                                reject(new Error(`saveAccount failed: ${err.message}`))
                            } else {
                                resolve(doc)
                            }
                        })
                    } else {
                        reject(err)
                    }
                } else {
                    const { servers = [] } = doc
                    const restServers = servers.filter(s => s.name !== server)
                    const newDoc = Object.assign({}, {
                        id,
                        servers: restServers.concat({
                            name: server,
                            proxy,
                            user: name,
                            password,
                        })
                    })

                    this.conn.replaceDocument(docLink, newDoc, (err, doc) => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(doc)
                        }
                    })
                }
            })
        })
    }
}

function isAccountValid(account) {
    return (
        account &&
        account.name &&
        account.password
    )
}

module.exports = Account