<template>
  <div class="map-container">
    <!-- 地图控制面板 -->
    <div class="map-controls neu-card p-4 mb-4">
      <div
        class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0"
      >
        <!-- 左侧控制 -->
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <MapIcon class="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <span class="font-medium text-neutral-700 dark:text-neutral-300"
              >地图视图</span
            >
          </div>

          <!-- 视图切换 -->
          <div
            class="flex items-center space-x-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1"
          >
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
              @click="setViewMode('timeline')"
              class="view-toggle-btn"
              :class="{ active: viewMode === 'timeline' }"
            >
              <ClockIcon class="w-4 h-4" />
              <span class="hidden sm:inline">时间轴</span>
            </button>
          </div>
        </div>

        <!-- 右侧控制 -->
        <div class="flex items-center space-x-3">
          <!-- 搜索框 -->
          <div class="relative">
            <MagnifyingGlassIcon
              class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400"
            />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索位置..."
              class="pl-10 pr-4 py-2 w-48 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              @input="handleSearch"
            />
          </div>

          <!-- 定位按钮 -->
          <button
            @click="centerToUserLocation"
            class="neu-button p-2"
            title="定位到当前位置"
            :disabled="locating"
          >
            <GlobeAltIcon
              class="w-4 h-4"
              :class="{ 'animate-spin': locating }"
            />
          </button>

          <!-- 全屏按钮 -->
          <button
            @click="toggleFullscreen"
            class="neu-button p-2"
            title="全屏显示"
          >
            <ArrowsPointingOutIcon v-if="!isFullscreen" class="w-4 h-4" />
            <ArrowsPointingInIcon v-else class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- 地图容器 -->
    <div
      ref="mapContainer"
      class="map-wrapper"
      :class="{ fullscreen: isFullscreen }"
    >
      <div
        ref="mapElement"
        class="map-element"
        :style="{ height: mapHeight }"
      ></div>

      <!-- 地图加载状态 -->
      <div
        v-if="loading"
        class="absolute inset-0 bg-white/80 dark:bg-neutral-900/80 flex items-center justify-center"
      >
        <div class="text-center">
          <div
            class="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"
          ></div>
          <p class="text-sm text-neutral-600 dark:text-neutral-400">
            加载地图中...
          </p>
        </div>
      </div>

      <!-- 地图图例 -->
      <div class="map-legend neu-card p-3">
        <div
          class="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
        >
          图例
        </div>
        <div class="space-y-1">
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 rounded-full bg-accent-500"></div>
            <span class="text-xs text-neutral-600 dark:text-neutral-400"
              >说说 ({{ stats.moments }})</span
            >
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 rounded-full bg-primary-500"></div>
            <span class="text-xs text-neutral-600 dark:text-neutral-400"
              >文章 ({{ stats.articles }})</span
            >
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 rounded-full bg-secondary-500"></div>
            <span class="text-xs text-neutral-600 dark:text-neutral-400"
              >相册 ({{ stats.galleries }})</span
            >
          </div>
        </div>
      </div>
    </div>

    <!-- 内容详情弹窗 -->
    <MapContentModal
      v-if="selectedContent"
      :content="selectedContent"
      @close="selectedContent = null"
      @navigate="navigateToContent"
    />
  </div>
</template>

<script setup>
import {
  MapIcon,
  MapPinIcon,
  FireIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  GlobeAltIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
} from '@heroicons/vue/24/outline'

// Props
const props = defineProps({
  height: {
    type: String,
    default: '500px',
  },
  markers: {
    type: Array,
    default: () => [],
  },
  center: {
    type: Object,
    default: () => ({ lat: 39.9042, lng: 116.4074 }), // 北京
  },
  zoom: {
    type: Number,
    default: 10,
  },
})

// 响应式数据
const mapElement = ref(null)
const mapContainer = ref(null)
const map = ref(null)
const loading = ref(true)
const locating = ref(false)
const isFullscreen = ref(false)
const viewMode = ref('markers')
const searchQuery = ref('')
const selectedContent = ref(null)
const markersLayer = ref(null)

// 计算属性
const mapHeight = computed(() => {
  return isFullscreen.value ? '100vh' : props.height
})

const stats = computed(() => {
  const moments = props.markers.filter((m) => m.type === 'moment').length
  const articles = props.markers.filter((m) => m.type === 'article').length
  const galleries = props.markers.filter((m) => m.type === 'gallery').length

  return { moments, articles, galleries }
})

// 方法
const initMap = async () => {
  if (!process.client) return

  try {
    // 动态导入 Leaflet
    const L = await import('leaflet')

    // 创建地图
    map.value = L.map(mapElement.value, {
      center: [props.center.lat, props.center.lng],
      zoom: props.zoom,
      zoomControl: false,
    })

    // 添加瓦片层
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map.value)

    // 添加缩放控制
    L.control
      .zoom({
        position: 'bottomright',
      })
      .addTo(map.value)

    // 创建标记层组
    markersLayer.value = L.layerGroup().addTo(map.value)

    // 添加标记
    addMarkers()

    loading.value = false
  } catch (error) {
    console.error('Error initializing map:', error)
    loading.value = false
  }
}

