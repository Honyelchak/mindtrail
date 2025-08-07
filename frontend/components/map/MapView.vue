<template>
  <div class="map-container">
    <!-- 地图控制面板 -->
    <div class="map-controls neu-card p-4 mb-4">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <!-- 左侧控制 -->
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <MapIcon class="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <span class="font-medium text-neutral-700 dark:text-neutral-300">地图视图</span>
          </div>

          <!-- 视图切换 -->
          <div class="flex items-center space-x-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1">
            <button
              @click="setViewMode('markers')"
              class="view-toggle-btn"
              :class="{ active: viewMode === 'markers' }"
            >
              <MapPinIcon class="w-4 h-4" />
              <span class="hidden sm:inline">标记</span>
            </button>
            <button
              @click="setViewMode('heatmap')"
              class="view-toggle-btn"
              :class="{ active: viewMode === 'heatmap' }"
            >
              <FireIcon class="w-4 h-4" />
              <span class="hidden sm:inline">热力图</span>
            </button>
            <button
              @click="setViewMode('cluster')"
              class="view-toggle-btn"
              :class="{ active: viewMode === 'cluster' }"
            >
              <Squares2X2Icon class="w-4 h-4" />
              <span class="hidden sm:inline">聚类</span>
            </button>
          </div>
        </div>

        <!-- 右侧控制 -->
        <div class="flex items-center space-x-2">
          <!-- 筛选按钮 -->
          <button
            @click="toggleFilters"
            class="neu-button-sm px-3 py-2 flex items-center space-x-2"
          >
            <FunnelIcon class="w-4 h-4" />
            <span class="hidden sm:inline">筛选</span>
          </button>

          <!-- 全屏按钮 -->
          <button
            @click="toggleFullscreen"
            class="neu-button-sm p-2"
            :title="isFullscreen ? '退出全屏' : '全屏显示'"
          >
            <ArrowsPointingOutIcon v-if="!isFullscreen" class="w-4 h-4" />
            <ArrowsPointingInIcon v-else class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- 筛选面板 -->
      <div v-if="showFilters" class="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- 内容类型筛选 -->
          <div>
            <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              内容类型
            </label>
            <div class="space-y-1">
              <label
                v-for="type in contentTypes"
                :key="type.key"
                class="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  v-model="activeFilters.contentTypes"
                  :value="type.key"
                  type="checkbox"
                  class="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <span class="text-sm">{{ type.label }}</span>
              </label>
            </div>
          </div>

          <!-- 时间范围筛选 -->
          <div>
            <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              时间范围
            </label>
            <select
              v-model="activeFilters.timeRange"
              class="w-full p-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800"
            >
              <option value="all">全部时间</option>
              <option value="today">今天</option>
              <option value="week">本周</option>
              <option value="month">本月</option>
              <option value="year">今年</option>
            </select>
          </div>

          <!-- 位置筛选 -->
          <div>
            <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              位置范围
            </label>
            <select
              v-model="activeFilters.locationRange"
              class="w-full p-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800"
            >
              <option value="all">全部位置</option>
              <option value="nearby">附近 1km</option>
              <option value="city">同城</option>
              <option value="province">同省</option>
            </select>
          </div>
        </div>

        <!-- 筛选操作 -->
        <div class="flex items-center justify-between mt-4">
          <button
            @click="resetFilters"
            class="text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            重置筛选
          </button>
          <div class="text-sm text-neutral-500">
            显示 {{ filteredMarkers.length }} 个标记
          </div>
        </div>
      </div>
    </div>

    <!-- 地图主体 -->
    <div
      ref="mapContainer"
      class="map-wrapper neu-card overflow-hidden"
      :class="{ 'fullscreen': isFullscreen }"
      :style="{ height: mapHeight }"
    >
      <!-- 地图加载状态 -->
      <div v-if="loading" class="flex items-center justify-center h-full">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p class="text-neutral-600 dark:text-neutral-400">加载地图中...</p>
        </div>
      </div>

      <!-- 地图内容 -->
      <div v-else class="relative w-full h-full">
        <!-- 这里应该是实际的地图组件 -->
        <div class="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900 dark:to-green-900 flex items-center justify-center">
          <div class="text-center">
            <div class="text-6xl mb-4">🗺️</div>
            <h3 class="text-xl font-semibold mb-2">交互式地图</h3>
            <p class="text-neutral-600 dark:text-neutral-400 mb-4">
              显示模式: {{ viewModeLabels[viewMode] }}
            </p>
            <p class="text-sm text-neutral-500">
              {{ filteredMarkers.length }} 个标记点
            </p>
          </div>
        </div>

        <!-- 地图图例 -->
        <div class="absolute bottom-4 left-4 bg-white dark:bg-neutral-800 rounded-lg p-3 shadow-lg">
          <h4 class="text-sm font-medium mb-2">图例</h4>
          <div class="space-y-1">
            <div
              v-for="type in contentTypes"
              :key="type.key"
              class="flex items-center space-x-2 text-xs"
            >
              <div
                class="w-3 h-3 rounded-full"
                :class="type.color"
              ></div>
              <span>{{ type.label }}</span>
            </div>
          </div>
        </div>

        <!-- 缩放控制 -->
        <div class="absolute top-4 right-4 flex flex-col space-y-1">
          <button
            @click="zoomIn"
            class="w-8 h-8 bg-white dark:bg-neutral-800 rounded shadow-lg flex items-center justify-center hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
          >
            <PlusIcon class="w-4 h-4" />
          </button>
          <button
            @click="zoomOut"
            class="w-8 h-8 bg-white dark:bg-neutral-800 rounded shadow-lg flex items-center justify-center hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
          >
            <MinusIcon class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- 地图统计信息 -->
    <div class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="neu-card p-4 text-center">
        <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">
          {{ stats.totalMarkers }}
        </div>
        <div class="text-sm text-neutral-500 dark:text-neutral-400">总标记</div>
      </div>
      <div class="neu-card p-4 text-center">
        <div class="text-2xl font-bold text-green-600 dark:text-green-400">
          {{ stats.uniqueLocations }}
        </div>
        <div class="text-sm text-neutral-500 dark:text-neutral-400">地点</div>
      </div>
      <div class="neu-card p-4 text-center">
        <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
          {{ stats.cities }}
        </div>
        <div class="text-sm text-neutral-500 dark:text-neutral-400">城市</div>
      </div>
      <div class="neu-card p-4 text-center">
        <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">
          {{ stats.totalDistance }}
        </div>
        <div class="text-sm text-neutral-500 dark:text-neutral-400">公里</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  MapIcon,
  MapPinIcon,
  FireIcon,
  Squares2X2Icon,
  FunnelIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  PlusIcon,
  MinusIcon
} from '@heroicons/vue/24/outline'

