const Promise = require('bluebird')
const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp')

mongoose.Promise = Promise

const TripSchama = new mongoose.Schema({
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
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  startTime: {
    type: Date,
    default: Date.now
  }
})

TripSchama.plugin(timestamps)

TripSchama.statics = {
  get(id) {
    return this.findById(id)
      .exec()
      .then((trip) => {
        if (trip) {
          return trip
        }
        return Promise.reject('No such tirp exists!')
      })
  }
}

module.exports = mongoose.model('Trip', TripSchama)
