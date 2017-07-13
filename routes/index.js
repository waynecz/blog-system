const fn_user = async (ctx) => {
    if (!ctx.session.user) {
      ctx.toast('未登录!');
      return
    }

    const {name, _id} = ctx.session.user;

    ctx.give({name, _id}, '获取用户信息成功！');
};

module.exports = {
  'GET /userinfo': fn_user,
};
