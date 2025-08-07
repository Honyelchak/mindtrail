<template>
  <div class="glass-card p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
        生活状态
      </h3>
      <div class="flex items-center space-x-2">
        <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span class="text-sm text-gray-600 dark:text-gray-400">在线</span>
      </div>
    </div>

    <!-- 今日统计 -->
    <div class="mb-6">
      <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">今日创作</h4>
      <div class="grid grid-cols-3 gap-4">
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {{ todayStats.articles }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">文章</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600 dark:text-green-400">
            {{ todayStats.moments }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">说说</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {{ todayStats.photos }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">照片</div>
        </div>
      </div>
    </div>

    <!-- 本周活跃度 -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-3">
        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">本周活跃度</h4>
        <span class="text-xs text-gray-500 dark:text-gray-400">
          {{ weeklyActivityPercentage }}% 活跃
        </span>
      </div>
      
      <!-- 活跃度图表 -->
      <div class="flex items-end justify-between space-x-1 h-16">
        <div
          v-for="(day, index) in weeklyActivity"
          :key="index"
          class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-t-sm relative group cursor-pointer"
          :style="{ height: `${(day.activity / maxActivity) * 100}%` }"
          :class="getActivityColor(day.activity)"
          @mouseenter="showTooltip(day, $event)"
          @mouseleave="hideTooltip"
        >
          <!-- 日期标签 -->
          <div class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 dark:text-gray-400">
            {{ day.label }}
          </div>
        </div>
      </div>
    </div>

    <!-- 最近足迹 -->
    <div class="mb-6">
      <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">最近足迹</h4>
      <div class="space-y-2">
        <div
          v-for="location in recentLocations"
          :key="location.id"
          class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          @click="() => $emit('location-click', location)"
        >
          <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-medium">
            {{ location.name.charAt(0) }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
              {{ location.name }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">
              {{ formatDate(location.lastVisit, 'relative') }}
            </div>
          </div>
          <div class="text-xs text-gray-400">
            {{ location.count }}次
          </div>
        </div>
      </div>
    </div>

    <!-- 心情趋势 -->
    <div class="mb-6">
      <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">心情趋势</h4>
      <div class="flex items-center justify-between">
        <div
          v-for="mood in moodTrend"
          :key="mood.type"
          class="text-center"
        >
          <div class="text-2xl mb-1">{{ mood.emoji }}</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">{{ mood.count }}</div>
        </div>
      </div>
    </div>

    <!-- 创作目标 -->
    <div>
      <div class="flex items-center justify-between mb-3">
        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">本月目标</h4>
        <span class="text-xs text-gray-500 dark:text-gray-400">
          {{ Math.round(monthlyProgress) }}%
        </span>
      </div>
      
      <!-- 进度条 -->
      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
        <div
          class="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-500"
          :style="{ width: `${Math.min(monthlyProgress, 100)}%` }"
        ></div>
      </div>
      
      <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>{{ currentMonthCreations }} / {{ monthlyGoal }}</span>
        <span>{{ monthlyGoal - currentMonthCreations > 0 ? `还需 ${monthlyGoal - currentMonthCreations}` : '已完成' }}</span>
      </div>
    </div>

    <!-- 工具提示 -->
    <div
      v-if="tooltip.show"
      class="fixed z-50 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg pointer-events-none"
      :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
    >
      {{ tooltip.content }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '~/utils'

interface Location {
  id: string
  name: string
  lastVisit: string
  count: number
}

interface ActivityDay {
  label: string
  activity: number
  date: string
}

interface MoodData {
  type: string
  emoji: string
  count: number
}

interface Emits {
  (e: 'location-click', location: Location): void
}

defineEmits<Emits>()

// 响应式数据
const tooltip = reactive({
  show: false,
  x: 0,
  y: 0,
  content: ''
})

// 今日统计
const todayStats = computed(() => ({
  articles: Math.floor(Math.random() * 3),
  moments: Math.floor(Math.random() * 8),
  photos: Math.floor(Math.random() * 15)
}))

// 本周活跃度数据
const weeklyActivity = computed((): ActivityDay[] => {
  const days = ['一', '二', '三', '四', '五', '六', '日']
  const today = new Date()
  
  return days.map((label, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (6 - index))
    
    return {
      label,
      activity: Math.floor(Math.random() * 10) + 1,
      date: date.toISOString()
    }
  })
})

// 最大活跃度（用于计算高度）
const maxActivity = computed(() => {
  return Math.max(...weeklyActivity.value.map(day => day.activity))
})

// 本周活跃度百分比
const weeklyActivityPercentage = computed(() => {
  const totalActivity = weeklyActivity.value.reduce((sum, day) => sum + day.activity, 0)
  const maxPossible = weeklyActivity.value.length * 10 // 假设最大活跃度为10
  return Math.round((totalActivity / maxPossible) * 100)
})

// 最近足迹
const recentLocations = computed((): Location[] => [
  {
    id: '1',
    name: '三里屯太古里',
    lastVisit: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    count: 5
  },
  {
    id: '2',
    name: '朝阳公园',
    lastVisit: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    count: 3
  },
  {
    id: '3',
    name: '国贸CBD',
    lastVisit: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    count: 8
  }
])

// 心情趋势
const moodTrend = computed((): MoodData[] => [
  { type: 'happy', emoji: '😊', count: 12 },
  { type: 'excited', emoji: '🤩', count: 8 },
  { type: 'peaceful', emoji: '😌', count: 15 },
  { type: 'thoughtful', emoji: '🤔', count: 6 },
  { type: 'grateful', emoji: '🙏', count: 9 }
])

// 本月目标相关
const monthlyGoal = ref<number>(30)
const currentMonthCreations = computed(() => {
  return Math.floor(Math.random() * 25) + 5 // 模拟数据
})

const monthlyProgress = computed(() => {
  return (currentMonthCreations.value / monthlyGoal.value) * 100
})

// 方法
const getActivityColor = (activity: number): string => {
  if (activity >= 8) return 'bg-green-500 dark:bg-green-400'
  if (activity >= 5) return 'bg-yellow-500 dark:bg-yellow-400'
  if (activity >= 2) return 'bg-orange-500 dark:bg-orange-400'
  return 'bg-gray-300 dark:bg-gray-600'
}

const showTooltip = (day: ActivityDay, event: MouseEvent): void => {
  tooltip.show = true
  tooltip.x = event.clientX + 10
  tooltip.y = event.clientY - 30
  tooltip.content = `${day.label}: ${day.activity} 次活动`
}

const hideTooltip = (): void => {
  tooltip.show = false
}
</script>

<style scoped>
.glass-card {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.dark .glass-card {
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}
</style>
