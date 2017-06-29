const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
  sid: {
    type: String,
    index: true
  },
  maxAge: Number,
  content: String,
  now: {
    type: Date,
    default: Date.now
  }
});

const findOrCreate = require('mongoose-findorcreate');
sessionSchema.plugin(findOrCreate);
const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;