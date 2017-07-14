<template>
  <div class="articles" layout="column top-center">

    <div v-if="posts.length > 0" class="articles__post" v-for="(p, i) in posts" :key="i">
      <h4 class="articles__title" @click="readPost(p._id)">
        {{p.title}}
      </h4>
      <p class="articles__tags">{{p.tags}}</p>
      <p class="articles__summary article article--list" v-html="p.content"></p>
      <p class="articles__date">{{p.lastEditTime}}</p>
    </div>

    <div v-if="posts.length === 0">
      <h4 class="articles__tags">
        暂无文章, 快去写吧
      </h4>
    </div>

    <div class="articles__pagination">
      <v-pagination @input="changeIndex" v-bind:length.number="pageCount" v-model="params.pageIndex"
                    total-visible="3"></v-pagination>
    </div>

    <v-btn
      v-if="logined"
      dark
      primary
      fab
      fixed
      bottom
      right
      v-tooltip:top="{ html: '写文章' }"
      @click.native="goToWrite"
    >
      <v-icon>add</v-icon>
    </v-btn>
  </div>
</template>
<script>
  import marked from 'marked'

  export default {
    name: 'articles',
    props: ['currentPage', 'logined', 'user'],
    data() {
      return {
        posts: [],
        loading: false,
        params: {
          pageSize: 20,
          pageIndex: 1
        },
        total: 0,
        pageCount: 1,
      };
    },
    methods: {
      async getPosts (flag = false) {
        let res;

        if (!flag) {
          res = await this.api.getArticles(this.params);
        } else {
          res = await this.api.getSomeonesArticles(this.user._id, this.params);
        }

        if (res.success) {
          this.posts = res.data.articles.map(e => {
            e.tags = e.tags.map(e => e.name).join(', ');
            e.content = marked(e.content)
                .replace(/h\d/, 'p')
                .replace(/img/g, 'span')
                .replace(/blockquote/g, 'p')
                .replace(/\n/g, '')
                .replace(/ol/g, 'span')
                .replace(/li/g, 'span')
                .replace(/p/g, 'span')
                .replace(/\s/g, '')
                .slice(0, 600) + '......';
            return e
          });

          this.total = res.data.count;
          this.pageCount = this.total > 20 ? Math.ceil(this.total / this.params.pageIndex) : 1;
        }
      },
      goToWrite () {
        this.$router.push('/home/write');
      },
      readPost (id) {
        this.$router.push(`/home/article/${id}`)
      },
      changeIndex (pi) {
        this.params.pageIndex = pi;
        this.getPosts();
      }

    },
    created () {
      this.getPosts();
    },
    watch: {
      currentPage (val) {
        if (val === 'mine') {
          this.getPosts(true);
        } else {
          this.getPosts();
        }
      }
    }
  };
</script>
