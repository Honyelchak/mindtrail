<template>
  <header class="sticky top-0 z-50 glass-nav">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo 和品牌名 -->
        <NuxtLink to="/" class="flex items-center space-x-3 group">
          <div
            class="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-neu-small"
          >
            <svg
              class="w-6 h-6 text-white"
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
          <div class="hidden sm:block">
            <h1 class="text-xl font-bold text-gradient">Mindtrail</h1>
            <p class="text-xs text-neutral-500 dark:text-neutral-400">
              记录型博客
            </p>
          </div>
        </NuxtLink>

        <!-- 桌面端导航菜单 -->
        <nav class="hidden md:flex items-center space-x-1">
          <NuxtLink
            v-for="item in navigation"
            :key="item.name"
            :to="item.href"
            class="nav-link"
            :class="{ 'nav-link-active': $route.path === item.href }"
          >
            <component :is="item.icon" class="w-5 h-5" />
            <span>{{ item.name }}</span>
          </NuxtLink>
        </nav>

        <!-- 右侧工具栏 -->
        <div class="flex items-center space-x-3">
          <!-- 主题切换按钮 -->
          <button
            @click="toggleColorMode"
            class="neu-button p-2 w-10 h-10"
            :title="
              $colorMode.value === 'dark' ? '切换到浅色模式' : '切换到深色模式'
            "
          >
            <SunIcon v-if="$colorMode.value === 'dark'" class="w-5 h-5" />
            <MoonIcon v-else class="w-5 h-5" />
          </button>

          <!-- 未登录状态 -->
          <NuxtLink
            v-if="!isAuthenticated"
            to="/login"
            class="hidden md:flex neu-button px-4 py-2 items-center space-x-2"
          >
            <UserIcon class="w-4 h-4" />
            <span>登录</span>
          </NuxtLink>

          <!-- 已登录状态 -->
          <div v-else class="hidden md:block relative">
            <!-- 用户头像和菜单 -->
            <button
              @click="showUserMenu = !showUserMenu"
              class="flex items-center space-x-2 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <img
                :src="user?.avatar || '/avatars/default.jpg'"
                :alt="user?.name"
                class="w-8 h-8 rounded-full"
                @error="handleAvatarError"
              />
              <span class="font-medium text-neutral-700 dark:text-neutral-300">
                {{ user?.name }}
              </span>
              <ChevronDownIcon class="w-4 h-4 text-neutral-500" />
            </button>

            <!-- 用户下拉菜单 -->
            <div
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-48 neu-card p-2 z-50"
              @click.stop
            >
              <div
                class="py-2 px-3 border-b border-neutral-200/50 dark:border-neutral-700/50 mb-2"
              >
                <p class="font-medium text-neutral-800 dark:text-neutral-200">
                  {{ user?.name }}
                </p>
                <p class="text-sm text-neutral-500 dark:text-neutral-400">
                  {{ user?.email }}
                </p>
              </div>

              <nav class="space-y-1">
                <NuxtLink
                  to="/profile"
                  class="user-menu-item"
                  @click="showUserMenu = false"
                >
                  <UserIcon class="w-4 h-4" />
                  <span>个人资料</span>
                </NuxtLink>

                <NuxtLink
                  to="/create"
                  class="user-menu-item"
                  @click="showUserMenu = false"
                >
                  <PlusIcon class="w-4 h-4" />
                  <span>创建内容</span>
                </NuxtLink>

                <NuxtLink
                  to="/admin"
                  class="user-menu-item"
                  @click="showUserMenu = false"
                >
                  <CogIcon class="w-4 h-4" />
                  <span>管理后台</span>
                </NuxtLink>

                <button
                  @click="handleLogout"
                  class="user-menu-item w-full text-left text-red-600 dark:text-red-400"
                >
                  <ArrowRightOnRectangleIcon class="w-4 h-4" />
                  <span>退出登录</span>
                </button>
              </nav>
            </div>
          </div>

          <!-- 移动端菜单按钮 -->
          <button
            @click="toggleMobileMenu"
            class="md:hidden neu-button p-2 w-10 h-10"
            :class="{ 'neu-button-active': isMobileMenuOpen }"
          >
            <Bars3Icon v-if="!isMobileMenuOpen" class="w-5 h-5" />
            <XMarkIcon v-else class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- 移动端导航菜单 -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <div v-if="isMobileMenuOpen" class="md:hidden py-4">
          <nav class="flex flex-col space-y-2">
            <NuxtLink
              v-for="item in navigation"
              :key="item.name"
              :to="item.href"
              class="mobile-nav-link"
              :class="{ 'mobile-nav-link-active': $route.path === item.href }"
              @click="closeMobileMenu"
            >
              <component :is="item.icon" class="w-5 h-5" />
              <span>{{ item.name }}</span>
            </NuxtLink>
          </nav>
        </div>
      </Transition>
    </div>
  </header>
