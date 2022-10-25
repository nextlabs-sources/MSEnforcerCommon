const express = require('express')
const httpStatus = require('../util/http-util').statusCode
const MSDBHelper = require('../util/ms-database')
const service = require('../services')
const User = require('../models/user')
const router = express.Router()

router.post('/:uid', (req, res) => {
    const { uid } = req.params
    const { server } = req.query
    let users = req.body

    if (uid && server) {
        const accounts = req.session.accounts || {}
        const userInfo = accounts[server] || {}
        const { user, password } = userInfo

        if (user && password) {
            const aduserSvc = new service.ADUserService(uid, {
                server,
                userName: user,
                password,
            })
            const dbSvc = new MSDBHelper(server, user, password)

            dbSvc.getAllDatabases()
                .then(dbs => {
                    return dbSvc.getRegisteredUsersInMasterDB()
                        .then(registeredUsers => {
                            users = users.map(u => new User(u))
                                .concat(registeredUsers.map(u => new User({ userPrincipalName: u, issqluser: '1' })))

                            return Promise.resolve()
                        })
                        .then(() => {
                            return Promise.resolve(dbs)
                        })
                        .catch(err => {
                            return Promise.reject(err)
                        })
                })
                .then(dbs => {
                    return aduserSvc.updateUsersOfAllDBs(dbs, users)
                })
                .then(() => {
                    res.status(httpStatus.created).end()
                })
                .catch(err => {
                    res.status(httpStatus.server_error)
                        .json({ error: err.message })
                        .end()
                })
        } else {
            res.status(httpStatus.bad_request)
                .json({ error: `credentials of server ${server} must be provided` })
                .end()
        }
    } else {
        res.status(httpStatus.bad_request)
            .json({ error: 'invalid request' })
            .end()
    }
})

module.exports = router