import Vue from 'vue'
import Router from 'vue-router'

import App from './App.vue'
import Home from '@/components/Home.vue'
import Sign from '@/pages/Sign.vue'
import Articles from '@/pages/Articles.vue'
import Detail from '@/pages/Detail.vue'
import Write from '@/pages/Write.vue'
import Edit from '@/pages/Edit.vue'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'App',
      component: App,
      children: [
        {
          path: 'sign',
          name: 'sign',
          component: Sign,
          meta: {
            notNeedAuth: true
          }
        },
        {
          path: 'home',
          name: 'home',
          component: Home,
          redirect: 'home/articles',
          children: [
            {
              path: 'articles',
              name: 'articles',
              component: Articles,
              meta: {
                banner: true,
                toolbar: false,
                nav: true,
                fixedHead: true,
                notNeedAuth: true
              }
            },
            {
              path: 'article/:id',
              name: 'article',
              component: Detail,
              meta: {
                articleBanner: true,
                banner: false,
                toolbar: false,
                nav: false,
                fixedHead: true,
                noTabs: true,
                articlesToolbar: true,
                notNeedAuth: true
              }
            },
            {
              path: 'write',
              name: 'write',
              component: Write,
              meta: {
                needAuth: true,
                toolbar: true,
                nav: false
              }
            },
            {
              path: 'edit/:id',
              name: 'edit',
              component: Edit,
              meta: {
                needAuth: true,
                toolbar: true,
                nav: false
              }
            }
          ]
        }
      ]
    },
    {
      path: '*',
      redirect: '/home/articles'
    },
  ]
})
