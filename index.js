const express = require('express')
const app = express()
const dataRoute = require('./routes/dataCountry')
const authRoute = require('./routes/auth')
const cors = require('cors')
const {logErrors, errorHandler, wrapError} = require('./utils/middlewares/errorHandler')
require('dotenv').config()
// Routes
app.use(express.json())

//Configuration cors
app.use(cors({
    origin: 'http://localhost:3000'
}))
express.json()
// Routes
app.use('/api/data/country', dataRoute)
app.use('/api/login', authRoute )

//Error managers
// app.use(logErrors)
// app.use(errorHandler)
// app.use(wrapError)

// Initialization
app.listen(process.env.PORT, ()=>{
    console.log(`Server on http://localhost:${process.env.PORT}`)
})