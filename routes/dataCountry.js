const dataRoute = require('express').Router()
const csv = require('csv-parser')
const fs = require('fs');
const passport = require('passport');
const flags = require('../flags')
const {logErrors, errorHandler, wrapError} = require('../utils/middlewares/errorHandler')

require('../utils/auth/strategies/jwt');

dataRoute.get('/:country',async function(req, res, next) {
    passport.authenticate('jwt', (error, user) => {
        try{
            const results = []
            if(error || !user){
                return res.send("unauthorized")
            }
            const {country} = req.params
            fs.createReadStream(`country_data/${country}.csv`)
            .on('error', err => res.json({"error": err}))
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                const data1 = {
                    country: `${country}`,
                    date: results.map(function(result){
                        return result.date
                    }),
                    vaccine: results.map(function(result){
                        return result.vaccine
                    }),
                    total_vaccinations: results.map(function(result){
                        return result.total_vaccinations
                    }),
                    people_vaccinated: results.map(function(result){
                        return result.people_vaccinated
                    }),
                    people_fully_vaccinated: results.map(function(result){
                        return result.people_fully_vaccinated
                    }),
                } 
                // res.json(data1)
                res.send(data1)
            });
        } catch(error){
            console.log(error)
            next(error)
        }
    })(req, res, next)
})

module.exports = dataRoute