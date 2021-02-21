import Vue from 'vue'
import VueRouter from 'vue-router'

import Index from '../components/index/index'
import Recommend from '../components/recommend/recommend'
import Rank from '../components/rank/rank'
import Singer from '../components/singer/singer'
import Search from '../components/Search/search'

Vue.use(VueRouter)

export default new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
      // 默认跳转到recommend
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      component: Index,
      redirect: '/recommend',
      children: [{
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
      path: '/search',
      component: Search
    }
  ]
})
