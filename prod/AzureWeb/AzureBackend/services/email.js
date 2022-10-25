class EmailService {
    constructor(uid) {
        this.uid = uid || ''
    }

    sendEmail(user, password) {
        return new Promise((resolve, reject) => {
            console.log(`email sent to ${user}, \nlogin url: https://cloudproxy.azurewebsites.net/login/${this.uid}`)
            setTimeout(resolve, 1000)
        })
    }

    sendErrorEmail(user, error) {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, 1000, error)
        })
    }
}

module.exports = EmailService