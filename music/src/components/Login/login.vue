<template>
  <div>
    <div class="top flexCenter">
      <van-icon
        class="flexCenter"
        name="arrow-left"
        size="20px"
        tag="div"
        @click="routeback"
      />
    </div>
    <div class="loginForm">login page</div>
  </div>
</template>

<script>
export default {
  methods: {
    routeback () {
      this.$router.push('./index')
      this.showPlaybar()
    },
    showPlaybar () {
      this.$store.commit('playbar', true)
    }
  }
}
</script>

<style lang="less" scoped>
.flexCenter {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
