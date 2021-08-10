<template>
  <div>
    <div class="header">
      <van-icon name="weapp-nav" size="20" @click="sideBar" />
      <div>M U S I C</div>
      <router-link to="/search" tag="div">
        <van-icon name="search" size="20" />
      </router-link>
    </div>
    <van-tabs v-model="activeName">
      <van-tab title="推荐" name="recommend" to="/recommend"></van-tab>
      <van-tab title="排行" name="rank" to="/rank"></van-tab>
      <van-tab title="歌手" name="singer" to="/singer"></van-tab>
    </van-tabs>
  </div>
</template>

<script>
export default {
  props: ['showSidebar'],
  data () {
    return {
      activeName: 'recommend'
    }
  },
  methods: {
    sideBar () {
      this.$emit('open')
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  color: white;
  background-color: rgb(212, 68, 57);
  line-height: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}
</style>
