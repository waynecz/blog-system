import Vue from 'vue'
import App from './App'
import router from './router'
import blogcz from './plugins'
import API from './api'
import Vuetify from 'vuetify'
import Toasted from 'vue-toasted';

Vue.use(Vuetify);
Vue.use(blogcz);
Vue.use(Toasted, {
  duration: 1500,
  position: 'bottom-left'
});

Vue.config.productionTip = false;

router.beforeEach(async (to, form, next) => {
  if (to.meta.notNeedAuth) {
    next()
    return
  }
  const res = await API.userinfo();
  window.USER = res.data;

  if (to.matched.some(record => record.meta.needAuth)) {
    if (!res.success) {
      next({
        path: '/sign',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
});

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
