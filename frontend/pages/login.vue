<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4">
    <div class="max-w-md w-full">
      <!-- Logo 和标题 -->
      <div class="text-center mb-8">
        <div
          class="w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center mx-auto mb-4 shadow-neu-small"
        >
          <svg
            class="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gradient mb-2">欢迎回来</h1>
        <p class="text-neutral-600 dark:text-neutral-400">
          登录到你的 Mindtrail 账户
        </p>
      </div>

      <!-- 登录表单 -->
      <div class="neu-card p-8">
        <!-- 标签切换 -->
        <div
          class="flex mb-6 bg-neutral-100 dark:bg-neutral-800 rounded-xl p-1"
        >
          <button
            @click="activeTab = 'login'"
            class="flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-all"
            :class="
              activeTab === 'login'
                ? 'bg-white dark:bg-neutral-700 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400'
            "
          >
            登录
          </button>
          <button
            @click="activeTab = 'register'"
            class="flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-all"
            :class="
              activeTab === 'register'
                ? 'bg-white dark:bg-neutral-700 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400'
            "
          >
            注册
          </button>
        </div>

        <!-- 错误信息 -->
        <div
          v-if="error"
          class="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
        >
          <div class="flex items-center space-x-2">
            <ExclamationTriangleIcon
              class="w-4 h-4 text-red-600 dark:text-red-400"
            />
            <span class="text-sm text-red-600 dark:text-red-400">{{
              error
            }}</span>
          </div>
        </div>

        <!-- 登录表单 -->
        <form v-if="activeTab === 'login'" @submit.prevent="handleLogin">
          <div class="space-y-4">
            <div>
              <label
                class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
              >
                邮箱地址
              </label>
              <input
                v-model="loginForm.email"
                type="email"
                required
                class="auth-input"
                placeholder="请输入邮箱地址"
              />
            </div>

            <div>
              <label
                class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
              >
                密码
              </label>
              <div class="relative">
                <input
                  v-model="loginForm.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  class="auth-input pr-10"
                  placeholder="请输入密码"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <EyeIcon
                    v-if="showPassword"
                    class="w-4 h-4 text-neutral-400"
                  />
                  <EyeSlashIcon v-else class="w-4 h-4 text-neutral-400" />
                </button>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <label class="flex items-center">
                <input
                  v-model="loginForm.remember"
                  type="checkbox"
                  class="w-4 h-4 text-primary-600 bg-neutral-100 border-neutral-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-neutral-800 focus:ring-2 dark:bg-neutral-700 dark:border-neutral-600"
                />
                <span
                  class="ml-2 text-sm text-neutral-600 dark:text-neutral-400"
                  >记住我</span
                >
              </label>

              <button
                type="button"
                class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
              >
                忘记密码？
              </button>
            </div>

            <button
              type="submit"
              class="w-full neu-button py-3"
              :disabled="loading"
            >
              {{ loading ? '登录中...' : '登录' }}
            </button>
          </div>
        </form>

        <!-- 注册表单 -->
        <form v-else @submit.prevent="handleRegister">
          <div class="space-y-4">
            <div>
              <label
                class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
              >
                用户名
              </label>
              <input
                v-model="registerForm.name"
                type="text"
                required
                class="auth-input"
                placeholder="请输入用户名"
              />
            </div>

            <div>
              <label
                class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
              >
                邮箱地址
              </label>
              <input
                v-model="registerForm.email"
                type="email"
                required
                class="auth-input"
                placeholder="请输入邮箱地址"
              />
            </div>

            <div>
              <label
                class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
              >
                密码
              </label>
              <div class="relative">
                <input
                  v-model="registerForm.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  class="auth-input pr-10"
                  placeholder="请输入密码（至少6位）"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <EyeIcon
                    v-if="showPassword"
                    class="w-4 h-4 text-neutral-400"
                  />
                  <EyeSlashIcon v-else class="w-4 h-4 text-neutral-400" />
                </button>
              </div>
            </div>

            <div>
              <label
                class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
              >
                确认密码
              </label>
              <input
                v-model="registerForm.confirmPassword"
                type="password"
                required
                class="auth-input"
                placeholder="请再次输入密码"
              />
            </div>

            <div class="flex items-start">
              <input
                v-model="registerForm.agreeTerms"
                type="checkbox"
                required
                class="w-4 h-4 text-primary-600 bg-neutral-100 border-neutral-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-neutral-800 focus:ring-2 dark:bg-neutral-700 dark:border-neutral-600 mt-0.5"
              />
              <span class="ml-2 text-sm text-neutral-600 dark:text-neutral-400">
                我同意
                <button
                  type="button"
                  class="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  用户协议
                </button>
                和
                <button
                  type="button"
                  class="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  隐私政策
                </button>
              </span>
            </div>

            <button
              type="submit"
              class="w-full neu-button py-3"
              :disabled="loading"
            >
              {{ loading ? '注册中...' : '创建账户' }}
            </button>
          </div>
        </form>

        <!-- 演示账户提示 -->
        <div
          class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
        >
          <div class="flex items-start space-x-2">
            <InformationCircleIcon
              class="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"
            />
            <div class="text-sm">
              <p class="text-blue-800 dark:text-blue-200 font-medium mb-1">
                演示账户
              </p>
              <p class="text-blue-700 dark:text-blue-300">
                邮箱: demo@mindtrail.com<br />
                密码: demo123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
  InformationCircleIcon,
} from '@heroicons/vue/24/outline'

// 页面元数据
useHead({
  title: '登录 - Mindtrail',
  meta: [
    {
      name: 'description',
      content: '登录到你的 Mindtrail 账户，开始记录生活的每一个瞬间。',
    },
  ],
})

// 路由
const router = useRouter()

// 使用认证 Composable
const { login, register, loading, error, clearError } = useAuth()

// 响应式数据
const activeTab = ref('login')
const showPassword = ref(false)

// 表单数据
const loginForm = ref({
  email: '',
  password: '',
  remember: false,
})

const registerForm = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false,
})

// 方法
const handleLogin = async () => {
  clearError()

  const result = await login({
    email: loginForm.value.email,
    password: loginForm.value.password,
  })

  if (result.success) {
    // 登录成功，跳转到首页
    await router.push('/')
  }
}

const handleRegister = async () => {
  clearError()

  // 验证密码确认
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    error.value = '两次输入的密码不一致'
    return
  }

  const result = await register({
    name: registerForm.value.name,
    email: registerForm.value.email,
    password: registerForm.value.password,
  })

  if (result.success) {
    // 注册成功，跳转到首页
    await router.push('/')
  }
}

// 监听标签切换，清除错误
watch(activeTab, () => {
  clearError()
})
</script>

<style scoped>
.auth-input {
  @apply w-full px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all;
}

.auth-input:focus {
  @apply ring-2 ring-primary-500 border-transparent;
}
</style>
