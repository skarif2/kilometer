const TripModel = require('./service.model')

function loadTrip(req, res, next, id) {
  TripModel.get(id)
    .then((trip) => {
      console.log('came here')
      req.trip = trip
      return next()
    })
    .catch(e => next(e))
}

function getState(req, res) {
  res.json({
    state: 'Good state',
    query: req.query
  })
}

function getEstimation(req, res) {
  res.json({
    state: 'Good estimation',
    body: req.body
  })
}

function createTrip(req, res) {
  res.json({
    state: 'Good Create Trip',
    body: req.body
  })
}

function updateTrip(req, res) {
  res.json({
    state: 'Good Update Trip',
    body: req.body
  })
}

function endTrip(req, res) {
  res.json({
    state: 'Good End Trip',
    body: req.body
  })
}

module.exports = {
  loadTrip,
  getState,
  getEstimation,
  createTrip,
  updateTrip,
  endTrip
}