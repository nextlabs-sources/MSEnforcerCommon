const express = require('express')
const httpStatus = require('../util/http-util').statusCode
const service = require('../services')
const deployProxyServer = require('../mock/proxy')
const router = express.Router()

router.get('/:uid', (req, res) => {
    const { uid } = req.params
    const proxySvc = new service.ProxyService(uid)

    proxySvc.getAllProxies()
        .then(infos => {
            res.status(httpStatus.ok)
                .json(infos)
                .end()
        })
        .catch(err => {
            res.status(httpStatus.server_error).json({
                error: err.message
            }).end()
        })
})

router.post('/:uid', (req, res) => {
    const { uid } = req.params
    const { server, type, account, key } = req.body
    const proxySvc = new service.ProxyService(uid)

    if (type === 'azure_sql') {
        if (uid && server && type) {
            deployProxyServer(server)
                .then(proxyIP => {

                    const infos = {
                        id: uid,
                        server,
                        proxy: proxyIP,
                    }

                    return proxySvc.saveServerProxy(infos)
                        .then(doc => {
                            res.status(httpStatus.created).json({
                                server,
                                proxy: infos.proxy,
                            }).end()
                        })
                })
                .catch(err => {
                    res.status(httpStatus.server_error).json({
                        error: err.message
                    }).end()
                })
        } else {
            res.status(httpStatus.bad_request).json({
                error: 'invalid request'
            }).end()
        }
    } else if (type === 'azure_file') {
        if (uid && server && account && key) {

            const accountSvc = new service.AccountService(uid)

            deployProxyServer(server)
                .then(proxyIP => {
                    
                    const infos = {
                        id: uid,
                        server,
                        proxy: proxyIP,
                    }

                    return proxySvc.saveServerProxy(infos)
                        .then(doc => {
                            return accountSvc.saveAccount({
                                id: uid,
                                server,
                                proxy: infos.proxy,
                                name: account,
                                password: key,
                            })
                        })
                        .then(() => {
                            res.status(httpStatus.created).json({
                                server,
                                proxy: infos.proxy,
                                account,
                                key,
                            }).end()
                        })
                })
                .catch(err => {
                    res.status(httpStatus.server_error).json({
                        error: err.message
                    }).end()
                })
        } else {
            res.status(httpStatus.bad_request).json({
                error: 'invalid request'
            }).end()
        }
    } else {
        res.status(httpStatus.bad_request).json({
            error: 'invalid client type'
        }).end()
    }
})

module.exports = router