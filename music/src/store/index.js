import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 切换到登录页面的时候不显示底下的playbar
    showPlaybar: true,
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
      // 歌词信息
      lrcInfo: {
        lrc: {
          lyric: ''
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
    searchHistory: [],
    // 播放列表
    playList: []
  },
  mutations: {
    // playbar在每个页面都存在，但是在登录页面不显示，考虑选择放在Vuex控制显示
    playbar (state, boolean) {
      state.showPlaybar = boolean
    },
    // 点击播放音乐后，存储当前播放音乐状态
    changeUrl (state, playing) {
      state.playCtr = false
      state.playingSong = playing.song
      state.playingSong.urlInfo = playing.urlInfo
      state.playingSong.lrcInfo = playing.lrcInfo
      // VIP试听片段信息
      if (!state.playingSong.urlInfo.freeTrialInfo) {
        state.playingSong.urlInfo.freeTrialInfo = {
          start: 0,
          end: state.playingSong.duration
        }
      }
      // 是否有歌词
      if (state.playingSong.lrcInfo.nolyric) {
        state.playingSong.lrcInfo.lrc = {}
        // 在分析歌词是否支持滚动的时候，会去掉最后一行
        state.playingSong.lrcInfo.lrc.lyric = '暂时没有歌词\n'
      }
      // 是否有专辑封面
      if (playing.picUrl) {
        state.playingSong.picUrl = playing.picUrl
      } else {
        state.playingSong.picUrl = state.defAlbumPic
      }
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
      // 消除播放历史中重复的项
      state.playingHistory.reduce((acc, next, index) => {
        if (next.song.id === song.song.id) state.playingHistory.splice(index, 1)
      })
    },
    // 添加进搜索历史
    addSearchHistory (state, song) {
      state.searchHistory.unshift(song)
      // 利用ES6的Set消除搜索历史中重复的项
      const set = new Set(state.searchHistory)
      state.searchHistory = [...set]
    },
    // 清除搜索记录
    clearHistory (state) {
      state.searchHistory = []
    },
    download (state, downloadInfo) {
      // 这是传统的下载方式,可以下载,但是跨域会使download属性失效
      const downloadFile = document.createElement('a')
      document.body.append(downloadFile)
      downloadFile.href = downloadInfo.url
      downloadFile.download = '文件名'
      // 超链接 target="_blank" 要增加 rel="noopener noreferrer" 来堵住钓鱼安全漏洞。如果你在链接上使用 target="_blank"属性，并且不加上rel="noopener"属性，那么你就让用户暴露在一个非常简单的钓鱼攻击之下。(摘要)
      downloadFile.rel = 'noopener noreferrer'
      downloadFile.click()
      document.body.removeChild(downloadFile)
    },
    // 添加进播放列表(未完成)
    addPlaylist (state, song) {
      state.playList.push(song)
      console.log(state.playList)
      for (const i in state.playList) {
        console.log(state.playList[i])
      }
    }
  },
  actions: {},
  modules: {}
})
