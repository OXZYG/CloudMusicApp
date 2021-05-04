<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <playbar></playbar>
  </div>
</template>

<script>
import playbar from './components/common/playbar.vue'
export default {
  components: { playbar },
  name: 'app'
}
</script>

<style lang="less">
html,
body {
  #app {
    margin: 0;
    padding: 0;
    font-family: 'Helvetica Neue', Helvetica, STHeiTi, sans-serif;
    background-color: rgba(244, 244, 244, 0);
  }
}
</style>
