<template>
  <div
    class="timeline-page h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-tertiary overflow-hidden"
  >
    <!-- 主导航 -->
    <MainNavigation />

    <!-- 页面头部 -->
    <header
      class="relative z-20 bg-glass-bg/80 backdrop-blur-md border-b border-glass-border p-4 mt-16"
    >
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-display-md text-white font-bold mb-1">时间轴</h1>
          <p class="text-white/70 text-sm">
            探索时间的轨迹，回顾生活的点点滴滴
          </p>
        </div>

        <!-- 页面操作 -->
        <div class="flex items-center space-x-4">
          <!-- 视图切换 -->
          <div
            class="flex items-center bg-glass-bg backdrop-blur-md rounded-lg p-1 border border-glass-border"
          >
            <button
              v-for="view in viewModes"
              :key="view.value"
              @click="setViewMode(view.value)"
              class="flex items-center space-x-2 px-3 py-2 rounded transition-all duration-200"
              :class="[
                viewMode === view.value
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10',
              ]"
            >
              <Icon :name="view.icon" class="w-4 h-4" />
              <span class="text-sm">{{ view.label }}</span>
            </button>
          </div>

          <!-- 导出按钮 -->
          <button
            @click="exportTimeline"
            class="flex items-center space-x-2 px-4 py-2 bg-glass-bg backdrop-blur-md border border-glass-border rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            <Icon name="heroicons:arrow-down-tray" class="w-4 h-4" />
            <span class="text-sm">导出</span>
          </button>

          <!-- 设置按钮 -->
          <button
            @click="showSettings = !showSettings"
            class="w-10 h-10 bg-glass-bg backdrop-blur-md border border-glass-border rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
            :class="{ 'bg-primary-500/20 text-primary-300': showSettings }"
          >
            <Icon name="heroicons:cog-6-tooth" class="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="relative h-full">
      <!-- 可缩放时间轴 -->
      <ZoomableTimeline
        :events="filteredEvents"
        :zoom-level="zoomLevel"
        :play-mode="playMode"
        :active-track="activeTracks"
        @event-click="handleEventClick"
        @zoom-level-change="handleZoomLevelChange"
        @play-mode-change="handlePlayModeChange"
        @track-toggle="handleTrackToggle"
      />

      <!-- 侧边栏 -->
      <div
        v-if="showSidebar"
        class="absolute top-0 right-0 w-80 h-full bg-glass-bg/90 backdrop-blur-md border-l border-glass-border transition-transform duration-350 z-10"
        :class="{ 'translate-x-full': !showSidebar }"
      >
        <!-- 侧边栏头部 -->
        <div class="p-4 border-b border-glass-border">
          <div class="flex items-center justify-between">
            <h3 class="text-white font-medium">详细信息</h3>
            <button
              @click="showSidebar = false"
              class="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-all duration-200"
            >
              <Icon name="heroicons:x-mark" class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- 事件详情 -->
        <div v-if="selectedEvent" class="p-4">
          <div class="space-y-4">
            <!-- 事件类型和标题 -->
            <div class="flex items-start space-x-3">
              <div
                class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                :style="{
                  backgroundColor: getEventTypeColor(selectedEvent.type),
                }"
              >
                <Icon
                  :name="getEventTypeIcon(selectedEvent.type)"
                  class="w-5 h-5 text-white"
                />
              </div>

              <div class="flex-1 min-w-0">
                <h4 class="text-white font-medium text-lg mb-1">
                  {{ selectedEvent.title }}
                </h4>
                <p class="text-white/70 text-sm">
                  {{ selectedEvent.description }}
                </p>
              </div>
            </div>

            <!-- 事件元信息 -->
            <div class="space-y-3 text-sm">
              <div class="flex items-center space-x-3">
                <Icon
                  name="heroicons:calendar-days"
                  class="w-4 h-4 text-white/60"
                />
                <span class="text-white/80">{{
                  formatEventDate(selectedEvent.date)
                }}</span>
              </div>

              <div
                v-if="selectedEvent.location"
                class="flex items-center space-x-3"
              >
                <Icon name="heroicons:map-pin" class="w-4 h-4 text-white/60" />
                <span class="text-white/80">{{ selectedEvent.location }}</span>
              </div>

              <div
                v-if="selectedEvent.mood"
                class="flex items-center space-x-3"
              >
                <div
                  class="w-4 h-4 rounded-full"
                  :style="{ backgroundColor: getMoodColor(selectedEvent.mood) }"
                />
                <span class="text-white/80">{{
                  getMoodLabel(selectedEvent.mood)
                }}</span>
              </div>
            </div>

            <!-- 标签 -->
            <div v-if="selectedEvent.tags.length > 0" class="space-y-2">
              <div class="text-white/60 text-sm">标签</div>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in selectedEvent.tags"
                  :key="tag"
                  class="px-2 py-1 bg-white/10 text-white/80 text-xs rounded-full hover:bg-white/20 transition-colors duration-200 cursor-pointer"
                  @click="filterByTag(tag)"
                >
                  #{{ tag }}
                </span>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="flex space-x-2 pt-4">
              <button
                @click="viewEventDetail"
                class="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm rounded-lg transition-colors duration-200"
              >
                查看详情
              </button>

              <button
                @click="editEvent"
                class="px-4 py-2 bg-white/10 hover:bg-white/20 text-white/80 text-sm rounded-lg transition-colors duration-200"
              >
                编辑
              </button>
            </div>
          </div>
        </div>

        <!-- 统计信息 -->
        <div v-else class="p-4">
          <div class="space-y-4">
            <h4 class="text-white font-medium">统计概览</h4>

            <div class="grid grid-cols-2 gap-4">
              <div
                v-for="stat in statistics"
                :key="stat.type"
                class="bg-white/5 rounded-lg p-3 text-center"
              >
                <div
                  class="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center"
                  :style="{ backgroundColor: stat.color }"
                >
                  <Icon :name="stat.icon" class="w-4 h-4 text-white" />
                </div>
                <div class="text-white font-medium">{{ stat.count }}</div>
                <div class="text-white/60 text-xs">{{ stat.label }}</div>
              </div>
            </div>

            <!-- 时间范围 -->
            <div class="bg-white/5 rounded-lg p-3">
              <div class="text-white/60 text-sm mb-2">时间范围</div>
              <div class="text-white text-sm">
                {{ formatDateRange() }}
              </div>
            </div>

            <!-- 活跃度图表 -->
            <div class="bg-white/5 rounded-lg p-3">
              <div class="text-white/60 text-sm mb-2">月度活跃度</div>
              <div class="flex items-end space-x-1 h-16">
                <div
                  v-for="(activity, index) in monthlyActivity"
                  :key="index"
                  class="flex-1 bg-primary-500/60 rounded-t"
                  :style="{ height: `${activity}%` }"
                  :title="`${index + 1}月: ${Math.round(activity)}%`"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 设置面板 -->
    <div
      v-if="showSettings"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
      @click="showSettings = false"
    >
      <div
        class="bg-glass-bg/90 backdrop-blur-md border border-glass-border rounded-2xl p-6 max-w-md w-full mx-4"
        @click.stop
      >
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-white font-medium text-lg">时间轴设置</h3>
          <button
            @click="showSettings = false"
            class="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-all duration-200"
          >
            <Icon name="heroicons:x-mark" class="w-4 h-4" />
          </button>
        </div>

        <div class="space-y-4">
          <!-- 自动播放设置 -->
          <div class="space-y-2">
            <label class="text-white/80 text-sm">自动播放速度</label>
            <div class="flex items-center space-x-2">
              <input
                v-model="playSpeed"
                type="range"
                min="0.5"
                max="3"
                step="0.5"
                class="flex-1 h-2 bg-white/20 rounded-full appearance-none cursor-pointer"
              />
              <span class="text-white/60 text-sm w-8">{{ playSpeed }}x</span>
            </div>
          </div>

          <!-- 显示选项 -->
          <div class="space-y-3">
            <label class="text-white/80 text-sm">显示选项</label>

            <div class="space-y-2">
              <label class="flex items-center space-x-3">
                <input
                  v-model="showHeatmap"
                  type="checkbox"
                  class="w-4 h-4 text-primary-500 bg-white/20 border-white/30 rounded focus:ring-primary-500"
                />
                <span class="text-white/70 text-sm">显示热力图</span>
              </label>

              <label class="flex items-center space-x-3">
                <input
                  v-model="showEventPreview"
                  type="checkbox"
                  class="w-4 h-4 text-primary-500 bg-white/20 border-white/30 rounded focus:ring-primary-500"
                />
                <span class="text-white/70 text-sm">显示事件预览</span>
              </label>

              <label class="flex items-center space-x-3">
                <input
                  v-model="enableSmoothScroll"
                  type="checkbox"
                  class="w-4 h-4 text-primary-500 bg-white/20 border-white/30 rounded focus:ring-primary-500"
                />
                <span class="text-white/70 text-sm">平滑滚动</span>
              </label>
            </div>
          </div>

          <!-- 重置按钮 -->
          <div class="pt-4 border-t border-white/10">
            <button
              @click="resetSettings"
              class="w-full px-4 py-2 bg-white/10 hover:bg-white/20 text-white/80 text-sm rounded-lg transition-colors duration-200"
            >
              重置为默认设置
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 页面元数据
useHead({
  title: '时间轴 - Mindtrail',
  meta: [
    {
      name: 'description',
      content: '探索时间的轨迹，回顾生活的点点滴滴。可缩放的交互式时间轴。',
    },
  ],
})

