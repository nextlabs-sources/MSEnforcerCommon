const config = require('../config')
const Connection = require('tedious').Connection
const Request = require('tedious').Request
const SQL_TYPES = require('tedious').TYPES

class MSDBHelper {
    constructor(server, userName, password) {
        if (!server || !userName || !password) {
            throw new Error(`MSDBHelper construct failed, invalid params`)
        }
        this.server = server.split(':')[0]
        this.userName = userName
        this.password = password
    }

    createDBIfNotExist(dbname) {
        if (!dbname) {
            return Promise.reject(new Error('database name is empty'))
        }

        return new Promise((resolve, reject) => {

            let conn = new Connection({
                server: this.server,
                userName: this.userName,
                password: this.password,
                options: {
                    encrypt: true,
                }
            })

            conn.on('connect', err => {
                if (err) {
                    reject(err)
                } else {
                    const sql = `if not exists(select name from sysdatabases where name = @dbname) create database ${config.parasiticDB.name}`
                    const req = new Request(sql, err => {
                        if (err) {
                            reject(err)
                        }
                    })

                    req.addParameter('dbname', SQL_TYPES.NVarChar, config.parasiticDB.name)
                    req.on('requestCompleted', err => {
                        if (err) {
                            reject(err)
                        } else {
                            req.removeAllListeners()
                            conn.close()
                            conn = null
                            resolve()
                        }
                    })
                    conn.execSql(req)
                }
            })
        })
    }

    createSchemaIfNotExist(dbname, schema) {
        if (!schema) {
            return Promise.reject(new Error('schema must not be empty'))
        }
        
        if (!dbname) {
            return Promise.reject(new Error('database must not be empty'))
        }

        return new Promise((resolve, reject) => {

            let conn = new Connection({
                server: this.server,
                userName: this.userName,
                password: this.password,
                options: {
                    database: dbname,
                    encrypt: true,
                    connectTimeout: 300000,
                    requestTimeout: 300000,
                }
            })

            conn.on('connect', err => {
                if (err) {
                    reject(err)
                } else {
                    const sql = `
                    if not exists(
                      select name from sys.schemas where name = @schema
                    )
                    begin
                      EXEC sp_executesql N'CREATE SCHEMA ${schema}'
                    end`
                    const req = new Request(sql, err => {
                        if (err) {
                            reject(err)
                        }
                    })

                    req.addParameter('schema', SQL_TYPES.NVarChar, schema)
                    req.on('requestCompleted', err => {
                        if (err) {
                            reject(err)
                        } else {
                            req.removeAllListeners()
                            conn.close()
                            conn = null
                            resolve()
                        }
                    })
                    conn.execSql(req)
                }
            })
        })
    }

