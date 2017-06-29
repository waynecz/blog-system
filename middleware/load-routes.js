const fs = require('fs');
const path = require('path');
require('colors');

const ROUTER = require('koa-router')();

const checkLoginStatus = require('../middleware/check-login');

module.exports = function () {
  const files = fs.readdirSync('./routes');

  const js_files = files.filter(f => f.endsWith('.js'));

  const METHOD_COLOR = {
    GET: 'blue',
    POST: 'green',
    DELETE: 'red',
    PATCH: 'yellow'
  };

  // 导入js文件
  js_files.forEach(f => {
    let mapping = require(path.join(process.cwd(), '/routes/' + f));

    Object.keys(mapping).forEach(url => {
      const elements = url.split(' ');

      const method = elements[0];
      const path = elements[1];
      const needSign = elements[2] === '?';

      if (needSign) {
        ROUTER[method.toLowerCase()](path, checkLoginStatus);
      }

      // 注册路由
      ROUTER[method.toLowerCase()](path, mapping[url]);

      // console.log(`【 register URL mapping 】: ${method} ${path}`[METHOD_COLOR[method]]);
    })
  });

  return ROUTER.routes();
};
