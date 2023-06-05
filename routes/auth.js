const authRoute = require('express').Router()
const express = require("express")
const passport = require("passport")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const {BasicStrategy} = require("passport-http")
const UsersService = require("../services/users")
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')


require('../utils/auth/strategies/basic')

const app = express()
app.use(cookieParser("secretCode"))

app.use(session({
    secret: "secretCode",
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.json())
// Basic  Stategy 
passport.use(new BasicStrategy(async function(email, password, cb){
    const userService = new UsersService()
    try {
        const user = await userService.getUser({email})
        if(!user){
            return res.send("Invalid")
        }
        if(!(await bcrypt.compare(password, user.password))){
            return res.send("Invalid")
        }
        delete user.password
        return cb(null, user)
    }
    catch(err){
        return cb(err)
    }
    
}))

authRoute.get("/sign-in", (req, res) => {
    res.send("Inicia session")
})

authRoute.get("/pro", async function(req, res, next){
    passport.authenticate('basic', function(error, user){
        console.log(user)
        try{
            if(error || !user){
                return res.send("unauthorized")
            }
            res.send("ENTER")
        } catch(error){
            next(error)
        }
    })(req, res, next)
})

authRoute.post("/sign-in", async function(req, res, next){
    passport.authenticate('basic', function(error, user){
        console.log(user)
        try{
            if(error || !user){
                return res.send("unauthorized")
            }
            req.logIn(user, {session: false}, async function(error){
                if(error){
                    next(error)
                }
                const {_id: id, name, email} = user
                const payload = {
                    sub: id,
                    name,
                    email, 
                }
                const token = jwt.sign(payload, "SecretToken",{
                    expiresIn: '180m'
                })
                return res.status(200).json({token, user: user})
            })

        } catch(error){
            next(error)
        }
    })(req, res, next)    
})

    

authRoute.get("/sign-up", (req, res) => {
    res.send("Crea una cuenta")
})
authRoute.post("/sign-up", async function(req, res, next){
    const {body: user} = req
    const userService = new UsersService()
    try{
        const validate = await userService.validateUser({user})
        if(validate){
            const createUserId = await userService.createUser({user})
            res.status(201)
            res.send({
                data: createUserId,
                msg:"user created"
            })
        }
        else{
            res.send({msg: "The email is in use"})
        }
    } catch (err){
        next(err)
    }
})

module.exports = authRoute