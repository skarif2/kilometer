const Promise = require('bluebird')
const geolib = require('geolib')
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
      req.trip = trip
      return next()
    })
    .catch(e => next(e))
}

function getState(req, res) {
  TripModel.findOne({ deviceId: req.query.deviceId })
    .then((trip) => {
      if (trip) {
        return res.json({
          status: 'success',
          state: true,
          trip
        })
      }
      return res.json({
        status: 'success',
        state: false
      })
    })
    .catch((err) => {
      return res.json({
        status: 'error',
        error: err 
      })
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
  TripModel.getByDeviceId(req.body.deviceId)
    .then(() => {
      const trip = new TripModel(req.body)
      trip.path.push(req.body.location)
      return trip.save()
    })
    .then((trip) => {
      res.json({
        status: 'success',
        trip: trip
      })
    })
    .catch((err) => {
      res.json({
        status: 'error',
        error: err
      })
    })
}

function updateTrip(req, res) {
  if (req.trip.deviceId !== req.body.deviceId) {
    return res.json({
      status: 'error',
      error: 'You are not supposed to update this trip!'
    })
  }
  if (req.body.location && req.body.location.lat && req.body.location.lng) {
    const trip = req.trip
    trip.path.push(req.body.location)
    return trip.save()
      .then((savedTrip) => res.json({
        status: 'success',
        trip: savedTrip
      }))
      .catch((err) => {
        res.json({
          status: 'error',
          error: err
        })
      })
  }
  return res.json({
    status: 'error',
    error: 'Nothing to update!'
  })
}

function endTrip(req, res) {
  if (req.trip.deviceId !== req.body.deviceId) {
    return res.json({
      status: 'error',
      error: 'You are not supposed to end this trip!'
    })
  }
  SettingsModel.getFirstOne()
    .then((settings) => {
      const trip = req.trip
      trip.path.push(req.body.location)
      const distance = parseFloat(_pathDistance(trip.path)).toFixed(2)
      const timeDifference = (new Date("2018-11-16T08:39:24.498Z").getTime())
        - (new Date(trip.startTime).getTime())
      const fareSettings = settings.vehicles.find(vehicle => vehicle.kind === trip.vehicle)
      if (fareSettings === undefined) {
        return res.json({
          status: 'error',
          error: 'No vehicle found in the vehicle type!'
        })
      }
      const fare = Math.round((fareSettings.base
            + (fareSettings.distance * distance)
            + ((fareSettings.duration / 60 / 1000) * timeDifference))
            / 10) * 10
      const successTrip = new SuccessTripModel({
        deviceId: trip.deviceId,
        from: trip.from,
        to: trip.to,
        vehicle: trip.vehicle,
        passenger: trip.passenger,
        startTime: trip.startTime,
        endTime: new Date(),
        path: trip.path,
        distance: `${distance} km`,
        duration: _msToTime(timeDifference),
        fare: `${fare} Tk`
      })
      successTrip.save()
        .then(() => trip.remove())
        .then(() => {
          return res.json({
            status: 'success',
            vehicle: successTrip.vehicle,
            distance: successTrip.distance,
            duration: successTrip.duration,
            fare: successTrip.fare
          })
        })
    })
    .catch((err) => {
      res.json({
        status: 'error',
        error: err
      })
    })
}

function _pathDistance(path) {
  let preLoc = undefined
  return path.reduce((acc, nextLoc) => {
    if (preLoc === undefined) {
      preLoc = nextLoc
      return 0
    }
    const subDistance = _getDistance(preLoc, nextLoc)
    preLoc = nextLoc
    return acc += subDistance
  }, 0)
}

function _getDistance(preLoc, nextLoc) {
  const R = 6371; // Radius of the earth in km
  const dLat = (nextLoc.lat - preLoc.lat) * (Math.PI / 180);
  const dLng = (nextLoc.lng - preLoc.lng) * (Math.PI / 180);
  const a =
    (Math.sin(dLat / 2) * Math.sin(dLat / 2)) +
    (Math.cos(preLoc.lat * (Math.PI / 180)) *
    Math.cos(nextLoc.lat * (Math.PI / 180)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2));
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

function _msToTime(duration) {
  let seconds = parseInt((duration/1000)%60)
  let minutes = parseInt((duration/(1000*60))%60) + (seconds < 20 ? 0 : 1)
  let hours = parseInt((duration/(1000*60*60))%24)
  return hours > 0 ? `${hours}hr ${minutes}min` : `${minutes} min`
}

module.exports = {
  loadTrip,
  getState,
  getEstimation,
  createTrip,
  updateTrip,
  endTrip
}