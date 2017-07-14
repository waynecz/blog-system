<template>
  <div class="home" layout="column top-left">

    <!-- FIXED_HEAD-->
    <v-toolbar
      v-if="fixedHead"
      style="background: transparent !important;position: fixed;z-index: 10;box-shadow: none;"
      :class="theme"
    >
      <v-btn v-tooltip:right="{ html: '返回主页' }" icon @click.native="back">
        <v-icon>arrow_back</v-icon>
      </v-btn>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>person</v-icon>
      </v-btn>

      <span class="nav__username">{{username}}</span>

      <v-menu bottom open-on-hover :nudge-top="-40">
        <v-btn icon slot="activator">
          <v-icon>more_vert</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile @click.native="signout">
            <v-list-tile-title>{{actionText}}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>

      <v-toolbar-title v-if="hasToolbar" slot="extension">{{title}}</v-toolbar-title>
    </v-toolbar>

    <!-- PARALLAX_BANNER-->
    <v-parallax v-if="hasBanner" class="home__banner" src="/static/img/banner.jpg"></v-parallax>

    <!-- ARTICLE_BANNER-->
    <div v-if="hasArticleBanner" class="article__banner">
      <img src="/static/img/article_banner.jpg" class="article__banner-img">
      <h1 class="article__title">{{articleTitle}}</h1>
    </div>

    <!-- TABS-->
    <v-tabs v-if="!noTabs" dark fixed centered v-model="currentPage" @input="changePage">
      <v-toolbar v-if="hasToolbar" extended :class="theme" dark>
        <v-btn v-if="!nav" v-tooltip:right="{ html: '返回主页' }" icon @click.native="back">
          <v-icon>arrow_back</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon>person</v-icon>
        </v-btn>

        <span class="nav__username">{{username}}</span>

        <v-menu bottom open-on-hover :nudge-top="-40">
          <v-btn icon slot="activator">
            <v-icon>more_vert</v-icon>
          </v-btn>
          <v-list>
            <v-list-tile @click.native="signout">
              <v-list-tile-title>{{actionText}}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>

        <v-toolbar-title v-if="hasToolbar" slot="extension">{{title}}</v-toolbar-title>
      </v-toolbar>
      <v-tabs-bar slot="activators" :class="theme">
        <v-tabs-slider class="yellow" :class="{'hidden': !nav}"></v-tabs-slider>

        <v-tabs-item
          v-if="nav"
          v-for="(m, i) in menus"
          :key="i"
          :href="`#${m.path}`"
        >{{m.name}}
        </v-tabs-item>
      </v-tabs-bar>
    </v-tabs>

    <!-- CONTENT-->
    <router-view :user="user" :logined="logined" :currentPage="currentPage" @changeTitle="changeTitle" @changeArticleTitle="changeArticleTitle"
                 class="content"></router-view>
  </div>
</template>
<script>
  export default {
    name: 'home',
    data() {
      return {
        title: 'WAYNEBO',
        articleTitle: 'WAYNEBO',
        // meta 信息
        writting: false,
        hasBanner: false,
        nav: false,
        hasToolbar: false,
        hasArticleBanner: false,
        fixedHead: false,
        articlesToolbar: false,
        noTabs: false,

        username: '未登录',
        currentPage: 'all',
        menus: [
          {
            name: '所有文章',
            path: 'all'
          },
          {
            name: '我的文章',
            path: 'mine'
          }
        ],
        theme: 'primary',
        user: {
          name: null,
          id: null
        }
      };
    },
    computed: {
      logined () {
        return this.user._id
      },
      actionText () {
        return this.logined ? '退出登录' : '登录'
      }
    },
    created () {
      this.getUserInfo();
      this.handleRouteChange();
    },
    methods: {
      handleRouteChange() {
        this.hasBanner = this.$route.meta.banner;
        this.hasToolbar = this.$route.meta.toolbar;
        this.hasArticleBanner = this.$route.meta.articleBanner;
        this.nav = this.$route.meta.nav;
        this.fixedHead = this.$route.meta.fixedHead;
        this.noTabs = this.$route.meta.noTabs;
        this.articlesToolbar = this.$route.meta.articlesToolbar;
        if (this.$route.path === '/home/articles') {
          this.currentPage = 'all';
        }
      },
      back() {
        this.$router.push('/home/articles')
      },
      changeTitle(title) {
        this.title = title;
      },
      changeArticleTitle(title) {
        this.articleTitle = title;
      },
      changePage(page) {

      },
      async getUserInfo () {
        const res = await this.api.userinfo();
        if (res.success) {
          this.user = res.data;
          this.username = res.data.name
        } else {
          this.menus.pop();
        }
      },
      async signout () {
        if (!this.logined) {
          this.$router.push('/sign');
          return
        }
        const res = await this.api.signout();
        if (res.success) {
          this.$toasted.success('登出成功！');
          this.$router.push('/sign');
        }
      }
    },
    watch: {
      '$route': 'handleRouteChange'
    }
  };
</script>

<style lang="scss">
  .nav, .content {
    width: 100%;
  }

  .content {
    flex-grow: 1;
  }

  .hidden {
    visibility: hidden;
  }
</style>
