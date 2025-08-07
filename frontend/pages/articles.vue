<template>
  <div class="min-h-screen">
    <!-- 页面头部 -->
    <div class="mb-8">
      <div class="text-center mb-6">
        <div
          class="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center shadow-neu-large"
        >
          <DocumentTextIcon class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-3xl font-bold text-gradient mb-2">深度文章</h1>
        <p class="text-lg text-neutral-600 dark:text-neutral-400">
          思考的深度，文字的力量 ✍️
        </p>
      </div>

      <!-- 统计和分类 -->
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
        <div class="neu-card p-4 text-center">
          <div class="text-xl font-bold text-primary-600 dark:text-primary-400">
            {{ articles.length }}
          </div>
          <div class="text-sm text-neutral-500 dark:text-neutral-400">
            总文章
          </div>
        </div>
        <div class="neu-card p-4 text-center">
          <div class="text-xl font-bold text-blue-600 dark:text-blue-400">
            {{ categoryStats.技术 || 0 }}
          </div>
          <div class="text-sm text-neutral-500 dark:text-neutral-400">技术</div>
        </div>
        <div class="neu-card p-4 text-center">
          <div class="text-xl font-bold text-green-600 dark:text-green-400">
            {{ categoryStats.生活 || 0 }}
          </div>
          <div class="text-sm text-neutral-500 dark:text-neutral-400">生活</div>
        </div>
        <div class="neu-card p-4 text-center">
          <div class="text-xl font-bold text-purple-600 dark:text-purple-400">
            {{ categoryStats.思考 || 0 }}
          </div>
          <div class="text-sm text-neutral-500 dark:text-neutral-400">思考</div>
        </div>
        <div class="neu-card p-4 text-center">
          <div class="text-xl font-bold text-orange-600 dark:text-orange-400">
            {{ categoryStats.教程 || 0 }}
          </div>
          <div class="text-sm text-neutral-500 dark:text-neutral-400">教程</div>
        </div>
      </div>
    </div>

    <!-- 视图切换和过滤 -->
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

        <!-- 分类过滤 -->
        <div class="flex flex-wrap items-center gap-2">
          <span
            class="text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >分类:</span
          >
          <button
            @click="selectedCategory = ''"
            class="filter-btn"
            :class="{ active: selectedCategory === '' }"
          >
            全部
          </button>
          <button
            v-for="category in categories"
            :key="category"
            @click="selectedCategory = category"
            class="filter-btn"
            :class="{ active: selectedCategory === category }"
          >
            {{ category }}
          </button>
        </div>

        <!-- 排序和时间筛选 -->
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <span
              class="text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >时间:</span
            >
            <select
              v-model="timeFilter"
              class="px-3 py-1 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">全部</option>
              <option value="month">本月</option>
              <option value="quarter">本季度</option>
              <option value="year">今年</option>
            </select>
          </div>

          <div class="flex items-center space-x-2">
            <span
              class="text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >排序:</span
            >
            <select
              v-model="sortBy"
              class="px-3 py-1 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="latest">最新发布</option>
              <option value="popular">最受欢迎</option>
              <option value="views">浏览最多</option>
              <option value="oldest">最早发布</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- 文章列表 -->
    <div class="space-y-8">
      <article
        v-for="article in sortedArticles"
        :key="article.id"
        class="neu-card overflow-hidden hover:shadow-neu-large transition-all duration-300"
      >
        <!-- 文章封面 -->
        <div
          v-if="article.media && article.media.length > 0"
          class="aspect-video overflow-hidden"
        >
          <img
            :src="article.media[0].url"
            :alt="article.media[0].alt"
            class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div class="p-6">
          <!-- 文章头部 -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-2">
              <span
                v-if="article.category"
                class="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium"
              >
                {{ article.category }}
              </span>
              <time class="text-sm text-neutral-500 dark:text-neutral-400">
                {{ formatDate(article.createdAt) }}
              </time>
            </div>

            <div
              class="flex items-center space-x-4 text-sm text-neutral-500 dark:text-neutral-400"
            >
              <span class="flex items-center space-x-1">
                <EyeIcon class="w-4 h-4" />
                <span>{{ article.stats?.views || 0 }}</span>
              </span>
              <span class="flex items-center space-x-1">
                <ClockIcon class="w-4 h-4" />
                <span>{{ getReadingTime(article.content) }}分钟</span>
              </span>
            </div>
          </div>

          <!-- 文章标题和摘要 -->
          <NuxtLink :to="`/articles/${article.id}`" class="block group">
            <h2
              class="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
            >
              {{ article.title }}
            </h2>
            <p
              class="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4"
            >
              {{ article.excerpt || article.content.substring(0, 200) + '...' }}
            </p>
          </NuxtLink>

          <!-- 标签 -->
          <div v-if="article.tags && article.tags.length > 0" class="mb-4">
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in article.tags"
                :key="tag"
                class="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-full text-xs hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer"
              >
                #{{ tag }}
              </span>
            </div>
          </div>

          <!-- 文章底部 -->
          <div
            class="flex items-center justify-between pt-4 border-t border-neutral-200/50 dark:border-neutral-700/50"
          >
            <div class="flex items-center space-x-6">
              <button
                class="flex items-center space-x-1 text-neutral-500 dark:text-neutral-400 hover:text-red-500 transition-colors"
              >
                <HeartIcon class="w-4 h-4" />
                <span class="text-sm">{{ article.stats?.likes || 0 }}</span>
              </button>
              <button
                class="flex items-center space-x-1 text-neutral-500 dark:text-neutral-400 hover:text-blue-500 transition-colors"
              >
                <ChatBubbleLeftIcon class="w-4 h-4" />
                <span class="text-sm">{{ article.stats?.comments || 0 }}</span>
              </button>
              <button
                class="flex items-center space-x-1 text-neutral-500 dark:text-neutral-400 hover:text-green-500 transition-colors"
              >
                <ShareIcon class="w-4 h-4" />
                <span class="text-sm">分享</span>
              </button>
            </div>

            <NuxtLink
              :to="`/articles/${article.id}`"
              class="neu-button px-4 py-2 text-sm"
            >
              阅读全文
            </NuxtLink>
          </div>
        </div>
      </article>

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
      <div v-if="articles.length === 0" class="text-center py-12">
        <div class="neu-card p-8 max-w-md mx-auto">
          <div class="text-6xl mb-4">📝</div>
          <h3 class="text-lg font-semibold mb-2">还没有文章</h3>
          <p class="text-neutral-600 dark:text-neutral-400 mb-4">
            开始写作你的第一篇文章吧！
          </p>
          <NuxtLink to="/create" class="neu-button px-6 py-3">
            写第一篇文章
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  DocumentTextIcon,
  EyeIcon,
  ClockIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
  ViewColumnsIcon,
  ListBulletIcon,
} from '@heroicons/vue/24/outline'

