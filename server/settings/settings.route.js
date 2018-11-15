const express = require('express')
const settingsCtrl = require('./settings.controller')

const router = express.Router()

router.route('/')
  .get(settingsCtrl.getSettings)
  .post(settingsCtrl.createSettings)

router.route('/:settingsId')
  .put(settingsCtrl.updateSettings)

router.route('/:settingsId/add')
  .post(settingsCtrl.addVehicle)

router.route('/:settingsId/delete')
  .delete(settingsCtrl.deleteVehicle)

router.param('settingsId', settingsCtrl.loadSettings)

module.exports = router