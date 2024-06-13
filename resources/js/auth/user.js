class User {

    constructor() {
        this.init()
    }

    init() {
        this.name = localStorage.getItem('userName')
        this.email = localStorage.getItem('userEmail')
        this.loggedIn = localStorage.getItem('userLoggedIn')
        this.avatar = localStorage.getItem('userAvatar')
    }

    /**
     *
     * @param data object
     * @param data.name string
     * @param data.email string
     * @param callback function
     */
    authenticated(data, callback) {
        localStorage.setItem('userName', data.name)
        localStorage.setItem('userEmail', data.email)
        localStorage.setItem('userLoggedIn', true)
        localStorage.setItem('userAvatar', data.avatar)

        this.init()

        callback()
    }

    /**
     *
     * @return {boolean}
     */
    isLoggedIn() {
        return Boolean(this.loggedIn) === true
    }
}

export default new User()