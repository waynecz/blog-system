const checkLoginStatus = async (ctx, next) => {
  if (!ctx.session.user) {
    ctx.toast('听话，先登录');
    return
  }
  await next()
};

module.exports = checkLoginStatus;