const express = require('express')
const httpStatus = require('../util/http-util').statusCode
const config = require('../config')
const service = require('../services')
const router = express.Router()

router.get('/:uid', (req, res) => {
    const { uid } = req.params
    const { proxy } = req.query

    if (!uid) {
        res.status(httpStatus.bad_request)
            .json({
                error: 'application id must be provided'
            })
            .end()
    } else if (!proxy) {
        res.status(httpStatus.bad_request)
            .json({
                error: 'proxy address must be provided'
            })
            .end()
    } else {
        const accountSvc = new service.AccountService(uid)

        accountSvc.getAccounts()
            .then(infos => {
                const info = infos.servers.find(i => i.proxy === proxy)

                if (info) {
                    res.status(httpStatus.ok)
                        .json({
                            id: info.id,
                            server: info.name,
                            proxy: info.proxy,
                            user: info.user,
                            password: info.password,
                        })
                        .end()
                } else {
                    res.status(httpStatus.bad_request)
                        .json({ error: `account of ${uid} & ${proxy} not found` })
                        .end()
                }
            })
            .catch(err => {
                res.status(httpStatus.server_error)
                    .json({ error: err.message })
                    .end()
            })
    }
})

module.exports = router