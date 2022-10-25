const express = require('express')
const httpUtil = require('../util/http-util')
const service = require('../services')
const router = express.Router()

router.post('/:uid', (req, res) => {
    const { uid } = req.params
    const { user, password, type } = req.body

    if (uid && user && password) {
        const loginSvc = new service.LoginService(uid)

        loginSvc.login(user, password, type)
            .then(isLoggedIn => {
                if (isLoggedIn) {
                    req.session.uid = uid
                    res.status(httpUtil.statusCode.created).end()
                } else {
                    res.status(httpUtil.statusCode.unauthorized)
                        .json({
                            error: `incorrect user or password`
                        }).end()
                }
            })
            .catch(err => {
                res.status(httpUtil.statusCode.server_error)
                    .json({
                        error: err.message
                    }).end()
            })
    } else {
        res.status(httpUtil.statusCode.bad_request).end()
    }
})

router.get('/out/:uid', (req, res) => {
    const { uid } = req.params
    const { user } = req.query

    if (uid && user) {
        req.session.destroy(err => {
            if(err) {
                res.status(httpUtil.statusCode.server_error).json({
                    error: err.message
                }).end()
            } else {
                res.status(httpUtil.statusCode.no_content).end()
            }
        })
    } else {
        res.status(httpUtil.statusCode.bad_request).json({
            error: 'invalid request'
        }).end()
    }
})

module.exports = router