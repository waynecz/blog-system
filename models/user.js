const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  username:String,
  password:String,
  createTime: String,
  articles: [{
    type: Schema.Types.ObjectId,
    ref: 'Article'
  }]
});

const findOrCreate = require('mongoose-findorcreate');
userSchema.plugin(findOrCreate);
const User = mongoose.model('User', userSchema);

module.exports = User;