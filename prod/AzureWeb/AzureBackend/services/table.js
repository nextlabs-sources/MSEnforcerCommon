const Connection = require('tedious').Connection
const Request = require('tedious').Request
const EntityStorage = require('../dal/secured_entity')

class TableService {
    constructor(uid, config) {
        this.uid = uid || ''
        this.config = config || {}
        this.tables = []
        this.storage = new EntityStorage(global.conn)
    }

    getAllTables() {
        let conn

        return new Promise((resolve, reject) => {
            try {
                const { user, password, server, database } = this.config

                conn = new Connection({
                    userName: user,
                    password,
                    server: server.split(':')[0],
                    options: {
                        encrypt: true,
                        database,
                    }
                })
                conn.on('connect', err => {
                    if(err) {
                        console.log(err)
                        reject(err)
                    } else {
                        const sql = 'select table_catalog, table_schema, table_name, table_type from INFORMATION_SCHEMA.TABLES'
                        const req = new Request(sql, (err) => {    
                            if(err) {
                                req.removeAllListeners()
                                conn.close()
                                reject(err)
                            }
                        })
                        req.on('row', cols => {
                            if(Array.isArray(cols)) {
                                this.tables.push({
                                    schema: cols[1].value,
                                    name: cols[2].value,
                                    type: cols[3].value,
                                })
                            }
                        })
                        req.on('requestCompleted', err => {
                            console.log(`request done: ${server}/${database}`)
                            req.removeAllListeners()
                            conn.close()
                            resolve(this.tables)
                        })                        
                        conn.execSql(req)
                    }
                })
            } catch(e) {
                conn && conn.close()
                reject(e)
            }
        })
    }

    getTopTables(pageNum) {
        let conn

        return new Promise((resolve, reject) => {
            try {
                const { user, password, server, database } = this.config

                conn = new Connection({
                    userName: user,
                    password,
                    server: server.split(':')[0],
                    options: {
                        encrypt: true,
                        database,
                    }
                })
                conn.on('connect', err => {
                    if(err) {
                        console.log(err)
                        reject(err)
                    } else {
                        const offset = (pageNum <= 1 ? 0 : (pageNum - 1) * 20)
                        console.log(`pageNum: ${pageNum}, offset: ${offset}`)
                        const sql = 'select table_catalog, table_schema, table_name, table_type from INFORMATION_SCHEMA.TABLES order by table_name offset @num rows fetch next 20 rows only'
                        const req = new Request(sql, (err) => {    
                            if(err) {
                                req.removeAllListeners()
                                conn.close()
                                reject(err)
                            }
                        })
                        req.addParameter('num', require('tedious').TYPES.Int, offset)
                        req.on('row', cols => {
                            if(Array.isArray(cols)) {
                                this.tables.push({
                                    schema: cols[1].value,
                                    name: cols[2].value,
                                    type: cols[3].value,
                                })
                            }
                        })
                        req.on('requestCompleted', err => {
                            console.log(`request done: ${server}/${database}`)
                            req.removeAllListeners()
                            conn.close()
                            resolve(this.tables)
                            //console.log(this.tables.map(t => t.name).join())
                        })                        
                        conn.execSql(req)
                    }
                })
            } catch(e) {
                conn && conn.close()
                reject(e)
            }
        })
    }

    saveEnforcedTables(tables) {
        const infos = {
            id: this.uid,
            server: this.config.server,
            database: this.config.database,
            tables,
        }
        return this.storage.saveSecuredEntitiesByDatabase(infos)
    }

    getEnforcedTables() {
        const infos = {
            id: this.uid,
            server: this.config.server,
            database: this.config.database,
        }        
        return this.storage.getSecuredEntitiesByDatabase(infos)
    }

    getAllEnforcedTablesOfServer() {
        const infos = {
            id: this.uid,
            server: this.config.server,
        }        
        return this.storage.getSecuredEntitiesByServer(infos)        
    }
}

module.exports = TableService