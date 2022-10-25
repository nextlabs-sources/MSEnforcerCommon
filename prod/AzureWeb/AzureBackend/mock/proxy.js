const deployProxyServer = server => {
    return new Promise((resolve, reject) => {
        if(!server || typeof server !== 'string') {
            reject(new Error(`deployServer failed, server invalid`))
        } else {
            const dotPos = server.indexOf('.')
            const colonPos = server.indexOf(':')
            const subDomain = server.slice(0, dotPos)
            const mainDomain = server.slice(dotPos + 1, colonPos)
            const port = server.slice(colonPos + 1)
            const proxyIP = []

            proxyIP.push(getASCIICode(subDomain) % 255)
            proxyIP.push(getASCIICode(mainDomain) % 255)
            proxyIP.push(getASCIICode(port) % 255)
            proxyIP.push(getASCIICode(server) % 255)

            resolve(proxyIP.join('.'))
        }
    })
}

function getASCIICode(str) {
    return Array.prototype.slice.call(str).reduce((prev, val) => {
        prev += val.charCodeAt(0)
        return prev
    }, 0)
}

module.exports = deployProxyServer