<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- 页面头部 -->
    <div
      class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700"
    >
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-200">
              足迹地图
            </h1>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              探索你的内容足迹，重温美好回忆
            </p>
          </div>

          <!-- 统计信息 -->
          <div class="flex items-center space-x-6 text-sm">
            <div class="text-center">
              <div class="text-lg font-bold text-primary-600">
                {{ totalLocations }}
              </div>
              <div class="text-gray-500">地点</div>
            </div>
            <div class="text-center">
              <div class="text-lg font-bold text-green-600">
                {{ totalContents }}
              </div>
              <div class="text-gray-500">内容</div>
            </div>
            <div class="text-center">
              <div class="text-lg font-bold text-purple-600">
                {{ totalRevisits }}
              </div>
              <div class="text-gray-500">回访</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-6">
      <div class="grid lg:grid-cols-4 gap-6">
        <!-- 左侧：筛选和列表 -->
        <div class="lg:col-span-1 space-y-6">
          <!-- 筛选器 -->
          <div class="glass-card p-4">
            <h3 class="font-semibold text-gray-800 dark:text-gray-200 mb-4">
              筛选条件
            </h3>

            <!-- 内容类型筛选 -->
            <div class="mb-4">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                内容类型
              </label>
              <div class="space-y-2">
                <label
                  v-for="type in contentTypes"
                  :key="type.key"
                  class="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    v-model="filters.contentTypes"
                    :value="type.key"
                    type="checkbox"
                    class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <div class="flex items-center space-x-2">
                    <component :is="type.icon" class="w-4 h-4" />
                    <span class="text-sm">{{ type.label }}</span>
                  </div>
                </label>
              </div>
            </div>

            <!-- 时间范围筛选 -->
            <div class="mb-4">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                时间范围
              </label>
              <select
                v-model="filters.timeRange"
                class="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm"
              >
                <option value="all">全部时间</option>
                <option value="today">今天</option>
                <option value="week">本周</option>
                <option value="month">本月</option>
                <option value="year">今年</option>
              </select>
            </div>

            <!-- 清除筛选 -->
            <button
              @click="clearFilters"
              class="w-full text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              清除筛选条件
            </button>
          </div>

          <!-- 位置列表 -->
          <div class="glass-card p-4">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold text-gray-800 dark:text-gray-200">
                位置列表
              </h3>
              <span class="text-sm text-gray-500"
                >{{ filteredLocations.length }} 个地点</span
              >
            </div>

            <div class="space-y-2 max-h-96 overflow-y-auto">
              <button
                v-for="location in filteredLocations"
                :key="location.id"
                @click="selectLocation(location)"
                class="w-full p-3 rounded-lg border transition-all text-left"
                :class="
                  selectedLocationId === location.id
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                "
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-1">
                      <div
                        class="w-4 h-4 rounded flex items-center justify-center"
                        :class="
                          getContentTypeConfig(location.contentType).bgClass
                        "
                      >
                        <component
                          :is="getContentTypeConfig(location.contentType).icon"
                          class="w-2 h-2 text-white"
                        />
                      </div>
                      <span
                        class="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-1"
                      >
                        {{ location.title }}
                      </span>
                    </div>
                    <p
                      class="text-xs text-gray-600 dark:text-gray-400 mb-1 line-clamp-1"
                    >
                      {{ location.address }}
                    </p>
                    <div class="flex items-center justify-between">
                      <span class="text-xs text-gray-500">
                        {{ formatDate(location.createdAt, 'relative') }}
                      </span>
                      <div
                        v-if="location.revisits.length > 0"
                        class="flex items-center space-x-1"
                      >
                        <EyeIcon class="w-3 h-3 text-gray-400" />
                        <span class="text-xs text-gray-500">{{
                          location.revisits.length
                        }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- 右侧：地图 -->
        <div class="lg:col-span-3">
          <div class="glass-card p-4 h-[600px]">
            <InteractiveMap
              :height="'100%'"
              :show-controls="true"
              :initial-center="mapCenter"
              :initial-zoom="mapZoom"
            />
          </div>
        </div>
      </div>

      <!-- 位置聚类统计 -->
      <div class="mt-8">
        <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          位置聚类
        </h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="cluster in locationClusters"
            :key="`cluster-${cluster.center.latitude}-${cluster.center.longitude}`"
            class="glass-card p-4 hover:scale-105 transition-transform cursor-pointer"
            @click="focusCluster(cluster)"
          >
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-medium text-gray-800 dark:text-gray-200">
                {{ cluster.name || getClusterName(cluster) }}
              </h3>
              <span class="text-sm text-gray-500"
                >{{ cluster.contents.length }} 项内容</span
              >
            </div>

            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {{ cluster.center.address || '未知位置' }}
            </p>

            <!-- 内容类型分布 -->
            <div class="flex space-x-2">
              <div
                v-for="type in getClusterContentTypes(cluster)"
                :key="type.key"
                class="flex items-center space-x-1"
              >
                <div
                  class="w-3 h-3 rounded"
                  :class="getContentTypeConfig(type.key).bgClass"
                />
                <span class="text-xs text-gray-500">{{ type.count }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  PhotoIcon,
  VideoCameraIcon,
  EyeIcon,
} from '@heroicons/vue/24/outline'
import { formatDate } from '~/utils'

// 页面元数据
useHead({
  title: '足迹地图 - 思维轨迹',
  meta: [
    {
      name: 'description',
      content: '在地图上查看你的所有内容足迹，重温美好回忆，发现新的故事。',
    },
  ],
})

// 使用位置数据
const { locationHistory, locationClusters, getCurrentLocation } = useLocation()

// 筛选状态
const filters = reactive({
  contentTypes: ['moment', 'article', 'gallery', 'video'],
  timeRange: 'all',
})

const selectedLocationId = ref(null)

// 内容类型配置
const contentTypes = [
  { key: 'moment', label: '说说', icon: ChatBubbleLeftRightIcon },
  { key: 'article', label: '文章', icon: DocumentTextIcon },
  { key: 'gallery', label: '相册', icon: PhotoIcon },
  { key: 'video', label: '视频', icon: VideoCameraIcon },
]

// 获取内容类型配置
const getContentTypeConfig = (type) => {
  const configs = {
    moment: { icon: ChatBubbleLeftRightIcon, bgClass: 'bg-green-500' },
    article: { icon: DocumentTextIcon, bgClass: 'bg-blue-500' },
    gallery: { icon: PhotoIcon, bgClass: 'bg-purple-500' },
    video: { icon: VideoCameraIcon, bgClass: 'bg-red-500' },
  }
  return configs[type] || configs.moment
}

// 统计数据
const totalLocations = computed(() => {
  const uniqueLocations = new Set()
  locationHistory.value.forEach((location) => {
    const key = `${location.latitude.toFixed(4)},${location.longitude.toFixed(4)}`
    uniqueLocations.add(key)
  })
  return uniqueLocations.size
})

const totalContents = computed(() => locationHistory.value.length)

const totalRevisits = computed(() => {
  return locationHistory.value.reduce((total, location) => {
    return total + (location.revisits?.length || 0)
  }, 0)
})

// 筛选后的位置
const filteredLocations = computed(() => {
  let filtered = locationHistory.value

  // 按内容类型筛选
  if (filters.contentTypes.length > 0) {
    filtered = filtered.filter((location) =>
      filters.contentTypes.includes(location.contentType)
    )
  }

  // 按时间范围筛选
  if (filters.timeRange !== 'all') {
    const now = new Date()
    let startDate

    switch (filters.timeRange) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1)
        break
    }

    if (startDate) {
      filtered = filtered.filter(
        (location) => new Date(location.createdAt) >= startDate
      )
    }
  }

  return filtered.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
})