interface Marker {
  id: string
  lat: number
  lng: number
  type: 'moment' | 'article' | 'gallery' | 'video'
  title: string
  createdAt: string
  location: string
}

interface Props {
  markers?: Marker[]
  center?: { lat: number; lng: number }
  zoom?: number
  height?: string
}

interface Emits {
  (e: 'marker-click', marker: Marker): void
  (e: 'view-change', viewMode: string): void
}

const props = withDefaults(defineProps<Props>(), {
  markers: () => [],
  center: () => ({ lat: 39.9042, lng: 116.4074 }),
  zoom: 10,
  height: '500px'
})

const emit = defineEmits<Emits>()

// 响应式数据
const viewMode = ref<string>('markers')
const showFilters = ref<boolean>(false)
const isFullscreen = ref<boolean>(false)
const loading = ref<boolean>(false)
const mapContainer = ref<HTMLElement | null>(null)

const activeFilters = reactive({
  contentTypes: ['moment', 'article', 'gallery', 'video'],
  timeRange: 'all',
  locationRange: 'all'
})

// 内容类型配置
const contentTypes = [
  { key: 'moment', label: '说说', color: 'bg-green-500' },
  { key: 'article', label: '文章', color: 'bg-blue-500' },
  { key: 'gallery', label: '相册', color: 'bg-purple-500' },
  { key: 'video', label: '视频', color: 'bg-red-500' }
]

// 视图模式标签
const viewModeLabels: Record<string, string> = {
  markers: '标记模式',
  heatmap: '热力图模式',
  cluster: '聚类模式'
}

// 计算属性
const mapHeight = computed(() => {
  return isFullscreen.value ? '100vh' : props.height
})

const filteredMarkers = computed(() => {
  let filtered = props.markers

  // 按内容类型筛选
  if (activeFilters.contentTypes.length > 0) {
    filtered = filtered.filter(marker => 
      activeFilters.contentTypes.includes(marker.type)
    )
  }

  // 按时间范围筛选
  if (activeFilters.timeRange !== 'all') {
    const now = new Date()
    let startDate: Date

    switch (activeFilters.timeRange) {
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
      default:
        startDate = new Date(0)
    }

    filtered = filtered.filter(marker => 
      new Date(marker.createdAt) >= startDate
    )
  }

  return filtered
})

const stats = computed(() => {
  const markers = filteredMarkers.value
  const uniqueLocations = new Set(markers.map(m => m.location)).size
  const cities = new Set(markers.map(m => m.location.split(',')[0])).size

  return {
    totalMarkers: markers.length,
    uniqueLocations,
    cities,
    totalDistance: Math.round(Math.random() * 1000) // 模拟数据
  }
})

// 方法
const setViewMode = (mode: string): void => {
  viewMode.value = mode
  emit('view-change', mode)
}

const toggleFilters = (): void => {
  showFilters.value = !showFilters.value
}

const toggleFullscreen = (): void => {
  isFullscreen.value = !isFullscreen.value
  
  if (isFullscreen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const resetFilters = (): void => {
  activeFilters.contentTypes = ['moment', 'article', 'gallery', 'video']
  activeFilters.timeRange = 'all'
  activeFilters.locationRange = 'all'
}

const zoomIn = (): void => {
  // 实现地图放大逻辑
  console.log('Zoom in')
}

const zoomOut = (): void => {
  // 实现地图缩小逻辑
  console.log('Zoom out')
}

// 生命周期
onUnmounted(() => {
  if (isFullscreen.value) {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
.view-toggle-btn {
  @apply px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center space-x-1;
  @apply text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200;
}

.view-toggle-btn.active {
  @apply bg-white dark:bg-neutral-700 text-primary-600 dark:text-primary-400 shadow-sm;
}

.map-wrapper.fullscreen {
  @apply fixed inset-0 z-50;
}
</style>
