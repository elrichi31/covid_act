const boom = require("@hapi/boom")

function errorHandler(err, req, res, next){
    const {output: {statusCode, payload}} = err
    res.status(statusCode)
    res.json(withErrorStack(payload, err.stack))
}
function logErrors(err, req, res, next){
    console.log(err)
    next(err)
}
function wrapError(err, req, res, next){
    if(!err.isBoom){
        next(boom.badImplementation(err))
    }
    next(err)
}

module.exports = {
    errorHandler,
    logErrors,
    wrapError,
}