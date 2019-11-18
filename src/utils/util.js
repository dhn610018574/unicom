import { isURL } from '@/utils/validate'

export function timeFix() {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}

export function welcome() {
  const arr = ['休息一会儿吧', '准备吃什么呢?', '要不要打一把 DOTA', '我猜你可能累了']
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent() {
  const event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

/**
 * 过滤对象中为空的属性
 * @param obj
 * @returns {*}
 */
export function filterObj(obj) {
  if (!(typeof obj === 'object')) {
    return
  }

  for (var key in obj) {
    if (obj.hasOwnProperty(key) && (obj[key] == null || obj[key] === undefined || obj[key] === '')) {
      delete obj[key]
    }
  }
  return obj
}

/**
 * 时间格式化
 * @param value
 * @param fmt
 * @returns {*}
 */
export function formatDate(value, fmt) {
  var regPos = /^\d+(\.\d+)?$/
  if (regPos.test(value)) {
    // 如果是数字
    const getDate = new Date(value)
    const o = {
      'M+': getDate.getMonth() + 1,
      'd+': getDate.getDate(),
      'h+': getDate.getHours(),
      'm+': getDate.getMinutes(),
      's+': getDate.getSeconds(),
      'q+': Math.floor((getDate.getMonth() + 3) / 3),
      S: getDate.getMilliseconds()
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (getDate.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (const k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
      }
    }
    return fmt
  } else {
    // TODO
    value = value.trim()
    return value.substr(0, fmt.length)
  }
}

// 生成首页路由
export function generateIndexRouter(data) {
  const home = getHomePath(data.filter(item => !item.hidden && item.path !== '/dashboard/analysis'))
  const indexRouter = [
    {
      path: '/',
      name: 'home',
      component: resolve => require(['@/components/layouts/TabLayout'], resolve),
      meta: { title: '首页' },
      redirect: home,
      children: [...generateChildRouters(data)]
    },
    {
      path: '*',
      redirect: '/404',
      hidden: true
    },
    {
      path: '/404',
      hidden: true,
      component: resolve => require(['@/views/exception/404'], resolve)
    }
  ]
  return indexRouter
}

// 获取首页跳转path
function getHomePath(data) {
  if (data.length) {
    if (data[0].children && data[0].children.length) {
      return getHomePath(data[0].children.filter(item => !item.hidden))
    } else {
      return data[0].path
    }
  } else {
    return '/404'
  }
}

// 生成嵌套路由（子路由）
function generateChildRouters(data) {
  const routers = []
  for (var item of data) {
    let component = ''
    if (item.component.indexOf('layouts') >= 0) {
      component = 'components/' + item.component
    } else {
      component = 'views/' + item.component
    }

    // eslint-disable-next-line no-eval
    const URL = (item.meta.url || '').replace(/{{([^}}]+)?}}/g, (s1, s2) => eval(s2)) // URL支持{{ window.xxx }}占位符变量
    if (isURL(URL)) {
      item.meta.url = URL
    }

    const menu = {
      id: item.id,
      path: item.path,
      name: item.name,
      redirect: item.redirect,
      component: resolve => require(['@/' + component + '.vue'], resolve),
      hidden: item.hidden,
      meta: {
        title: item.meta.title,
        icon: item.meta.icon,
        url: item.meta.url,
        permissionList: item.meta.permissionList
      }
    }
    if (item.alwaysShow) {
      menu.alwaysShow = true
    }
    if (item.children && item.children.length > 0) {
      menu.children = [...generateChildRouters(item.children)]
    }

    if (item.route && item.route === '0') {
      console.log('123')
    } else {
      routers.push(menu)
    }
  }
  return routers
}

/**
 * 深度克隆对象、数组
 * @param obj 被克隆的对象
 * @return 克隆后的对象
 */
export function cloneObject(obj) {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * 随机生成数字
 *
 * 示例：生成长度为 12 的随机数：randomNumber(12)
 * 示例：生成 3~23 之间的随机数：randomNumber(3, 23)
 *
 * @param1 最小值 | 长度
 * @param2 最大值
 * @return int 生成后的数字
 */
export function randomNumber() {
  // 生成 最小值 到 最大值 区间的随机数
  const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
  if (arguments.length === 1) {
    const [length] = arguments
    // 生成指定长度的随机数字，首位一定不是 0
    const nums = [...Array(length).keys()].map(i => (i > 0 ? random(0, 9) : random(1, 9)))
    return parseInt(nums.join(''))
  } else if (arguments.length >= 2) {
    const [min, max] = arguments
    return random(min, max)
  } else {
    return Number.NaN
  }
}

/**
 * 随机生成字符串
 * @param length 字符串的长度
 * @param chats 可选字符串区间（只会生成传入的字符串中的字符）
 * @return string 生成的字符串
 */
export function randomString(length, chats) {
  if (!length) length = 1
  if (!chats) chats = '0123456789qwertyuioplkjhgfdsazxcvbnm'
  let str = ''
  for (let i = 0; i < length; i++) {
    const num = randomNumber(0, chats.length - 1)
    str += chats[num]
  }
  return str
}

/**
 * 随机生成uuid
 * @return string 生成的uuid
 */
export function randomUUID() {
  const chats = '0123456789abcdef'
  return randomString(32, chats)
}

/**
 * 下划线转驼峰
 * @param string
 * @returns {*}
 */
export function underLine2CamelCase(string) {
  return string.replace(/_([a-z])/g, function(all, letter) {
    return letter.toUpperCase()
  })
}

// 修正数字为两位数
export function returnFloat(value) {
  value = Math.round(parseFloat(value) * 100) / 100
  if (!value) {
    return '0.00'
  }
  var s = value.toString().split('.')
  if (s.length === 1) {
    value = value.toString() + '.00'
    return value
  }
  if (s.length > 1) {
    if (s[1].length < 2) {
      value = value.toString() + '0'
    }
    return value
  }
}
