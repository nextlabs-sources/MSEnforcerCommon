const SignupStorage = require('../dal/signup')

class ClientService {

    constructor() {
        this.storage = new SignupStorage(global.conn)
    }

    registerClient(info) {
        return this.storage.saveSignupInfos(info)
    }

    getClient(uid) {
        return this.storage.getSignupInfosById(uid)
    }
}

module.exports = ClientService