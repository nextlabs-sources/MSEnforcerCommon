const GSStorage = require('../dal/general_setting')

class GeneralSettingService {
    constructor(uid) {
        this.uid = uid || ''
        this.storage = new GSStorage(global.conn)
    }

    getGeneralSetting() {
        return (
            this.storage.getGeneralSettingsById(this.uid)
        )
    }

    saveGeneralSetting(setting) {
        return (
            this.storage.saveGeneralSettings(Object.assign({}, setting, { id: this.uid }))
        )
    }
}

module.exports = GeneralSettingService