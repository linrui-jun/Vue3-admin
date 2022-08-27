// service统一出口
import MYRequest from './request'
import { BASE_URL, TIME_OUT } from './request/config'

import localCache from '@/utils/cache'

const myRequest = new MYRequest({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
  interceptors: {
    requestInterceptor: (config) => {
      // console.log('实例的请求拦截器')
      const token = localCache.getCache('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    requestInterceptorCatch(error) {
      return error
    },
    responseInterceptor(res) {
      // console.log('实例的响应拦截器')
      return res
    },
    responseInterceptorCatch(error) {
      return error
    }
  }
})

export default myRequest
