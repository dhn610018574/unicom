import { postAction } from './manage'
import apiUrl from './apiUrl'
// 登录接口
const loginIn = (params) => postAction(apiUrl.login, params)

export {
  loginIn
}
