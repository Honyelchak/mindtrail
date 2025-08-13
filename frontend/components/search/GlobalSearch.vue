<!--
  GlobalSearch.vue - 全局搜索组件
  
  Features:
  - 全局内容搜索
  - 实时搜索建议
  - 搜索历史记录
  - 高级筛选选项
  - 键盘快捷键支持
-->

<template>
  <div class="global-search">
    <!-- 搜索触发按钮 -->
    <button
      v-if="!isOpen"
      @click="openSearch"
      class="search-trigger group flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
    >
      <Icon name="heroicons:magnifying-glass" class="w-4 h-4" />
      <span class="text-sm">搜索...</span>
      <div class="hidden sm:flex items-center space-x-1 ml-2 px-2 py-1 bg-white/10 rounded text-xs">
        <span>⌘</span>
        <span>K</span>
      </div>
    </button>

    <!-- 搜索模态框 -->
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-20"
      @click="closeSearch"
    >
      <div
        class="search-modal w-full max-w-2xl mx-4 bg-gradient-to-br from-glass-bg/95 to-glass-bg/90 backdrop-blur-xl border border-glass-border rounded-2xl shadow-glass-lg overflow-hidden"
        @click.stop
      >
        <!-- 搜索输入框 -->
        <div class="p-6 border-b border-glass-border">
          <div class="relative">
            <input
              ref="searchInput"
              v-model="searchQuery"
              type="text"
              placeholder="搜索文章、照片、时间线、地图..."
              class="w-full bg-transparent text-white text-lg placeholder-white/60 focus:outline-none"
              @keydown.escape="closeSearch"
              @keydown.enter="performSearch"
              @keydown.down="navigateResults('down')"
              @keydown.up="navigateResults('up')"
            />
            <Icon name="heroicons:magnifying-glass" class="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 text-white/60" />
          </div>
        </div>

        <!-- 搜索结果 -->
        <div class="max-h-96 overflow-y-auto">
          <!-- 搜索建议 -->
          <div v-if="searchQuery && searchResults.length > 0" class="p-4">
            <div class="text-white/60 text-sm font-medium mb-3 flex items-center space-x-2">
              <Icon name="heroicons:light-bulb" class="w-4 h-4" />
              <span>搜索结果</span>
              <span class="px-2 py-0.5 bg-white/10 rounded-full text-xs">{{ searchResults.length }}</span>
            </div>
            
            <div class="space-y-2">
              <button
                v-for="(result, index) in searchResults.slice(0, 8)"
                :key="result.id"
                @click="selectResult(result)"
                class="w-full flex items-center space-x-4 p-3 rounded-xl hover:bg-white/10 transition-colors duration-200 text-left"
                :class="{ 'bg-white/10': index === selectedIndex }"
              >
                <!-- 结果图标 -->
                <div
                  class="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center shadow-lg"
                  :style="{ backgroundColor: getResultColor(result.type) }"
                >
                  <Icon :name="getResultIcon(result.type)" class="w-5 h-5 text-white" />
                </div>
                
                <!-- 结果信息 -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-2 mb-1">
                    <h4 class="text-white font-medium line-clamp-1" v-html="highlightText(result.title, searchQuery)" />
                    <span
                      class="px-2 py-0.5 rounded-full text-xs font-medium"
                      :style="{ backgroundColor: getResultColor(result.type), color: 'white' }"
                    >
                      {{ getResultTypeLabel(result.type) }}
                    </span>
                  </div>
                  <p class="text-white/70 text-sm line-clamp-1" v-html="highlightText(result.description, searchQuery)" />
                  <div class="flex items-center space-x-3 mt-2 text-xs text-white/50">
                    <span>{{ formatDate(result.date) }}</span>
                    <span v-if="result.tags">{{ result.tags.slice(0, 2).map(tag => `#${tag}`).join(' ') }}</span>
                  </div>
                </div>
                
                <!-- 快捷键提示 -->
                <div v-if="index === selectedIndex" class="flex-shrink-0 text-white/60 text-xs">
                  <span>↵</span>
                </div>
              </button>
            </div>
          </div>

          <!-- 搜索历史 -->
          <div v-else-if="!searchQuery && searchHistory.length > 0" class="p-4">
            <div class="text-white/60 text-sm font-medium mb-3 flex items-center space-x-2">
              <Icon name="heroicons:clock" class="w-4 h-4" />
              <span>最近搜索</span>
            </div>
            
            <div class="space-y-2">
              <button
                v-for="(history, index) in searchHistory.slice(0, 5)"
                :key="index"
                @click="searchQuery = history.query"
                class="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-white/10 transition-colors duration-200 text-left group"
              >
                <Icon name="heroicons:clock" class="w-4 h-4 text-white/60" />
                <span class="text-white/80 flex-1">{{ history.query }}</span>
                <button
                  @click.stop="removeFromHistory(index)"
                  class="opacity-0 group-hover:opacity-100 w-6 h-6 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200"
                >
                  <Icon name="heroicons:x-mark" class="w-3 h-3 text-white/60" />
                </button>
              </button>
            </div>
          </div>

          <!-- 快速导航 -->
          <div v-else-if="!searchQuery" class="p-4">
            <div class="text-white/60 text-sm font-medium mb-3 flex items-center space-x-2">
              <Icon name="heroicons:bolt" class="w-4 h-4" />
              <span>快速导航</span>
            </div>
            
            <div class="grid grid-cols-2 gap-3">
              <NuxtLink
                v-for="item in quickNavItems"
                :key="item.path"
                :to="item.path"
                @click="closeSearch"
                class="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/10 transition-colors duration-200"
              >
                <div
                  class="w-8 h-8 rounded-lg flex items-center justify-center"
                  :style="{ backgroundColor: item.color }"
                >
                  <Icon :name="item.icon" class="w-4 h-4 text-white" />
                </div>
                <span class="text-white/80 text-sm">{{ item.label }}</span>
              </NuxtLink>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-else-if="searchQuery && searchResults.length === 0" class="p-8 text-center">
            <Icon name="heroicons:magnifying-glass" class="w-12 h-12 text-white/40 mx-auto mb-4" />
            <h3 class="text-white/80 font-medium mb-2">未找到相关内容</h3>
            <p class="text-white/60 text-sm">尝试使用不同的关键词或检查拼写</p>
          </div>
        </div>

        <!-- 搜索提示 -->
        <div class="p-4 border-t border-glass-border bg-gradient-to-r from-white/5 to-transparent">
          <div class="flex items-center justify-between text-xs text-white/60">
            <div class="flex items-center space-x-4">
              <div class="flex items-center space-x-1">
                <span class="px-1.5 py-0.5 bg-white/10 rounded">↵</span>
                <span>选择</span>
              </div>
              <div class="flex items-center space-x-1">
                <span class="px-1.5 py-0.5 bg-white/10 rounded">↑↓</span>
                <span>导航</span>
              </div>
              <div class="flex items-center space-x-1">
                <span class="px-1.5 py-0.5 bg-white/10 rounded">Esc</span>
                <span>关闭</span>
              </div>
            </div>
            
            <div class="flex items-center space-x-2">
              <button
                @click="toggleAdvancedSearch"
                class="flex items-center space-x-1 px-2 py-1 bg-white/10 hover:bg-white/20 rounded transition-colors duration-200"
              >
                <Icon name="heroicons:adjustments-horizontal" class="w-3 h-3" />
                <span>高级搜索</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 高级搜索面板 -->
    <div
      v-if="showAdvancedSearch"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-60 flex items-center justify-center"
      @click="showAdvancedSearch = false"
    >
      <div
        class="w-full max-w-md mx-4 bg-gradient-to-br from-glass-bg/95 to-glass-bg/90 backdrop-blur-xl border border-glass-border rounded-2xl shadow-glass-lg p-6"
        @click.stop
      >
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-white font-bold text-lg">高级搜索</h3>
          <button
            @click="showAdvancedSearch = false"
            class="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white/70 hover:text-white transition-all duration-300"
          >
            <Icon name="heroicons:x-mark" class="w-4 h-4" />
          </button>
        </div>
        
        <div class="space-y-4">
          <!-- 内容类型筛选 -->
          <div>
            <label class="text-white/90 text-sm font-medium mb-2 block">内容类型</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="type in contentTypes"
                :key="type.value"
                @click="toggleContentType(type.value)"
                class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300"
                :class="[
                  selectedTypes.includes(type.value)
                    ? 'bg-gradient-to-r from-primary-500/30 to-secondary-500/30 text-primary-300 border border-primary-400/50'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/20'
                ]"
              >
                <Icon :name="type.icon" class="w-4 h-4" />
                <span class="text-sm">{{ type.label }}</span>
              </button>
            </div>
          </div>
          
          <!-- 时间范围 -->
          <div>
            <label class="text-white/90 text-sm font-medium mb-2 block">时间范围</label>
            <select
              v-model="selectedTimeRange"
              class="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            >
              <option value="" class="bg-slate-800">全部时间</option>
              <option value="today" class="bg-slate-800">今天</option>
              <option value="week" class="bg-slate-800">本周</option>
              <option value="month" class="bg-slate-800">本月</option>
              <option value="year" class="bg-slate-800">今年</option>
            </select>
          </div>
          
          <!-- 应用按钮 -->
          <button
            @click="applyAdvancedSearch"
            class="w-full px-4 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105"
          >
            应用筛选
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props
interface Props {
  placeholder?: string
  showTrigger?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '搜索...',
  showTrigger: true
})

