const Promise = require('bluebird')
const MapsClient = require('@google/maps').createClient({
  key: 'AIzaSyDk70yhTWcTzS6Jz3kQfqBa4u3z2j-KfJM',
  Promise: Promise
});
const TripModel = require('./trip.model')
const SuccessTripModel = require('./successtrip.model')
const SettingsModel = require('../settings/settings.model')

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
  MapsClient.distanceMatrix({ origins: req.body.from, destinations: req.body.to })
    .asPromise()
    .then((response) => {
      const settings = SettingsModel.getFirstOne()
      return Promise.all([response.json, settings])
    })
    .then(([gmap, settings]) => {
      const from = gmap.origin_addresses
      const to = gmap.destination_addresses
      const distance = parseFloat((gmap.rows[0].elements[0].distance.value/ 1000).toFixed(2))
      const duration = Math.floor(gmap.rows[0].elements[0].duration.value / 60)
      const estimations = settings.vehicles.map((vehicle) => ({
        kind: vehicle.kind,
        fare: Math.round((vehicle.base
          +(vehicle.distance * distance)
          + (vehicle.duration * duration))
          / 10)* 10
      }))
      return res.json({
        from,
        to,
        distance,
        duration,
        estimations
      })
    })
    .catch((err) => {
      console.log(err)
      res.json({
        state: 'error',
        err
      })
    });
  
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