const express = require('express')
const httpUtil = require('../util/http-util')
const MSDBHelper = require('../util/ms-database')
const router = express.Router()

router.get('/:uid', (req, res) => {
    const { uid } = req.params
    const { server } = req.query

    if (uid && server) {
        console.log(`fetch db: ${req.sessionID}`)
        const accounts = req.session.accounts || {}
        const userInfo = accounts[server] || {}
        const { user, password } = userInfo
        const databaseSvc = new MSDBHelper(server, user, password)

        if (user && password) {
            databaseSvc.getAllDatabases()
                .then(databases => {
                    res.status(httpUtil.statusCode.ok).json({
                        server,
                        databases,
                    }).end()
                })
                .catch(error => {
                    res.status(httpUtil.statusCode.server_error)
                        .json({
                            error: error.message
                        }).end()
                })
        } else {
            res.status(httpUtil.statusCode.bad_request)
                .json({ error: `credentials of server ${server} must be provided` })
                .end()
        }
    } else {
        res.status(httpUtil.statusCode.bad_request).json({
            error: 'invalid request'
        }).end()
    }
})

module.exports = router