<!--
  MainNavigation.vue - 主导航组件
  
  Features:
  - 响应式导航菜单
  - 模块间快速切换
  - 搜索功能
  - 主题切换
  - 用户菜单
-->

<template>
  <nav
    class="main-navigation fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-glass-bg/95 to-glass-bg/90 backdrop-blur-xl border-b border-glass-border shadow-glass-lg"
  >
    <div class="container mx-auto px-6">
      <div class="flex items-center justify-between h-16">
        <!-- Logo 和品牌 -->
        <div class="flex items-center space-x-4">
          <NuxtLink to="/" class="group flex items-center space-x-3">
            <div
              class="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl"
            >
              <Icon name="heroicons:sparkles" class="w-6 h-6 text-white" />
            </div>
            <div class="hidden sm:block">
              <h1 class="text-white font-bold text-xl">Mindtrail</h1>
              <p class="text-white/60 text-xs">思维轨迹</p>
            </div>
          </NuxtLink>
        </div>

        <!-- 主导航菜单 -->
        <div class="hidden md:flex items-center space-x-1">
          <NuxtLink
            v-for="item in navigationItems"
            :key="item.path"
            :to="item.path"
            class="group flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 hover:bg-white/10 text-white/80 hover:text-white"
            :class="{
              'bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-primary-300':
                isActive(item.path),
            }"
          >
            <Icon
              :name="item.icon"
              class="w-5 h-5 text-white/80 group-hover:text-white transition-all duration-300 group-hover:scale-110"
            />
            <span class="text-sm font-medium">{{ item.label }}</span>
            <div
              v-if="item.badge"
              class="px-2 py-0.5 bg-accent-500 text-white text-xs rounded-full"
            >
              {{ item.badge }}
            </div>
          </NuxtLink>
        </div>

        <!-- 右侧操作区 -->
        <div class="flex items-center space-x-3">
          <!-- 全局搜索 -->
          <div class="relative">
            <button
              @click="toggleSearch"
              class="group w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
              :class="{
                'bg-primary-500/20 text-primary-300 border-primary-400/50':
                  showSearch,
              }"
            >
              <Icon
                name="heroicons:magnifying-glass"
                class="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
              />
            </button>

            <!-- 搜索下拉面板 -->
            <div
              v-if="showSearch"
              class="absolute top-full right-0 mt-2 w-96 bg-glass-bg/95 backdrop-blur-xl border border-glass-border rounded-2xl shadow-glass-lg overflow-hidden"
            >
              <div class="p-4">
                <div class="relative">
                  <input
                    v-model="searchQuery"
                    ref="searchInput"
                    type="text"
                    placeholder="搜索文章、照片、时间线..."
                    class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pl-12 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all duration-300"
                    @keydown.escape="closeSearch"
                    @keydown.enter="performSearch"
                  />
                  <Icon
                    name="heroicons:magnifying-glass"
                    class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60"
                  />
                </div>

                <!-- 搜索建议 -->
                <div v-if="searchSuggestions.length > 0" class="mt-4 space-y-2">
                  <div class="text-white/60 text-xs font-medium mb-2">
                    搜索建议
                  </div>
                  <button
                    v-for="suggestion in searchSuggestions.slice(0, 5)"
                    :key="suggestion.id"
                    @click="selectSuggestion(suggestion)"
                    class="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors duration-200 text-left"
                  >
                    <div
                      class="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                      :style="{
                        backgroundColor: getTypeColor(suggestion.type),
                      }"
                    >
                      <Icon
                        :name="getTypeIcon(suggestion.type)"
                        class="w-4 h-4 text-white"
                      />
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="text-white text-sm font-medium line-clamp-1">
                        {{ suggestion.title }}
                      </div>
                      <div class="text-white/60 text-xs line-clamp-1">
                        {{ suggestion.description }}
                      </div>
                    </div>
                  </button>
                </div>

                <!-- 快速导航 -->
                <div class="mt-4 pt-4 border-t border-white/10">
                  <div class="text-white/60 text-xs font-medium mb-2">
                    快速导航
                  </div>
                  <div class="grid grid-cols-2 gap-2">
                    <NuxtLink
                      v-for="item in quickNavItems"
                      :key="item.path"
                      :to="item.path"
                      @click="closeSearch"
                      class="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
                    >
                      <Icon :name="item.icon" class="w-4 h-4 text-white/60" />
                      <span class="text-white/80 text-sm">{{
                        item.label
                      }}</span>
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 主题切换 -->
          <button
            @click="themeManager.toggleTheme()"
            class="group w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
            :title="themeManager.getThemeLabel()"
          >
            <Icon
              :name="themeManager.getThemeIcon()"
              class="w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
            />
          </button>

          <!-- 用户菜单 -->
          <div class="relative">
            <button
              @click="toggleUserMenu"
              class="group flex items-center space-x-2 p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300 hover:scale-105"
            >
              <div
                class="w-6 h-6 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center"
              >
                <Icon name="heroicons:user" class="w-4 h-4 text-white" />
              </div>
              <span class="hidden sm:block text-white/80 text-sm">用户</span>
              <Icon
                name="heroicons:chevron-down"
                class="w-4 h-4 text-white/60 transition-transform duration-300"
                :class="{ 'rotate-180': showUserMenu }"
              />
            </button>

            <!-- 用户菜单下拉 -->
            <div
              v-if="showUserMenu"
              class="absolute top-full right-0 mt-2 w-48 bg-glass-bg/95 backdrop-blur-xl border border-glass-border rounded-xl shadow-glass-lg overflow-hidden"
            >
              <div class="p-2">
                <button
                  v-for="item in userMenuItems"
                  :key="item.label"
                  @click="handleUserMenuClick(item)"
                  class="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors duration-200 text-left"
                >
                  <Icon :name="item.icon" class="w-4 h-4 text-white/60" />
                  <span class="text-white/80 text-sm">{{ item.label }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- 移动端菜单按钮 -->
          <button
            @click="toggleMobileMenu"
            class="md:hidden group w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
          >
            <Icon
              :name="showMobileMenu ? 'heroicons:x-mark' : 'heroicons:bars-3'"
              class="w-5 h-5 transition-all duration-300 group-hover:scale-110"
            />
          </button>
        </div>
      </div>

      <!-- 移动端菜单 -->
      <div
        v-if="showMobileMenu"
        class="md:hidden border-t border-glass-border bg-gradient-to-b from-white/5 to-transparent"
      >
        <div class="py-4 space-y-2">
          <NuxtLink
            v-for="item in navigationItems"
            :key="item.path"
            :to="item.path"
            @click="closeMobileMenu"
            class="flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 hover:bg-white/10 text-white/80 hover:text-white"
            :class="{
              'bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-primary-300':
                isActive(item.path),
            }"
          >
            <Icon :name="item.icon" class="w-5 h-5 text-white/80" />
            <span class="text-sm font-medium">{{ item.label }}</span>
            <div
              v-if="item.badge"
              class="ml-auto px-2 py-0.5 bg-accent-500 text-white text-xs rounded-full"
            >
              {{ item.badge }}
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
// 响应式状态
const showSearch = ref(false)
const showUserMenu = ref(false)
const showMobileMenu = ref(false)
const searchQuery = ref('')
const searchInput = ref<HTMLInputElement>()

