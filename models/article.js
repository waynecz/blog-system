const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const articleSchema = new Schema({
  title: String,
  visits: {
    type: Number,
    default: 0
  },
  tags: [{
    type:Schema.Types.ObjectId,
    ref: 'Tag'
  }],
  createTime: {
    type: String
  },
  lastEditTime: {
    type: String,
    default: moment().format('YYYY-MM-DD HH:mm:ss')
  },
  hidden:  {
    type: Boolean,
    default: false
  },
  summary: String,
  content: String,
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'comment'
  }]
}, { versionKey: false, skipVersioning: { tags: true } });

articleSchema.set('toJSON', { getters: true, virtuals: true});
articleSchema.set('toObject', { getters: true, virtuals: true});

// articleSchema.path('createTime').get(function (v) {
//   return new Date(v).format('yyyy-MM-dd hh:mm:ss');
// });
// articleSchema.path('lastEditTime').get(function (v) {
//   return new Date(v).format('yyyy-MM-dd hh:mm:ss');
// });

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;