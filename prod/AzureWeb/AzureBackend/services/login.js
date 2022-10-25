const crypto = require('crypto')
const SignupStorage = require('../dal/signup')

class LoginService {

    constructor(uid) {
        this.uid = uid || ''
        this.storage = new SignupStorage(global.conn)
    }

    login(name, pwd, type) {
        if(!name || !pwd) {
            return Promise.resolve(false)
        }

        return (
            this.storage.getSignupInfosById(this.uid)
            .then(client => {
                const hash = crypto.createHash('md5')
                hash.update(pwd)

                if(client.email === name && client.password === hash.digest('base64') && client.type === type) {
                    return Promise.resolve(true)
                } else {
                    return Promise.resolve(false)
                }
            })
        )
    }
}

module.exports = LoginService