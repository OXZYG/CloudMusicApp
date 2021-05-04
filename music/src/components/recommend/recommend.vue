<template>
  <div class="recomd">
    <!-- 轮播图 -->
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="(value, index) in this.banner" :key="index">
        <!-- <img :src="value.imageUrl" alt="none"> -->
        <img v-lazy="value.imageUrl" />
      </van-swipe-item>
    </van-swipe>
    <!-- 推荐歌单 -->
    <div class="recomdList">
      <div class="recomdListTop">
        <div class="listTitle">推荐歌单</div>
        <div class="listMore">
          More
          <div class="arrow"></div>
        </div>
      </div>
      <div class="recomdItems">
        <div
          class="recomdItem"
          v-for="value in this.recommendSongs"
          :key="value.id"
          @click="selectItem(value)"
        >
          <img
            v-lazy="{
              src: value.picUrl,
              loading: require('./slide_square.png')
            }"
          />
          <div class="recomdPlaycount">
            <van-icon name="service-o" />{{ value.playCount | Tenthousand }}
          </div>
          <div class="recomdName textOverflow" v-text="value.name"></div>
        </div>
      </div>
    </div>
    <!-- 推荐MV -->
    <div class="recomdList">
      <div class="recomdListTop">
        <div class="listTitle">推荐MV</div>
        <div class="listMore">
          More
          <div class="arrow"></div>
        </div>
      </div>
      <div class="recomdItems">
        <div
          class="recomdItem"
          v-for="value in this.recommendMV"
          :key="value.id"
        >
          <div
            class=" recomdMVBgImg"
            :style="{
              background: 'url(' + value.picUrl + ')',
              backgroundSize: 'cover'
            }"
          ></div>
          <img
            class="recomdMVImg"
            v-lazy="{
              src: value.picUrl,
              loading: require('./slide_square.png')
            }"
          />
          <div class="recomdPlaycount">
            <van-icon name="play-circle-o" />{{ value.playCount | Tenthousand }}
          </div>
          <div
            class="recomdName recomdMVName textOverflow "
            v-text="value.name"
          ></div>
        </div>
      </div>
    </div>
    <!-- 精选歌单 -->
    <div class="recomdList">
      <div class="recomdListTop featuredListTop">
        <div>
          <div class="listMore">
            More
            <div class="arrow"></div>
          </div>
        </div>
      </div>
      <van-tabs v-model="active" animated>
        <van-tab name="hot" title="热歌">
          <div class="featuredItems">
            <div
              class="featuredItem"
              v-for="value in this.featuredHot"
              :key="value.id"
            >
              <div class="itemImg">
                <img
                  v-lazy="{
                    src: value.coverImgUrl,
                    loading: require('./slide_square.png')
                  }"
                />
              </div>
              <div class="itemName textOverflow" v-text="value.name"></div>
              <div
                class="itemCreator textOverflow "
                v-text="value.creator.nickname"
              ></div>
              <div
                class="itemDescription textOverflow "
                v-text="value.description"
              ></div>
            </div>
          </div>
        </van-tab>
        <van-tab name="new" title="新歌">
          <div class="featuredItems">
            <div
              class="featuredItem"
              v-for="value in this.featuredNew"
              :key="value.id"
            >
              <div class="itemImg">
                <img
                  v-lazy="{
                    src: value.coverImgUrl,
                    loading: require('./slide_square.png')
                  }"
                />
              </div>
              <div class="itemName textOverflow" v-text="value.name"></div>
              <div
                class="itemCreator textOverflow "
                v-text="value.creator.nickname"
              ></div>
              <div
                class="itemDescription textOverflow"
                v-text="value.description"
              ></div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
export default {
  // 播放量数目过滤
  filters: {
    Tenthousand: function (value) {
      if (value < 10000) {
        return ' ' + value
      } else {
        value = (value / 10000).toFixed(1)
        return ' ' + value + '万'
      }
    }
  },
  created () {
    // 获取轮播图数据
    this.getSwipe()
    // 获取推荐歌单
    this.getRecommendSongs()
    // 获取推荐MV
    this.getRecommendMV()
    this.getPlaylistCatlist()
    // 获取精选歌单
    this.getFeatured()
  },
  components: {},
  data () {
    return {
      // 轮播图
      banner: [],
      // 推荐歌单
      recommendSongs: [],
      recommendSongsDetail: [],
      // 推荐MV
      recommendMV: [],
      recommendMVDetail: [],
      active: 'hot',
      // 精选歌单：最新,最热
      featuredNew: [],
      featuredHot: []
    }
  },
  methods: {
    // 获取轮播图数据
    async getSwipe () {
      const { data: res } = await this.$http.get('/banner')
      // console.log(res)
      if (res.code !== 200) {
        return this.$notify({ type: 'danger', message: '轮播图数据获取失败' })
      } else {
        this.banner = res.banners
      }
    },
    // 获取推荐歌单
    async getRecommendSongs () {
      const { data: res } = await this.$http.get('/personalized?limit=8')
      this.recommendSongs = res.result
    },
    // 获取推荐MV
    async getRecommendMV () {
      const { data: res } = await this.$http.get('/personalized/mv')
      this.recommendMV = res.result
    },
    async getPlaylistCatlist () {
      // const res = await this.$http.get('/playlist/catlist')
      // console.log(res)
    },
    // 获取精选歌单
    async getFeatured () {
      const hotSong = await this.$http.get('/top/playlist?limit=6&order=hot')
      const newSong = await this.$http.get('/top/playlist?limit=6&order=new')
      if (hotSong.status !== 200) {
        return this.$notify({ type: 'danger', message: '最热精选歌单获取失败' })
      } else {
        this.featuredHot = hotSong.data.playlists
      }
      if (newSong.status !== 200) {
        return this.$notify({ type: 'danger', message: '最新精选歌单获取失败' })
      } else {
        this.featuredNew = newSong.data.playlists
      }
    },
    // 未完成
    async selectItem (value) {
      // 歌单详情
      const res1 = await this.$http.get(`/playlist/detail?id=${value.id}`)
      // 歌单详情动态
      // const res2 = await this.$http.get(
      //   `/playlist/detail/dynamic?id=${value.id}`
      // )
      // console.log(res)
      this.recommendSongsDetail = res1.data
      console.log(this.recommendSongsDetail)
      // console.log(res2)
      this.$toast('unfinished')
    }
  }
}
</script>

