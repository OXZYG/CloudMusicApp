<template>
  <div>
    <div class="searchTop">
      <van-icon name="arrow-left" size="20px" tag="div" @click="routeback" />
      <van-search
        v-model="value"
        shape="round"
        placeholder="请输入搜索关键词"
        background="rgb(212,68,57)"
        tag="div"
        @search="onSearch"
      >
      </van-search>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: ''
    }
  },
  methods: {
    routeback () {
      this.$router.go(-1)
    },
    debounce (func, wait) {
      let timeout
      return function () {
        if (timeout) clearTimeout(timeout)
        timeout = setTimeout(() => func.apply(this, arguments), wait)
      }
    },
    async onSearch (val) {
      const res = this.debounce(
        await this.$http.get(`/search?keywords=${val}`),
        200
      )
      console.log(res)
    }
  }
}
</script>

<style lang="less" scoped>
.searchTop {
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 50px;
  background-color: rgb(212, 68, 57);
  .van-icon {
    width: 30px;
    padding-left: 10px;
    color: white;
  }
  .van-search {
    width: 1200px;
    flex: 1;
  }
  .van-icon-search::before {
    content: '';
  }
}
</style>
