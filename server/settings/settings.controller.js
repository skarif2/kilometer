const SettingsModel = require('./settings.model')


function loadSettings(req, res, next, id) {
  SettingsModel.get(id)
    .then((settings) => {
      req.settings = settings
      return next()
    })
    .catch(e => next(e))
}

function getSettings(req, res) {
  SettingsModel.find({})
    .then((settings) => {
      if (settings.length > 0) {
        return res.json({
          status: 'success',
          settings: settings[0]
        })
      }
      return res.json({
        status: 'error',
        error: 'No settings found! Please create one.'
      })
    })
    .catch((err) => {
      res.josn({
        status: 'error',
        error: err
      })
    })
}

function createSettings(req, res) {
  SettingsModel.find({})
    .then((settings) => {
      if (settings.length > 0) {
        return res.json({
          status: 'error',
          error: 'Settings already created!'
        })
      } else {
        let settings = {}
        if (req.body.vehicles && req.body.vehicles.length > 0) {
          settings = new SettingsModel(req.body.vehicles)

        } else {
          settings = new SettingsModel({
            vehicles: [{
              kind: 'bike',
              base: '50',
              distance: 12,
              time: 1
            }]
          })
        }
        settings.save()
          .then((settings) => {
            return res.json({
              status: 'success',
              settings
            })
          })
          .catch((err) => {
            return res.json({
              status: 'error',
              error: err
            })
          })
      }
    })
}

function updateSettings(req, res) {
  const settings = req.settings
  if (req.body.vehicles && req.body.vehicles.length > 0) {
    settings.vehicles = req.body.vehicles
    settings.save()
      .then((savedSettings) => {
        return res.json({
          status: 'success',
          settings: savedSettings
        })
      })
      .catch((err) => {
        return res.json({
          status: 'error',
          error: err
        })
      })
  } else {
    return res.json({
      status: 'error',
      error: 'Nothing to update!'
    })
  }
}

function addVehicle(req, res) {
  const settings = req.settings
  if (req.body.kind && req.body.base && req.body.distance && req.body.time) {
    settings.vehicles.push(req.body)
    settings.save()
      .then((savedSettings) => {
        return res.json({
          status: 'success',
          settings: savedSettings
        })
      })
      .catch((err) => {
        return res.josn({
          status: 'error',
          error: err
        })
      })
  } else {
    return res.json({
      status: 'error',
      error: 'Plase provide valid parameters!'
    })
  }
}

function deleteVehicle(req, res) {
  const settings = req.settings
  if (req.body.kind) {
    settings.vehicles = settings.vehicles.filter((vehicle) => vehicle.kind != req.body.kind)
    settings.save()
      .then((savedSettings) => {
        return res.json({
          status: 'success',
          settings: savedSettings
        })
      })
      .catch((err) => {
        return res.josn({
          status: 'error',
          error: err
        })
      })
  } else {
    return res.json({
      status: 'error',
      error: 'Nothing to delete!'
    })
  }
}


module.exports = {
  loadSettings,
  getSettings,
  createSettings,
  updateSettings,
  addVehicle,
  deleteVehicle
}