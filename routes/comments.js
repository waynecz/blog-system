const fn_create_comment = async (ctx, next) => {
  next()
};

const fn_delete_comment = async (ctx, next) => {
  next()
};

module.exports = {
  'POST /posts/:postId/comment ?': fn_create_comment,
  'DELETE /posts/:postId/comment/:commentId ?': fn_delete_comment
};
