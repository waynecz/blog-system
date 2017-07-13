<template>
  <div class="article">
    <!-- content-->
    <div class="article__box" v-html="postContent"></div>

    <v-btn
      v-if="user && user._id === post.owner._id"
      dark
      secondary
      fab
      fixed
      bottom
      right
      v-tooltip:top="{ html: '编辑' }"
      @click.native="goToEdit"
    >
      <v-icon>border_color</v-icon>
    </v-btn>

  </div>
</template>
<script>
  import marked from 'marked'

  export default {
    name: '',
    props: {},
    data() {
      return {
        postId: '',
        postContent: '',
        loading: false,
        tags: [],
        post: {
          owner: {}
        }
      };
    },
    computed: {
      user () {
        return window.USER
      }
    },
    created() {
      this.postId = this.$route.params.id;
      this.getPostDetail(this.$route.params.id);
    },
    methods: {
      async getPostDetail (id) {
        const res = await this.api.readArticle(id);

        if (res.success) {
          this.post = res.data;
          this.postContent = marked(this.post.content);
          this.$emit('changeArticleTitle', this.post.title);
        }

        this.$nextTick(() => {
          document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightBlock(block);
          });
        })
      },
      goToEdit () {
        this.$router.push(`/home/edit/${this.postId}`)
      }
    }
  };
</script>
