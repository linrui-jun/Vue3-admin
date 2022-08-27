import myRequest from '../index'

import { IAccount, IDataType } from './types'
import { ILoginResult } from '../../service/types'

enum LoginAPI {
  AccountLogin = '/login',
  LoginUserInfo = '/users/', //users/id
  UserMenus = '/role/' //role/id/menu
}

export function accountLoginRequest(account: IAccount) {
  return myRequest.post<IDataType<ILoginResult>>({
    url: LoginAPI.AccountLogin,
    data: account
  })
}

export function requestUserInfoByid(id: number) {
  return myRequest.get<IDataType>({
    url: LoginAPI.LoginUserInfo + id,
    showLoading: false
  })
}

export function requestUserMenusByRoleId(id: number) {
  return myRequest.get<IDataType>({
    url: LoginAPI.UserMenus + id + '/menu',
    showLoading: false
  })
}
