<template>
  <div class="article">
    <!-- ARTICLES_TOOLBAR-->
    <v-toolbar class="primary" dark v-if="user && user._id === post.owner._id">
      <v-spacer></v-spacer>

      <v-btn @click.native.stop="confirmDelDialog = true" icon v-tooltip:top="{ html: '删除文章' }">
        <v-icon>delete_forever</v-icon>
      </v-btn>

      <v-btn
        @click.native="goToEdit"
        icon v-tooltip:top="{ html: '编辑文章' }">
        <v-icon>create</v-icon>
      </v-btn>

    </v-toolbar>
    <!-- content-->
    <div class="article__box" v-html="postContent"></div>

    <v-dialog width="300" v-model="confirmDelDialog">
      <v-card>
        <v-card-title class="headline">请仔细看下面这句话</v-card-title>
        <v-card-text>请问文章被删了就会没有这个道理你懂吗</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn primary flat="flat" @click.native="confirmDelDialog = false">那就不删了</v-btn>
          <v-btn primary flat="flat" @click.native="deletePost">懂，滚</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- comment-->
    <div class="article__comment-box">
      <div :key="i" class="article__comment" v-for="(c, i) in comments" layout="row top-left">
        <div class="article__comment-label">
          <div >{{c.owner.name}}：</div>
          <div class="article__comment-date">{{c.lastEditTime}}：</div>
        </div>

          <div class="article__comment-content" v-html="c.content"></div>
      </div>

      <v-text-field
        v-if="logined"
        style="margin-top: 50px;"
        name="comment"
        v-model="commentContent"
        label="编写评论"
        multi-line
      ></v-text-field>
      <v-btn v-if="logined" block primary large @click.native="saySomething">提交评论</v-btn>
    </div>
  </div>
</template>
<script>
  import marked from 'marked'

  export default {
    name: 'article',
    props: ['logined', 'user'],
    data() {
      return {
        postId: '',
        postContent: '',
        comments: [],
        loading: false,
        tags: [],
        post: {
          owner: {}
        },
        confirmDelDialog: false,
        commentContent: ''
      };
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
          this.comments = res.data.comments.reverse();
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
      },
      async deletePost () {
        const res = await this.api.delArticle(this.postId);

        if (res.success) {
          this.$toasted.success('删除成功!');
          this.$router.push(`/articles/articles`);
        }
      },
      async saySomething () {
        const res = await this.api.comment({
          content: this.commentContent,
          articleId: this.postId
        });

        if (res.success) {
          let { lastEditTime, content, owner: { name }, _id } = res.data;
          this.$toasted.success('评论成功!');
          this.commentContent = '';
          this.comments.unshift({
            lastEditTime, content, owner: { name }, _id
          })
        }
      }
    }
  };
</script>