// 响应式状态
const viewMode = ref('timeline')
const zoomLevel = ref<'year' | 'month' | 'day'>('month')
const playMode = ref(false)
const activeTracks = ref(['article', 'photo', 'moment', 'milestone'])
const selectedEvent = ref(null)
const showSidebar = ref(false)
const showSettings = ref(false)

// 设置选项
const playSpeed = ref(1)
const showHeatmap = ref(true)
const showEventPreview = ref(true)
const enableSmoothScroll = ref(true)

// 配置数据
const viewModes = [
  { value: 'timeline', label: '时间轴', icon: 'heroicons:chart-bar' },
  { value: 'calendar', label: '日历', icon: 'heroicons:calendar-days' },
  { value: 'stats', label: '统计', icon: 'heroicons:chart-pie' },
]

// 模拟事件数据
const events = ref([
  {
    id: '1',
    title: '发布新文章：深度学习在NLP中的应用',
    description: '探讨了深度学习技术在自然语言处理领域的最新进展和应用。',
    date: '2024-01-15T10:00:00Z',
    type: 'article',
    location: '上海',
    tags: ['深度学习', 'NLP', '技术'],
    mood: 'thinking',
    track: 'content',
  },
  {
    id: '2',
    title: '拍摄城市夜景',
    description: '在外滩拍摄了一组城市夜景照片，记录了上海的繁华夜色。',
    date: '2024-01-12T20:30:00Z',
    type: 'photo',
    location: '上海外滩',
    tags: ['摄影', '夜景', '城市'],
    mood: 'excited',
    track: 'life',
  },
  {
    id: '3',
    title: '今天心情不错',
    description: '阳光明媚的一天，和朋友们一起喝咖啡聊天，感觉很放松。',
    date: '2024-01-10T14:20:00Z',
    type: 'moment',
    location: '咖啡厅',
    tags: ['心情', '朋友', '咖啡'],
    mood: 'happy',
    track: 'life',
  },
  {
    id: '4',
    title: '完成博客系统重构',
    description: '历时一个月，终于完成了博客系统的全面重构，性能提升了50%。',
    date: '2024-01-08T18:00:00Z',
    type: 'milestone',
    location: '家',
    tags: ['项目', '重构', '成就'],
    mood: 'excited',
    track: 'work',
  },
  {
    id: '5',
    title: '山间徒步',
    description: '周末去黄山徒步，拍摄了很多美丽的自然风光照片。',
    date: '2024-01-06T08:00:00Z',
    type: 'photo',
    location: '黄山',
    tags: ['徒步', '自然', '风光'],
    mood: 'calm',
    track: 'life',
  },
])

