<template>
  <van-tabbar>
    <audio :src="playingSong.urlInfo.url" autoplay></audio>
    <div class="songPic flexCenter" @click="detail">
      <img :src="picUrl" />
    </div>
    <div class="songInfo flexCenter" @click="detail">
      <div class="songName textOverflow">
        {{ playingSong.name }}
      </div>
      <div class="artists textOverflow">
        {{ playingSong.artists | artistName }}
      </div>
    </div>
    <div class="flexCenter" @click="playBtn">
      <van-icon name="pause" v-show="!playOrpause" />
      <van-icon name="play" v-show="playOrpause" />
    </div>
    <div class="playList flexCenter">
      <div class="mus-bofangliebiao"></div>
    </div>
    <transition name="overlay">
      <div class="overlay" v-show="showDetail">
        <playdetail :showDetail="showDetail" @closeDetail="detail"></playdetail>
      </div>
    </transition>
  </van-tabbar>
</template>
<script>
import playdetail from './playdetail.vue'
export default {
  components: { playdetail },
  data () {
    return {
      // 播放页面
      showDetail: false
    }
  },
  computed: {
    playingSong () {
      return this.$store.state.playingSong
    },
    playOrpause () {
      return this.$store.state.playCtr
    },
    defPic () {
      return this.$store.state.defAlbumPic
    },
    picUrl () {
      return this.playingSong.picUrl ? this.playingSong.picUrl : this.defPic
    }
  },
  methods: {
    playBtn () {
      this.$store.commit('playBtn')
    },
    // 打开/关闭播放音乐页面
    detail () {
      this.showDetail = !this.showDetail
      if (this.showDetail) {
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
.flexCenter {
  display: flex;
  justify-content: center;
  align-items: center;
}
.textOverflow {
  /* CSS文本超过n行用省略号代替(兼容所有浏览器) */
  display: -webkit-box; /*设置块元素的布局为伸缩布局；*/
  overflow: hidden;
  text-overflow: ellipsis; /*超出盒子的部分使用省略号表示。*/
  -webkit-box-orient: vertical; /*设置伸缩项的布局方向；垂直*/
}
.van-tabbar {
  z-index: 10;
  display: grid;
  grid-template-columns: 4fr 12fr 1fr 3fr;
  column-gap: 1rem;
  .songPic {
    padding-left: 1rem;
    img {
      display: block;
      width: 40px;
      border-radius: 10%;
      z-index: 1;
    }
  }
  .songInfo {
    flex-direction: column;
    .songName {
      -webkit-line-clamp: 1;
    }
    .artists {
      color: rgba(0, 0, 0, 0.5);
      -webkit-line-clamp: 1;
    }
  }
  .overlay {
    z-index: 1;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 1);
  }
  // 过渡效果
  .overlay-enter-active,
  .overlay-leave-active {
    transition: all 1s;
  }
  .overlay-enter,
  .overlay-leave-to {
    transform: translateY(100vh);
    opacity: 0;
  }
  .overlay-leave,
  .overlay-enter-to {
    opacity: 1;
  }
}
</style>
