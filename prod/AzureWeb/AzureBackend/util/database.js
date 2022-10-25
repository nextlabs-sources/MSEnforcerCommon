const httpStatus = require('./http-util').statusCode

class DBHelper {
    constructor(conn) {
        if(!conn) {
            throw new Error(`DBHelper construct failed, conn is null`)
        }
        this.conn = conn
    }

    createDBIfNotExist(dbname) {
        if(!dbname) {
            return Promise.reject(new Error('database name is empty'))
        }
    
        return new Promise((resolve, reject) => {
            const dbLink = `dbs/${dbname}`
            
            this.conn.readDatabase(dbLink, (err, db) => {
                if(err) {
                    if(err.code === httpStatus.not_found) {
                        this.conn.createDatabase({ id: dbname }, (err, db) => {
                            if(err) {
                                reject(new Error(`create database failed: ${err.message}`))
                            } else {
                                resolve(db)
                            }
                        })
                    } else {
                        reject(new Error(`read database failed, ${err.message}`))
                    }
                } else {
                    resolve(db)
                }
            })
        })
    }

    createCollectionIfNotExist(dbname, collectionName) {
        if(!dbname) {
            return Promise.reject(new Error('database name is empty'))
        }

        if(!collectionName) {
            return Promise.reject(new Error('collection name is empty'))
        }

        return new Promise((resolve, reject) => {
            const dbLink = `dbs/${dbname}`
            const collectionLink = `${dbLink}/colls/${collectionName}`

            this.conn.readCollection(collectionLink, (err, collection) => {
                if(err) {
                    if(err.code === httpStatus.not_found) {
                        this.conn.createCollection(dbLink, { id: collectionName }, (err, collection) => {
                            if(err) {
                                reject(new Error(`create collection '${collectionName}' failed: ${err.message}`))
                            } else {
                                resolve(collection)
                            }
                        })
                    } else {
                        reject(new Error(`readCollection failed: ${err.message}`))
                    }
                } else {
                    resolve(collection)
                }
            })
        })
    }

    dropDB(dbname) {

        if(!dbname) {
            return Promise.reject(new Error('database name must not be empty'))
        }

        return new Promise((resolve, reject) => {
            const dbLink = `dbs/${dbname}`

            this.conn.deleteDatabase(dbLink, (err, db) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(db)
                }
            })            
        })
    }
}

module.exports = DBHelper