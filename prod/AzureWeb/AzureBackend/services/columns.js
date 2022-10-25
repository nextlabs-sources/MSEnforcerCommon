const Connection = require('tedious').Connection
const Request = require('tedious').Request
const config = require('../config')

class ColumnService {
    constructor(uid, config) {
        this.uid = uid || ''
        this.config = config || {}
        this.columns = []
    }

    getColumns(schema, table) {
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
                        const sql = 'select column_name, data_type, is_nullable from INFORMATION_SCHEMA.COLUMNS where table_name = @tname and table_schema = @tschema'
                        const req = new Request(sql, (err) => {
                            if(err) {
                                req.removeAllListeners()
                                conn.close()
                                reject(err)
                            }
                        })
                        req.addParameter('tname', require('tedious').TYPES.NVarChar, table)
                        req.addParameter('tschema', require('tedious').TYPES.NVarChar, schema)
                        req.on('row', cols => {
                            if(Array.isArray(cols) && isColTypeSupported(cols[1].value)) {
                                this.columns.push({
                                    name: cols[0].value,
                                    type: cols[1].value,
                                    nullable: cols[2].value,
                                })
                            }
                        })
                        req.on('requestCompleted', err => {
                            console.log(`request done: ${server}/${database}/${table}`)
                            req.removeAllListeners()
                            conn.close()
                            resolve(this.columns)
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

    saveEnforcedColumns(columns) {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, 1000)
        })
    }
}

function isColTypeSupported(dataType) {
    if(!dataType) {
        return false
    }

    return config.misc.supportedSQLTypes.findIndex(t => t === dataType) > -1
}

module.exports = ColumnService