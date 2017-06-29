import axios from 'axios'

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
      console.warn(res.data.msg || setting.errmsg);
      return res.data
    }
  }
};

const fetch = {
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
  signup(data) {
    const url = '/signup';
    return fetch.post(url, data);
  },
  signin(data) {
    const url = '/signin';
    return fetch.post(url, data);
  },
  signout() {
    const url = '/signout';
    return fetch.get(url);
  },
  createTag(data) {
    const url = '/tags';
    return fetch.post(url, data);
  },
  delTag(id) {
    const url = `/tags/${id}`;
    return fetch.del(url, { errmsg: '删除失败' });
  },
  createArticle(data) {
    const url = '/posts';
    return fetch.post(url, data);
  },
  readArticle(id) {
    const url =  `/posts/${id}`;
    return fetch.get(url);
  },
  delArticle(id) {
    const url = `/posts/${id}`;
    return fetch.del(url, { errmsg: '删除失败' });
  },
  updateArticle(id, data) {
    const url = `/posts/${id}`;
    return fetch.post(url, data, { errmsg: '更新文章失败' });
  },
  getArticles() {
    const url = `/posts`;
    return fetch.get(url, null, { errmsg: '获取文章列表失败' });
  },
  getSomeonesArticles(id) {
    const url = `/posts/user/${id}`;
    return fetch.get(url, { errmsg: '获取文章列表失败' });
  }
};

export default APIS
