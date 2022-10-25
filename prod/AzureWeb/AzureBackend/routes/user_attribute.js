const express = require('express')
const httpUtil = require('../util/http-util')
const service = require('../services')
const router = express.Router()

router.get('/meta/:uid', (req, res) => {

    const { uid } = req.params

    if(uid) {
        const userAttrSvc = new service.UserAttributeService(uid)

        userAttrSvc.getUserAttributes()
        .then(attrs => {
            res.json(attrs).end()
        })
    } else {
        res.status(httpUtil.statusCode.bad_request)
        .json({
            error: 'invalid request'
        }).end()        
    }
})

router.get('/:uid', (req, res) => {
    const { uid } = req.params

    if(uid) {
        const userAttrSvc = new service.UserAttributeService(uid)

        userAttrSvc.getEnforcedUserAttributes()
        .then(attrs => {
            res.status(httpUtil.statusCode.ok).json({
                user_attributes: attrs
            }).end()
        })
        .catch(err => {
            res.status(httpUtil.statusCode.server_error)
            .json({
                error: err.message
            }).end()
        })
    } else {
        res.status(httpUtil.statusCode.bad_request)
        .json({
            error: 'invalid request'
        }).end()        
    }
})

router.post('/:uid', (req, res) => {
    const { uid } = req.params
    const attrs = req.body

    if(uid) {
        const userAttrSvc = new service.UserAttributeService(uid)

        console.log(`attrs saved: ${JSON.stringify(attrs)}`)

        userAttrSvc.saveUserAttributes(attrs)
        .then(doc => {
            res.status(httpUtil.statusCode.created).end()
        })
    } else {
        res.status(httpUtil.statusCode.bad_request)
        .json({
            error: 'invalid request'
        }).end()        
    }
})

module.exports = router