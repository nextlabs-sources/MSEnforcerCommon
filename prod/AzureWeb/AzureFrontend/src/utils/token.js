class AzureTokenHelper {

    static isValid(token) {
        if(!token) {
            return false
        }

        if(!token.access_token || !token.refresh_token || !token.expires_on) {
            return false
        }

        return !AzureTokenHelper.isExpired(token)
    }

    static isExpired(token) {
        const expireOnDate = token.expires_on * 1000
        return (expireOnDate < Date.now())
    }
}

export default AzureTokenHelper