const express = require('express')
const httpUtil = require('../util/http-util')
const service = require('../services')
const router = express.Router()

router.get('/:uid', (req, res) => {

    const { uid } = req.params

    if (uid) {
        const generalSettingSvc = new service.GeneralSettingService(uid)

        generalSettingSvc.getGeneralSetting()
            .then(setting => {
                const reducedSetting = {
                    id: setting.id,
                    jpcHttps: setting.jpcHttps,
                    jpcHost: setting.jpcHost,
                    jpcPort: setting.jpcPort,
                    ccHost: setting.ccHost,
                    ccPort: setting.ccPort,
                    clientId: setting.clientId,
                    clientKey: setting.clientKey,
                    policyDecision: setting.policyDecision,
                    exceptionMsg: setting.exceptionMsg,
                    defaultMsg: setting.defaultMsg,   
                }
                
                if(setting.fileInfoServer && setting.fileInfoPort) {
                    reducedSetting.fileInfoServer = setting.fileInfoServer
                    reducedSetting.fileInfoPort = setting.fileInfoPort
                }
                res.json(reducedSetting).end()
            })
    } else {
        res.status(httpUtil.statusCode.bad_request)
            .json({
                error: 'application id must be provided'
            }).end()
    }
})

module.exports = router