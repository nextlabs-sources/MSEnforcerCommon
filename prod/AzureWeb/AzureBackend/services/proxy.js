const ProxyStorage = require('../dal/proxy')

class ProxyService {

    constructor(uid) {
        this.uid = uid
        this.storage = new ProxyStorage(global.conn)
    }

    getAllProxies() {
        return this.storage.getProxiesByClientId(this.uid)
    }

    saveServerProxy(infos) {
        return this.storage.saveServerProxy(infos)
    }
}

module.exports = ProxyService