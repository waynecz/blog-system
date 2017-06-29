import API from '@/src/api/API'
export default {
  data () {
    return {
      api: API
    }
  },
  methods: {
    msg (msg, type) {
      this.$message({
        message: msg,
        type: type
      })
    }
  }
}
