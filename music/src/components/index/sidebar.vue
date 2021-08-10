<template>
  <div class="overlay" @click="sideBar">
    <transition name="sideBar">
      <div @click.stop>
        <div class="wrapper">
          <div class="wrapContent" @click="login">登录</div>
          <div class="wrapContent">come on</div>
          <div class="wrapContent">come on</div>
          <div class="wrapContent">come on</div>
          <div class="wrapContent">come on</div>
        </div>
        <div class="sidebarfoot">
          <div class="loginout">退出登录</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {
    sideBar () {
      this.$emit('close')
    },
    login () {
      this.$router.push('./login')
      this.closePlaybar()
    },
    closePlaybar () {
      this.$store.commit('playbar', false)
    }
  }
}
</script>

<style lang="less" scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 20;
  width: 100vw;
  height: 100vh;
  div {
    position: relative;
    width: 15rem;
    height: 100vh;
    background-color: white;
    .wrapper {
      width: 100%;
      height: 92vh;
      overflow: auto;
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
      position: absolute;
      bottom: 0;
      left: 0;
      text-align: center;
    }
  }
}
</style>
