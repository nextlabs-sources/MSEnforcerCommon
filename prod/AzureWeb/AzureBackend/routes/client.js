const express = require('express')
const httpUtil = require('../util/http-util')
const service = require('../services')
const router = express.Router()

router.get('/:uid', (req, res) => {

    const { uid } = req.params

    if (uid) {
        const clientSvc = new service.ClientService()

        clientSvc.getClient(uid)
            .then(client => {
                res.json(client).end()
            })
    } else {
        res.status(httpUtil.statusCode.bad_request)
            .json({
                error: 'invalid request'
            }).end()
    }
})

// router.post('/', (req, res) => {
//     const { first_name, last_name, email, company, phone } = req.body

//     if (first_name && last_name && email && company && phone) {
//         const clientSvc = new service.ClientService()

//         console.log(`client created: ${JSON.stringify(req.body)}`)

//         clientSvc.registerClient({
//             first_name,
//             last_name,
//             email,
//             company,
//             phone,
//         })
//             .then(uid => {
//                 res.set('Location', `/api/clients/${uid}`)
//                     .status(httpUtil.statusCode.created).end()
//             })
//     } else {
//         res.status(httpUtil.statusCode.bad_request)
//             .json({
//                 error: 'invalid request'
//             }).end()
//     }
// })

module.exports = router