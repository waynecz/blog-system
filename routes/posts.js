const Article = require('../models/article');
const Tag = require('../models/tag');
const User = require('../models/user');
const ObjectId = require('mongoose').Types.ObjectId;
const moment = require('moment');

const getTagsId = async (tags) => {
  let TS = await Promise.all(
    tags.map(t => {
      return Tag.findOne({
        name: t
      }).exec();
    })
  );
  return TS.map(e => new ObjectId(e.id));
};

const updateUsersArticles = (ctx, articleId, addOrDel = true) => {
  const userId = ctx.session.user._id;
  const articles = ctx.session.user.articles;

  if (addOrDel) {
    articles.concat(articleId);
  } else {
    articles.splice(articleId.indexOf(articles), 1)
  }

  User.findByIdAndUpdate(userId, { articles }).exec();
};

const checkIfIsOwner = require('../utils/check-owner');
// 接口部分
const fn_get_posts = async (ctx) => {
  const {
    pageSize,
    pageIndex
  } = ctx.request.query;


  let articles = await Article.find({
  })
    .sort('-lastEditTime')
    .skip((Number(pageIndex) - 1) * Number(pageSize))
    .limit(Number(pageSize))
    .populate('tags')
    .populate({
      path: 'owner',
      select: 'name'
    }).exec();

  ctx.give({
    articles,
    count: await Article.find({
    }).count()
  }, '获取文章列表成功！');
};

const fn_get_someones_posts = async (ctx, next) => {
  const {
    pageSize,
    pageIndex
  } = ctx.request.query;

  let articles = await Article.find({
    owner: ctx.params.userId
  }).sort('-lastEditTime')
    .skip((Number(pageIndex) - 1) * Number(pageSize))
    .limit(Number(pageSize))
    .populate('tags')
    .populate({
      path: 'owner',
      select: 'name'
    }).exec();

  ctx.give({
    articles,
    count: await Article.find({
      owner: ctx.params.userId
    }).count()
  }, '获取个人文章列表成功！');
};

const fn_get_post_detail = async (ctx, next) => {
  if (!ctx.params.postId) {
    ctx.toast('ID ?');
    return
  }

  let article = await Article.findById(ctx.params.postId).populate('tags').populate({
    path: 'owner',
    select: 'name'
  }).exec();

  ctx.give(article._doc, '获取文章内容成功！');
};

const fn_create_post = async (ctx) => {
  const {
    title,
    tags,
    createTime,
    summary,
    content
  } = ctx.request.body;

  let article = await Article.findOne({
    title
  }).exec();

  if (article) {
    ctx.toast('有一篇名字一样的了！', article._doc);
    return;
  }

  let newArticle = await new Article({
    title,
    tags: await getTagsId(tags),
    owner: new ObjectId(ctx.session.user._id),
    createTime,
    summary,
    content,
    comments: []
  }).save();

  updateUsersArticles(ctx, newArticle._doc._id);

  ctx.give(newArticle._doc, '新建文章成功！');

};

const fn_update_post = async (ctx) => {
  const data = Object.assign(ctx.request.body, { lastEditTime: moment().toDate() });

  if (data.tags) {
    data.tags = await getTagsId(data.tags);
  }

  if (await checkIfIsOwner(ctx, Article, 'postId')) return;

  let article = await Article.findByIdAndUpdate(ctx.params.postId, data).exec();

  if (!article) {
    ctx.toast('该文章不存在！');
    return;
  }

  let newArticle = await Article.findById(ctx.params.postId)
    .populate('tags owner')
    .exec();

  ctx.give(newArticle._doc, '文章更新成功！');
};

const fn_delete_post = async (ctx) => {
  if (await checkIfIsOwner(ctx, Article, 'postId')) return;

  let article = await Article.findOneAndRemove({
    _id: new ObjectId(ctx.params.postId)
  }).exec();

  if (!article) {
    ctx.toast('该文章不存在！');
    return;
  }

  updateUsersArticles(ctx, article._doc._id, false);

  ctx.give('删除文章成功！');
};

const fn_create_tag = async (ctx) => {
  let { name } = ctx.request.body;

  let tag = await Tag.findOne({
    name,
    owner: new ObjectId(ctx.session.user._id)
  }).exec();

  if (tag) {
    ctx.toast('该 Tag 已存在！', tag._doc);
    return;
  }

  let newTag = await new Tag({ name }).save();

  ctx.give(newTag._doc, '创建成功！');
};

const fn_del_tag = async (ctx) => {
  if (await checkIfIsOwner(ctx, Tag, 'tagId')) return;

  let tag = await Tag.findOneAndRemove({
    _id: new ObjectId(ctx.params.tagId)
  }).exec();

  if (!tag) {
    ctx.toast('该 Tag 不存在！');
    return;
  }

  ctx.give('移除成功！');

};

const fn_get_tag = async (ctx) => {

  let tags = await Tag.find().exec();

  ctx.give({
    list: tags
  }, '获取 tag 成功！');

};

module.exports = {
  'GET /posts': fn_get_posts,
  'GET /posts/user/:userId': fn_get_someones_posts,
  'GET /posts/:postId': fn_get_post_detail,
  'POST /posts ?': fn_create_post,
  'POST /posts/:postId ?': fn_update_post, // PATCH 暂时失效了
  'DELETE /posts/:postId ?': fn_delete_post,
  'GET /tags': fn_get_tag,
  'POST /tags ?': fn_create_tag,
  'DELETE /tags/:tagId ?': fn_del_tag
};
