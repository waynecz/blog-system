const checkIfIsOwner = require('../utils/check-owner');
const Comment = require('../models/comment');
const moment = require('moment');
const ObjectId = require('mongoose').Types.ObjectId;

const fn_create_comment = async (ctx) => {
  const {
    content,
    article
  } = ctx.request.body;

  let newComment = await new Comment({
    content,
    article: new ObjectId(article),
    owner: {
      name: ctx.session.user.name,
      id: ctx.session.user._id
    },
    lastEditTime: moment().format('YYYY-MM-DD HH:mm:ss')
  }).save();

  ctx.give(newComment, '评论成功！');

};

const fn_update_comment = async (ctx) => {
  const data = Object.assign(ctx.request.body, { lastEditTime: moment().format('YYYY-MM-DD HH:mm:ss') });

  if (await checkIfIsOwner(ctx, Comment, 'commentId')) return;

  let comment = await Comment.findByIdAndUpdate(ctx.params.commentId, data).exec();

  if (!comment) {
    ctx.toast('该评论不存在！');
    return;
  }

  let newComment = await Comment.findById(ctx.params.commentId)
    .populate('article')
    .exec();

  ctx.give(newComment, '评论修改成功！');

};

const fn_delete_comment = async (ctx) => {
  if (await checkIfIsOwner(ctx, Comment, 'commentId')) return;

  let comment = await Comment.findOneAndRemove({
    _id: new ObjectId(ctx.params.commentId)
  }).exec();

  if (!comment) {
    ctx.toast('该评论不存在！');
    return;
  }

  ctx.give('删除评论成功！');

};

module.exports = {
  'POST /comments ?': fn_create_comment,
  'POST /comments/:commentId ?': fn_update_comment,
  'DELETE /comments/:commentId ?': fn_delete_comment
};
