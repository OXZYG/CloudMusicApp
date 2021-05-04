<template>
  <div>
    当前播放
    <div class="musicList">
      <van-list>
        <div
          v-for="(item, index) in this.songs"
          :key="item.id"
          class="songItem"
        >
          <div class="songIndex">{{ index }}</div>
          <div class="songInfo" @click="showSongInfo(item)">
            <div class="songName textOverflow">
              {{ item.name }}
            </div>
            <div class="artists textOverflow">
              {{ item.artists | artistName }}
            </div>
          </div>
          <div class="duration">{{ item.duration | durToMin }}</div>
          <div class="icon">
            <van-icon name="ellipsis" />
          </div>
        </div>
      </van-list>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {}
  },
  computed: {
    songs () {
      return this.$store.getters.onPlaySongs
    }
  }
}
</script>

<style lang="less" scoped>
.searchResItem {
  height: 4rem;
  display: grid;
  grid-template-columns: 1fr 20fr 1fr 2fr;

  .songIndex {
    padding-left: 1rem;
    width: 2rem;
    display: inline-block;
    color: rgba(0, 0, 0, 0.5);
    line-height: 4rem;
  }
  .songInfo {
    padding: 4px 0;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .songName {
      -webkit-line-clamp: 2;
      font-weight: 800;
    }
    .artists {
      -webkit-line-clamp: 2;
    }
  }
  .duration {
    line-height: 4rem;
    text-align: end;
    color: rgba(0, 0, 0, 0.5);
    font-weight: 600;
  }
  .icon {
    display: flex;
    justify-content: flex-end;
    .van-icon {
      // line-height: 3rem;
      // 超出窗口，需要偏移
      transform: rotateZ(90deg) translateY(2rem);
      font-weight: 900;
      color: rgba(0, 0, 0, 0.5);
    }
  }
</style>
