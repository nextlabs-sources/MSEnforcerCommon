const cuid = require('cuid')
const config = require('../config')
const httpStatus = require('../util/http-util').statusCode

class Proxy {

    constructor(conn) {
        if (!conn) {
            throw new Error(`Proxy construct failed: connection is null`)
        }
        this.conn = conn
        this.dbLink = `dbs/${config.database.name}`
        this.collectionLink = `${this.dbLink}/colls/${config.table.proxies}`
    }

    getProxiesByClientId(id) {
        if (!id) {
            return Promise.reject(new Error('id must not be empty'))
        }

        return new Promise((resolve, reject) => {
            const docLink = `${this.collectionLink}/docs/${id}`
            this.conn.readDocument(docLink, (err, doc) => {
                if (err) {
                    if (err.code === httpStatus.not_found) {
                        resolve({
                            id,
                            servers: []
                        })
                    } else {
                        reject(err)
                    }
                } else {
                    resolve(doc)
                }
            })
        })
    }

    getProxyByServer(id, server) {

    }

    saveServerProxy(infos) {
        if (!isInfosValid(infos)) {
            return Promise.reject(new Error('invalid proxy infos'))
        }

        return new Promise((resolve, reject) => {
            const { id, server, proxy, account, key } = infos
            const docLink = `${this.collectionLink}/docs/${id}`

            this.conn.readDocument(docLink, (err, doc) => {
                if (err) {
                    if (err.code === httpStatus.not_found) {
                        this.conn.createDocument(this.collectionLink, {
                            id,
                            servers: [
                                { name: server, proxy, account, key, }
                            ]
                        }, (err, doc) => {
                            if (err) {
                                reject(new Error(`saveServerProxy failed: ${err.message}`))
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
                            account,
                            key,
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

function isInfosValid(infos) {

    if (!infos) {
        return Promise.reject('invalid proxy infos')
    }

    const { id, server, proxy } = infos

    return (
        id &&
        server &&
        proxy
    )
}

module.exports = Proxy