// 主题管理
const themeManager = useGlobalTheme()

// 导航配置
const navigationItems = [
  {
    path: '/articles-enhanced',
    label: '文章',
    icon: 'heroicons:document-text',
    badge: null,
  },
  {
    path: '/gallery-enhanced',
    label: '相册',
    icon: 'heroicons:photo',
    badge: null,
  },
  {
    path: '/moments-new',
    label: '说说',
    icon: 'heroicons:chat-bubble-left',
    badge: null,
  },
  {
    path: '/timeline-optimized',
    label: '时间轴',
    icon: 'heroicons:clock',
    badge: 'New',
  },
  {
    path: '/map-optimized',
    label: '地图',
    icon: 'heroicons:globe-asia-australia',
    badge: 'New',
  },
]

const quickNavItems = [
  {
    path: '/articles-enhanced',
    label: '最新文章',
    icon: 'heroicons:document-text',
  },
  { path: '/gallery-enhanced', label: '照片集', icon: 'heroicons:photo' },
  {
    path: '/moments-new',
    label: '生活说说',
    icon: 'heroicons:chat-bubble-left',
  },
  { path: '/timeline-optimized', label: '时间线', icon: 'heroicons:clock' },
  { path: '/map-optimized', label: '地图', icon: 'heroicons:map' },
]