// 地图中心和缩放
const mapCenter = computed(() => {
  if (filteredLocations.value.length > 0) {
    const firstLocation = filteredLocations.value[0]
    return {
      lat: firstLocation.latitude,
      lng: firstLocation.longitude,
    }
  }
  return { lat: 39.9042, lng: 116.4074 } // 默认北京
})

const mapZoom = computed(() => {
  return filteredLocations.value.length > 0 ? 13 : 10
})

// 获取聚类名称
const getClusterName = (cluster) => {
  if (cluster.contents.length === 1) {
    return cluster.contents[0].title
  }
  return `${cluster.contents.length} 项内容`
}

// 获取聚类内容类型分布
const getClusterContentTypes = (cluster) => {
  const typeCount = {}
  cluster.contents.forEach((content) => {
    typeCount[content.contentType] = (typeCount[content.contentType] || 0) + 1
  })

  return Object.entries(typeCount).map(([key, count]) => ({
    key,
    count,
  }))
}

// 选择位置
const selectLocation = (location) => {
  selectedLocationId.value = location.id
  // 这里可以触发地图聚焦到该位置
}

// 聚焦聚类
const focusCluster = (cluster) => {
  // 这里可以触发地图聚焦到聚类中心
  console.log('聚焦聚类:', cluster)
}

// 清除筛选
const clearFilters = () => {
  filters.contentTypes = ['moment', 'article', 'gallery', 'video']
  filters.timeRange = 'all'
}

// 组件挂载时获取当前位置
onMounted(() => {
  getCurrentLocation().catch(() => {
    // 忽略位置获取失败
  })
})
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

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}
</style>
