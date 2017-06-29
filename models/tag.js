const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tagSchema = new Schema({
  name: String,
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
},{ versionKey: false});

tagSchema.set('toJSON', { getters: true, virtuals: true});
tagSchema.set('toObject', { getters: true, virtuals: true});

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;