// 响应式状态
const isOpen = ref(false)
const searchQuery = ref('')
const searchInput = ref<HTMLInputElement>()
const selectedIndex = ref(0)
const showAdvancedSearch = ref(false)
const selectedTypes = ref<string[]>([])
const selectedTimeRange = ref('')

// 搜索历史
const searchHistory = ref([
  { query: '深度学习', timestamp: Date.now() },
  { query: '摄影技巧', timestamp: Date.now() - 86400000 },
  { query: '旅行日记', timestamp: Date.now() - 172800000 }
])

// 配置数据
const contentTypes = [
  { value: 'article', label: '文章', icon: 'heroicons:document-text' },
  { value: 'photo', label: '照片', icon: 'heroicons:photo' },
  { value: 'moment', label: '说说', icon: 'heroicons:chat-bubble-left' },
  { value: 'milestone', label: '里程碑', icon: 'heroicons:flag' }
]

const quickNavItems = [
  { path: '/articles-enhanced', label: '最新文章', icon: 'heroicons:document-text', color: '#3b82f6' },
  { path: '/gallery-enhanced', label: '照片集', icon: 'heroicons:photo', color: '#10b981' },
  { path: '/timeline-optimized', label: '时间线', icon: 'heroicons:clock', color: '#f59e0b' },
  { path: '/map-optimized', label: '地图', icon: 'heroicons:map', color: '#ef4444' }
]

