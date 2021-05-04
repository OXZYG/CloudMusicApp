<template>
  <div>
    <div class="searchTop">
      <van-icon name="arrow-left" size="20px" tag="div" @click="routeback" />
      <van-search
        v-model="keyword"
        shape="round"
        :placeholder="this.defaultKeyword"
        background="rgb(212,68,57)"
        tag="div"
        @search="onSearch"
        @clear="clearSearch"
      >
      </van-search>
    </div>
    <div class="search">
      <div v-show="!showRes">
        <div class="history flexCenter" v-show="this.searchHistory.length">
          <div style="font-weight:800">历史</div>
          <div class="searchHistory">
            <div
              class="searchHistoryItem textOverflow"
              v-for="(item, index) in this.searchHistory"
              :key="index"
              @click="keySearch(item)"
            >
              <div>{{ item }}</div>
            </div>
          </div>
          <div @click="clearHistory"><van-icon name="delete-o" /></div>
        </div>
        <div class="hot">
          <div class="hotTitle">热搜榜</div>
          <div class="hotSearch">
            <div
              class="hotItem textOverflow"
              v-for="(item, index) in this.hotSearchList"
              :key="index"
              @click="keySearch(item.searchWord)"
            >
              <div class="hotIndex flexCenter">{{ index + 1 }}</div>
              <div>
                <div class="hotWord textOverflow">{{ item.searchWord }}</div>
                <div class="hotContent textOverflow">{{ item.content }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <van-list
        v-model="loading"
        :finished="finished"
        :finished-text="finishedText"
        @load="onLoad"
        :immediate-check="immdeCheck"
        :offset="100"
        v-show="showRes"
      >
        <div v-for="(item, index) in this.songs" :key="index" class="songItem">
          <div class="songIndex flexCenter">{{ index }}</div>
          <div class="songInfo" @click="playMusic(item)">
            <div class="songName textOverflow" ref="songItems">
              {{ item.name }}
              <span class="songAlias" v-show="item.alias.length">
                ({{ item.alias[0] }})
              </span>
            </div>
            <div class="artists textOverflow">
              {{ item.artists | artistName }}
            </div>
          </div>
          <div class="duration" @click="playMusic(item)">
            {{ item.duration | durToMin }}
          </div>
          <div class="icon flexCenter" @click="action(item)">
            <van-icon name="plus" />
          </div>
        </div>
      </van-list>
    </div>
    <van-action-sheet v-model="showAction" class="flexCenter">
      <div @click="download">下载</div>
      <div>更多功能..</div>
    </van-action-sheet>
  </div>
</template>

<script>
export default {
  created () {
    this.defaultSearch()
    this.hotSearch()
  },
  data () {
    return {
      // 展示搜索结果
      showRes: false,
      // 默认搜索关键词
      defaultKeyword: '',
      // 热搜列表
      hotSearchList: [],
      // 搜索关键词
      keyword: '',

      // 搜索结果数
      songCount: 0,
      // 每次搜索获取数目
      limit: 100,
      // 搜索偏移量
      offset: 0,
      // 搜索结果
      songs: '',
      // 滚动搜索参数
      immdeCheck: false,
      loading: false,
      finished: false,
      finishedText: '没有更多了~',
      musicUrl: '',
      showAction: false,
      selectItem: {}
    }
  },
  computed: {
    // 搜索历史
    searchHistory () {
      return this.$store.state.searchHistory
    }
  },
  methods: {
    // 返回按键
    routeback () {
      this.$router.go(-1)
      this.showRes = false
      this.songs = ''
      this.keyword = ''
    },
    // 获取热搜列表
    async hotSearch () {
      const { data: res } = await this.$http.get('/search/hot/detail')
      this.hotSearchList = res.data
    },
    // 默认搜索关键词
    async defaultSearch () {
      const { data: res } = await this.$http.get('/search/default')
      this.defaultKeyword = res.data.realkeyword
    },
    // 搜索按键
    async onSearch () {
      // 重置偏移量
      this.offset = 0
      // 使用默认搜索关键词
      if (!this.keyword) this.keyword = this.defaultKeyword

      const { data: res } = await this.$http.get(
        `/search?keywords=${this.keyword}&limit=${this.limit}&offset=${this.offset}`
      )
      this.songs = res.result.songs
      this.songCount = res.result.songCount
      // 添加进搜索历史
      this.$store.commit('addSearchHistory', this.keyword)
      // 先得到结果再展示
      this.showRes = true
      // 对没有版权的歌曲，改变样式
      for (let i = 0; i < this.songs.length; i++) {
        const { data: res } = await this.$http.get(
          `/song/url?id=${this.songs[i].id}`
        )
        if (!res.data[0].url) {
          this.$refs.songItems[i].classList.add('useless')
        }
      }
    },
    // 点击搜索历史/热搜榜，触发搜索
    keySearch (item) {
      this.keyword = item
      this.onSearch()
    },
    // 清除搜索框
    clearSearch () {
      this.showRes = false
    },
    // 清楚搜索记录
    clearHistory () {
      this.$store.commit('clearHistory')
    },
    // 滚动触发搜索
    async scrollSearch () {
      const { data: res } = await this.$http.get(
        `/search?keywords=${this.keyword}&limit=${this.limit}&offset=${this.offset}`
      )
      this.loading = false
      // bug，没有更多歌曲时会拼接一个空的，要先检查是否有更多歌曲
      if (res.result.songs) {
        this.songs = this.songs.concat(res.result.songs)
      }
      if (this.songs.length >= this.songCount) {
        this.finished = true
      }
    },
    // 加载更多
    onLoad () {
      this.offset += this.limit
      this.scrollSearch()
    },

    // 播放音乐，获取音乐信息，并存储正在播放音乐信息
    async playMusic (item) {
      // 音乐的试听片段信息和url信息
      const playing = {}
      const { data: urlRes } = await this.$http.get(`/song/url?id=${item.id}`)
      console.log(urlRes)
      // 专辑封面信息，是否有专辑封面
      if (item.album.id) {
        const { data: albumRes } = await this.$http.get(
          `/album?id=${item.album.id}`
        )
        playing.picUrl = albumRes.album.picUrl
      }
      // 保存信息
      playing.song = item
      // 试听片段和Url
      playing.urlInfo = urlRes.data[0]
      // 是否是VIP音乐
      if (playing.urlInfo.freeTrialInfo) {
        this.$toast(`正在试听《${item.name}》片段，开通VIP畅听完整版`)
      }
      this.$store.commit('changeUrl', playing)
      // 音乐是否有Url可进行播放
      if (playing.urlInfo.url) {
        // 播放音乐
        this.$store.commit('playMusic')
        // 添加进播放历史
        this.$store.commit('addPlayHistory', playing)
      } else {
        // 无音源报错
        this.$toast('因合作方要求，该资源暂时下架')
      }
    },
    // 展示对歌曲操作的面板
    action (item) {
      this.showAction = true
      this.selectItem = item
    },
    // 下载音乐
    async download () {
      const { data: urlRes } = await this.$http.get(
        `/song/url?id=${this.selectItem.id}`
      )
      const downloadInfo = {}
      downloadInfo.url = urlRes.data[0].url
      downloadInfo.name = this.selectItem.name
      this.$store.commit('downloadMusic', downloadInfo)
    }
  },
  watch: {
    // 清除搜索框
    keyword: function (newKey, oldKey) {
      if (newKey === '') this.showRes = false
    }
  }
}
</script>

<style lang="less" scoped>
.textOverflow {
  /* CSS文本超过n行用省略号代替(兼容所有浏览器) */
  display: -webkit-box; /*设置块元素的布局为伸缩布局；*/
  overflow: hidden;
  text-overflow: ellipsis; /*超出盒子的部分使用省略号表示。*/
  -webkit-box-orient: vertical; /*设置伸缩项的布局方向；垂直*/
}
.flexCenter {
  display: flex;
  justify-content: center;
  align-items: center;
}
.searchTop {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgb(212, 68, 57);
  .van-icon {
    width: 4vw;
    padding-left: 2vw;
    color: white;
  }
  .van-search {
    width: 94vw;
    flex: 1;
  }
  .van-icon-search::before {
    content: '';
  }
}

.search {
  margin-top: 54px;
  padding: 0.5rem;
  font-size: 1rem;
  .useless {
    color: rgba(0, 0, 0, 0.4);
  }
  .history {
    height: 3rem;
    margin-bottom: 10px;
    > div {
      margin: 0 0.5rem;
    }
    .searchHistory {
      flex: 1;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      overflow: auto;
      .searchHistoryItem {
        flex: none;
        background-color: rgba(242, 242, 242, 0.685);
        border-radius: 10%;
        padding: 4px;
        margin: 0 0.5rem;
      }
    }
  }

  .hot {
    .hotTitle {
      font-weight: 800;
    }
    .hotSearch {
      margin-top: 1rem;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .hotItem:nth-child(-n + 3) .hotIndex {
        color: red;
      }
      .hotItem {
        margin: 0 0 10px;
        flex-basis: 40vw;
        display: grid;
        grid-template-columns: 1fr 4fr;
        .hotIndex {
          color: rgba(0, 0, 0, 0.5);
          justify-content: flex-start;
        }
        .hotWord {
          -webkit-line-clamp: 1;
        }
        .hotContent {
          font-size: 0.6rem;
          -webkit-line-clamp: 1;
        }
      }
    }
  }
  .van-list {
    .songItem:nth-child(odd) {
      background-color: rgba(0, 0, 0, 0.02);
    }
    .songItem {
      height: 4rem;
      display: grid;
      grid-template-columns: 2fr 20fr 1fr 2fr;
      margin: 1px;

      .songIndex {
        justify-content: flex-start;
        color: rgba(0, 0, 0, 0.5);
      }
      .songInfo {
        padding: 4px 0;
        display: flex;
        flex-direction: column;
        justify-content: space-around;

        .songName {
          font-weight: 800;
          -webkit-line-clamp: 1;
          .songAlias {
            color: rgba(0, 0, 0, 0.5);
          }
        }
        .artists {
          color: rgba(0, 0, 0, 0.6);
          -webkit-line-clamp: 1;
        }
      }
      .duration {
        line-height: 4rem;
        text-align: end;
        color: rgba(0, 0, 0, 0.5);
      }
      .van-icon {
        z-index: -1;
      }
    }
  }
}
.van-popup {
  text-align: center;
  > div {
    line-height: 50px;
    width: 100vw;
  }
}
</style>
