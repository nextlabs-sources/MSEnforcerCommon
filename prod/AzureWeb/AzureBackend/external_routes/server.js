const express = require('express')
const httpStatus = require('../util/http-util').statusCode
const config = require('../config')
const service = require('../services')
const router = express.Router()

router.get('/:uid', (req, res) => {
    const { uid } = req.params
    const { proxy } = req.query

    if (uid && proxy) {

        const accountSvc = new service.ProxyService(uid)

        accountSvc.getAllProxies()
            .then(infos => {
                const info = infos.servers.find(i => i.proxy === proxy)

                if (info) {
                    res.status(httpStatus.ok)
                        .json(info)
                        .end()
                } else {
                    res.status(httpStatus.bad_request)
                        .json({ error: `server of ${uid} & ${proxy} not found` })
                        .end()
                }
            })
            .catch(err => {
                res.status(httpStatus.server_error)
                    .json({ error: err.message })
                    .end()
            })

    } else {
        if (!uid) {
            res.status(httpStatus.bad_request)
                .json({
                    error: 'application id must be provided'
                })
                .end()
        } else {
            res.status(httpStatus.bad_request)
                .json({
                    error: 'proxy address must be provided'
                })
                .end()
        }
    }
})

module.exports = router