</template>

<script setup>
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  PhotoIcon,
  MapIcon,
  UserIcon,
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  PlusIcon,
  CogIcon,
  ClockIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/vue/24/outline'

// 使用认证 Composable
const { user, isAuthenticated, logout, initAuth } = useAuth()

// 响应式状态
const isMobileMenuOpen = ref(false)
const showUserMenu = ref(false)

// 导航菜单配置
const navigation = computed(() => {
  const baseNavigation = [
    { name: '主页', href: '/', icon: HomeIcon },
    { name: '说说', href: '/moments', icon: ChatBubbleLeftRightIcon },
    { name: '文章', href: '/articles', icon: DocumentTextIcon },
    { name: '相册', href: '/gallery', icon: PhotoIcon },
    { name: '时间轴', href: '/timeline', icon: ClockIcon },
    { name: '地图', href: '/map', icon: MapIcon },
  ]

  // 如果已登录，添加创建内容链接
  if (isAuthenticated.value) {
    baseNavigation.push({ name: '创建', href: '/create', icon: PlusIcon })
  }

  return baseNavigation
})

// 主题切换
const { $colorMode } = useNuxtApp()
const toggleColorMode = () => {
  $colorMode.preference = $colorMode.value === 'dark' ? 'light' : 'dark'
}

// 移动端菜单控制
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// 用户相关方法
const handleLogout = async () => {
  showUserMenu.value = false
  await logout()
  await navigateTo('/')
}

const handleAvatarError = (event) => {
  event.target.src = '/avatars/default.jpg'
}

// 点击外部关闭用户菜单
const handleClickOutside = (event) => {
  if (showUserMenu.value && !event.target.closest('.relative')) {
    showUserMenu.value = false
  }
}

// 初始化认证状态
onMounted(() => {
  initAuth()

  // 添加全局点击事件监听
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// 监听路由变化，关闭移动端菜单
watch(
  () => useRoute().path,
  () => {
    closeMobileMenu()
    showUserMenu.value = false
  }
)
</script>

<style scoped>
.nav-link {
  @apply flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200;
  @apply text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400;
  @apply hover:bg-white/50 dark:hover:bg-white/5;
}

.nav-link-active {
  @apply text-primary-600 dark:text-primary-400 bg-white/70 dark:bg-white/10;
  box-shadow: var(--shadow-neumorphism-small);
}

.mobile-nav-link {
  @apply flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200;
  @apply text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400;
  @apply hover:bg-white/50 dark:hover:bg-white/5;
}

.mobile-nav-link-active {
  @apply text-primary-600 dark:text-primary-400 bg-white/70 dark:bg-white/10;
  box-shadow: var(--shadow-neumorphism-small);
}

.neu-button-active {
  box-shadow: var(--shadow-neumorphism-inset);
}

.user-menu-item {
  @apply flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200;
  @apply text-neutral-600 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-100;
  @apply hover:bg-neutral-100 dark:hover:bg-neutral-700;
}
</style>
