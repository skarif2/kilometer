const express = require('express')
const app = express()
const port = 3000

app.get('/kilometer/services/state', (req, res) => res.send('/kilometer/services/state'))

app.get('/kilometer/services/estimation', (req, res) => res.send('/kilometer/services/estimation'))

app.get('/kilometer/services/trips', (req, res) => res.send('/kilometer/services/trips'))

app.post('/kilometer/services/trips', (req, res) => res.send('/kilometer/services/trips'))

app.put('/kilometer/services/trips/:tripId', (req, res) => res.send('/kilometer/services/trips'))

app.delete('/kilometer/services/trips/:tripId', (req, res) => res.send('/kilometer/services/trips'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))