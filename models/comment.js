const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const commentSchema = new Schema({
  content: String,
  owner: Object,
  lastEditTime: {
    type: String,
    default: moment().format('YYYY-MM-DD HH:mm:ss')
  },
  article: String

},{ versionKey: false});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;