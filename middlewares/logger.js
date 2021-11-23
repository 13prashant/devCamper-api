// @dsc     Logging middleware
const logger = (req, res, next) => {
    req.hello = 'Hello World!'
    console.log(`${req.protocol}//${req.get('host')}${req.originalUrl}`)
    next()
}

module.exports = logger