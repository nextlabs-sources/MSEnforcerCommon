const Connection = require('tedious').Connection
const Request = require('tedious').Request
const TYPES = require('tedious').TYPES
const config = require('../config')
const user_attributes = require('../mock/user_attributes')
const User = require('../models/user')

class ADUserService {
    constructor(uid, config) {
        this.uid = uid
        this.config = config
    }

    updateUsersOfSingleDB(db, users) {
        if (!db) {
            return Promise.reject(new Error('database must not be nulll'))
        }

        if (!Array.isArray(users)) {
            return Promise.reject(new Error('users must be array type'))
        }

        return new Promise((resolve, reject) => {
            const sqlUsers = []
            const { server, userName, password } = this.config
            let conn = new Connection({
                server: server.split(':')[0],
                userName,
                password,
                options: {
                    encrypt: true,
                    database: db,
                    connectTimeout: 30000,
                    requestTimeout: 30000,
                }
            })

            conn.on('connect', err => {
                if (err) {
                    reject(err)
                } else {
                    const sql1 = 'select name from sysusers where issqluser=@isSqlUser'
                    const req1 = new Request(sql1, err => {
                        if (err) {
                            reject(err)
                        }
                    })

                    req1.addParameter('isSqlUser', TYPES.Bit, 1)
                    req1.on('row', cols => {
                        if (Array.isArray(cols)) {
                            sqlUsers.push(cols[0].value)
                        }
                    })
                    req1.on('requestCompleted', err => {
                        if (err) {
                            reject(err)
                        } else {
                            users = users.concat(sqlUsers.map(u => new User({ userPrincipalName: u, issqluser: '1', })))
                            let sql2 = `truncate table ${config.parasiticDB.tables.user};`
                            const fields = Object.keys(user_attributes)
                            const values = users.map(u => {
                                const rowValues = fields.map(k => (u[k] === null || u[k] === undefined) ? 'NULL' : `'${u[k]}'`)
                                return `(${rowValues.join(',')})`
                            }).join(',')
                            sql2 += `insert into ${config.parasiticDB.tables.user} (${fields.join(',')}) values ${values}`

                            //console.log(sql2)
                            const req2 = new Request(sql2, err => {
                                if (err) {
                                    reject(err)
                                }
                            })

                            req2.on('requestCompleted', err => {
                                if (err) {
                                    reject(err)
                                } else {
                                    req2.removeAllListeners()
                                    conn.close()
                                    conn = null
                                    console.log(`requestCompleted ${db} done`)
                                    resolve()
                                }
                            })

                            conn.execSql(req2)
                        }
                    })
                    conn.execSql(req1)
                }
            })
        })
    }

    updateUsersOfAllDBs(dbs, users) {

        if (!Array.isArray(dbs)) {
            return Promise.reject(new Error('databases must be array type'))
        }

        if (!Array.isArray(users)) {
            return Promise.reject(new Error('users must array type'))
        }

        const operations = dbs.map(d => this.updateUsersOfSingleDB(d, users))
        return Promise.all(operations)
    }
}

module.exports = ADUserService