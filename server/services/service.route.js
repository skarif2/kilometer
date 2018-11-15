const express = require('express')
const serviceCtrl = require('./service.controller')

const router = express.Router()

router.route('/')
  .get((req, res) => res.send('OK'))

router.route('/state')
  .get(serviceCtrl.getState)

router.route('/estimation')
  .post(serviceCtrl.getEstimation)

router.route('/trips')
  .post(serviceCtrl.createTrip)

router.route('/trips/:tripId')
  .put(serviceCtrl.updateTrip)
  .delete(serviceCtrl.endTrip)

router.param('tripId', serviceCtrl.loadTrip)

module.exports = router
