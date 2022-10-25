const express = require('express')
const request = require('request')
const httpStatus = require('../util/http-util').statusCode
const service = require('../services')
const config = require('../config')
const router = express.Router()

router.get('/:uid', (req, res) => {

    const { uid } = req.params

    if (uid) {
        const generalSettingSvc = new service.GeneralSettingService(uid)

        generalSettingSvc.getGeneralSetting()
            .then(setting => {
                res.json(setting).end()
            })
    } else {
        res.status(httpStatus.bad_request)
            .json({
                error: 'invalid request'
            }).end()
    }
})

router.post('/:uid', (req, res) => {
    const { uid } = req.params
    const setting = req.body

    if (uid) {
        const generalSettingSvc = new service.GeneralSettingService(uid)

        generalSettingSvc.saveGeneralSetting(setting)
            .then(doc => {
                res.status(httpStatus.created).end()
            })
            .catch(err => {
                res.status(httpStatus.server_error).json({ error: err.message }).end()
            })
    } else {
        res.status(httpStatus.bad_request)
            .json({
                error: 'invalid request'
            }).end()
    }
})

router.post('/connection/:uid', (req, res) => {
    const { uid } = req.params
    const { jpcHttps, jpcHost, jpcPort, ccHost, ccPort, clientId, clientKey } = req.body

    if (isCredentialsValid(req.body)) {
        testCCToken(ccHost, ccPort, clientId, clientKey)
            .then(token => testJPC(jpcHttps, jpcHost, jpcPort, token))
            .then(() => {
                res.status(httpStatus.created).end()
            })
            .catch(err => {
                res.status(httpStatus.server_error)
                    .json({
                        error: err.message
                    })
                    .end()
            })
    } else {
        res.status(httpStatus.bad_request).json({
            error: `invalid params`
        }).end()
    }
})

function isCredentialsValid(cred) {
    if (!cred) {
        return false
    }

    const jpcPort = Number(cred.jpcPort)
    const ccPort = Number(cred.ccPort)

    if (!cred.jpcHost || !cred.ccHost) {
        console.log(cred.jpcHost, cred.ccHost)
        return false
    }

    if (isNaN(jpcPort) || isNaN(ccPort) || jpcPort < 0 || jpcPort > 65535 || ccPort < 0 || ccPort > 65535) {
        console.log(jpcPort, ccPort)
        return false
    }

    if(!cred.clientId || !cred.clientKey) {
        console.log(cred.clientId, cred.clientKey)
        return false
    }

    return true
}

function testJPC(https, host, port, token) {

    if (!token || !token.access_token) {
        return Promise.reject(new Error('invalid token'))
    }

    const protocol = https ? 'https://' : 'http://'
    const options = {
        method: 'POST',
        url: `${protocol}${host}:${port}/${config.misc.jpcSuffix}`,
        headers: {
            'Content-Type': 'application/json',
            'Service': 'EVAL',
            'Version': '1.0',
            'Authorization': `${token.token_type} ${token.access_token}`,
        },
        body: JSON.stringify(config.misc.jpcTestBody),
        strictSSL: false,
    }

    return new Promise((resolve, reject) => {
        request(options, (err, res, body) => {
            if (err) {
                reject(err)
            } else {
                if (res.statusCode === httpStatus.ok) {
                    resolve()
                } else {
                    reject(new Error('test JPC failed'))
                }
            }
        })
    })
}

function testCCToken(host, port, clientId, clientKey) {
    const options = {
        method: 'POST',
        url: `https://${host}:${port}/${config.misc.ccSuffix}`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        form: {
            grant_type: 'client_credentials',
            client_id: clientId,
            client_secret: clientKey,
        },
        strictSSL: false,
    }

    return new Promise((resolve, reject) => {
        request(options, (err, res, body) => {
            if (err) {
                reject(err)
            } else {
                if (res.statusCode === httpStatus.ok) {
                    const token = JSON.parse(body)
                    if (token.access_token) {
                        resolve(token)
                    } else {
                        reject(new Error(token.error))
                    }
                } else {
                    reject(new Error('test cc token failed'))
                }
            }
        })
    })
}

module.exports = router