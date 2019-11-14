import { getAction } from './manage'
const queryPermissionsByUser = (params) => getAction('/sys/permission/getUserPermissionByToken', params)
export {
  queryPermissionsByUser
}
