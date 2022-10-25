const cuid = require('cuid')
const config = require('../config')
const httpStatus = require('../util/http-util').statusCode

class SecureEntity {

    constructor(conn) {
        if (!conn) {
            throw new Error(`SecureEntity construct failed: connection is null`)
        }
        this.conn = conn
        this.dbLink = `dbs/${config.database.name}`
        this.collectionLink = `${this.dbLink}/colls/${config.table.secured_entities}`
    }

    getSecuredEntitiesByServer(infos) {
        const { id, server } = infos

        if (!id || !server) {
            return Promise.reject(new Error('getSecuredEntitiesByServer failed: id & server & database must not be empty'))
        }

        return new Promise((resolve, reject) => {
            const docLink = `${this.collectionLink}/docs/${id}`

            this.conn.readDocument(docLink, (err, doc) => {
                if (err) {
                    reject(err)
                } else {
                    const { id, servers = [] } = doc
                    const curServer = servers.find(s => s.name === server) || { databases: [] }
                    let tables = []

                    curServer.databases.forEach(d => {
                        tables = tables.concat(d.tables.map(t => {
                            return Object.assign({}, t, { database: d.name })
                        }))
                    })

                    resolve(tables)
                }
            })
        })
    }

    getSecuredEntitiesByDatabase(infos) {
        const { id, server, database } = infos

        if (!id || !server || !database) {
            return Promise.reject(new Error('getSecuredEntitiesByDatabase failed: id & server & database must not be empty'))
        }

        return new Promise((resolve, reject) => {
            const docLink = `${this.collectionLink}/docs/${id}`

            this.conn.readDocument(docLink, (err, doc) => {
                if (err) {
                    reject(err)
                } else {
                    const { id, servers = [] } = doc
                    const curServer = servers.find(s => s.name === server) || { databases: [] }
                    const curDb = curServer.databases.find(d => d.name === database) || { tables: [] }

                    resolve(curDb.tables)
                }
            })
        })
    }

    saveSecuredEntitiesByDatabase(infos) {
        const { id, server, database, tables } = infos

        if (!id || !server || !database) {
            return Promise.reject(new Error('getSecuredEntitiesByDatabase failed: id & server & database must not be empty'))
        }

        if (!Array.isArray(tables)) {
            return Promise.reject(new Error('getSecuredEntitiesByDatabase failed: tables must not be array type'))
        }

        return new Promise((resolve, reject) => {
            const docLink = `${this.collectionLink}/docs/${id}`

            this.conn.readDocument(docLink, (err, doc) => {
                if (err) {
                    if (err.code === httpStatus.not_found) {

                        const docToBeInserted = {
                            id,
                            servers: [{
                                name: server, databases: [{
                                    name: database,
                                    tables,
                                }]
                            }]
                        }

                        this.conn.createDocument(this.collectionLink, docToBeInserted, (err, doc) => {
                            if (err) {
                                reject(new Error(`create secured_entities failed: ${err.message}`))
                            } else {
                                resolve(doc)
                            }
                        })
                    } else {
                        reject(err)
                    }
                } else {
                    const curServer = Object.assign({}, { name: server, databases: [] }, doc.servers.find(s => s.name === server))
                    const curDb = Object.assign({}, { name: database, tables: [] }, curServer.databases.find(d => d.name === database))

                    curDb.tables = tables
                    curServer.databases = curServer.databases.filter(d => d.name !== curDb.name).concat(curDb)

                    if (Array.isArray(doc.servers)) {
                        doc.servers = doc.servers.filter(s => s.name !== server).concat(curServer)
                    } else {
                        doc.servers = [].concat(curServer)
                    }

                    this.conn.replaceDocument(docLink, doc, (err, doc) => {
                        if (err) {
                            reject(new Error(`update secured_entites failed: ${err.message}`))
                        } else {
                            resolve(doc)
                        }
                    })
                }
            })
        })
    }
}

module.exports = SecureEntity