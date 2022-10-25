const express = require('express')
const httpStatus = require('../util/http-util').statusCode
const config = require('../config')
const service = require('../services')
const router = express.Router()


router.get('/:uid', (req, res) => {
    const { uid } = req.params
    const { proxy, } = req.query

    if (uid) {
        const proxySvc = new service.ProxyService(uid)
        proxySvc.getAllProxies()
            .then(proxies => {
                if (proxies && Array.isArray(proxies.servers)) {
                    const currentServer = proxies.servers.filter(s => s.proxy === proxy)[0]

                    if (currentServer) {
                        const server = currentServer.name
                        const tableService = new service.TableService(uid, {
                            server,
                        })

                        tableService.getAllEnforcedTablesOfServer()
                            .then(tables => {
                                res.status(httpStatus.ok)
                                    .json({
                                        server,
                                        proxy,
                                        tables,
                                    }).end()
                            })
                            .catch(err => {
                                res.status(httpStatus.server_error)
                                    .json({
                                        error: err.message
                                    })
                                    .end()
                            })
                    } else {
                        res.status(httpStatus.server_error).json({
                            error: `proxy ${proxy} not found`
                        })
                    }
                } else {
                    res.status(httpStatus.server_error).json({
                        error: `proxy ${proxy} not deployed`
                    })
                }
            })
    } else {
        res.status(httpStatus.bad_request).json({
            error: 'application id must be provided'
        }).end()
    }
})

module.exports = router