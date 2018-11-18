const Promise = require('bluebird')
const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp')

mongoose.Promise = Promise

const SuccessTripSchama = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  vehicle: {
    type: String,
    required: true
  },
  passenger: {
    name: {
      type: String,
      default: undefined
    },
    phone: {
      type: String,
      default: undefined
    }
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  path: [{
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  }]
})

SuccessTripSchama.plugin(timestamps)

SuccessTripSchama.statics = {
  get(id) {
    return this.findById(id)
      .exec()
      .then((trip) => {
        if (trip) {
          return trip
        }
        return Promise.reject('No such tirp exists!')
      })
  },

  getByDeviceId(deviceId) {
    return this.findOne({ deviceId })
      .exec()
      .then((trip) => {
        if (trip) {
          return Promise.reject('You are already on a trip!')
        }
        return true
      })
  }
}

module.exports = mongoose.model('SuccessTrip', SuccessTripSchama)
