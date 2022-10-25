const express = require('express')
const httpStatus = require('../util/http-util').statusCode
const MSDBHelper = require('../util/ms-database')
const service = require('../services')
const router = express.Router()
const config = require('../config')

router.post('/:uid', (req, res) => {
    const { uid } = req.params
    const { server, user, password, proxy } = req.body

    if (uid && server && user && password) {
        console.log(`credentials session: ${req.sessionID}`)
        req.session.accounts = Object.assign({}, req.session.accounts, { [server]: { user, password } })

        if (req.session.accounts[server] && req.session.accounts[server].user === user && req.session.accounts[server].password === password) {
            const helper = new MSDBHelper(server, user, password)
            let databases = []
            let registeredUser = {}

            helper.getAllDatabases()
                .then(dbs => {
                    console.log(`create nxl_users tables in database ${dbs.toString()}: ${Date.now()}`)
                    const createUserTableOperations = dbs.map(d => helper.createUserTableIfNotExist(d))
                    databases = dbs
                    return Promise.all(createUserTableOperations)
                })
                .then(() => {
                    console.log(`createTables end: ${Date.now()}`)
                    return helper.registerLoginInMasterDB(config.parasiticDB.account.name, config.parasiticDB.account.password)
                })
                .then(user => {
                    registeredUser = user
                    const createUserOperations = databases.map(d => helper.createReadOnlyUser(d, config.parasiticDB.tables.user, user.name))
                    return Promise.all(createUserOperations)
                })
                .then(() => {
                    const createSchemaOperations = databases.map(d => helper.createSchemaIfNotExist(d, config.parasiticDB.schema))
                    return Promise.all(createSchemaOperations)
                })
                .then(() => {
                    const grantRLSPermissionOperations = databases.map(d => helper.grantRLSPermission2User(config.parasiticDB.schema, d, config.parasiticDB.account.name))
                    return Promise.all(grantRLSPermissionOperations)

                })
                .then(() => {
                    const accountSvc = new service.AccountService(uid)

                    return accountSvc.saveAccount({
                        id: uid,
                        server,
                        proxy,
                        name: registeredUser.name,
                        password: registeredUser.password,
                    })
                })
                .then(() => {
                    res.status(httpStatus.created).end()
                })
                .catch(err => {
                    console.log(err)
                    res.status(httpStatus.server_error)
                        .json({
                            error: err.message
                        }).end()
                })
        } else {
            res.status(httpStatus.server_error).json({
                error: 'create credentials in session failed'
            }).end()
        }
    }
    else {
        res.status(httpStatus.bad_request).json({
            error: 'invalid params'
        }).end()
    }
})

module.exports = router