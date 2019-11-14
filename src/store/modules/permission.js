import { constantRouterMap } from '@/config/router.config'

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, data) => {
      state.addRouters = data
      state.routers = constantRouterMap.concat(data)
    }
  },
  actions: {
    // 动态添加主界面路由，需要缓存
    UpdateAppRouter ({ commit }, routes) {
      return new Promise(resolve => {
        let routelist = routes.constRoutes
        commit('SET_ROUTERS', routelist)
        resolve()
      })
    }
  }
}

export default permission
