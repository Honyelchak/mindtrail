<template>
  <div class="min-h-screen">
    <!-- 页面头部 -->
    <div class="mb-8">
      <div class="text-center mb-6">
        <div
          class="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r from-secondary-500 to-secondary-600 flex items-center justify-center shadow-neu-large"
        >
          <PhotoIcon class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-3xl font-bold text-gradient mb-2">视觉相册</h1>
        <p class="text-lg text-neutral-600 dark:text-neutral-400">
          用镜头捕捉美好，用图片讲述故事 📸
        </p>
      </div>

      <!-- 统计信息 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
        <div class="neu-card p-4 text-center">
          <div
            class="text-xl font-bold text-secondary-600 dark:text-secondary-400"
          >
            {{ galleries.length }}
          </div>
          <div class="text-sm text-neutral-500 dark:text-neutral-400">相册</div>
        </div>
        <div class="neu-card p-4 text-center">
          <div class="text-xl font-bold text-primary-600 dark:text-primary-400">
            {{ totalPhotos }}
          </div>
          <div class="text-sm text-neutral-500 dark:text-neutral-400">照片</div>
        </div>
        <div class="neu-card p-4 text-center">
          <div class="text-xl font-bold text-accent-600 dark:text-accent-400">
            {{ thisMonthPhotos }}
          </div>
          <div class="text-sm text-neutral-500 dark:text-neutral-400">本月</div>
        </div>
        <div class="neu-card p-4 text-center">
          <div class="text-xl font-bold text-green-600 dark:text-green-400">
            {{ uniqueLocations }}
          </div>
          <div class="text-sm text-neutral-500 dark:text-neutral-400">地点</div>
        </div>
      </div>
    </div>

    <!-- 视图切换 -->
    <div class="neu-card p-4 mb-8">
      <div class="flex items-center justify-between">
        <div
          class="flex items-center space-x-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1"
        >
          <button
            @click="viewMode = 'grid'"
            class="view-toggle-btn"
            :class="{ active: viewMode === 'grid' }"
          >
            <ViewColumnsIcon class="w-4 h-4" />
            <span class="hidden sm:inline">网格</span>
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
            @click="viewMode = 'timeline'"
            class="view-toggle-btn"
            :class="{ active: viewMode === 'timeline' }"
          >
            <ClockIcon class="w-4 h-4" />
            <span class="hidden sm:inline">时间轴</span>
          </button>
        </div>

        <div class="flex items-center space-x-2">
          <span
            class="text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >排序:</span
          >
          <select
            v-model="sortBy"
            class="px-3 py-1 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-secondary-500"
          >
            <option value="latest">最新发布</option>
            <option value="oldest">最早发布</option>
            <option value="popular">最受欢迎</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 相册内容 -->
    <div
      v-if="viewMode === 'grid'"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div
        v-for="gallery in sortedGalleries"
        :key="gallery.id"
        class="neu-card overflow-hidden group hover:shadow-neu-large transition-all duration-300"
      >
        <!-- 相册封面 -->
        <div class="aspect-square overflow-hidden relative">
          <img
            :src="gallery.media[0]?.url"
            :alt="gallery.media[0]?.alt"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          <!-- 照片数量标识 -->
          <div
            class="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded-full text-xs font-medium"
          >
            {{ gallery.media.length }} 张
          </div>

          <!-- 悬停遮罩 -->
          <div
            class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center"
          >
            <div
              class="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <button
                class="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-neutral-800 hover:bg-white transition-colors"
              >
                <EyeIcon class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <!-- 相册信息 -->
        <div class="p-4">
          <NuxtLink :to="`/galleries/${gallery.id}`" class="block group">
            <h3
              class="font-bold text-neutral-800 dark:text-neutral-200 mb-2 group-hover:text-secondary-600 dark:group-hover:text-secondary-400 transition-colors"
            >
              {{ gallery.title }}
            </h3>
            <p
              class="text-sm text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2"
            >
              {{ gallery.content }}
            </p>
          </NuxtLink>

          <!-- 元信息 -->
          <div
            class="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400"
          >
            <div class="flex items-center space-x-2">
              <time>{{ formatDate(gallery.createdAt) }}</time>
              <span v-if="gallery.location">·</span>
              <span v-if="gallery.location" class="flex items-center space-x-1">
                <MapPinIcon class="w-3 h-3" />
                <span>{{ gallery.location.name }}</span>
              </span>
            </div>

            <div class="flex items-center space-x-3">
              <span class="flex items-center space-x-1">
                <HeartIcon class="w-3 h-3" />
                <span>{{ gallery.stats?.likes || 0 }}</span>
              </span>
              <span class="flex items-center space-x-1">
                <EyeIcon class="w-3 h-3" />
                <span>{{ gallery.stats?.views || 0 }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 瀑布流视图 -->
    <div
      v-else-if="viewMode === 'masonry'"
      class="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6"
    >
      <div
        v-for="gallery in sortedGalleries"
        :key="gallery.id"
        class="break-inside-avoid mb-6"
      >
        <div
          class="neu-card overflow-hidden group hover:shadow-neu-large transition-all duration-300"
        >
          <div class="relative">
            <img
              :src="gallery.media[0]?.url"
              :alt="gallery.media[0]?.alt"
              class="w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div
              class="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded-full text-xs font-medium"
            >
              {{ gallery.media.length }}
            </div>
          </div>

          <div class="p-4">
            <NuxtLink :to="`/galleries/${gallery.id}`">
              <h3
                class="font-bold text-neutral-800 dark:text-neutral-200 mb-2 hover:text-secondary-600 dark:hover:text-secondary-400 transition-colors"
              >
                {{ gallery.title }}
              </h3>
            </NuxtLink>
            <p class="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
              {{ gallery.content.substring(0, 100)
              }}{{ gallery.content.length > 100 ? '...' : '' }}
            </p>
            <div class="text-xs text-neutral-500 dark:text-neutral-400">
              {{ formatDate(gallery.createdAt) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 时间轴视图 -->
    <div v-else class="space-y-8">
      <div
        v-for="gallery in sortedGalleries"
        :key="gallery.id"
        class="neu-card p-6 hover:shadow-neu-large transition-all duration-300"
      >
        <TimelineItem :item="gallery" />
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
    <div v-if="galleries.length === 0" class="text-center py-12">
      <div class="neu-card p-8 max-w-md mx-auto">
        <div class="text-6xl mb-4">📷</div>
        <h3 class="text-lg font-semibold mb-2">还没有相册</h3>
        <p class="text-neutral-600 dark:text-neutral-400 mb-4">
          开始创建你的第一个相册吧！
        </p>
        <NuxtLink to="/create" class="neu-button px-6 py-3">
          创建相册
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  PhotoIcon,
  ViewColumnsIcon,
  Squares2X2Icon,
  ClockIcon,
  EyeIcon,
  HeartIcon,
  MapPinIcon,
} from '@heroicons/vue/24/outline'

// 页面元数据
useHead({
  title: '视觉相册 - 思维轨迹',
  meta: [
    {
      name: 'description',
      content: '用镜头记录美好瞬间，分享生活中的精彩画面。',
    },
  ],
})

// 使用 Timeline Composable
const { timeline, loadMockData, loading } = useTimeline()

// 响应式数据
const viewMode = ref('grid')
const sortBy = ref('latest')
const hasMore = ref(true)

// 计算属性
const galleries = computed(() => {
  return timeline.value.filter((item) => item.type === 'gallery')
})

const totalPhotos = computed(() => {
  return galleries.value.reduce((total, gallery) => {
    return total + (gallery.media?.length || 0)
  }, 0)
})

const thisMonthPhotos = computed(() => {
  const now = new Date()
  const thisMonth = now.getMonth()
  const thisYear = now.getFullYear()

  return galleries.value
    .filter((gallery) => {
      const date = new Date(gallery.createdAt)
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear
    })
    .reduce((total, gallery) => total + (gallery.media?.length || 0), 0)
})

const uniqueLocations = computed(() => {
  const locations = new Set()
  galleries.value.forEach((gallery) => {
    if (gallery.location?.name) {
      locations.add(gallery.location.name)
    }
  })
  return locations.size
})

const sortedGalleries = computed(() => {
  let filtered = [...galleries.value]

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

// 方法
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const loadMore = () => {
  // 模拟加载更多
  console.log('Loading more galleries...')
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
  @apply bg-white dark:bg-neutral-700 text-secondary-600 dark:text-secondary-400 shadow-sm;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