// 模拟搜索数据
const mockData = [
  {
    id: '1',
    title: '深度学习在NLP中的应用',
    description: '探讨了深度学习技术在自然语言处理领域的最新进展和应用场景。',
    type: 'article',
    date: '2024-01-15T10:00:00Z',
    tags: ['深度学习', 'NLP', '技术'],
    path: '/articles/1'
  },
  {
    id: '2',
    title: '上海外滩夜景摄影',
    description: '在外滩拍摄了一组城市夜景照片，记录了上海的繁华夜色。',
    type: 'photo',
    date: '2024-01-12T20:30:00Z',
    tags: ['摄影', '夜景', '城市'],
    path: '/gallery-enhanced?photo=2'
  },
  {
    id: '3',
    title: '完成博客系统重构',
    description: '历时一个月，终于完成了博客系统的全面重构，性能提升了50%。',
    type: 'milestone',
    date: '2024-01-08T18:00:00Z',
    tags: ['项目', '重构', '成就'],
    path: '/timeline-optimized?event=3'
  },
  {
    id: '4',
    title: '今天心情不错',
    description: '阳光明媚的一天，和朋友们一起喝咖啡聊天，感觉很放松。',
    type: 'moment',
    date: '2024-01-10T14:20:00Z',
    tags: ['心情', '朋友', '咖啡'],
    path: '/timeline-optimized?event=4'
  }
]

// 计算属性
const searchResults = computed(() => {
  if (!searchQuery.value) return []
  
  const query = searchQuery.value.toLowerCase()
  let results = mockData.filter(item =>
    item.title.toLowerCase().includes(query) ||
    item.description.toLowerCase().includes(query) ||
    item.tags.some(tag => tag.toLowerCase().includes(query))
  )
  
  // 应用类型筛选
  if (selectedTypes.value.length > 0) {
    results = results.filter(item => selectedTypes.value.includes(item.type))
  }
  
  // 应用时间筛选
  if (selectedTimeRange.value) {
    const now = new Date()
    const itemDate = new Date(item.date)
    
    switch (selectedTimeRange.value) {
      case 'today':
        results = results.filter(item => {
          const itemDate = new Date(item.date)
          return itemDate.toDateString() === now.toDateString()
        })
        break
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        results = results.filter(item => new Date(item.date) >= weekAgo)
        break
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        results = results.filter(item => new Date(item.date) >= monthAgo)
        break
      case 'year':
        const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        results = results.filter(item => new Date(item.date) >= yearAgo)
        break
    }
  }
  
  return results
})