    createUserTableIfNotExist(dbname) {
        if (!dbname) {
            return Promise.reject(new Error('database name is empty'))
        }

        return new Promise((resolve, reject) => {

            let conn = new Connection({
                server: this.server,
                userName: this.userName,
                password: this.password,
                options: {
                    database: dbname,
                    encrypt: true,
                    connectTimeout: 300000,
                    requestTimeout: 300000,
                }
            })

            conn.on('connect', err => {
                if (err) {
                    reject(err)
                } else {
                    const sql = `if not exists(
                        select table_name from information_schema.tables where table_name = @tableName
                    ) create table ${config.parasiticDB.tables.user} (
                        objectId varchar(36),
                        objectType varchar(128),
                        deletionTimestamp varchar(128),
                        accountEnabled varchar(128),
                        ageGroup varchar(128),
                        city varchar(128),
                        companyName varchar(128),
                        consentProvidedForMinor varchar(128),
                        country varchar(128),
                        creationType varchar(128),
                        department varchar(128),
                        dirSyncEnabled varchar(128),
                        displayName varchar(128),
                        employeeId varchar(128),
                        facsimileTelephoneNumber varchar(128),
                        givenName varchar(128),
                        immutableId varchar(128),
                        isCompromised varchar(128),
                        jobTitle varchar(128),
                        lastDirSyncTime varchar(128),
                        legalAgeGroupClassification varchar(128),
                        mail varchar(128),
                        mailNickname varchar(128),
                        mobile varchar(128),
                        onPremisesDistinguishedName varchar(128),
                        onPremisesSecurityIdentifier varchar(128),
                        passwordPolicies varchar(128),
                        physicalDeliveryOfficeName varchar(128),
                        postalCode varchar(128),
                        preferredLanguage varchar(128),
                        refreshTokensValidFromDateTime varchar(128),
                        showInAddressList varchar(128),
                        sipProxyAddress varchar(128),
                        state varchar(128),
                        streetAddress varchar(128),
                        surname varchar(128),
                        telephoneNumber varchar(128),
                        usageLocation varchar(128),
                        userPrincipalName varchar(128),
                        userType varchar(128),
                        issqluser varchar(128)
                    )`//passwordProfile varchar(128), this is an object and thus discarded
                    const req = new Request(sql, err => {
                        if (err) {
                            reject(err)
                        }
                    })

                    req.addParameter('tableName', SQL_TYPES.NVarChar, config.parasiticDB.tables.user)
                    req.on('requestCompleted', err => {
                        if (err) {
                            reject(err)
                        } else {
                            req.removeAllListeners()
                            conn.close()
                            conn = null
                            resolve()
                        }
                    })
                    conn.execSql(req)
                }
            })
        })
    }

    registerLoginInMasterDB(name, password) {

        if(!name || !password) {
            return Promise.reject(new Error(`name & password must not be empty`))
        }

        return new Promise((resolve, reject) => {
            let conn = new Connection({
                server: this.server,
                userName: this.userName,
                password: this.password,
                options: {
                    database: 'master',
                    encrypt: true,
                }
            })

            conn.on('connect', err => {
                if (err) {
                    reject(err)
                } else {
                    const sql = `
                    if not exists (select name from sys.sql_logins where name = '${name}')
                    begin
                        create login ${name} with password='${password}'
                        if not exists (select * from sys.database_principals where name = '${name}')
                        begin
                            create user ${name} from login ${name}
                        end
                    end
                    `
                    
                    const req = new Request(sql, err => {
                        if (err) {
                            reject(err)
                        }
                    })

                    req.on('requestCompleted', err => {
                        if (err) {
                            reject(err)
                        } else {
                            req.removeAllListeners()
                            conn.close()
                            conn = null
                            resolve({ name, password })
                        }
                    })
                    conn.execSql(req)
                }
            })
        })
    }

    createReadOnlyUser(dbname, table, user) {

        if(!dbname || !table) {
            return Promise.reject(new Error('database & table must not be empty'))
        }

        if(!user) {
            return Promise.reject(new Error('user name must not be empty'))
        }

        return new Promise((resolve, reject) => {
            let conn = new Connection({
                server: this.server,
                userName: this.userName,
                password: this.password,
                options: {
                    database: dbname,
                    encrypt: true,
                }
            })

            conn.on('connect', err => {
                if (err) {
                    reject(err)
                } else {

                    const sql = `
                    if not exists (select * from sys.database_principals where name = '${user}')
                    begin
                        create user ${user} from login ${user}
                    end
                    grant select on ${table} to public
                    `
                    const req = new Request(sql, err => {
                        if (err) {
                            reject(err)
                        }
                    })

                    req.on('requestCompleted', err => {
                        if (err) {
                            reject(err)
                        } else {
                            req.removeAllListeners()
                            conn.close()
                            conn = null
                            resolve()
                        }
                    })
                    conn.execSql(req)
                }
            })
        })
    }

