const Koa = require('koa');
const path = require('path');

const LOGGER = require('koa-logger');

const STATIC = require('koa-static');
const BODY_PARSER = require('koa-bodyparser');
const SESSION = require('koa-session2');
const CORS = require('koa-cors');

const QUICK_RES = require('./middleware/res-json');
const controllers = require('./middleware/load-routes');

const MongoSessionStore = require('./Store');

const APP = new Koa();

// 快捷回复
QUICK_RES(APP);

APP.use(STATIC(path.join(__dirname, './public')));

APP.use(async (ctx, next) => {
  try {
    await next()
  } catch (e) {
    let status = e.status || 500;
    let message = e.message || '服务器错误';

    ctx.status = status;

    ctx.app.emit('error', e, ctx);
  }
});

APP.use(SESSION({
  key: 'SESSION_ID',
  store: new MongoSessionStore(),
  httpOnly: false
}));

APP.use(CORS({
  origin: 'http://hahaha.ha:8888, http://localhost:3333/#/',
  credentials: true
}));

APP.use(async (ctx, next) => {
  console.log('USER: ', ctx.session.user);
  await next();
});

APP.use(LOGGER());

APP.use(BODY_PARSER({
  onerror(err, ctx) {
    ctx.throw('错误的 body', 422);
  }
}));

APP.use(controllers());

APP.on('error', async (err, ctx) => {
  console.log(err);
  ctx.body = {
    msg: '服务器出错'
  }
});

APP.listen(3333, () => {
  console.log('listening to port 3333');
});
