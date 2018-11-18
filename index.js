const express = require('express')
const bodyParser = require('body-parser')
const compress = require('compression')
const helmet = require('helmet')
const cors = require('cors')
const mongoose = require('mongoose')
const serviceRoutes = require('./server/services/service.route')
const settingRoutes = require('./server/settings/settings.route')

require('dotenv').config()

const app = express()
const port = process.env.PORT
const mongoUri = process.env.MONGO_URI

mongoose.set('useCreateIndex', true)
mongoose.connect(mongoUri, { server: { socketOptions: { keepAlive: 1 } } });
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${mongoUri}`);
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  res.header('X-powered-by', 'Scala')
  res.header('Access-Control-Max-Age', '1000')
  next()
})

app.use(compress())
app.use(helmet())
app.use(cors())

app.use('/services', serviceRoutes)
app.use('/settings', settingRoutes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))