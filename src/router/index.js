import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

import daohang from '@/components/daohang'
import list from '@/components/list'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'daohang',
      component: daohang,
      children:[
        {
          path: '/list',name: 'list',component: list,
        }
      ]
    }
  ]
})
