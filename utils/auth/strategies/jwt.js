const passport = require('passport')
const {Strategy, ExtractJwt} = require('passport-jwt')
const boom = require('@hapi/boom')
const UsersService = require("../../../services/users")

passport.use(
    new Strategy({
        secretOrKey: "SecretToken",
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    },
    async function (tokenPayload, cb) {
        const usersService = new UsersService()
        try {
            const user = await usersService.getUser({email: tokenPayload.email})
            if(!user){
                return cb(boom.unauthorized(), false)
            }
            delete user.password
            cb(null, {...user})

        } catch (error){
            return cb(error)
        }
    })
)