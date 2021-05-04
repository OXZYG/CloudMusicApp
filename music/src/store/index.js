import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 没有专辑封面的替代图
    defAlbumPic: require('@/components/common/image/album.png'),
    // 播放暂停控制 false播放 true暂停
    playCtr: true,
    // 当前播放音乐的信息
    playingSong: {
      // 音乐Url
      urlInfo: {
        // VIP试听片段信息
        freeTrialInfo: {
          start: 0,
          end: 0
        }
      },
      // 专辑封面Url
      picUrl: '',
      // 歌名
      name: '无',
      // 歌手信息
      artists: [{ id: 0, name: '无' }]
      // 音乐时长
      // duration: 0,
    },
    // 播放历史
    playingHistory: [],
    // 搜索历史
    searchHistory: []
  },
  mutations: {
    // 点击播放音乐后，存储当前播放音乐状态
    changeUrl (state, playing) {
      state.playingSong = playing.song
      state.playingSong.urlInfo = playing.urlInfo
      // VIP试听片段信息
      if (!state.playingSong.urlInfo.freeTrialInfo) {
        state.playingSong.urlInfo.freeTrialInfo = {
          start: 0,
          end: state.playingSong.duration
        }
      }
      // 专辑封面
      if (playing.picUrl) {
        state.playingSong.picUrl = playing.picUrl
      } else {
        state.playingSong.picUrl = state.defAlbumPic
      }
    },
    // 播放音乐（因为有些音乐不能播放，所以不能在changeUrl之后就立即播放
    playMusic (state) {
      const audio = document.querySelector('audio')
      // 等待音频加载完再执行播放
      setTimeout(() => {
        audio.play()
      }, 1000)
      state.playCtr = false
    },
    // 控制播放的按钮
    playBtn (state) {
      if (!state.playingSong.urlInfo.url) return
      const audio = document.querySelector('audio')
      state.playCtr = !state.playCtr
      if (!state.playCtr) {
        audio.play()
      } else {
        audio.pause()
      }
    },
    // 添加进播放历史
    addPlayHistory (state, song) {
      state.playingHistory.unshift(song)
    },
    // 添加进搜索历史
    addSearchHistory (state, song) {
      state.searchHistory.unshift(song)
    },
    // 清除搜索记录
    clearHistory (state) {
      state.searchHistory = []
    },
    downloadMusic (state, downloadInfo) {
      // 这是传统的下载方式,可以下载,但是跨域会使download属性失效
      const downloadFileA = document.createElement('a')
      document.body.append(downloadFileA)
      downloadFileA.href = downloadInfo.url
      downloadFileA.download = '文件名'
      // 超链接 target="_blank" 要增加 rel="noopener noreferrer" 来堵住钓鱼安全漏洞。如果你在链接上使用 target="_blank"属性，并且不加上rel="noopener"属性，那么你就让用户暴露在一个非常简单的钓鱼攻击之下。(摘要)
      downloadFileA.rel = 'noopener noreferrer'
      console.log(downloadFileA)
      downloadFileA.click()
      document.body.removeChild(downloadFileA)
    }
  },
  actions: {},
  modules: {}
})
