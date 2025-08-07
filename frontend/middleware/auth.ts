/**
 * 认证中间件
 * 保护需要登录才能访问的页面
 */

export default defineNuxtRouteMiddleware((to, from) => {
  // 在客户端执行
  if (process.client) {
    const { isAuthenticated } = useAuth()
    
    // 如果用户未登录，重定向到登录页
    if (!isAuthenticated.value) {
      return navigateTo({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      })
    }
  }
})
