<template>
  <div>
    <div class="header">
      <van-icon name="weapp-nav" size="20" @click="sideBar" />
      <transition name="overlay">
        <div class="overlay" v-show="showSidebar" @click="sideBar">
          <transition name="sideBar">
            <div v-show="showSidebar" @click.stop>
              <div class="wrapper">
                <div class="wrapContent">come on</div>
              </div>
              <div class="sidebarfoot">
                <div class="loginout">退出登录</div>
              </div>
            </div>
          </transition>
        </div>
      </transition>
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
  data () {
    return {
      activeName: 'recommend',
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
    },
    // 锁定滚动
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
.header {
  color: white;
  background-color: rgb(212, 68, 57);
  line-height: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}
// 侧边栏过渡效果
.overlay-enter-active,
.sideBar-enter-active,
.overlay-leave-active,
.sideBar-leave-active {
  transition: all 1s;
}
.overlay-enter,
.overlay-leave-to {
  opacity: 0;
}
.sideBar-enter,
.sideBar-leave-to {
  opacity: 0;
  transform: translateX(-100px);
}
.overlay-leave,
.overlay-enter-to,
.sideBar-leave,
.sideBar-enter-to {
  opacity: 1;
}
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  div {
    position: relative;
    width: 15rem;
    height: 100vh;
    .wrapper {
      width: 100%;
      height: 92vh;
      overflow: auto;
      background-color: rgba(0, 0, 0, 0.4);
      .wrapContent {
        width: 80%;
        height: 5rem;
        margin: 1rem;
        background-color: wheat;
      }
    }
    .sidebarfoot {
      width: 15rem;
      height: 8vh;
      background-color: rgba(0, 0, 0, 0.4);
      position: absolute;
      bottom: 0;
      left: 0;
      text-align: center;
    }
  }
}
</style>
