import Vue from 'vue'
import VueRouter from 'vue-router'

import Index from '../components/index/index'
import Login from '../components/Login/login'
import Recommend from '../components/index/recommend/recommend'
import Rank from '../components/index/rank/rank'
import Singer from '../components/index/singer/singer'
import Playlist from '../components/index/playlist/playlist'
import Search from '../components/Search/search'

Vue.use(VueRouter)

export default new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      // 默认跳转到recommend
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      component: Index,
      redirect: '/recommend',
      children: [
        {
          path: '/recommend',
          component: Recommend
        },
        {
          path: '/rank',
          component: Rank
        },
        {
          path: '/singer',
          component: Singer
        }
      ]
    },
    {
      path: '/playlist',
      component: Playlist
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/search',
      component: Search
    }
  ]
})
