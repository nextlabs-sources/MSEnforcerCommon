const AccountStorage = require('../dal/account')

class AccountService {

    constructor(uid) {
        this.uid = uid
        this.storage = new AccountStorage(global.conn)
    }

    getAccounts() {
        return this.storage.getAccountsByClientId(this.uid)
    }

    saveAccount(account) {
        return this.storage.saveAccount(account)
    }
}

module.exports = AccountService