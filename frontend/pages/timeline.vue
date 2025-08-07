<template>
  <div class="min-h-screen">
    <!-- 页面头部 -->
    <div class="mb-8">
      <div class="text-center mb-6">
        <div class="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center shadow-neu-large">
          <ClockIcon class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-3xl font-bold text-gradient mb-2">时间轴</h1>
        <p class="text-lg text-neutral-600 dark:text-neutral-400">
          按时间顺序回顾所有内容 ⏰
        </p>
      </div>

      <!-- 统计信息 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
        <div class="neu-card p-4 text-center">
          <div class="text-xl font-bold text-purple-600 dark:text-purple-400">{{ timeline.length }}</div>
          <div class="text-sm text-neutral-500 dark:text-neutral-400">总记录</div>
        </div>
        <div class="neu-card p-4 text-center">
          <div class="text-xl font-bold text-primary-600 dark:text-primary-400">{{ stats.thisYear }}</div>
          <div class="text-sm text-neutral-500 dark:text-neutral-400">今年</div>
        </div>
        <div class="neu-card p-4 text-center">
          <div class="text-xl font-bold text-secondary-600 dark:text-secondary-400">{{ stats.thisMonth }}</div>
          <div class="text-sm text-neutral-500 dark:text-neutral-400">本月</div>
        </div>
        <div class="neu-card p-4 text-center">
          <div class="text-xl font-bold text-accent-600 dark:text-accent-400">{{ stats.thisWeek }}</div>
          <div class="text-sm text-neutral-500 dark:text-neutral-400">本周</div>
        </div>
      </div>
    </div>

    <!-- 筛选器 -->
    <div class="neu-card p-4 mb-8">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <!-- 内容类型过滤 -->
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-sm font-medium text-neutral-700 dark:text-neutral-300">类型:</span>
          <button
            @click="selectedType = ''"
            class="filter-btn"
            :class="{ 'active': selectedType === '' }"
          >
            全部
          </button>
          <button
            v-for="type in contentTypes"
            :key="type.value"
            @click="selectedType = type.value"
            class="filter-btn"
            :class="{ 'active': selectedType === type.value }"
          >
            <component :is="type.icon" class="w-4 h-4 mr-1" />
            {{ type.label }}
          </button>
        </div>

        <!-- 时间范围选择 -->
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <span class="text-sm font-medium text-neutral-700 dark:text-neutral-300">时间:</span>
            <select
              v-model="timeRange"
              class="px-3 py-1 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">全部</option>
              <option value="week">本周</option>
              <option value="month">本月</option>
              <option value="quarter">本季度</option>
              <option value="year">今年</option>
            </select>
          </div>

          <div class="flex items-center space-x-2">
            <span class="text-sm font-medium text-neutral-700 dark:text-neutral-300">排序:</span>
            <select
              v-model="sortOrder"
              class="px-3 py-1 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="desc">最新在前</option>
              <option value="asc">最早在前</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- 时间轴内容 -->
    <div class="relative">
      <!-- 主时间线 -->
      <div class="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 via-primary-500 to-secondary-500 rounded-full"></div>
      
      <!-- 按年份分组 -->
      <div v-for="(yearGroup, year) in groupedTimeline" :key="year" class="mb-12">
        <!-- 年份标题 -->
        <div class="relative flex items-center mb-8">
          <div class="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center shadow-lg z-10">
            <span class="text-white font-bold text-lg">{{ year }}</span>
          </div>
          <div class="ml-6 flex-1">
            <h2 class="text-2xl font-bold text-neutral-800 dark:text-neutral-200">{{ year }}年</h2>
            <p class="text-neutral-500 dark:text-neutral-400">{{ yearGroup.length }} 条记录</p>
          </div>
        </div>

        <!-- 该年的内容 -->
        <div class="space-y-8 ml-4">
          <div
            v-for="item in yearGroup"
            :key="item.id"
            class="relative flex items-start space-x-6"
          >
            <!-- 时间节点 -->
            <div class="relative z-10 flex-shrink-0">
              <div class="w-12 h-12 rounded-full flex items-center justify-center shadow-md"
                   :class="getTypeStyle(item.type).bg">
                <component :is="getTypeStyle(item.type).icon" class="w-5 h-5 text-white" />
              </div>
              
              <!-- 时间标签 -->
              <div class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                {{ formatDate(item.createdAt) }}
              </div>
            </div>

            <!-- 内容卡片 -->
            <div class="flex-1 neu-card p-6 hover:shadow-neu-large transition-all duration-300 mt-1">
              <TimelineItem :item="item" />
            </div>
          </div>
        </div>
      </div>

      <!-- 加载更多 -->
      <div v-if="hasMore" class="text-center py-8">
        <button
          @click="loadMore"
          class="neu-button px-6 py-3"
          :disabled="loading"
        >
          {{ loading ? '加载中...' : '加载更多' }}
        </button>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredTimeline.length === 0" class="text-center py-12">
        <div class="neu-card p-8 max-w-md mx-auto">
          <div class="text-6xl mb-4">📅</div>
          <h3 class="text-lg font-semibold mb-2">暂无记录</h3>
          <p class="text-neutral-600 dark:text-neutral-400 mb-4">
            {{ selectedType || timeRange !== 'all' ? '尝试调整筛选条件' : '开始创建你的第一条记录吧！' }}
          </p>
          <NuxtLink v-if="!selectedType && timeRange === 'all'" to="/create" class="neu-button px-6 py-3">
            创建内容
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ClockIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  PhotoIcon
} from '@heroicons/vue/24/outline'

