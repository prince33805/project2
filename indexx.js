require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')

const app = express()

// middleware section
app.use(bodyParser.json())
app.use(bodyParser.urlencoded( {extended: true} ))

// import transactions router V22
const RouterV22 = require('./routes2/transactionRoutesV22')
app.use('/api/v22',RouterV22)

const PORT = process.env.PORT || 3000
const HOSTNAME = process.env.HOSTNAME
app.listen(PORT, HOSTNAME, () => {
  console.log('Server is listening at: '+HOSTNAME+':'+PORT)
})