const userMenuItems = [
  { label: '个人设置', icon: 'heroicons:cog-6-tooth', action: 'settings' },
  { label: '主题切换', icon: 'heroicons:swatch', action: 'theme' },
  { label: '导出数据', icon: 'heroicons:arrow-down-tray', action: 'export' },
  { label: '帮助文档', icon: 'heroicons:question-mark-circle', action: 'help' },
]

// 模拟搜索数据
const searchSuggestions = computed(() => {
  if (!searchQuery.value) return []

  const mockData = [
    {
      id: '1',
      title: '深度学习在NLP中的应用',
      description: '技术文章',
      type: 'article',
    },
    { id: '2', title: '上海外滩夜景', description: '摄影作品', type: 'photo' },
    {
      id: '3',
      title: '完成博客重构',
      description: '里程碑事件',
      type: 'milestone',
    },
    { id: '4', title: '华东摄影之旅', description: '旅行故事', type: 'story' },
  ]

  const query = searchQuery.value.toLowerCase()
  return mockData.filter(
    (item) =>
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
  )
})

// 路由相关
const route = useRoute()

const isActive = (path: string) => {
  return route.path === path
}

// 事件处理
const toggleSearch = () => {
  showSearch.value = !showSearch.value
  if (showSearch.value) {
    nextTick(() => {
      searchInput.value?.focus()
    })
  }
}

const closeSearch = () => {
  showSearch.value = false
  searchQuery.value = ''
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}

// 主题切换现在通过 themeManager 处理

const performSearch = () => {
  if (searchQuery.value.trim()) {
    // 执行搜索逻辑
    console.log('Searching for:', searchQuery.value)
    closeSearch()
  }
}

const selectSuggestion = (suggestion: any) => {
  // 根据类型跳转到对应页面
  switch (suggestion.type) {
    case 'article':
      navigateTo(`/articles/${suggestion.id}`)
      break
    case 'photo':
      navigateTo(`/gallery?photo=${suggestion.id}`)
      break
    case 'milestone':
      navigateTo(`/timeline-optimized?event=${suggestion.id}`)
      break
    case 'story':
      navigateTo(`/map-optimized?story=${suggestion.id}`)
      break
  }
  closeSearch()
}

const handleUserMenuClick = (item: any) => {
  switch (item.action) {
    case 'settings':
      console.log('Open settings')
      break
    case 'theme':
      themeManager.toggleTheme()
      break
    case 'export':
      console.log('Export data')
      break
    case 'help':
      console.log('Open help')
      break
  }
  showUserMenu.value = false
}

const getTypeColor = (type: string) => {
  const colors = {
    article: '#3b82f6',
    photo: '#10b981',
    milestone: '#ef4444',
    story: '#f59e0b',
  }
  return colors[type as keyof typeof colors] || '#6b7280'
}

const getTypeIcon = (type: string) => {
  const icons = {
    article: 'heroicons:document-text',
    photo: 'heroicons:photo',
    milestone: 'heroicons:flag',
    story: 'heroicons:book-open',
  }
  return icons[type as keyof typeof icons] || 'heroicons:circle'
}

// 点击外部关闭菜单
onMounted(() => {
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (!target.closest('.main-navigation')) {
      showSearch.value = false
      showUserMenu.value = false
    }
  }

  document.addEventListener('click', handleClickOutside)

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>

<style scoped>
/* 文本截断 */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .main-navigation .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>
