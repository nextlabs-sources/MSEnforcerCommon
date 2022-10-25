class ConnectionInfo {

    constructor(uid) {
        this.uid = uid
    }

    getAllConnectionInfos() {
        return [
            {
                server: 'sqltest002.database.windows.net',
                user: 'nladmin',
                password: '123blue!'                
            }         
        ]
    }

    getConnectionInfo(server) {
       return {
           server: 'sqltest002.database.windows.net',
           user: 'nladmin',
           password: '123blue!'
       } 
    }

    saveConnectionInfo(connInfo) {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, 1000)
        })
    }
}

module.exports = ConnectionInfo