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
        <div class="picOrlyc flexCenter" @click="changePL">
          <div class="picWrap flexCenter" ref="picWrap" v-show="picOrlrc">
            <img :src="picUrl" :class="{ roll: !playOrpause }" ref="pic" />
          </div>
          <div
            class="lrcWrap"
            v-show="!picOrlrc"
            :style="{ transform: `translateY(${lrcTrans}px)` }"
          >
            <div class="lrc" v-for="(item, index) in lrc" :key="index">
              {{ item.c }}
            </div>
          </div>
        </div>
        <div class="songOpt">
          <div class="ctrTop flexCenter">
            <div class="mus-xin icon"></div>
            <div class="mus-xiazai icon" @click="download"></div>
            <div class="mus-tianjia icon"></div>
            <div class="mus-pinglunshu icon"></div>
            <div class="mus-sandian icon"></div>
          </div>
          <div class="progress flexCenter">
            <div class="currentTime flexCenter">
              {{ this.audioCurTime | curToMin }}
            </div>
            <van-progress
              :percentage="this.timeTage"
              stroke-width="4"
              pivot-text=""
              ref="progress"
            ></van-progress>
            <div class="durationTime flexCenter">
              {{ playingSong.duration | durToMin }}
            </div>
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
  mounted () {
    this.audioProgress()
    this.defLrcTrans = document.documentElement.clientHeight * 0.35
  },
  data () {
    return {
      // 当前播放时间
      audioCurTime: 0,
      // 控制进度条的进度
      timeTage: 0,
      // 控制展示专辑封面或者歌词
      picOrlrc: true,
      defLrcTrans: 0,
      // 控制歌词滚动的距离
      lrcTrans: 0,
      // 控制歌词是否滚动
      canScroll: false,
      // 当前歌词（第n行
      lineNow: 0,
      // 歌词C位
      Cpos: 0,
      // 滚动距离（应等于行高）
      offset: 32,
      startY: 0,
      endY: 0
    }
  },
  methods: {
    // 监听控制进度条变化
    audioProgress () {
      const audio = document.querySelector('audio')
      audio.ontimeupdate = setInterval(() => {
        this.audioCurTime = audio.currentTime
        this.timeTage = parseInt((this.audioCurTime / this.duration) * 100000)
      }, 1000)
    },
    close () {
      this.$emit('closeDetail')
    },
    playBtn () {
      this.$store.commit('playBtn')
    },
    // 下载歌曲
    download () {
      this.$store.commit('download', this.playingSong.urlInfo)
    },
    // 歌词和专辑封面切换
    changePL () {
      this.picOrlrc = !this.picOrlrc
    },
    // 下一首
    nextSong () {},
    // 对收到的LRC格式歌词转化成数组，
    // lrc[i].t 是第i行歌词的时间，以秒计；lrc[i].c 是第i行歌词。
    lrcAnalysis (lrc) {
      this.lineNow = 0
      this.lrcTrans = this.defLrcTrans
      const newLrc = []
      const lrcs = lrc.split('\n') // 用回车拆分成数组
      // 去掉最后一行空白
      lrcs.pop()
      // 判断开头是不是lrc格式的歌词时间格式
      if (lrcs[0].substring(0, 1) !== '[') {
        this.canScroll = false
        for (const i in lrcs) {
          newLrc.push({ c: lrcs[i] })
        }
      } else {
        this.canScroll = true
        for (const i in lrcs) {
          // 遍历歌词数组
          // lrcs[i] = lrcs[i].replace(/(^\s*)|(\s*$)/g, '') // 去除前后空格
          const arr = lrcs[i].match(/\[(\d+:.+?)\]/g) // 提取时间字段，可能有多个‘：’
          let start = 0
          for (const k in arr) {
            start += arr[k].length // 计算歌词在字符中的位置
          }
          const content = lrcs[i].substring(start) // 获取歌词内容
          for (const k in arr) {
            const t = arr[k].substring(1, arr[k].length - 1) // 取[]间的内容，用来计算时间
            const s = t.split(':') // 分离:前后文字
            newLrc.push({
              // 对象{t:时间,c:歌词}加入ms数组
              t: (parseFloat(s[0]) * 60 + parseFloat(s[1])).toFixed(3),
              c: content
            })
          }
          newLrc.sort(function (a, b) {
            // 按时间顺序排序
            return a.t - b.t
          })
        }
      }
      return newLrc
    },
    // 监听播放器的timeupdate事件，实现文字与音频播放同步
    lrcSynchro () {
      const audio = document.querySelector('audio') // 播放器
      const lrcWrap = document.querySelector('.lrcWrap') // 歌词容器列表

      if (this.lineNow === this.lrc.length) return
      var curTime = audio.currentTime // 播放器时间
      // 高亮显示歌词当前行及文字滚动控制，行号为lineNow
      if (parseFloat(this.lrc[this.lineNow].t) <= curTime) {
        const lis = lrcWrap.getElementsByTagName('div') // 歌词数组
        if (this.lineNow > 0) {
          lis[this.lineNow - 1].className = 'lrc' // 去掉上一行的高亮样式
        }
        lis[this.lineNow].className += ' lineHigh' // 高亮显示当前行
        // 文字滚动
        this.lrcTrans += -this.offset
        this.lineNow++
      }
    },
    // 监听播放器的ended事件，播放结束时回滚歌词
    // 滚回到开头，用于播放结束时
    musicEnd () {
      // 对高亮歌词进行变灰
      if (document.querySelector('.lrc.lineHigh')) {
        document.querySelector('.lrc.lineHigh').className = 'lrc'
      }
      this.lrcTrans = this.defLrcTrans
      this.lineNow = 0
    },
    // 歌词滚动高亮
    lrcScroll () {
      const audio = document.querySelector('audio') // 播放器
      audio.addEventListener('timeupdate', this.lrcSynchro)
      audio.addEventListener('ended', this.musicEnd)
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
    },
    duration () {
      return this.playingSong.duration ? this.playingSong.duration : 1
    },
    lrc: {
      get () {
        return this.playingSong.lrcInfo.lrc.lyric
      },
      set (val) {
        this.playingSong.lrcInfo.lrc.lyric = val
      }
    }
  },
  watch: {
    // 组件从隐藏状态切换到显示状态时，渲染不正确(调用组件的 resize 方法来主动触发重绘)
    showDetail (newVal, oldVal) {
      if (newVal) this.$refs.progress.resize()
    },
    // animation-play-state有两个值：running/paused，ios低版本和安卓部分浏览器上支持不好
    // 对需要加动画的元素pic上套一层picWrap作为父元素，当用户动作使动画停止的时候将pic的transform追加到picWrap的transform上，并删掉pic的animation属性，当用户动作使其播放时给其重新添加animation。
    playOrpause (newVal, oldVal) {
      if (newVal) {
        const imgTransform = getComputedStyle(this.$refs.pic).transform
        const wrapTransform = getComputedStyle(this.$refs.picWrap).transform
        this.$refs.picWrap.style.transform =
          wrapTransform === 'none'
            ? imgTransform
            : wrapTransform.concat(' ', imgTransform)
      }
    },
    // 换曲获取新歌词的时候更新歌词，并对歌词进行滚动高亮（注：在歌未播完前切歌时，对原先歌词的高亮不会消失，要加一步清除
    lrc (newLrc, oldLrc) {
      // 在歌曲播完前切歌，需要手动清除上一首播放位置的高亮
      if (document.querySelector('.lrc.lineHigh')) {
        document.querySelector('.lrc.lineHigh').className = 'lrc'
      }
      if (!Array.isArray(newLrc)) {
        this.lrc = this.lrcAnalysis(newLrc)
      }
    },
    // 歌词支持滚动的时候，调用滚动高亮函数
    canScroll (newVal, oldVal) {
      if (newVal) this.lrcScroll()
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
        width: 100vw;
        overflow: hidden;
        margin: 1rem;
        .roll {
          -webkit-animation: run 25s infinite linear;
          animation: run 25s infinite linear;
        }
        .picWrap {
          height: 40vw;
          width: 40vw;
          img {
            border-radius: 50%;
            display: block;
            width: 100%;
          }
          // 控制专辑转动
          @keyframes run {
            to {
              transform: rotateZ(360deg);
            }
          }
        }
        .lrcWrap {
          height: 60vh;
          // 隐藏歌词
          text-overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 1rem;
          transition-duration: 600ms;
          .lrc {
            color: rgba(160, 160, 160, 1);
            // 当内容为空格的时候，失去高度
            min-height: 32px;
            flex: none;
            line-height: 32px;
          }
          .lineHigh {
            color: white;
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
          .currentTime {
            width: 4rem;
          }
          /deep/.van-progress {
            margin: 0 1rem;
            flex: 1;
            .van-progress__portion {
              background-color: red;
            }
          }
          .durationTime {
            width: 4rem;
          }
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
