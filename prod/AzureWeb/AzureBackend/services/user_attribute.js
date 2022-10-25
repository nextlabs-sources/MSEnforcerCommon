const attrs = require('../mock/user_attributes')
const UserAttributeStorage = require('../dal/user_attribute')

class UserAttributeService {
    constructor(uid) {
        this.uid = uid || ''
        this.storage = new UserAttributeStorage(global.conn)
    }

    getUserAttributes() {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, 100, Object.keys(attrs).map(a => ({
                name: a,
                type: 'varchar',
            })))
        })
    }

    getEnforcedUserAttributes() {
        return this.storage.getEnforcedUserAttributesById(this.uid)
    }

    saveUserAttributes(attributes) {

        if(!Array.isArray(attributes)) {
            return Promise.reject(new Error(`attributes must be array type`))
        }

        return (
            this.storage.saveUserAttributes({ id: this.uid, attributes })
        )
    }
}

module.exports = UserAttributeService