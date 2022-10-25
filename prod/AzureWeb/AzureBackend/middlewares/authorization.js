const httpUtil = require('../util/http-util')

const Authorization = (req, res, next) => {
    const { uid } = req.session

    if(uid) {
        next()
    } else {
        res.status(httpUtil.statusCode.unauthorized).json({
            error: `you are not authorized to perform actions`
        }).end()
    }
}

module.exports = Authorization