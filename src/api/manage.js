import { axios } from '@/utils/request'
// get请求
export function getAction (url, params) {
  return axios({
    url: url,
    method: 'get',
    params
  })
}
// post请求
export function postAction (url, data) {
  return axios({
    url: url,
    method: 'post',
    data
  })
}
// put请求
export function putAction (url, data) {
  return axios({
    url: url,
    method: 'put',
    data
  })
}
// delete请求
export function deleteAction (url, params) {
  return axios({
    url: url,
    method: 'delete',
    params
  })
}
// 文件下载
export function downFile (url, params) {
  return axios({
    url: url,
    params,
    method: 'get',
    responseType: 'blob'
  })
}
