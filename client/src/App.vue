<template>
  <div id="app">
    <button @click="click">CLICK ME</button>
    <button @click="click2">CLICK ME2</button>

  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'app',
  mounted() {
  },
  methods: {
    click () {
      this.api.signin({
        username: 'wayne2',
        password: '1112'
      })
//      this.api.createTag({name: '翁'})
    },
    click2 () {
//      this.api.createArticle({
//        title: '休息休息2333',
//        tags: ['翁', '诚'],
//        createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
//        summary: 'xxxx',
//        content: '#这是标题',
//      })
      this.api.getArticles('5954c5c5bb8fa7229b632e2e')
    }
  }
}
</script>

<style lang="scss">
  @import "sass/index";
</style>
