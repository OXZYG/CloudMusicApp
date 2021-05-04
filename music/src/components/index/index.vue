<template>
  <div>
    <van-sticky>
      <top-bar></top-bar>
    </van-sticky>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import TopBar from './topbar'

export default {
  components: { TopBar },
  data () {
    return {}
  }
}
</script>
<style lang="less" scoped>
// 默认z-index: 99
/deep/.van-sticky--fixed {
  z-index: 2;
}
</style>