    grantRLSPermission2User(schema, dbname, user) {

        if(!schema) {
            return Promise.reject(new Error('schema must not be empty'))
        }

        if(!dbname) {
            return Promise.reject(new Error('database must not be empty'))
        }

        if(!user) {
            return Promise.reject(new Error('user name must not be empty'))
        }

        return new Promise((resolve, reject) => {
            let conn = new Connection({
                server: this.server,
                userName: this.userName,
                password: this.password,
                options: {
                    database: dbname,
                    encrypt: true,
                }
            })

            conn.on('connect', err => {
                if (err) {
                    reject(err)
                } else {

                    const sql = `
                    grant control on schema::${schema} to ${user}
                    grant select on schema::${schema} to ${user}
                    grant references to ${user}
                    grant alter on schema::${schema} to ${user}
                    grant create function to ${user}
                    grant execute to ${user}
                    grant alter any security policy to ${user}
                    `
                    const req = new Request(sql, err => {
                        if (err) {
                            console.log(dbname, sql)
                            reject(err)
                        }
                    })

                    req.on('requestCompleted', err => {
                        if (err) {
                            console.log(dbname, sql)
                            reject(err)
                        } else {
                            req.removeAllListeners()
                            conn.close()
                            conn = null
                            resolve()
                        }
                    })
                    conn.execSql(req)
                }
            })
        })
    }

    dropDB(dbname) {
        if (!dbname) {
            return Promise.reject(new Error('database name is empty'))
        }

        return new Promise((resolve, reject) => {

            let conn = new Connection({
                server: this.server,
                userName: this.userName,
                password: this.password,
                options: {
                    encrypt: true,
                }
            })

            conn.on('connect', err => {
                if (err) {
                    reject(err)
                } else {
                    const sql = `if exists(select name from sysdatabases where name = @dbname) drop database ${config.parasiticDB.name}`
                    const req = new Request(sql, err => {
                        if (err) {
                            reject(err)
                        }
                    })

                    req.addParameter('dbname', SQL_TYPES.NVarChar, config.parasiticDB.name)
                    req.on('requestCompleted', err => {
                        if (err) {
                            reject(err)
                        } else {
                            req.removeAllListeners()
                            conn.close()
                            conn = null
                            resolve()
                        }
                    })
                    conn.execSql(req)
                }
            })
        })
    }

    getAllDatabases() {
        return new Promise((resolve, reject) => {
            const sql = `select name from sysdatabases where name not in ('master', 'tempdb', 'msdb')`
            let conn = new Connection({
                server: this.server,
                userName: this.userName,
                password: this.password,
                options: {
                    encrypt: true,
                }
            })
            let databases = []

            conn.on('connect', err => {
                if (err) {
                    reject(err)
                } else {
                    const req = new Request(sql, err => {
                        if (err) {
                            reject(err)
                        }
                    })
                    req.on('row', cols => {
                        if (Array.isArray(cols)) {
                            databases.push(cols[0].value)
                        }
                    })
                    req.on('requestCompleted', err => {
                        req.removeAllListeners()
                        conn.close()
                        conn = null
                        resolve(databases)
                    })
                    conn.execSql(req)
                }
            })
        })
    }

    getRegisteredUsersInMasterDB() {

        return new Promise((resolve, reject) => {
            const registeredUsers = []
            let conn = new Connection({
                server: this.server,
                userName: this.userName,
                password: this.password,
                options: {
                    database: 'master',
                    encrypt: true,
                }
            })

            conn.on('connect', err => {
                if (err) {
                    reject(err)
                } else {
                    const sql = 'select name from sysusers where issqluser=@isSqlUser'
                    const req = new Request(sql, err => {
                        if (err) {
                            reject(err)
                        }
                    })

                    req.addParameter('isSqlUser', SQL_TYPES.Bit, 1)
                    req.on('row', cols => {
                        if (Array.isArray(cols)) {
                            registeredUsers.push(cols[0].value)
                        }
                    })                    
                    req.on('requestCompleted', err => {
                        if (err) {
                            reject(err)
                        } else {
                            req.removeAllListeners()
                            conn.close()
                            conn = null
                            resolve(registeredUsers)
                        }
                    })
                    conn.execSql(req)
                }
            })
        })        
    }
}

module.exports = MSDBHelper