const addMarkers = async () => {
  if (!map.value || !markersLayer.value) return

  const L = await import('leaflet')

  // 清除现有标记
  markersLayer.value.clearLayers()

  // 为每个内容添加标记
  props.markers.forEach((item) => {
    if (!item.location?.coordinates) return

    const { lat, lng } = item.location.coordinates

    // 根据内容类型选择图标颜色
    const color = getMarkerColor(item.type)

    // 创建自定义图标
    const icon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div class="marker-pin" style="background-color: ${color}">
          <div class="marker-icon">${getMarkerIcon(item.type)}</div>
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    })

    // 创建标记
    const marker = L.marker([lat, lng], { icon })
      .bindPopup(createPopupContent(item))
      .on('click', () => {
        selectedContent.value = item
      })

    markersLayer.value.addLayer(marker)
  })
}

const getMarkerColor = (type) => {
  const colors = {
    moment: '#f093fb',
    article: '#667eea',
    gallery: '#764ba2',
  }
  return colors[type] || '#667eea'
}

const getMarkerIcon = (type) => {
  const icons = {
    moment: '💭',
    article: '📝',
    gallery: '📷',
  }
  return icons[type] || '📍'
}

const createPopupContent = (item) => {
  return `
    <div class="map-popup">
      <h3 class="font-medium text-sm mb-1">${item.title}</h3>
      <p class="text-xs text-neutral-600 mb-2">${item.content.substring(
        0,
        100
      )}...</p>
      <div class="flex items-center justify-between text-xs">
        <span class="text-neutral-500">${formatDate(item.createdAt)}</span>
        <span class="text-primary-600">${getTypeLabel(item.type)}</span>
      </div>
    </div>
  `
}

const getTypeLabel = (type) => {
  const labels = {
    moment: '说说',
    article: '文章',
    gallery: '相册',
  }
  return labels[type] || type
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
  })
}

const setViewMode = (mode) => {
  viewMode.value = mode
  // 这里可以根据不同模式切换地图显示
  switch (mode) {
    case 'markers':
      // 显示标记
      break
    case 'heatmap':
      // 显示热力图
      break
    case 'timeline':
      // 显示时间轴
      break
  }
}

const handleSearch = debounce(async () => {
  if (!searchQuery.value.trim()) return

  // 实现地图搜索功能
  console.log('Searching for:', searchQuery.value)
}, 300)

const centerToUserLocation = async () => {
  if (!navigator.geolocation || !map.value) return

  locating.value = true

  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      })
    })

    const { latitude, longitude } = position.coords
    map.value.setView([latitude, longitude], 15)
  } catch (error) {
    console.error('Geolocation error:', error)
  } finally {
    locating.value = false
  }
}

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value

  // 延迟调整地图大小
  nextTick(() => {
    if (map.value) {
      setTimeout(() => {
        map.value.invalidateSize()
      }, 300)
    }
  })
}

const navigateToContent = (content) => {
  const typeRoute = {
    moment: 'moments',
    article: 'articles',
    gallery: 'galleries',
  }[content.type]

  navigateTo(`/${typeRoute}/${content.id}`)
}

// 防抖函数
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// 监听标记变化
watch(
  () => props.markers,
  () => {
    addMarkers()
  },
  { deep: true }
)

// 组件挂载时初始化地图
onMounted(() => {
  initMap()
})

// 组件卸载时清理地图
onUnmounted(() => {
  if (map.value) {
    map.value.remove()
  }
})
</script>

<style scoped>
.map-container {
  @apply relative;
}

.view-toggle-btn {
  @apply flex items-center space-x-1 px-3 py-1.5 text-sm rounded-md transition-colors;
  @apply text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200;
}

.view-toggle-btn.active {
  @apply bg-white dark:bg-neutral-700 text-primary-600 dark:text-primary-400 shadow-sm;
}

.map-wrapper {
  @apply relative rounded-xl overflow-hidden;
}

.map-wrapper.fullscreen {
  @apply fixed inset-0 z-50 rounded-none;
}

.map-element {
  @apply w-full relative;
}

.map-legend {
  @apply absolute bottom-4 left-4 z-10;
}

/* Leaflet 样式覆盖 */
:deep(.leaflet-container) {
  @apply rounded-xl;
}

:deep(.leaflet-control-zoom) {
  @apply border-none shadow-lg;
}

:deep(.leaflet-control-zoom a) {
  @apply bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700;
}

:deep(.leaflet-control-zoom a:hover) {
  @apply bg-neutral-50 dark:bg-neutral-700;
}

/* 自定义标记样式 */
:deep(.custom-marker) {
  @apply bg-transparent border-none;
}

:deep(.marker-pin) {
  @apply w-6 h-6 rounded-full flex items-center justify-center text-white text-xs shadow-lg relative;
}

:deep(.marker-pin::after) {
  content: '';
  @apply absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid currentColor;
}

/* 弹窗样式 */
:deep(.leaflet-popup-content-wrapper) {
  @apply rounded-lg shadow-lg border-none;
}

:deep(.leaflet-popup-content) {
  @apply m-0;
}

:deep(.map-popup) {
  @apply p-3 min-w-48;
}

:deep(.leaflet-popup-tip) {
  @apply bg-white dark:bg-neutral-800;
}
</style>
