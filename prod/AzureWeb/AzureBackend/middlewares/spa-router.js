const SPARouter = (req, res, next) => {
    const reg = /^(\/api)|(\/ext_api)/i
    const isApiReq = reg.test(req.path)

    if(isApiReq) {
        next()
    } else {
        res.sendFile('index.html', { root: require('path').resolve(`${__dirname}/../public`) }, err => {
            if(err) {
                console.log(err)
                next(err)
            }
        })
    }
}

module.exports = SPARouter