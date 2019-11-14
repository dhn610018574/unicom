/* eslint-disable camelcase */
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'

import { queryPermissionsByUser } from '@/api/user'
const user = {
  state: {
    permissionList: []
  },

  mutations: {
    SET_PERMISSIONLIST: (state, permissionList) => {
      state.permissionList = permissionList
    }
  },

  actions: {
    // 获取用户信息
    GetPermissionList ({ commit }) {
      return new Promise((resolve, reject) => {
        let v_token = Vue.ls.get(ACCESS_TOKEN)
        let params = { token: v_token }
        queryPermissionsByUser(params)
          .then(response => {
            const menuData = response.result.menu
            if (menuData && menuData.length > 0) {
              commit('SET_PERMISSIONLIST', menuData.filter(item => item.path !== '/dashboard/analysis'))
            } else {
              // eslint-disable-next-line prefer-promise-reject-errors
              reject('getPermissionList: permissions must be a non-null array !')
            }
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}

export default user
