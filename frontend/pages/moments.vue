<template>
  <div class="min-h-screen">
    <!-- 页面头部 -->
    <div class="mb-8">
      <div class="text-center mb-6">
        <div
          class="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r from-accent-500 to-accent-600 flex items-center justify-center shadow-neu-large"
        >
          <ChatBubbleLeftRightIcon class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-3xl font-bold text-gradient mb-2">生活说说</h1>
        <p class="text-lg text-neutral-600 dark:text-neutral-400">
          记录此刻的想法和心情 💭
        </p>
      </div>

      <!-- 统计信息 -->
      <div class="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8">
        <div class="neu-card p-4 text-center">
          <div class="text-xl font-bold text-accent-600 dark:text-accent-400">
            {{ moments.length }}
          </div>
          <div class="text-sm text-neutral-500 dark:text-neutral-400">
            总说说
          </div>
        </div>
        <div class="neu-card p-4 text-center">
          <div class="text-xl font-bold text-primary-600 dark:text-primary-400">
            {{ todayMoments }}
          </div>
          <div class="text-sm text-neutral-500 dark:text-neutral-400">今日</div>
        </div>
        <div class="neu-card p-4 text-center">
          <div
            class="text-xl font-bold text-secondary-600 dark:text-secondary-400"
          >
            {{ thisMonthMoments }}
          </div>
          <div class="text-sm text-neutral-500 dark:text-neutral-400">本月</div>
        </div>
      </div>
    </div>

    <!-- 快速发布 -->
    <div class="neu-card p-6 mb-8">
      <div class="flex items-start space-x-4">
        <img
          src="/avatars/author.jpg"
          alt="我的头像"
          class="w-10 h-10 rounded-full object-cover"
          @error="handleAvatarError"
        />
        <div class="flex-1">
          <textarea
            v-model="quickMoment"
            placeholder="分享此刻的想法..."
            class="w-full p-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
            rows="3"
          ></textarea>
          <div class="flex items-center justify-between mt-3">
            <div
              class="flex items-center space-x-2 text-sm text-neutral-500 dark:text-neutral-400"
            >
              <span>{{ quickMoment.length }}/280</span>
            </div>
            <button
              @click="publishQuickMoment"
              class="neu-button px-4 py-2"
              :disabled="!quickMoment.trim() || publishing"
            >
              {{ publishing ? '发布中...' : '发布' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 视图切换和时间筛选 -->
    <div class="neu-card p-4 mb-8">
      <div
        class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0"
      >
        <!-- 视图模式切换 -->
        <div
          class="flex items-center space-x-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1"
        >
          <button
            @click="viewMode = 'cards'"
            class="view-toggle-btn"
            :class="{ active: viewMode === 'cards' }"
          >
            <ViewColumnsIcon class="w-4 h-4" />
            <span class="hidden sm:inline">卡片</span>
          </button>
          <button
            @click="viewMode = 'masonry'"
            class="view-toggle-btn"
            :class="{ active: viewMode === 'masonry' }"
          >
            <Squares2X2Icon class="w-4 h-4" />
            <span class="hidden sm:inline">瀑布流</span>
          </button>
          <button
            @click="viewMode = 'list'"
            class="view-toggle-btn"
            :class="{ active: viewMode === 'list' }"
          >
            <ListBulletIcon class="w-4 h-4" />
            <span class="hidden sm:inline">列表</span>
          </button>
          <button
            @click="viewMode = 'timeline'"
            class="view-toggle-btn"
            :class="{ active: viewMode === 'timeline' }"
          >
            <ClockIcon class="w-4 h-4" />
            <span class="hidden sm:inline">时间轴</span>
          </button>
        </div>

        <!-- 时间筛选 -->
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <span
              class="text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >时间:</span
            >
            <select
              v-model="timeFilter"
              class="px-3 py-1 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-accent-500"
            >
              <option value="">全部</option>
              <option value="today">今天</option>
              <option value="week">本周</option>
              <option value="month">本月</option>
              <option value="year">今年</option>
              <option value="onThisDay">去年今日</option>
            </select>
          </div>

          <div class="flex items-center space-x-2">
            <span
              class="text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >分组:</span
            >
            <select
              v-model="groupBy"
              class="px-3 py-1 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-accent-500"
            >
              <option value="">不分组</option>
              <option value="date">按日期</option>
              <option value="emotion">按情绪</option>
              <option value="location">按地点</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- 说说内容 -->
    <div v-if="groupBy">
      <!-- 分组显示 -->
      <div
        v-for="(group, groupKey) in groupedMoments"
        :key="groupKey"
        class="mb-8"
      >
        <h2
          class="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-4 flex items-center space-x-2"
        >
          <component :is="getGroupIcon(groupBy)" class="w-5 h-5" />
          <span>{{ getGroupTitle(groupBy, groupKey) }}</span>
          <span
            class="text-sm font-normal text-neutral-500 dark:text-neutral-400"
            >({{ group.length }})</span
          >
        </h2>
        <component :is="getViewComponent(viewMode)" :moments="group" />
      </div>
    </div>
    <div v-else>
      <!-- 普通显示 -->
      <component :is="getViewComponent(viewMode)" :moments="sortedMoments" />
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
    <div v-if="moments.length === 0" class="text-center py-12">
      <div class="neu-card p-8 max-w-md mx-auto">
        <div class="text-6xl mb-4">💭</div>
        <h3 class="text-lg font-semibold mb-2">还没有说说</h3>
        <p class="text-neutral-600 dark:text-neutral-400 mb-4">
          分享你此刻的想法和心情吧！
        </p>
        <NuxtLink to="/create" class="neu-button px-6 py-3">
          发布第一条说说
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ChatBubbleLeftRightIcon,
  MapPinIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
  ViewColumnsIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ClockIcon,
  CalendarDaysIcon,
  FaceSmileIcon,
  TagIcon,
} from '@heroicons/vue/24/outline'

// 页面元数据
useHead({
  title: '生活说说 - 思维轨迹',
  meta: [
    {
      name: 'description',
      content: '记录生活中的点点滴滴，分享此刻的心情和想法。',
    },
  ],
})

// 使用 Timeline Composable
const { timeline, loadMockData, loading } = useTimeline()

// 响应式数据
const quickMoment = ref('')
const publishing = ref(false)
const sortBy = ref('latest')
const selectedEmotions = ref([])
const hasMore = ref(true)
const viewMode = ref('cards')
const timeFilter = ref('')
const groupBy = ref('')

// 计算属性
const moments = computed(() => {
  return timeline.value.filter((item) => item.type === 'moment')
})

const todayMoments = computed(() => {
  const today = new Date().toDateString()
  return moments.value.filter(
    (moment) => new Date(moment.createdAt).toDateString() === today
  ).length
})

const thisMonthMoments = computed(() => {
  const now = new Date()
  const thisMonth = now.getMonth()
  const thisYear = now.getFullYear()

  return moments.value.filter((moment) => {
    const date = new Date(moment.createdAt)
    return date.getMonth() === thisMonth && date.getFullYear() === thisYear
  }).length
})

const sortedMoments = computed(() => {
  let filtered = [...moments.value]

  // 按情绪过滤
  if (selectedEmotions.value.length > 0) {
    filtered = filtered.filter((moment) =>
      selectedEmotions.value.includes(moment.emotion?.type)
    )
  }

  // 按时间过滤
  if (timeFilter.value) {
    const now = new Date()
    filtered = filtered.filter((moment) => {
      const momentDate = new Date(moment.createdAt)

      switch (timeFilter.value) {
        case 'today':
          return momentDate.toDateString() === now.toDateString()
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          return momentDate >= weekAgo
        case 'month':
          return (
            momentDate.getMonth() === now.getMonth() &&
            momentDate.getFullYear() === now.getFullYear()
          )
        case 'year':
          return momentDate.getFullYear() === now.getFullYear()
        case 'onThisDay':
          const lastYear = new Date(
            now.getFullYear() - 1,
            now.getMonth(),
            now.getDate()
          )
          const dayBefore = new Date(lastYear.getTime() - 24 * 60 * 60 * 1000)
          const dayAfter = new Date(lastYear.getTime() + 24 * 60 * 60 * 1000)
          return momentDate >= dayBefore && momentDate <= dayAfter
        default:
          return true
      }
    })
  }

  // 排序
  switch (sortBy.value) {
    case 'latest':
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      break
    case 'oldest':
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      break
    case 'popular':
      filtered.sort((a, b) => (b.stats?.likes || 0) - (a.stats?.likes || 0))
      break
  }

  return filtered
})

const groupedMoments = computed(() => {
  if (!groupBy.value) return {}

  const groups = {}

  sortedMoments.value.forEach((moment) => {
    let groupKey = ''

    switch (groupBy.value) {
      case 'date':
        groupKey = new Date(moment.createdAt).toLocaleDateString('zh-CN')
        break
      case 'emotion':
        groupKey = moment.emotion?.label || '无情绪'
        break
      case 'location':
        groupKey = moment.location?.name || '无位置'
        break
      default:
        groupKey = '其他'
    }

    if (!groups[groupKey]) {
      groups[groupKey] = []
    }
    groups[groupKey].push(moment)
  })

  return groups
})

// 情绪过滤器
const emotionFilters = [
  { type: 'happy', label: '开心', icon: '😊' },
  { type: 'sad', label: '难过', icon: '😢' },
  { type: 'excited', label: '兴奋', icon: '🤩' },
  { type: 'peaceful', label: '平静', icon: '😌' },
  { type: 'focused', label: '专注', icon: '🤔' },
]

// 方法
const handleAvatarError = (event) => {
  event.target.src = '/avatars/default.jpg'
}

const publishQuickMoment = async () => {
  if (!quickMoment.value.trim() || publishing.value) return

  publishing.value = true

  try {
    // 模拟发布
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log('Published moment:', quickMoment.value)
    quickMoment.value = ''

    // 这里应该刷新数据
    loadMockData()
  } catch (error) {
    console.error('Error publishing moment:', error)
  } finally {
    publishing.value = false
  }
}

const toggleEmotionFilter = (emotionType) => {
  const index = selectedEmotions.value.indexOf(emotionType)
  if (index > -1) {
    selectedEmotions.value.splice(index, 1)
  } else {
    selectedEmotions.value.push(emotionType)
  }
}

const getViewComponent = (mode) => {
  const components = {
    cards: 'MomentsCardsView',
    masonry: 'MomentsMasonryView',
    list: 'MomentsListView',
    timeline: 'MomentsTimelineView',
  }
  return components[mode] || 'MomentsCardsView'
}

const getGroupIcon = (groupType) => {
  const icons = {
    date: CalendarDaysIcon,
    emotion: FaceSmileIcon,
    location: MapPinIcon,
  }
  return icons[groupType] || TagIcon
}

const getGroupTitle = (groupType, groupKey) => {
  switch (groupType) {
    case 'date':
      return groupKey
    case 'emotion':
      return groupKey
    case 'location':
      return groupKey
    default:
      return groupKey
  }
}

const loadMore = () => {
  // 模拟加载更多
  console.log('Loading more moments...')
  hasMore.value = false
}

// 页面加载时获取数据
onMounted(() => {
  loadMockData()
})
</script>

<style scoped>
.view-toggle-btn {
  @apply flex items-center space-x-1 px-3 py-1.5 text-sm rounded-md transition-colors;
  @apply text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200;
}

.view-toggle-btn.active {
  @apply bg-white dark:bg-neutral-700 text-accent-600 dark:text-accent-400 shadow-sm;
}
</style>
