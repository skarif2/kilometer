const Promise = require('bluebird')
const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp')

mongoose.Promise = Promise

const SettingsSchama = new mongoose.Schema({
  vehicles: [{
    kind: {
      type: String,
      required: true,
      unique: true
    },
    base: {
      type: Number,
      required: true
    },
    distance: {
      type: Number,
      required: true
    },
    duration: {
      type: Number,
      required: true
    }
  }]
})

SettingsSchama.plugin(timestamps)

SettingsSchama.statics = {
  get(id) {
    return this.findById(id)
      .exec()
      .then((settings) => {
        if (settings) {
          return settings
        }
        return Promise.reject('No settings exists!')
      })
  },

  getFirstOne() {
    return this.findOne({}, [], { $orderby : { 'created_at' : -1 } })
      .exec()
      .then((settings) => {
        if (settings) {
          return settings
        }
        return Promise.reject('No settings exists!')
      })
  }
}

module.exports = mongoose.model('Setting', SettingsSchama)
