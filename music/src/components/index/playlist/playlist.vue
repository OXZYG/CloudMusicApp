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
    <div class="songItems flexCenter">
      <div
        v-for="(item, index) in this.songs"
        :key="index"
        @click="playMusic(item)"
        class="songItem flexCenter"
      >
        <div class="songName textOverflow">
          {{ item.name }} -- {{ item.ar | artistName }}
        </div>
        <div class="duration">{{ item.dt | durToMin }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  activated () {
    this.playlistDetail()
  },
  data () {
    return {
      playlistId: '',
      idArray: [],
      songs: []
    }
  },
  methods: {
    routeback () {
      this.$router.go(-1)
    },
    async playlistDetail () {
      this.playlistId = this.$route.query.id
      // 歌单详情
      // 可以获取对应歌单内的所有的音乐(未登录状态只能获取不完整的歌单,登录后是完整的)
      // 可拿全部 trackIds 请求一次 song/detail 接口获取所有歌曲的详情
      const { data: res1 } = await this.$http.get(
        `/playlist/detail?id=${this.playlistId}`
      )
      for (const item of res1.playlist.trackIds) {
        this.idArray.push(item.id)
      }
      const idStr = this.idArray.join(',')
      const { data: res2 } = await this.$http.get(`song/detail?ids=${idStr}`)
      this.songs = res2.songs
      console.log(this.songs)
      this.idArray = []
    },
    // 播放音乐，获取音乐信息，并存储正在播放音乐信息
    async playMusic (item) {
      // console.log(item)
      // const playing = {}
      // 获取音乐的url信息(包含试听片段信息)和lrc歌词信息
      // const { data: urlRes } = await this.$http.get(`/song/url?id=${item.id}`)
      // const { data: lrcRes } = await this.$http.get(`/lyric?id=${item.id}`)
      // console.log(urlRes)
      // // 获取专辑封面信息，判断音乐信息中是否有专辑封面id
      // if (item.album.id) {
      //   const { data: albumRes } = await this.$http.get(
      //     `/album?id=${item.album.id}`
      //   )
      //   playing.picUrl = albumRes.album.picUrl
      // }
      // // 注：播放音乐逻辑，小心bug
      // // 1、先检查音乐是否有Url可进行播放
      // if (urlRes.data[0].url) {
      //   // 2、保存完整信息
      //   playing.song = item
      //   // Url信息（包含试听片段信息
      //   playing.urlInfo = urlRes.data[0]
      //   playing.lrcInfo = lrcRes
      //   // 3、再检查是否是VIP音乐，即试听片段信息
      //   if (playing.urlInfo.freeTrialInfo) {
      //     this.$toast(`正在试听《${item.name}》片段，开通VIP畅听完整版`)
      //   }
      //   // 4、添加url播放音乐
      //   this.$store.commit('changeUrl', playing)
      //   // 5、添加进播放历史
      //   this.$store.commit('addPlayHistory', playing)
      // } else {
      //   // 6、无音源报错
      //   this.$toast('因合作方要求，该资源暂时下架')
      // }
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

.songItems {
  width: 100vw;
  flex-direction: column;
  justify-content: flex-start;
  align-items: inherit;
  .songItem {
    margin: 1rem 0 0;
    justify-content: space-between;
    .songName {
      -webkit-line-clamp: 1;
    }
    .duration {
    }
  }
}
</style>
