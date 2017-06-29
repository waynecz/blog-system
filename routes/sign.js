const User = require('../models/user');
const md5 = require('md5');

const fn_signin = async (ctx) => {
  let { username, password } = ctx.request.body;

  let user = await User.findOne({
    username
  }).exec();

  console.log('USER:', user);

  if (!user) {
    ctx.toast('用户不存在！');
    return;
  }

  if (user.password !== md5(password)) {
    ctx.toast('密码错误！');
    return;
  }

  ctx.session.user = user;
  ctx.give(user, '登录成功！');
};

const fn_signup = async (ctx) => {
  let { username, password, name } = ctx.request.body;
  password = md5(password);

  let user = await User.findOne({
    username
  }).exec();

  if (user) {
    ctx.toast('账户已存在！');
    return;
  }

  let createTime = Date.now();

  let newUser = await new User({ name, username, password, createTime }).save();
  ctx.session.user = newUser;

  ctx.give(newUser);

};

const fn_signout = async (ctx) => {
  ctx.session.user = null;
  ctx.give({}, '登出成功');
};

module.exports = {
  'POST /signup': fn_signup,
  'POST /signin': fn_signin,
  'GET /signout': fn_signout
};
