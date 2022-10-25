const express = require('express')
const httpUtil = require('../util/http-util')
const config = require('../config')
const service = require('../services')
const router = express.Router()

router.get('/:uid', (req, res) => {
    const { uid } = req.params

    console.log(`client: ${uid}`)

    if (uid) {
        const connSvc = new service.ConnInfoService(uid)
        const connInfos = connSvc.getAllConnectionInfos() || []
        
        res.json(connInfos).end()
    } else {
        res.status(httpUtil.statusCode.bad_request).json({
            error: 'invalid client id'
        }).end()
    }
})

router.post('/:uid', (req, res) => {
    const { uid } = req.params
    const { server, database, user, password } = req.body
    const connSvc = new service.ConnInfoService(uid)

    console.log(`connInfo saved: ${uid}, ${server}, ${database}, ${user}, ${password}`)

    if (user && password && server && database) {
        connSvc.saveConnectionInfo({
            server,
            database,
            user,
            password
        })
        .then(() => {
            res.status(httpUtil.statusCode.created).end()
        })
    } else {
        res.status(httpUtil.statusCode.bad_request).json({
            error: 'invalid request'
        }).end()
    }
})

module.exports = router