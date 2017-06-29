module.exports = (app) => {
  app.context.toast = function (errMsg = "爆炸了", extraData) {
    const ctx = this;
    ctx.body = {
      msg: errMsg,
      success: false,
      data: Object.assign({}, extraData)
    };
  };

  app.context.give = function (data = {}, msg = "成功") {
    const ctx = this;
    let message = msg;
    let output = data;

    if (typeof data === 'string') {
      message = data;
      output = {};
    }

    ctx.body = {
      msg: message,
      success: true,
      data: Object.assign({}, output)
    };
  }
};