<style lang="less" scoped>
.textOverflow {
  /* CSS文本超过2行用省略号代替(兼容所有浏览器) */
  display: -webkit-box; /*设置块元素的布局为伸缩布局；*/
  overflow: hidden;
  text-overflow: ellipsis; /*超出盒子的部分使用省略号表示。*/
  -webkit-box-orient: vertical; /*设置伸缩项的布局方向；垂直*/
}
.recomd {
  margin-bottom: 50px;
  // 轮播图
  .my-swipe {
    margin: 1vh 0 0 0;
    .van-swipe-item {
      color: #fff;
      font-size: 20px;
      line-height: 10px;
      text-align: center;
      img {
        width: 96%;
        border-radius: 1rem;
      }
    }
  }
  .recomdList {
    margin: 0.5rem 0;
    box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.2);
    border-radius: 1rem;
    background-color: #fff;
    .recomdListTop {
      height: 1.5rem;
      position: relative;
      font-size: 1rem;
      font-weight: 800;
      .listTitle {
        line-height: 2rem;
        position: absolute;
        top: 0;
        left: 0.5rem;
        color: rgba(0, 0, 0, 0.8);
      }
      .listMore {
        position: absolute;
        top: 0;
        right: 0.5rem;
        border: 0.5px solid rgba(0, 0, 0, 0.4);
        border-radius: 10px;
        padding: 0rem 0.5rem 0.1rem;
        .arrow {
          border-right: 0.1rem solid rgba(0, 0, 0, 0.7);
          border-top: 0.1rem solid rgba(0, 0, 0, 0.7);
          width: 0.5rem;
          height: 0.5rem;
          display: inline-block;
          transform: rotateZ(45deg);
        }
      }
    }
    // 推荐
    .recomdItems {
      display: flex;
      justify-content: flex-start;
      overflow: auto;
      height: 11rem;
      margin: 1rem;
      // 单个推荐
      .recomdItem {
        flex: none;
        width: 8rem;
        height: 8rem;
        margin-right: 1rem;
        box-shadow: 4px -4px 10px rgba(0, 0, 0, 0.7);
        border-radius: 1rem;
        // 调整内部结构
        position: relative;
        // 推荐的图片
        img {
          display: block;
          width: 100%;
          border-radius: 1rem;
        }
        // MV背景图模糊
        .recomdMVBgImg {
          width: 100%;
          height: 100%;
          filter: blur(4px);
          position: absolute;
        }
        .recomdMVImg {
          width: 90%;
          // MV图片居中
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        // 推荐的播放量
        .recomdPlaycount {
          display: inline-block;
          color: white;
          border-radius: 20%;
          background: rgba(0, 0, 0, 0.2);
          // 使播放量在右上角
          position: absolute;
          top: 2px;
          right: 5px;
          z-index: 1;
        }
        // 推荐名
        .recomdName {
          padding-top: 0.5rem;
          padding-left: 0.5rem;
          line-height: 1.2rem;
          -webkit-line-clamp: 2;
        }
        // MV推荐名
        .recomdMVName {
          position: absolute;
          bottom: -2.5rem;
        }
      }
    }

    // vant默认样式修改
    /deep/ .van-tabs__wrap {
      height: 2rem;
      .van-tabs__nav {
        background-color: transparent;
        width: 10rem;
        .van-tab {
          line-height: 1.5rem;
          border-right: 2px solid rgba(0, 0, 0, 0.4);
          span {
            font-size: 1.5rem;
          }
        }
        .van-tab--active {
          color: rgba(0, 0, 0, 1);
          font-weight: bold;
        }
        .van-tabs__line {
          background-color: transparent;
        }
        .van-tab:nth-last-child(2) {
          border-right: none;
        }
      }
    }
    //网友精选歌单布局
    .featuredListTop {
      // border: 10px solid black;
      position: absolute;
      right: 0;
    }
    .featuredListTop > div {
      position: relative;
      width: 10rem;
    }
    .featuredItems {
      display: flex;
      flex-flow: column wrap;
      justify-content: center;
      align-items: center;
      height: 10rem;
      overflow: auto;
      // padding-left: 1rem;
      margin: 0 1rem;
      .featuredItem {
        width: 21rem;
        height: 4rem;
        display: grid;
        grid-template-rows: 1fr 1fr;
        grid-template-columns: 1fr 3fr 1fr;
        gap: 0 0.5rem;
        margin: 0.5rem 0.5rem 0 0;
        line-height: 2rem;
        .itemImg {
          grid-row-start: 1;
          grid-row-end: 3;
          img {
            display: block;
            width: 100%;
            border-radius: 50%;
          }
        }
        .itemName {
          -webkit-line-clamp: 1;
          font-size: 1.2rem;
          font-weight: 800;
        }
        .itemCreator {
          color: rgba(0, 0, 0, 0.7);
          -webkit-line-clamp: 1;
        }
        .itemDescription {
          color: rgba(0, 0, 0, 0.7);
          -webkit-line-clamp: 1;
          grid-column-start: 2;
          grid-column-end: 4;
        }
      }
    }
  }
}
</style>
