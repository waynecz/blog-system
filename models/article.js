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
    type: Date
  },
  lastEditTime: {
    type: Date,
    default: moment().toDate()
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

articleSchema.path('createTime').get((v) => {
  return moment(v).format('YYYY-MM-DD HH:mm:ss');
});
articleSchema.path('lastEditTime').get((v) => {
  return moment(v).format('YYYY-MM-DD HH:mm:ss');
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;