<template>
  <div class="write">
    <!-- head-->
    <div class="write__head" layout="row center-justify">
      <div class="write__head-inner">
        <v-text-field
          name="title"
          v-model="form.title"
          label="TITLE"
          prepend-icon="wb_sunny"
          required
        ></v-text-field>
      </div>
      <div class="write__head-inner">
        <v-select
          label="TAGS"
          v-bind:items="tags"
          v-model="form.tags"
          prepend-icon="local_offer"
          multiple
          max-height="400"
        ></v-select>
      </div>
      <div class="write__head-inner">
        <v-text-field
          name="addtags"
          v-model="tagName"
          label="新建标签「点右边那个去」"
          append-icon="add_circle"
          :append-icon-cb="addTag"
        ></v-text-field>
      </div>
    </div>
    <!-- write-->
    <div class="write__box">
      <textarea id="PLAY" class="write__area"></textarea>
    </div>
    <!-- action-->
    <v-layout row justify-center>
      <v-flex xs8>
        <v-btn primary block large @click.native="save">post it</v-btn>
      </v-flex>
    </v-layout>

  </div>
</template>
<script>
  import SimpleMDE from 'simplemde'
  import marked from 'marked'

  export default {
    name: 'write',
    data() {
      return {
        loading: false,
        editor: null,
        form: {
          title: '',
          tags: [],
          createTime: '',
          summary: '',
          content: '',
        },
        tags: [],
        tagName: ''
      };
    },
    created() {
      this.getTagList();
      this.$emit('changeTitle', '写点什么吧');
    },
    mounted() {
      this.editor = new SimpleMDE({ element: document.getElementById("PLAY") })
    },
    methods: {
      async addTag () {
        if (!this.tagName.trim()) {
          this.$toasted.error('拜托写个标签名');
          return
        }
        const res = await this.api.createTag({
          name: this.tagName
        });

        if (res.success) {
          this.tagName = '';
          this.$toasted.success('创建标签成功！');
          this.getTagList();
        }
      },
      async getTagList () {
        const res = await this.api.getTags();
        this.tags = res.data.list.map(e => e.name);
      },
      async save () {
        if (this.loading) return;

        this.loading = true;

        this.form.content = this.editor.value();
        this.form.createTime = Date.now();

        console.log(marked(this.form.content));

        const res = await this.api.createArticle(this.form);

        if (res.success) {
          this.$toasted.success('保存成功!');
          this.$router.push('/home/articles');
        }

        this.loading = false;
      }
    }

  };
</script>
