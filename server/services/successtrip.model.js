const Promise = require('bluebird')
const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp')

mongoose.Promise = Promise

const SuccessTripSchama = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true
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
  endTime: {
    type: Date,
    default: Date.now
  },
  path: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  }],
  distance: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  fare: {
    type: String,
    required: true
  }
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
        return Promise.reject('No such success tirp exists!')
      })
  },
}

module.exports = mongoose.model('SuccessTrip', SuccessTripSchama)
