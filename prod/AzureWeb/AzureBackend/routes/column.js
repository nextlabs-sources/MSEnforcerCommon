const express = require('express')
const httpUtil = require('../util/http-util')
const config = require('../config')
const service = require('../services')
const router = express.Router()

router.get('/meta/:uid', (req, res) => {
    const { uid } = req.params
    const { server, database, schema, table } = req.query
    const accounts = req.session.accounts || {}
    const userInfo = accounts[server] || {}
    const { user, password } = userInfo

    if (uid && server && database && table) {

        if (user && password) {
            const colSvc = new service.ColumnService(uid, {
                server,
                database,
                user,
                password,
            })

            colSvc.getColumns(schema, table)
                .then(cols => {
                    res.json({
                        server,
                        database,
                        schema,
                        table,
                        columns: cols,
                    }).end()
                })
                .catch(err => {
                    res.status(httpUtil.statusCode.server_error).json({
                        error: err.message
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

router.post('/:uid', (req, res) => {
    const { uid } = req.params
    const { server, database, table } = req.query
    const columns = req.body

    console.log(`client id: ${uid},\nserver: ${server}, \ntable: ${database},\ncolumns saved: ${JSON.stringify(columns)}`)

    if (uid && server && database && table) {
        const connSvc = new service.ConnInfoService(uid)
        const connInfo = connSvc.getConnectionInfo(server) || {}
        const colSvc = new service.ColumnService(uid, Object.assign({}, connInfo, { database }))

        colSvc.saveEnforcedColumns(columns)
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