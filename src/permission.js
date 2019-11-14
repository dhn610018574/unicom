import Vue from 'vue'
import router from './router'
import store from './store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { generateIndexRouter } from '@/utils/util'

NProgress.configure({ showSpinner: false })

const whiteList = ['/user/login', '/user/register', '/user/register-result']

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (Vue.ls.get(ACCESS_TOKEN)) {
    if (to.path === '/user/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      if (store.getters.permissionList.length === 0) {
        store.dispatch('GetPermissionList').then(res => {
          const menuData = res.result.menu
          if (menuData === null || menuData === '' || menuData === undefined) {
            return
          }
          let constRoutes = []
          constRoutes = generateIndexRouter(menuData)
          store.dispatch('UpdateAppRouter', { constRoutes }).then(() => {
            router.addRoutes(store.getters.addRouters)
            next({ path: to.path })
          })
        }).catch(() => {
          // store.dispatch('Logout').then(() => {
          //   next({ path: '/user/login' })
          // })
        })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next({ path: '/user/login' })
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
