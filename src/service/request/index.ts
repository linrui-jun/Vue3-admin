import axios from 'axios'
import type { AxiosInstance } from 'axios'
import { MYRequestConfig, MYRequestInterceptors } from './type'

import { ElLoading } from 'element-plus'
import { LoadingInstance } from 'element-plus/lib/components/loading/src/loading'

const DEAFULT_LOADING = true

class MYRequest {
  instance: AxiosInstance
  interceptors?: MYRequestInterceptors
  showLoading: boolean
  loading?: LoadingInstance

  constructor(config: MYRequestConfig) {
    //创建axios实例
    this.instance = axios.create(config)

    //保存基本信息
    this.interceptors = config.interceptors
    this.showLoading = config.showLoading ?? DEAFULT_LOADING

    // 使用拦截器
    // 1.从config中取出的拦截器是对应实例的拦截器
    this.instance.interceptors.request.use(
      this.interceptors?.requestInterceptor,
      this.interceptors?.requestInterceptorCatch
    )
    this.instance.interceptors.response.use(
      this.interceptors?.responseInterceptor,
      this.interceptors?.responseInterceptorCatch
    )

    // 2.添加所有的实例都有的拦截器
    this.instance.interceptors.request.use(
      (config) => {
        // console.log('所有实例请求的拦截器')
        if (this.showLoading) {
          this.loading = ElLoading.service({
            lock: true,
            text: '正在请求数据...',
            background: 'rgb(0,0,0,0.5)'
          })
        }
        return config
      },
      (err) => {
        return err
      }
    )
    this.instance.interceptors.response.use(
      (res) => {
        // console.log('所有实例请求的拦截器')
        //移除loading
        setTimeout(() => {
          this.loading?.close()
        }, 2000)
        //只需要返回data，因为axios会创建很多对象
        const data = res.data
        if (data.returnCode === '-1001') {
          // console.log('请求失败，错误信息')
        } else {
          return data
        }
      },
      (error) => {
        this.loading?.close()
        return error
      }
    )
  }

  request<T = any>(config: MYRequestConfig<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      //3.每一个请求特有的拦截器
      if (config.interceptors?.requestInterceptor) {
        config = config.interceptors.requestInterceptor(config)
      }

      //判断是否需要显示Loading（在main.ts发生网络请求时）
      if (config.showLoading === false) {
        this.showLoading = config.showLoading
      }

      this.instance
        .request<any, T>(config)
        .then((res) => {
          if (config.interceptors?.responseInterceptor) {
            res = config.interceptors.responseInterceptor(res)
          }
          // 2.将showLoading设置true, 这样不会影响下一个请求
          this.showLoading = DEAFULT_LOADING

          //将结果resolve返回出去
          resolve(res)
        })
        .catch((err) => {
          // 2.将showLoading设置true, 这样不会影响下一个请求
          this.showLoading = DEAFULT_LOADING
          reject(err)
          return err
        })
    })
  }

  get<T = any>(config: MYRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'GET' })
  }
  post<T = any>(config: MYRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'POST' })
  }
  delete<T = any>(config: MYRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE' })
  }
  patch<T = any>(config: MYRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'PATCH' })
  }
}
export default MYRequest