// 页面元数据
useHead({
  title: '深度文章 - 思维轨迹',
  meta: [
    {
      name: 'description',
      content: '深度思考和技术分享，记录学习和成长的过程。',
    },
  ],
})

// 使用 Timeline Composable
const { timeline, loadMockData, loading } = useTimeline()

// 响应式数据
const selectedCategory = ref('')
const sortBy = ref('latest')
const hasMore = ref(true)
const viewMode = ref('cards')
const timeFilter = ref('')

// 计算属性
const articles = computed(() => {
  return timeline.value.filter((item) => item.type === 'article')
})

const categories = computed(() => {
  const cats = new Set()
  articles.value.forEach((article) => {
    if (article.category) {
      cats.add(article.category)
    }
  })
  return Array.from(cats)
})

const categoryStats = computed(() => {
  const stats = {}
  articles.value.forEach((article) => {
    if (article.category) {
      stats[article.category] = (stats[article.category] || 0) + 1
    }
  })
  return stats
})

const sortedArticles = computed(() => {
  let filtered = [...articles.value]

  // 按分类过滤
  if (selectedCategory.value) {
    filtered = filtered.filter(
      (article) => article.category === selectedCategory.value
    )
  }

  // 按时间过滤
  if (timeFilter.value) {
    const now = new Date()
    filtered = filtered.filter((article) => {
      const articleDate = new Date(article.createdAt)

      switch (timeFilter.value) {
        case 'month':
          return (
            articleDate.getMonth() === now.getMonth() &&
            articleDate.getFullYear() === now.getFullYear()
          )
        case 'quarter':
          const currentQuarter = Math.floor(now.getMonth() / 3)
          const articleQuarter = Math.floor(articleDate.getMonth() / 3)
          return (
            articleQuarter === currentQuarter &&
            articleDate.getFullYear() === now.getFullYear()
          )
        case 'year':
          return articleDate.getFullYear() === now.getFullYear()
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
    case 'views':
      filtered.sort((a, b) => (b.stats?.views || 0) - (a.stats?.views || 0))
      break
  }

  return filtered
})

// 方法
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const getReadingTime = (content) => {
  // 估算阅读时间（按中文250字/分钟计算）
  const wordCount = content.length
  return Math.max(1, Math.ceil(wordCount / 250))
}

const loadMore = () => {
  // 模拟加载更多
  console.log('Loading more articles...')
  hasMore.value = false
}

// 页面加载时获取数据
onMounted(() => {
  loadMockData()
})
</script>

<style scoped>
.filter-btn {
  @apply px-3 py-1 text-sm rounded-full transition-all duration-200;
  @apply text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800;
  @apply hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400;
}

.filter-btn.active {
  @apply bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300;
}

.view-toggle-btn {
  @apply flex items-center space-x-1 px-3 py-1.5 text-sm rounded-md transition-colors;
  @apply text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200;
}

.view-toggle-btn.active {
  @apply bg-white dark:bg-neutral-700 text-primary-600 dark:text-primary-400 shadow-sm;
}
</style>
