/**
 * 用户认证管理 Composable
 * 提供登录、注册、登出、权限验证等功能
 */

import type {
  User,
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from '~/types'

export const useAuth = () => {
  // 响应式数据
  const user = ref<User | null>(null)
  const isAuthenticated = ref<boolean>(false)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // 从 localStorage 或 cookie 中获取用户信息
  const initAuth = () => {
    if (process.client) {
      const token = localStorage.getItem('auth_token')
      const userData = localStorage.getItem('user_data')

      if (token && userData) {
        try {
          user.value = JSON.parse(userData)
          isAuthenticated.value = true
        } catch (err) {
          console.error('Error parsing user data:', err)
          clearAuth()
        }
      }
    }
  }

  /**
   * 用户登录
   */
  const login = async (credentials) => {
    loading.value = true
    error.value = null

    try {
      // 模拟 API 调用延迟
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 模拟登录验证
      const { email, password } = credentials

      if (email === 'demo@mindtrail.com' && password === 'demo123') {
        const userData = {
          id: '1',
          name: '演示用户',
          email: 'demo@mindtrail.com',
          avatar: '/avatars/demo-user.jpg',
          role: 'user',
          permissions: ['read', 'write', 'comment'],
          profile: {
            bio: '这是一个演示账户',
            location: '北京',
            website: 'https://mindtrail.demo',
            joinedAt: '2024-01-01T00:00:00Z',
          },
          preferences: {
            theme: 'auto',
            language: 'zh-CN',
            notifications: {
              email: true,
              push: false,
              comments: true,
              likes: true,
            },
            privacy: {
              showEmail: false,
              showLocation: true,
              allowComments: true,
            },
          },
        }

        const token = 'demo_jwt_token_' + Date.now()

        // 保存到本地存储
        if (process.client) {
          localStorage.setItem('auth_token', token)
          localStorage.setItem('user_data', JSON.stringify(userData))
        }

        user.value = userData
        isAuthenticated.value = true

        return { success: true, user: userData }
      } else {
        throw new Error('邮箱或密码错误')
      }
    } catch (err) {
      error.value = err.message || '登录失败'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * 用户注册
   */
  const register = async (userData) => {
    loading.value = true
    error.value = null

    try {
      // 模拟 API 调用延迟
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // 模拟注册验证
      const { name, email, password } = userData

      // 简单验证
      if (!name || !email || !password) {
        throw new Error('请填写所有必填字段')
      }

      if (password.length < 6) {
        throw new Error('密码长度至少6位')
      }

      // 模拟邮箱已存在检查
      if (email === 'existing@example.com') {
        throw new Error('该邮箱已被注册')
      }

      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        avatar: '/avatars/default.jpg',
        role: 'user',
        permissions: ['read', 'write', 'comment'],
        profile: {
          bio: '',
          location: '',
          website: '',
          joinedAt: new Date().toISOString(),
        },
        preferences: {
          theme: 'auto',
          language: 'zh-CN',
          notifications: {
            email: true,
            push: false,
            comments: true,
            likes: true,
          },
          privacy: {
            showEmail: false,
            showLocation: true,
            allowComments: true,
          },
        },
      }

      const token = 'jwt_token_' + Date.now()

      // 保存到本地存储
      if (process.client) {
        localStorage.setItem('auth_token', token)
        localStorage.setItem('user_data', JSON.stringify(newUser))
      }

      user.value = newUser
      isAuthenticated.value = true

      return { success: true, user: newUser }
    } catch (err) {
      error.value = err.message || '注册失败'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * 用户登出
   */
  const logout = async () => {
    loading.value = true

    try {
      // 模拟 API 调用
      await new Promise((resolve) => setTimeout(resolve, 500))

      clearAuth()

      return { success: true }
    } catch (err) {
      error.value = err.message || '登出失败'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * 清除认证信息
   */
  const clearAuth = () => {
    user.value = null
    isAuthenticated.value = false

    if (process.client) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
    }
  }

  /**
   * 更新用户信息
   */
  const updateProfile = async (profileData) => {
    loading.value = true
    error.value = null

    try {
      // 模拟 API 调用
      await new Promise((resolve) => setTimeout(resolve, 800))

      const updatedUser = {
        ...user.value,
        ...profileData,
        profile: {
          ...user.value.profile,
          ...profileData.profile,
        },
      }

      // 保存到本地存储
      if (process.client) {
        localStorage.setItem('user_data', JSON.stringify(updatedUser))
      }

      user.value = updatedUser

      return { success: true, user: updatedUser }
    } catch (err) {
      error.value = err.message || '更新失败'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * 更改密码
   */
  const changePassword = async (passwordData) => {
    loading.value = true
    error.value = null

    try {
      // 模拟 API 调用
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const { currentPassword, newPassword } = passwordData

      // 模拟密码验证
      if (currentPassword !== 'demo123') {
        throw new Error('当前密码错误')
      }

      if (newPassword.length < 6) {
        throw new Error('新密码长度至少6位')
      }

      return { success: true }
    } catch (err) {
      error.value = err.message || '密码更改失败'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * 权限检查
   */
  const hasPermission = (permission) => {
    if (!isAuthenticated.value || !user.value) return false
    return user.value.permissions?.includes(permission) || false
  }

  /**
   * 角色检查
   */
  const hasRole = (role) => {
    if (!isAuthenticated.value || !user.value) return false
    return user.value.role === role
  }

  /**
   * 刷新用户信息
   */
  const refreshUser = async () => {
    if (!isAuthenticated.value) return

    loading.value = true

    try {
      // 模拟从服务器获取最新用户信息
      await new Promise((resolve) => setTimeout(resolve, 500))

      // 实际项目中这里应该调用 API 获取最新用户信息
      return { success: true, user: user.value }
    } catch (err) {
      error.value = err.message || '刷新用户信息失败'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * 清除错误信息
   */
  const clearError = () => {
    error.value = null
  }

  return {
    // 状态
    user: readonly(user),
    isAuthenticated: readonly(isAuthenticated),
    loading: readonly(loading),
    error: readonly(error),

    // 方法
    initAuth,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    hasPermission,
    hasRole,
    refreshUser,
    clearError,
  }
}
