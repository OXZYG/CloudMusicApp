<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="less">
html,
body {
  #app {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC',
      'Helvetica Neue', STHeiti, 'Microsoft Yahei', Tahoma, Simsun, sans-serif;
    background-color: rgba(244, 244, 244, 0);
  }
}
</style>