// 方法
const openSearch = () => {
  isOpen.value = true
  nextTick(() => {
    searchInput.value?.focus()
  })
}

const closeSearch = () => {
  isOpen.value = false
  searchQuery.value = ''
  selectedIndex.value = 0
  showAdvancedSearch.value = false
}

const performSearch = () => {
  if (searchQuery.value.trim() && searchResults.value.length > 0) {
    const result = searchResults.value[selectedIndex.value] || searchResults.value[0]
    selectResult(result)
  }
}

const selectResult = (result: any) => {
  // 添加到搜索历史
  addToHistory(searchQuery.value)
  
  // 导航到结果页面
  navigateTo(result.path)
  closeSearch()
}

const navigateResults = (direction: 'up' | 'down') => {
  if (searchResults.value.length === 0) return
  
  if (direction === 'down') {
    selectedIndex.value = (selectedIndex.value + 1) % searchResults.value.length
  } else {
    selectedIndex.value = selectedIndex.value === 0 ? searchResults.value.length - 1 : selectedIndex.value - 1
  }
}

const addToHistory = (query: string) => {
  if (!query.trim()) return
  
  // 移除重复项
  const filtered = searchHistory.value.filter(item => item.query !== query)
  
  // 添加到开头
  searchHistory.value = [
    { query, timestamp: Date.now() },
    ...filtered.slice(0, 9) // 保持最多10条历史记录
  ]
}

const removeFromHistory = (index: number) => {
  searchHistory.value.splice(index, 1)
}

const toggleAdvancedSearch = () => {
  showAdvancedSearch.value = !showAdvancedSearch.value
}

const toggleContentType = (type: string) => {
  const index = selectedTypes.value.indexOf(type)
  if (index > -1) {
    selectedTypes.value.splice(index, 1)
  } else {
    selectedTypes.value.push(type)
  }
}

const applyAdvancedSearch = () => {
  showAdvancedSearch.value = false
  // 触发搜索更新
  selectedIndex.value = 0
}

// 辅助方法
const getResultColor = (type: string) => {
  const colors = {
    article: '#3b82f6',
    photo: '#10b981',
    moment: '#f59e0b',
    milestone: '#ef4444'
  }
  return colors[type as keyof typeof colors] || '#6b7280'
}

const getResultIcon = (type: string) => {
  const icons = {
    article: 'heroicons:document-text',
    photo: 'heroicons:photo',
    moment: 'heroicons:chat-bubble-left',
    milestone: 'heroicons:flag'
  }
  return icons[type as keyof typeof icons] || 'heroicons:circle'
}

const getResultTypeLabel = (type: string) => {
  const labels = {
    article: '文章',
    photo: '照片',
    moment: '说说',
    milestone: '里程碑'
  }
  return labels[type as keyof typeof labels] || type
}

const highlightText = (text: string, query: string) => {
  if (!query) return text
  
  const regex = new RegExp(`(${query})`, 'gi')
  return text.replace(regex, '<mark class="bg-primary-500/30 text-primary-300 px-1 rounded">$1</mark>')
}

const formatDate = (date: string) => {
  const d = new Date(date)
  return d.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric'
  })
}

// 键盘快捷键
onMounted(() => {
  const handleKeydown = (event: KeyboardEvent) => {
    // Cmd/Ctrl + K 打开搜索
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault()
      openSearch()
    }
  }
  
  document.addEventListener('keydown', handleKeydown)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })
})

// 监听搜索查询变化
watch(searchQuery, () => {
  selectedIndex.value = 0
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

/* 高亮标记样式 */
:deep(mark) {
  background-color: rgba(59, 130, 246, 0.3);
  color: rgb(147, 197, 253);
  padding: 0 0.25rem;
  border-radius: 0.25rem;
}

/* 滚动条样式 */
.max-h-96::-webkit-scrollbar {
  width: 6px;
}

.max-h-96::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.max-h-96::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.max-h-96::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>
