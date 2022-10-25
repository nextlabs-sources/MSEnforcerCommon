const express = require('express')
const httpUtil = require('../util/http-util')
const service = require('../services')
const config = require('../config')
const router = express.Router()

router.get('/meta/:uid', (req, res) => {
    const { uid } = req.params
    const { server, database, page = 1 } = req.query
    const accounts = req.session.accounts || {}
    const userInfo = accounts[server] || {}
    const { user, password } = userInfo

    console.log(`client: ${uid}`)

    if (user && password && server && database) {

        if (user && password) {
            const tableService = new service.TableService(uid, {
                user,
                password,
                server,
                database,
            })
            tableService.getTopTables(page)
                .then(tables => {
                    res.status(httpUtil.statusCode.ok)
                        .json({
                            server,
                            database,
                            done: tables.length !== 20,
                            tables: tables.filter(t => t.name !== config.parasiticDB.tables.user),
                        }).end()
                })
                .catch(err => {
                    res.status(httpUtil.statusCode.server_error)
                        .json({
                            error: err.message
                        })
                        .end()
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

router.get('/:uid', (req, res) => {
    const { uid } = req.params
    const { server, database } = req.query
    const accounts = req.session.accounts || {}
    const userInfo = accounts[server] || {}
    const { user, password } = userInfo

    console.log(`client: ${uid}`)

    if (server && database) {
        if (user && password) {
            const tableService = new service.TableService(uid, {
                user,
                password,
                server,
                database,
            })
            tableService.getEnforcedTables()
                .then(tables => {
                    res.status(httpUtil.statusCode.ok)
                        .json({
                            server,
                            database,
                            tables,
                        }).end()
                })
                .catch(err => {
                    res.status(httpUtil.statusCode.server_error)
                        .json({
                            error: err.message
                        })
                        .end()
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
    const { server, database } = req.query
    const tables = req.body
    const accounts = req.session.accounts || {}
    const userInfo = accounts[server] || {}
    const { user, password } = userInfo

    console.log(`uid: ${uid}, \nserver: ${server}, \ndatabase: ${database}, \ntables saved: ${JSON.stringify(tables, 1)}`)

    if (uid && server && database) {
        if (user && password) {
            const tableSvc = new service.TableService(uid, {
                user,
                password,
                server,
                database,
            })
            tableSvc.saveEnforcedTables(tables)
                .then(() => {
                    res.status(httpUtil.statusCode.created).end()
                })
                .catch(error => {
                    res.status(httpUtil.statusCode.server_error).json({
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