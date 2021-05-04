<template>
  <div>
    <div
      class="bgImg"
      :style="{ background: 'url(' + picUrl + ') center center no-repeat' }"
    ></div>
    <div class="playdetail">
      <div class="content flexCenter">
        <div class="top flexCenter">
          <div class="closeBtn flexCenter" @click="close">
            <div class="mus-xiala icon"></div>
          </div>
          <div class="songInfo flexCenter">
            <div class="songName textOverflow">{{ playingSong.name }}</div>
            <div class="artists textOverflow">
              {{ playingSong.artists | artistName }}
            </div>
          </div>
          <div class="shareBtn flexCenter">
            <div class="mus-fenxiang icon"></div>
          </div>
        </div>
        <div class="picOrlyc flexCenter">
          <div class="pic flexCenter">
            <img :src="picUrl" />
          </div>
        </div>
        <div class="songOpt flexCenter">
          <div class="ctrTop flexCenter">
            <div class="mus-xin icon"></div>
            <div class="mus-xiazai icon"></div>
            <div class="mus-tianjia icon"></div>
          </div>
          <div class="progress flexCenter">
            <van-progress :percentage="50"></van-progress>
          </div>
          <div class="ctrBtm flexCenter">
            <div class="playMode flexCenter">
              <div class="mus-danquxunhuan icon"></div>
            </div>
            <div class="mus-shangyishoushangyige icon"></div>
            <div class="playOrpause flexCenter icon" @click="playBtn">
              <van-icon name="pause" v-show="!playOrpause" />
              <van-icon name="play" v-show="playOrpause" />
            </div>
            <div class="mus-xiayigexiayishou icon"></div>
            <div class="playList flexCenter">
              <div class="mus-bofangliebiao icon"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // 接受playbar传过来的值
  props: ['showDetail'],
  data () {
    return {}
  },
  methods: {
    close () {
      this.$emit('closeDetail')
    },
    playBtn () {
      this.$store.commit('playBtn')
    }
  },
  computed: {
    playOrpause () {
      return this.$store.state.playCtr
    },
    playingSong () {
      return this.$store.state.playingSong
    },
    defPic () {
      return this.$store.state.defAlbumPic
    },
    picUrl () {
      return this.playingSong.picUrl ? this.playingSong.picUrl : this.defPic
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
.icon {
  font-size: 2rem;
}
div {
  position: relative;
  .bgImg {
    width: 100%;
    height: 100%;
    position: fixed;
    -webkit-filter: blur(15px);
    filter: blur(15px);
    transform: scale(1.2);
  }
  .playdetail {
    color: white;
    z-index: 3;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.3);
    .content {
      flex-direction: column;
      height: 100vh;
      .top {
        .closeBtn {
          width: 10vw;
        }
        .songInfo {
          height: 3rem;
          width: 80vw;
          flex-direction: column;
          .songName {
            font-size: 1.2rem;
            font-weight: 800;
            -webkit-line-clamp: 1;
          }
          .artists {
            -webkit-line-clamp: 1;
          }
        }
        .shareBtn {
          width: 10vw;
        }
      }
      .picOrlyc {
        flex: 1;
        .pic {
          height: 40vw;
          width: 40vw;
          img {
            border-radius: 50%;
            display: block;
            width: 100%;
          }
        }
      }
      .songOpt {
        flex-direction: column;
        .ctrTop {
          height: 3rem;
          width: 100vw;
          justify-content: space-around;
        }
        .progress {
          width: 100vw;
          height: 3rem;
        }
        .ctrBtm {
          width: 100vw;
          height: 3rem;
          justify-content: space-around;
        }
      }
    }
  }
}
</style>
