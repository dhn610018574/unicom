import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import { VueAxios } from './axios'
import { Modal, notification } from 'ant-design-vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
// 设置环境区分
let baseURL = ''
const baseURLArr = [
  {
    type: 'development',
    url: 'http://10.192.168.1'
  },
  {
    type: 'production',
    url: 'http://10.192.1.1'
  },
  {
    type: 'test',
    url: 'http://10.192.168.2'
  }
]
baseURLArr.forEach(item => {
  if (process.env.NODE_ENV === item.type) {
    baseURL = item.url
  }
})

// 创建 axios 实例
const service = axios.create({
  baseURL,
  timeout: 60000 // 请求超时时间
})

const err = error => {
  if (error.response) {
    const data = error.response.data
    const token = Vue.ls.get(ACCESS_TOKEN)

    switch (error.response.status) {
      case 403:
        notification.error({ message: '系统提示', description: '拒绝访问', duration: 4 })
        break
      case 500:
        if (token && data.message === 'Token失效，请重新登录') {
          Modal.error({
            title: '登录已过期',
            content: '很抱歉，登录已过期，请重新登录',
            okText: '重新登录',
            mask: false,
            onOk: () => {
              store.dispatch('Logout').then(() => {
                Vue.ls.remove(ACCESS_TOKEN)
                window.location.reload()
              })
            }
          })
        }
        break
      case 404:
        notification.error({ message: '系统提示', description: '很抱歉，资源未找到!', duration: 4 })
        break
      case 504:
        notification.error({ message: '系统提示', description: '网络超时' })
        break
      case 401:
        notification.error({ message: '系统提示', description: '未授权，请重新登录', duration: 4 })
        if (token) {
          store.dispatch('Logout').then(() => {
            setTimeout(() => {
              window.location.reload()
            }, 1500)
          })
        }
        break
      default:
        notification.error({
          message: '系统提示',
          description: data.message,
          duration: 4
        })
        break
    }
  } else {
    notification.error({ message: '系统提示', description: '网络超时，请稍后重试' })
  }
  return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use(
  config => {
    const token = Vue.ls.get(ACCESS_TOKEN)
    if (token) {
      config.headers['X-Access-Token'] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
    }
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.parse(new Date()) / 1000
      }
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(response => {
  return response.data
}, err)

const installer = {
  vm: {},
  install(Vue, router = {}) {
    Vue.use(VueAxios, router, service)
  }
}

export { installer as VueAxios, service as axios }