// 计算属性
const filteredEvents = computed(() => {
  return events.value.filter((event) => activeTracks.value.includes(event.type))
})

const statistics = computed(() => {
  const eventTypes = {
    article: {
      label: '文章',
      color: '#3b82f6',
      icon: 'heroicons:document-text',
    },
    photo: { label: '照片', color: '#10b981', icon: 'heroicons:photo' },
    moment: {
      label: '说说',
      color: '#f59e0b',
      icon: 'heroicons:chat-bubble-left',
    },
    milestone: { label: '里程碑', color: '#ef4444', icon: 'heroicons:flag' },
  }

  return Object.entries(eventTypes).map(([type, config]) => ({
    type,
    ...config,
    count: events.value.filter((e) => e.type === type).length,
  }))
})

const monthlyActivity = computed(() => {
  // 生成12个月的活跃度数据
  const activity = new Array(12).fill(0)

  events.value.forEach((event) => {
    const month = new Date(event.date).getMonth()
    activity[month] += 1
  })

  const maxActivity = Math.max(...activity)
  return activity.map((count) =>
    maxActivity > 0 ? (count / maxActivity) * 100 : 0
  )
})

// 方法
const setViewMode = (mode: string) => {
  viewMode.value = mode
}

const handleEventClick = (event: any) => {
  selectedEvent.value = event
  showSidebar.value = true
}

