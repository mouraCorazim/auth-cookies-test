module.exports = (email, password) => {

    return {

        'email': email,
        'password': password,
        'active': true,
        'created': new Date(Date.now())
    }
}