<template>
  <div class="min-h-screen">
    <!-- 页面头部 -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gradient mb-2">管理后台</h1>
          <p class="text-neutral-600 dark:text-neutral-400">
            欢迎回来，{{ user?.name }} 👋
          </p>
        </div>

        <div class="flex items-center space-x-4">
          <NuxtLink
            to="/create"
            class="neu-button px-4 py-2 flex items-center space-x-2"
          >
            <PlusIcon class="w-4 h-4" />
            <span>新建内容</span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="neu-card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p
              class="text-sm font-medium text-neutral-600 dark:text-neutral-400"
            >
              总内容
            </p>
            <p
              class="text-2xl font-bold text-neutral-900 dark:text-neutral-100"
            >
              {{ stats.total }}
            </p>
          </div>
          <div
            class="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-xl flex items-center justify-center"
          >
            <DocumentTextIcon
              class="w-6 h-6 text-primary-600 dark:text-primary-400"
            />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <span class="text-green-600 dark:text-green-400">+12%</span>
          <span class="text-neutral-500 dark:text-neutral-400 ml-1"
            >较上月</span
          >
        </div>
      </div>

      <div class="neu-card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p
              class="text-sm font-medium text-neutral-600 dark:text-neutral-400"
            >
              文章
            </p>
            <p
              class="text-2xl font-bold text-neutral-900 dark:text-neutral-100"
            >
              {{ stats.articles }}
            </p>
          </div>
          <div
            class="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center"
          >
            <DocumentTextIcon
              class="w-6 h-6 text-blue-600 dark:text-blue-400"
            />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <span class="text-green-600 dark:text-green-400">+5%</span>
          <span class="text-neutral-500 dark:text-neutral-400 ml-1"
            >较上月</span
          >
        </div>
      </div>

      <div class="neu-card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p
              class="text-sm font-medium text-neutral-600 dark:text-neutral-400"
            >
              说说
            </p>
            <p
              class="text-2xl font-bold text-neutral-900 dark:text-neutral-100"
            >
              {{ stats.moments }}
            </p>
          </div>
          <div
            class="w-12 h-12 bg-accent-100 dark:bg-accent-900/20 rounded-xl flex items-center justify-center"
          >
            <ChatBubbleLeftRightIcon
              class="w-6 h-6 text-accent-600 dark:text-accent-400"
            />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <span class="text-green-600 dark:text-green-400">+18%</span>
          <span class="text-neutral-500 dark:text-neutral-400 ml-1"
            >较上月</span
          >
        </div>
      </div>

      <div class="neu-card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p
              class="text-sm font-medium text-neutral-600 dark:text-neutral-400"
            >
              相册
            </p>
            <p
              class="text-2xl font-bold text-neutral-900 dark:text-neutral-100"
            >
              {{ stats.galleries }}
            </p>
          </div>
          <div
            class="w-12 h-12 bg-secondary-100 dark:bg-secondary-900/20 rounded-xl flex items-center justify-center"
          >
            <PhotoIcon
              class="w-6 h-6 text-secondary-600 dark:text-secondary-400"
            />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <span class="text-green-600 dark:text-green-400">+8%</span>
          <span class="text-neutral-500 dark:text-neutral-400 ml-1"
            >较上月</span
          >
        </div>
      </div>
    </div>

    <!-- 快速操作 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- 最近内容 -->
      <div class="neu-card p-6">
        <div class="flex items-center justify-between mb-4">
          <h2
            class="text-lg font-semibold text-neutral-800 dark:text-neutral-200"
          >
            最近内容
          </h2>
          <NuxtLink
            to="/"
            class="text-sm text-primary-600 dark:text-primary-400 hover:underline"
          >
            查看全部
          </NuxtLink>
        </div>

        <div class="space-y-3">
          <div
            v-for="item in recentContent"
            :key="item.id"
            class="flex items-center space-x-3 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center"
              :class="getTypeStyle(item.type).bg"
            >
              <component
                :is="getTypeStyle(item.type).icon"
                class="w-5 h-5 text-white"
              />
            </div>
            <div class="flex-1 min-w-0">
              <p
                class="font-medium text-neutral-800 dark:text-neutral-200 truncate"
              >
                {{ item.title }}
              </p>
              <p class="text-sm text-neutral-500 dark:text-neutral-400">
                {{ formatDate(item.createdAt) }}
              </p>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-xs text-neutral-500 dark:text-neutral-400">
                {{ item.stats?.views || 0 }} 浏览
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 快速操作 -->
      <div class="neu-card p-6">
        <h2
          class="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-4"
        >
          快速操作
        </h2>

        <div class="grid grid-cols-2 gap-4">
          <NuxtLink to="/create" class="quick-action-btn">
            <PlusIcon class="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <span>新建内容</span>
          </NuxtLink>

          <button class="quick-action-btn" @click="exportData">
            <ArrowDownTrayIcon
              class="w-6 h-6 text-green-600 dark:text-green-400"
            />
            <span>导出数据</span>
          </button>

          <NuxtLink to="/admin/settings" class="quick-action-btn">
            <CogIcon class="w-6 h-6 text-neutral-600 dark:text-neutral-400" />
            <span>系统设置</span>
          </NuxtLink>

          <button class="quick-action-btn" @click="clearCache">
            <TrashIcon class="w-6 h-6 text-red-600 dark:text-red-400" />
            <span>清理缓存</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  PlusIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  PhotoIcon,
  ArrowDownTrayIcon,
  CogIcon,
  TrashIcon,
} from '@heroicons/vue/24/outline'

// 页面元数据
definePageMeta({
  middleware: 'auth',
  layout: 'default',
})

useHead({
  title: '管理后台 - 思维轨迹',
  meta: [
    { name: 'description', content: '管理后台，查看统计数据和管理内容。' },
  ],
})

// 使用认证和时间线数据
const { user } = useAuth()
const { timeline, loadMockData } = useTimeline()

// 计算属性
const stats = computed(() => {
  const articles = timeline.value.filter(
    (item) => item.type === 'article'
  ).length
  const moments = timeline.value.filter((item) => item.type === 'moment').length
  const galleries = timeline.value.filter(
    (item) => item.type === 'gallery'
  ).length
  const total = articles + moments + galleries

  return { total, articles, moments, galleries }
})

const recentContent = computed(() => {
  return timeline.value
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
})

// 方法
const getTypeStyle = (type) => {
  const styles = {
    article: {
      bg: 'bg-gradient-to-r from-primary-500 to-primary-600',
      icon: DocumentTextIcon,
    },
    moment: {
      bg: 'bg-gradient-to-r from-accent-500 to-accent-600',
      icon: ChatBubbleLeftRightIcon,
    },
    gallery: {
      bg: 'bg-gradient-to-r from-secondary-500 to-secondary-600',
      icon: PhotoIcon,
    },
  }
  return styles[type] || styles.article
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
  })
}

const exportData = () => {
  // 模拟导出数据
  console.log('Exporting data...')
  alert('数据导出功能开发中...')
}

const clearCache = () => {
  // 模拟清理缓存
  console.log('Clearing cache...')
  alert('缓存清理完成！')
}

// 页面加载时获取数据
onMounted(() => {
  loadMockData()
})
</script>

<style scoped>
.quick-action-btn {
  @apply flex flex-col items-center justify-center p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all duration-200 space-y-2;
}
</style>