// 页面元数据
useHead({
  title: '时间轴 - 思维轨迹',
  meta: [
    { name: 'description', content: '按时间顺序回顾所有内容，记录生活的每一个瞬间。' }
  ]
})

// 使用 Timeline Composable
const { timeline, loadMockData, loading } = useTimeline()

// 响应式数据
const selectedType = ref('')
const timeRange = ref('all')
const sortOrder = ref('desc')
const hasMore = ref(true)

// 内容类型配置
const contentTypes = [
  { value: 'article', label: '文章', icon: DocumentTextIcon },
  { value: 'moment', label: '说说', icon: ChatBubbleLeftRightIcon },
  { value: 'gallery', label: '相册', icon: PhotoIcon }
]

// 计算属性
const filteredTimeline = computed(() => {
  let filtered = [...timeline.value]

  // 按类型过滤
  if (selectedType.value) {
    filtered = filtered.filter(item => item.type === selectedType.value)
  }

  // 按时间范围过滤
  if (timeRange.value !== 'all') {
    const now = new Date()
    filtered = filtered.filter(item => {
      const itemDate = new Date(item.createdAt)
      
      switch (timeRange.value) {
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          return itemDate >= weekAgo
        case 'month':
          return itemDate.getMonth() === now.getMonth() && 
                 itemDate.getFullYear() === now.getFullYear()
        case 'quarter':
          const currentQuarter = Math.floor(now.getMonth() / 3)
          const itemQuarter = Math.floor(itemDate.getMonth() / 3)
          return itemQuarter === currentQuarter && 
                 itemDate.getFullYear() === now.getFullYear()
        case 'year':
          return itemDate.getFullYear() === now.getFullYear()
        default:
          return true
      }
    })
  }

  // 排序
  filtered.sort((a, b) => {
    const dateA = new Date(a.createdAt)
    const dateB = new Date(b.createdAt)
    return sortOrder.value === 'desc' ? dateB - dateA : dateA - dateB
  })

  return filtered
})

const groupedTimeline = computed(() => {
  const groups = {}
  
  filteredTimeline.value.forEach(item => {
    const year = new Date(item.createdAt).getFullYear()
    if (!groups[year]) {
      groups[year] = []
    }
    groups[year].push(item)
  })
  
  return groups
})

const stats = computed(() => {
  const now = new Date()
  const thisYear = now.getFullYear()
  const thisMonth = now.getMonth()
  const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  
  return {
    thisYear: timeline.value.filter(item => 
      new Date(item.createdAt).getFullYear() === thisYear
    ).length,
    thisMonth: timeline.value.filter(item => {
      const date = new Date(item.createdAt)
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear
    }).length,
    thisWeek: timeline.value.filter(item => 
      new Date(item.createdAt) >= thisWeek
    ).length
  }
})

// 方法
const getTypeStyle = (type) => {
  const styles = {
    article: {
      bg: 'bg-gradient-to-r from-primary-500 to-primary-600',
      icon: DocumentTextIcon
    },
    moment: {
      bg: 'bg-gradient-to-r from-accent-500 to-accent-600',
      icon: ChatBubbleLeftRightIcon
    },
    gallery: {
      bg: 'bg-gradient-to-r from-secondary-500 to-secondary-600',
      icon: PhotoIcon
    }
  }
  return styles[type] || styles.article
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric'
  })
}

const loadMore = () => {
  // 模拟加载更多
  console.log('Loading more timeline items...')
  hasMore.value = false
}

// 页面加载时获取数据
onMounted(() => {
  loadMockData()
})
</script>

<style scoped>
.filter-btn {
  @apply flex items-center px-3 py-1 text-sm rounded-full transition-all duration-200;
  @apply text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800;
  @apply hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400;
}

.filter-btn.active {
  @apply bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300;
}
</style>
