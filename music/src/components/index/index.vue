<template>
  <div>
    <van-sticky>
      <top-bar @open="sideBar"></top-bar>
    </van-sticky>
    <transition name="overlay">
      <side-bar v-show="showSidebar" @close="sideBar"></side-bar>
    </transition>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import TopBar from './topbar'
import SideBar from './sidebar'

export default {
  components: { TopBar, SideBar },
  data () {
    return {
      showSidebar: false
    }
  },
  methods: {
    sideBar () {
      this.showSidebar = !this.showSidebar
      // 滚动穿透问题，锁定/解除滚动
      if (this.showSidebar) {
        this.lockScroll()
      } else {
        this.looseScroll()
      }
    }, // 锁定滚动
    lockScroll () {
      const scrollTop =
        document.body.scrollTop || document.documentElement.scrollTop
      document.body.style.cssText +=
        'position:fixed;width:100%;top:-' + scrollTop + 'px;'
    },
    // 解除滚动
    looseScroll () {
      const body = document.body
      body.style.position = ''
      const top = body.style.top
      document.body.scrollTop = document.documentElement.scrollTop = -parseInt(
        top
      )
      body.style.top = ''
    }
  }
}
</script>
<style lang="less" scoped>
// 默认z-index: 99，布局需要调整
/deep/ .van-sticky--fixed {
  z-index: 10;
}

.overlay-enter-active,
.overlay-leave-active {
  transition: all 0.3s;
}
.overlay-enter,
.overlay-leave-to {
  transform: translateX(-100px);
  opacity: 0;
}
.overlay-leave,
.overlay-enter-to {
  opacity: 1;
}
</style>
