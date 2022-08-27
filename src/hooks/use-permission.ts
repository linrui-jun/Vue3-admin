import { useStore } from '@/store'

export function userPermission(pageName: string, hanldeName: string) {
  const store = useStore()
  const permissions = store.state.login.permissions
  const verifyPermission = `system:${pageName}:${hanldeName}`

  // !!转为布尔值
  return !!permissions.find((item) => item === verifyPermission)
}