const handleZoomLevelChange = (level: string) => {
  zoomLevel.value = level as 'year' | 'month' | 'day'
}

const handlePlayModeChange = (playing: boolean) => {
  playMode.value = playing
}

const handleTrackToggle = (track: string) => {
  const index = activeTracks.value.indexOf(track)
  if (index > -1) {
    activeTracks.value.splice(index, 1)
  } else {
    activeTracks.value.push(track)
  }
}

const exportTimeline = () => {
  // 实现时间轴导出功能
  const data = {
    events: filteredEvents.value,
    settings: {
      zoomLevel: zoomLevel.value,
      activeTracks: activeTracks.value,
    },
    exportDate: new Date().toISOString(),
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `timeline-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const viewEventDetail = () => {
  if (selectedEvent.value) {
    // 根据事件类型跳转到对应页面
    const event = selectedEvent.value
    if (event.type === 'article') {
      navigateTo(`/articles/${event.id}`)
    } else if (event.type === 'photo') {
      navigateTo(`/gallery?photo=${event.id}`)
    }
  }
}

const editEvent = () => {
  // 实现事件编辑功能
  console.log('Edit event:', selectedEvent.value)
}

const filterByTag = (tag: string) => {
  // 实现标签过滤功能
  console.log('Filter by tag:', tag)
}

const resetSettings = () => {
  playSpeed.value = 1
  showHeatmap.value = true
  showEventPreview.value = true
  enableSmoothScroll.value = true
}

const getEventTypeColor = (type: string) => {
  const colors = {
    article: '#3b82f6',
    photo: '#10b981',
    moment: '#f59e0b',
    milestone: '#ef4444',
  }
  return colors[type as keyof typeof colors] || '#6b7280'
}

const getEventTypeIcon = (type: string) => {
  const icons = {
    article: 'heroicons:document-text',
    photo: 'heroicons:photo',
    moment: 'heroicons:chat-bubble-left',
    milestone: 'heroicons:flag',
  }
  return icons[type as keyof typeof icons] || 'heroicons:circle'
}

const getMoodColor = (mood: string) => {
  const colors = {
    happy: '#fbbf24',
    excited: '#f472b6',
    calm: '#34d399',
    thinking: '#a78bfa',
    love: '#fb7185',
    sad: '#60a5fa',
    angry: '#f87171',
    tired: '#9ca3af',
  }
  return colors[mood as keyof typeof colors] || '#6b7280'
}

const getMoodLabel = (mood: string) => {
  const labels = {
    happy: '开心',
    excited: '兴奋',
    calm: '平静',
    thinking: '思考',
    love: '爱意',
    sad: '难过',
    angry: '愤怒',
    tired: '疲惫',
  }
  return labels[mood as keyof typeof labels] || mood
}

const formatEventDate = (date: string) => {
  const d = new Date(date)
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatDateRange = () => {
  if (events.value.length === 0) return '暂无数据'

  const dates = events.value
    .map((e) => new Date(e.date))
    .sort((a, b) => a.getTime() - b.getTime())
  const start = dates[0]
  const end = dates[dates.length - 1]

  return `${start.toLocaleDateString('zh-CN')} - ${end.toLocaleDateString('zh-CN')}`
}
</script>

<style scoped>
/* 页面特定样式 */
.timeline-page {
  height: 100vh;
  overflow: hidden;
}

/* 滑块样式 */
input[type='range'] {
  -webkit-appearance: none;
  appearance: none;
}

input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: theme('colors.primary.500');
  border-radius: 50%;
  cursor: pointer;
}

input[type='range']::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: theme('colors.primary.500');
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

/* 复选框样式 */
input[type='checkbox']:checked {
  background-color: theme('colors.primary.500');
  border-color: theme('colors.primary.500');
}

/* 响应式调整 */
@media (max-width: 768px) {
  .timeline-page header {
    padding: 1rem;
  }

  .timeline-page header .flex {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .absolute.right-0.w-80 {
    width: 100%;
    right: 0;
  }
}
</style>
