import axios from 'axios'
import Vue from 'vue'

const HOST = 'http://127.0.0.1:3333';

const catchHandler = (e) => {
  console.warn(e);
};

const thenHandelr = (option = {}) => {
  const setting = Object.assign(option, { loading: 'loading', errmsg: '胜败乃兵家常事，大侠请重新来过' });

  return function (res) {
    if (res.data.success) {
      return res.data
    } else {
      if (!window.location.href.includes('sign')) {
        Vue.toasted.show(res.data.msg || setting.errmsg);
      }
      return res.data
    }
  }
};

const FETCH = {
  get(url, params, option) {
    return axios.get(HOST + url, {
      params,
      withCredentials: true
    }).catch(catchHandler).then(thenHandelr(option))
  },
  post(url, data, option = { patch: false }) {
    return axios({
      url: HOST + url,
      data: data,
      method: option.patch ? 'PATCH' : 'POST',
      withCredentials: true
    }).catch(catchHandler).then(thenHandelr(option))
  },
  del(url, option) {
    return axios.delete(HOST + url, {
      withCredentials: true
    }).catch(catchHandler).then(thenHandelr(option))
  }
};

const APIS = {
  userinfo() {
    const url = '/userinfo';
    return FETCH.get(url);
  },
  signup(data) {
    const url = '/signup';
    return FETCH.post(url, data);
  },
  signin(data) {
    const url = '/signin';
    return FETCH.post(url, data);
  },
  signout() {
    const url = '/signout';
    return FETCH.get(url);
  },
  createTag(data) {
    const url = '/tags';
    return FETCH.post(url, data);
  },
  getTags() {
    const url = '/tags';
    return FETCH.get(url);
  },
  delTag(id) {
    const url = `/tags/${id}`;
    return FETCH.del(url, { errmsg: '删除失败' });
  },
  createArticle(data) {
    const url = '/posts';
    return FETCH.post(url, data);
  },
  readArticle(id) {
    const url = `/posts/${id}`;
    return FETCH.get(url);
  },
  delArticle(id) {
    const url = `/posts/${id}`;
    return FETCH.del(url, { errmsg: '删除失败' });
  },
  updateArticle(id, data) {
    const url = `/posts/${id}`;
    console.log(id)
    return FETCH.post(url, data, { errmsg: '更新文章失败' });
  },
  getArticles(params) {
    const url = `/posts`;
    return FETCH.get(url, params, { errmsg: '获取文章列表失败' });
  },
  getSomeonesArticles(id, params) {
    const url = `/posts/user/${id}`;
    return FETCH.get(url, params, { errmsg: '获取文章列表失败' });
  },
  comment(data) {
    const url = `/comments`;
    return FETCH.post(url, data, { errmsg: '评论失败' });
  },
  modifyComment(id, data) {
    const url = `/comments/${id}`;
    return FETCH.post(url, data, { errmsg: '修改评论失败' });
  },
  delComment(id) {
    const url = `/comments/${id}`;
    return FETCH.del(url, { errmsg: '删除评论失败' });
  }

};

export default APIS
