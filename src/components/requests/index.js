import axios from 'axios'
import { message } from 'antd'

const isDev = process.env.NODE_ENV === 'development'

const service = axios.create(
  {
    baseURL: isDev ? 'http://rap2api.taobao.org/app/mock/236109' : ''
  }
)
const service1 = axios.create(
  {
    baseURL: isDev ? 'http://rap2api.taobao.org/app/mock/236109' : ''
  }
)

service.interceptors.request.use(
  (config) => {
    config.data = Object.assign({}, config.data, {
      authToken: 'itisatokenplaceholder'
    })
    return config
  }
)
service.interceptors.response.use(
  (resp) => {
    if (resp.data.code === 200) {
      return resp.data
    } else {
      // 全局显示错误
      message.error(resp.data.errMsg)
    }
  }
)

// 获取文章列表
export const getArticles = (offset = 0, limited = 10) => {
  return service.post('/api/v1/articleList', { offset, limited })
}

// 通过id删除文章
export const deleteArt = id => {
  // 此处有两种方式，一种是 return service.post('/api/v1/articleDelete',{id})
  return service.post(`/api/v1/articleDelete/${id}`)
}

// 获取文章阅读量
export const getArticleReadAmount = () => {
  return service.post('/api/v1/notifications')
}

// 获取通知列表
export const getNotifications = () => {
  return service.post('/api/v1/notifications')
}

// 登录接口
// export const loginRequest = (username = "0",password = "0", remember = true) => {
//   return service1.post('/api/v1/login',{username, password, remember})
// }
export const loginRequest = ({ username, password, remember }) => {
  return service1.post('/api/v1/login', { username, password, remember })
}