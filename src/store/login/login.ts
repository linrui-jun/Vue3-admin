import { Module } from 'vuex'

import {
  accountLoginRequest,
  requestUserInfoByid,
  requestUserMenusByRoleId
} from '@/service/login/login'
import localCache from '@/utils/cache'
import { mapMenusToRoutes, mapMenusToPermissions } from '@/utils/map-menus'
import router from '@/router'

import { IAccount } from '@/service/login/types'

import { ILoginState } from './types'
import { IRootState } from '../types'

const LoginModule: Module<ILoginState, IRootState> = {
  namespaced: true,
  state() {
    return {
      token: '',
      userInfo: {},
      userMenus: [],
      permissions: []
    }
  },
  getters: {},
  mutations: {
    changeToken(state, token: string) {
      state.token = token
    },
    changeUserInfo(state, userInfo: any) {
      state.userInfo = userInfo
    },
    changeUserMenus(state, userMenus: any) {
      state.userMenus = userMenus

      console.log('注册动态路由')

      // userMenus -> routes
      const routes = mapMenusToRoutes(userMenus)
      // console.log(routes)

      // 将routes -> router.main.children
      routes.forEach((route) => {
        router.addRoute('main', route)
      })

      //获取用户按钮的权限
      const permissions = mapMenusToPermissions(userMenus)
      state.permissions = permissions
    }
  },
  actions: {
    async accountLoginAction({ commit, dispatch }, payload: IAccount) {
      // 1.实现登录逻辑
      const loginResult = await accountLoginRequest(payload)
      console.log(loginResult)
      const { id, token } = loginResult.data
      commit('changeToken', token)
      localCache.setCache('token', token)

      //发送初始化的请求(完整的role、department等)
      //确保token已经拿到
      dispatch('getInitialDataAction', null, { root: true })

      //2.请求用户信息
      const userInfoResult = await requestUserInfoByid(id)
      const userInfo = userInfoResult.data
      console.log(userInfo)

      commit('changeUserInfo', userInfo)
      localCache.setCache('userinfo', userInfo)

      //3.请求用户菜单
      const userMenusResult = await requestUserMenusByRoleId(userInfo.role.id)
      const userMenus = userMenusResult.data
      console.log(userMenus)
      commit('changeUserMenus', userMenus)
      localCache.setCache('usermenus', userMenus)

      //4.跳到首页
      router.push('/main')
    },

    loadLocalLogin({ commit, dispatch }) {
      const token = localCache.getCache('token')
      if (token) {
        commit('changeToken', token)
        //发送初始化的请求(完整的role、department等)
        //确保token已经拿到
        dispatch('getInitialDataAction', null, { root: true })
      }
      const userInfo = localCache.getCache('userinfo')
      if (userInfo) {
        commit('changeUserInfo', userInfo)
      }
      const userMenus = localCache.getCache('userMenus')
      if (userMenus) {
        commit('changeUserMenus', userMenus)
      }
    }

    // phoneLoginAction({commit},payload: any) {
    //   console.log("执行phoneLoginAction");

    // }
  }
}

export default LoginModule
