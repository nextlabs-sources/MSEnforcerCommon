const oauthParser = (req, res, next) => {

    const authHeader = req.get('Authorization')
    const authCodeHeader = req.get('code')
    const refreshHeader = req.get('refresh_token')
    const oauth = {}

    if(authHeader) {
        const tokenArrays = authHeader.split(' ')
        if(tokenArrays.length === 2) {
            oauth['token_type'] = tokenArrays[0].trim()
            oauth['token'] = tokenArrays[1].trim()
        }
    } else if(authCodeHeader) {
        oauth['authorization_code'] = authCodeHeader.trim()
    } else if(refreshHeader) {
        oauth['refresh_token'] = refreshHeader.trim()
    }

    req.oauth = oauth
    next()
}

module.exports = oauthParser