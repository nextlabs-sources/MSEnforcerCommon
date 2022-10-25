const DBHelper = require('../util/database')

class CosmosDBInitializer {
    constructor(conn) {
        if(!conn) {
            throw new Error(`CosmosDBInitializer construct failed: conn is null`)
        }
        this.conn = conn
    }

    init(database, collections) {
        if(!database) {
            return Promise.reject(new Error(`database is null`))
        }

        if(!Array.isArray(collections)) {
            return Promise.reject(new Error(`collections must be array type`))
        }

        const helper = new DBHelper(this.conn)
        const dbInitializer = helper.createDBIfNotExist(database)
        const collectionInitializers = collections.map(c => helper.createCollectionIfNotExist(database, c))

        return (
            dbInitializer
            .then(db => Promise.all(collectionInitializers))
            .catch(err => Promise.reject(err))
        )
    }
}

module.exports = CosmosDBInitializer