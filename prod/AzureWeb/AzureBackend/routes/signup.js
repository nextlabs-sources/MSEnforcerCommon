const express = require('express')
const httpUtil = require('../util/http-util')
const service = require('../services')
const router = express.Router()

router.post('/', (req, res) => {
    const info = Object.assign({}, req.body)
    let emailSvc, clientSvc, appId = '', type = ''

    if (isSignupInfoValid(info)) {

        clientSvc = new service.ClientService()

        clientSvc.registerClient(info)
            .then(infos => {
                appId = infos.id
                type = infos.type
                emailSvc = new service.EmailService(infos.id)
                return emailSvc.sendEmail(infos.email, infos.password)
            })
            .then(() => {
                res.set('Location', `${type}/login/${appId}`).status(httpUtil.statusCode.created).end()
            })
            .catch(error => {
                emailSvc && emailSvc.sendErrorEmail(info.email, error.message)
                res.status(httpUtil.statusCode.server_error)
                    .json({ error: error.message })
                    .end()
            })

    } else {
        res.status(httpUtil.statusCode.bad_request)
            .json({ error: `invalid signup infos` })
            .end()
    }
})

function isSignupInfoValid(info) {
    if (!info) {
        return false
    }

    const { first_name, last_name, email, company, phone, password } = info

    return (email && password)
}

module.exports = router