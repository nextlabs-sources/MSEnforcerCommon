const request = require('request')
const express = require('express')
const httpUtil = require('../util/http-util')
const config = require('../config')
const router = express.Router()

router.post('/grant', (req, res) => {

    const { client_id, client_secret, tenantId, code, redirect_uri } = req.body
    
    if (!isCredentialValid(req.body)) {
        return res.status(httpUtil.statusCode.bad_request).json({
            error: `invalid params: ${JSON.stringify(req.body)}`
        }).end()
    }

    const options = {
        method: 'POST',
        url: `https://login.microsoftonline.com/${tenantId}/oauth2/token`,
        headers:
        {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form:
        {
            grant_type: 'authorization_code',
            code,
            redirect_uri,
            client_id,
            client_secret,
        }
    }

    request(options, (err, response, body) => {

        if(err) {
            return res.status(httpUtil.statusCode.server_error).json({
                error: err.message
            }).end()
        }

        res.status(httpUtil.statusCode.ok).json(JSON.parse(body)).end()
    })
})

// router.get('/refresh', (req, res) => {

//     const { refresh_token } = req.oauth

//     if (!refresh_token) {
//         return res.status(httpUtil.statusCode.bad_request).json({
//             error: `invalid refresh token`
//         }).end()
//     }

//     const options = {
//         method: 'POST',
//         url: `https://login.microsoftonline.com/${config.app.tenant}/oauth2/token`,
//         headers:
//         {
//             'Cache-Control': 'no-cache',
//             'Content-Type': 'application/x-www-form-urlencoded'
//         },
//         form:
//         {
//             grant_type: 'refresh_token',
//             refresh_token: refresh_token,
//             client_id: config.app.key,
//             client_secret: config.app.secret,
//         }
//     }

//     request(options, (err, response, body) => {

//         if(err) {
//             return res.status(httpUtil.statusCode.server_error).json({
//                 error: err.message
//             }).end()
//         }

//         res.status(httpUtil.statusCode.ok).json(JSON.parse(body)).end()
//     })
// })

function isCredentialValid(credential) {
    return (
        credential.client_id &&
        credential.client_secret &&
        credential.tenantId &&
        credential.code &&
        credential.redirect_uri
    )
}

module.exports = router