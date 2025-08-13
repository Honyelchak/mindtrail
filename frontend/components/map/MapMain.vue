<!--
  MapMain.vue - 主地图组件
  
  Props:
  - markers: MapMarker[] - 地图标记数组
  - paths: MapPath[] - 路径数组
  - theme: 'light' | 'dark' - 地图主题
  - activeMarker: string - 激活的标记ID
  - showClusters: boolean - 是否显示聚合
  
  Mock Data Structure:
  interface MapMarker {
    id: string
    coordinates: [number, number]
    title: string
    description: string
    type: 'photo' | 'article' | 'moment' | 'milestone'
    thumbnail?: string
    date: string
    content?: any
  }
  
  interface MapPath {
    id: string
    name: string
    coordinates: [number, number][]
    markers: MapMarker[]
    distance: number
    duration: number
    description: string
    color?: string
  }
-->

<template>
  <div class="map-main relative w-full h-full bg-slate-900 overflow-hidden">
    <!-- 地图容器 -->
    <div ref="mapContainer" class="absolute inset-0" :class="mapThemeClass">
      <!-- 模拟地图背景 -->
      <div
        class="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900"
      >
        <!-- 网格线 -->
        <div class="absolute inset-0 opacity-20">
          <div class="map-grid"></div>
        </div>

        <!-- 路径轨迹 -->
        <svg
          v-if="paths.length > 0"
          class="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <!-- 路径定义 -->
          <defs>
            <linearGradient
              v-for="path in paths"
              :key="`gradient-${path.id}`"
              :id="`pathGradient-${path.id}`"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop
                offset="0%"
                :style="`stop-color:${path.color || '#3b82f6'};stop-opacity:0.8`"
              />
              <stop
                offset="50%"
                :style="`stop-color:${path.color || '#8b5cf6'};stop-opacity:0.9`"
              />
              <stop
                offset="100%"
                :style="`stop-color:${path.color || '#ec4899'};stop-opacity:0.8`"
              />
            </linearGradient>
          </defs>

          <!-- 路径轨迹 -->
          <path
            v-for="path in visiblePaths"
            :key="path.id"
            :d="getPathData(path)"
            :stroke="`url(#pathGradient-${path.id})`"
            stroke-width="0.5"
            fill="none"
            class="path-line"
            :class="{ 'path-active': activePathId === path.id }"
            @click="handlePathClick(path)"
          />
        </svg>

        <!-- 优化后的地图标记 -->
        <div
          v-for="marker in visibleMarkers"
          :key="marker.id"
          class="map-marker absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
          :style="getMarkerPosition(marker.coordinates)"
          @click="handleMarkerClick(marker)"
          @mouseenter="showMarkerPreview(marker, $event)"
          @mouseleave="hideMarkerPreview"
        >
          <!-- 增强的标记点设计 -->
          <div
            class="marker-dot relative transition-all duration-300 hover:scale-125 hover:-translate-y-1"
            :class="[
              getMarkerSizeClass(marker.type),
              marker.id === activeMarker ? 'marker-active' : 'marker-normal',
            ]"
          >
            <!-- 标记阴影 -->
            <div
              class="absolute inset-0 rounded-full opacity-30 blur-sm transition-all duration-300 group-hover:opacity-50 group-hover:blur-md"
              :style="{ backgroundColor: getMarkerColor(marker.type) }"
            />

            <!-- 标记背景 -->
            <div
              class="absolute inset-0 rounded-full border-2 border-white shadow-xl transition-all duration-300 group-hover:shadow-2xl z-10"
              :style="{ backgroundColor: getMarkerColor(marker.type) }"
            />

            <!-- 标记图标 -->
            <div
              class="absolute inset-0 flex items-center justify-center text-white z-20 transition-all duration-300 group-hover:scale-110"
            >
              <Icon :name="getMarkerIcon(marker.type)" class="w-4 h-4" />
            </div>

            <!-- 缩略图覆盖层 -->
            <div
              v-if="marker.thumbnail"
              class="absolute inset-1 rounded-full overflow-hidden opacity-0 group-hover:opacity-90 transition-all duration-300 z-15 border border-white/50"
            >
              <img
                :src="marker.thumbnail"
                :alt="marker.title"
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
              <!-- 缩略图遮罩 -->
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
              />
            </div>

            <!-- 激活状态的多层指示器 -->
            <div v-if="marker.id === activeMarker" class="absolute inset-0">
              <!-- 外层脉冲环 -->
              <div
                class="absolute -inset-3 rounded-full border-2 border-primary-400/60 animate-ping"
              />
              <!-- 中层光晕 -->
              <div
                class="absolute -inset-2 rounded-full bg-primary-400/20 animate-pulse"
              />
              <!-- 内层高亮 -->
              <div
                class="absolute -inset-1 rounded-full border border-primary-300/80"
              />
            </div>

            <!-- 类型标识小点 -->
            <div
              class="absolute -top-1 -right-1 w-3 h-3 rounded-full border border-white shadow-sm z-30 transition-all duration-300 group-hover:scale-125"
              :style="{ backgroundColor: getMarkerTypeColor(marker.type) }"
            />
          </div>

          <!-- 增强的标记标签 -->
          <div
            class="marker-label absolute top-10 left-1/2 transform -translate-x-1/2 px-3 py-2 bg-black/90 backdrop-blur-md text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-30 border border-white/20 shadow-xl"
          >
            <div class="font-medium">{{ marker.title }}</div>
            <div class="text-xs text-white/70 mt-1">
              {{ getMarkerTypeLabel(marker.type) }}
            </div>
            <!-- 标签箭头 -->
            <div
              class="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/90 border-l border-t border-white/20 rotate-45"
            />
          </div>
        </div>

        <!-- 聚合标记 -->
        <div
          v-for="cluster in clusters"
          :key="cluster.id"
          class="cluster-marker absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
          :style="getMarkerPosition(cluster.center)"
          @click="handleClusterClick(cluster)"
        >
          <div
            class="relative w-12 h-12 bg-primary-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white font-bold hover:scale-110 transition-transform duration-200"
          >
            {{ cluster.count }}

            <!-- 聚合指示环 -->
            <div
              class="absolute -inset-2 rounded-full border-2 border-primary-400/50 animate-pulse"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 优化后的地图控制面板 -->
    <div class="absolute top-6 right-6 flex flex-col space-y-3 z-20">
      <!-- 缩放控制组 -->
      <div
        class="bg-gradient-to-b from-glass-bg/95 to-glass-bg/90 backdrop-blur-xl border border-glass-border rounded-xl shadow-glass-lg overflow-hidden"
      >
        <button
          @click="zoomIn"
          class="group w-12 h-12 flex items-center justify-center text-white/70 hover:text-white hover:bg-gradient-to-r hover:from-primary-500/20 hover:to-secondary-500/20 transition-all duration-300 border-b border-glass-border hover:scale-105"
          title="放大"
        >
          <Icon
            name="heroicons:plus"
            class="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
          />
        </button>

        <button
          @click="zoomOut"
          class="group w-12 h-12 flex items-center justify-center text-white/70 hover:text-white hover:bg-gradient-to-r hover:from-primary-500/20 hover:to-secondary-500/20 transition-all duration-300 hover:scale-105"
          title="缩小"
        >
          <Icon
            name="heroicons:minus"
            class="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
          />
        </button>
      </div>

      <!-- 视图控制组 -->
      <div
        class="bg-gradient-to-b from-glass-bg/95 to-glass-bg/90 backdrop-blur-xl border border-glass-border rounded-xl shadow-glass-lg overflow-hidden"
      >
        <button
          @click="fitBounds"
          class="group w-12 h-12 flex items-center justify-center text-white/70 hover:text-white hover:bg-gradient-to-r hover:from-primary-500/20 hover:to-secondary-500/20 transition-all duration-300 border-b border-glass-border hover:scale-105"
          title="适应边界"
        >
          <Icon
            name="heroicons:arrows-pointing-out"
            class="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
          />
        </button>

        <button
          @click="toggleTheme"
          class="group w-12 h-12 flex items-center justify-center text-white/70 hover:text-white hover:bg-gradient-to-r hover:from-primary-500/20 hover:to-secondary-500/20 transition-all duration-300 border-b border-glass-border hover:scale-105"
          :title="theme === 'dark' ? '切换到亮色' : '切换到暗色'"
        >
          <Icon
            :name="theme === 'dark' ? 'heroicons:sun' : 'heroicons:moon'"
            class="w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
          />
        </button>

        <button
          @click="toggleClusters"
          class="group w-12 h-12 flex items-center justify-center transition-all duration-300 hover:scale-105"
          :class="[
            showClusters
              ? 'bg-gradient-to-r from-primary-500/30 to-secondary-500/30 text-primary-300 border-primary-400/50'
              : 'text-white/70 hover:text-white hover:bg-gradient-to-r hover:from-primary-500/20 hover:to-secondary-500/20',
          ]"
          title="切换聚合显示"
        >
          <Icon
            name="heroicons:squares-2x2"
            class="w-5 h-5 transition-all duration-300 group-hover:scale-110"
            :class="{ 'animate-pulse': showClusters }"
          />
        </button>
      </div>
    </div>

    <!-- 比例尺 -->
    <div
      class="absolute bottom-4 left-4 bg-glass-bg/90 backdrop-blur-md border border-glass-border rounded-lg px-3 py-2 z-20"
    >
      <div class="flex items-center space-x-2 text-white/70 text-xs">
        <div class="w-16 h-0.5 bg-white/70"></div>
        <span>{{ scaleText }}</span>
      </div>
    </div>

    <!-- 标记预览卡片 -->
    <div
      v-if="previewMarker && previewPosition"
      class="marker-preview absolute z-30 max-w-sm p-4 bg-black/90 backdrop-blur-md border border-white/20 rounded-lg shadow-2xl pointer-events-none"
      :style="previewPosition"
    >
      <div class="flex items-start space-x-3">
        <div
          class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
          :style="{ backgroundColor: getMarkerColor(previewMarker.type) }"
        >
          <Icon
            :name="getMarkerIcon(previewMarker.type)"
            class="w-4 h-4 text-white"
          />
        </div>

        <div class="flex-1 min-w-0">
          <h4 class="text-white font-medium text-sm mb-1 line-clamp-1">
            {{ previewMarker.title }}
          </h4>
          <p class="text-white/70 text-xs mb-2 line-clamp-2">
            {{ previewMarker.description }}
          </p>

          <div class="flex items-center justify-between text-white/50 text-xs">
            <span>{{ formatMarkerDate(previewMarker.date) }}</span>
            <span>{{ getMarkerTypeLabel(previewMarker.type) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 聚合弹窗 -->
    <ClusterPopover
      v-if="activeCluster"
      :cluster="activeCluster"
      :position="clusterPopoverPosition"
      @marker-click="handleMarkerClick"
      @close="closeClusterPopover"
    />

    <!-- 路径回放控制器 -->
    <PathReplayController
      v-if="activePathId && replayMode"
      :path="getPathById(activePathId)"
      :playing="replayPlaying"
      :speed="replaySpeed"
      @play-pause="toggleReplay"
      @speed-change="setReplaySpeed"
      @position-change="setReplayPosition"
      @close="closeReplay"
    />
  </div>
</template>

<script setup lang="ts">
interface MapMarker {
  id: string
  coordinates: [number, number]
  title: string
  description: string
  type: 'photo' | 'article' | 'moment' | 'milestone'
  thumbnail?: string
  date: string
  content?: any
}

interface MapPath {
  id: string
  name: string
  coordinates: [number, number][]
  markers: MapMarker[]
  distance: number
  duration: number
  description: string
  color?: string
}

interface MarkerCluster {
  id: string
  center: [number, number]
  count: number
  markers: MapMarker[]
}

interface Props {
  markers: MapMarker[]
  paths?: MapPath[]
  theme?: 'light' | 'dark'
  activeMarker?: string
  showClusters?: boolean
}

interface Emits {
  markerClick: [marker: MapMarker]
  pathClick: [path: MapPath]
  clusterClick: [cluster: MarkerCluster]
  themeChange: [theme: string]
  clustersToggle: [show: boolean]
}

const props = withDefaults(defineProps<Props>(), {
  paths: () => [],
  theme: 'dark',
  activeMarker: '',
  showClusters: true,
})

const emit = defineEmits<Emits>()

// 响应式状态
const mapContainer = ref<HTMLElement>()
const zoom = ref(1)
const center = ref([0, 0])
const previewMarker = ref<MapMarker | null>(null)
const previewPosition = ref<any>(null)
const activeCluster = ref<MarkerCluster | null>(null)
const clusterPopoverPosition = ref<any>(null)
const activePathId = ref<string>('')
const replayMode = ref(false)
const replayPlaying = ref(false)
const replaySpeed = ref(1)

// 配置数据
const markerTypes = {
  photo: { color: '#10b981', icon: 'heroicons:photo', label: '照片' },
  article: { color: '#3b82f6', icon: 'heroicons:document-text', label: '文章' },
  moment: {
    color: '#f59e0b',
    icon: 'heroicons:chat-bubble-left',
    label: '说说',
  },
  milestone: { color: '#ef4444', icon: 'heroicons:flag', label: '里程碑' },
}

// 计算属性
const mapThemeClass = computed(() => ({
  'map-light': props.theme === 'light',
  'map-dark': props.theme === 'dark',
}))

const visibleMarkers = computed(() => {
  if (props.showClusters) {
    // 返回非聚合的标记
    return props.markers.filter((marker) => !isMarkerClustered(marker))
  }
  return props.markers
})

const visiblePaths = computed(() => {
  return props.paths.filter((path) => path.coordinates.length > 1)
})

const clusters = computed(() => {
  if (!props.showClusters) return []

  // 简化的聚合算法
  const clustered: MarkerCluster[] = []
  const processed = new Set<string>()

  props.markers.forEach((marker) => {
    if (processed.has(marker.id)) return

    const nearby = props.markers.filter((m) => {
      if (processed.has(m.id) || m.id === marker.id) return false
      const distance = getDistance(marker.coordinates, m.coordinates)
      return distance < 5 // 5% 的距离阈值
    })

    if (nearby.length > 0) {
      const allMarkers = [marker, ...nearby]
      const center = getCenterPoint(allMarkers.map((m) => m.coordinates))

      clustered.push({
        id: `cluster-${marker.id}`,
        center,
        count: allMarkers.length,
        markers: allMarkers,
      })

      allMarkers.forEach((m) => processed.add(m.id))
    }
  })

  return clustered
})

const scaleText = computed(() => {
  const scale = Math.round(100 / zoom.value)
  return `${scale}km`
})

// 方法
const getMarkerPosition = (coordinates: [number, number]) => {
  const [lng, lat] = coordinates
  const x = ((lng + 180) / 360) * 100
  const y = ((90 - lat) / 180) * 100

  return {
    left: `${x}%`,
    top: `${y}%`,
  }
}

const getMarkerColor = (type: string) => {
  return markerTypes[type as keyof typeof markerTypes]?.color || '#6b7280'
}

const getMarkerIcon = (type: string) => {
  return (
    markerTypes[type as keyof typeof markerTypes]?.icon || 'heroicons:map-pin'
  )
}

const getMarkerTypeLabel = (type: string) => {
  return markerTypes[type as keyof typeof markerTypes]?.label || type
}

const getMarkerSizeClass = (type: string) => {
  const sizes = {
    milestone: 'w-8 h-8',
    article: 'w-7 h-7',
    photo: 'w-6 h-6',
    moment: 'w-5 h-5',
  }
  return sizes[type as keyof typeof sizes] || 'w-6 h-6'
}

const getPathData = (path: MapPath) => {
  if (path.coordinates.length < 2) return ''

  const points = path.coordinates.map(([lng, lat]) => {
    const x = ((lng + 180) / 360) * 100
    const y = ((90 - lat) / 180) * 100
    return `${x},${y}`
  })

  return `M ${points.join(' L ')}`
}

const getPathById = (id: string) => {
  return props.paths.find((path) => path.id === id)
}

const isMarkerClustered = (marker: MapMarker) => {
  return clusters.value.some((cluster) =>
    cluster.markers.some((m) => m.id === marker.id)
  )
}

const getDistance = (coord1: [number, number], coord2: [number, number]) => {
  const [lng1, lat1] = coord1
  const [lng2, lat2] = coord2
  return Math.sqrt(Math.pow(lng2 - lng1, 2) + Math.pow(lat2 - lat1, 2))
}

const getCenterPoint = (coordinates: [number, number][]) => {
  const avgLng =
    coordinates.reduce((sum, [lng]) => sum + lng, 0) / coordinates.length
  const avgLat =
    coordinates.reduce((sum, [, lat]) => sum + lat, 0) / coordinates.length
  return [avgLng, avgLat] as [number, number]
}

// 事件处理
const handleMarkerClick = (marker: MapMarker) => {
  emit('markerClick', marker)
}

const handlePathClick = (path: MapPath) => {
  activePathId.value = path.id
  emit('pathClick', path)
}

const handleClusterClick = (cluster: MarkerCluster) => {
  activeCluster.value = cluster

  const rect = mapContainer.value?.getBoundingClientRect()
  if (rect) {
    const position = getMarkerPosition(cluster.center)
    clusterPopoverPosition.value = {
      left: `${parseFloat(position.left)}%`,
      top: `${parseFloat(position.top)}%`,
    }
  }

  emit('clusterClick', cluster)
}

const showMarkerPreview = (marker: MapMarker, event: MouseEvent) => {
  previewMarker.value = marker

  const rect = mapContainer.value?.getBoundingClientRect()
  if (rect) {
    previewPosition.value = {
      left: `${event.clientX - rect.left + 10}px`,
      top: `${event.clientY - rect.top - 10}px`,
    }
  }
}

const hideMarkerPreview = () => {
  previewMarker.value = null
  previewPosition.value = null
}

const closeClusterPopover = () => {
  activeCluster.value = null
  clusterPopoverPosition.value = null
}

const zoomIn = () => {
  zoom.value = Math.min(zoom.value * 1.5, 5)
}

const zoomOut = () => {
  zoom.value = Math.max(zoom.value / 1.5, 0.5)
}

const fitBounds = () => {
  zoom.value = 1
  center.value = [0, 0]
}

const toggleTheme = () => {
  const newTheme = props.theme === 'dark' ? 'light' : 'dark'
  emit('themeChange', newTheme)
}

const toggleClusters = () => {
  emit('clustersToggle', !props.showClusters)
}

const toggleReplay = () => {
  replayPlaying.value = !replayPlaying.value
}

const setReplaySpeed = (speed: number) => {
  replaySpeed.value = speed
}

const setReplayPosition = (position: number) => {
  // 实现回放位置设置
}

const closeReplay = () => {
  replayMode.value = false
  replayPlaying.value = false
  activePathId.value = ''
}

const formatMarkerDate = (date: string) => {
  const d = new Date(date)
  return d.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
  })
}

const getMarkerTypeColor = (type: string) => {
  const typeColors = {
    photo: '#34d399',
    article: '#60a5fa',
    moment: '#fbbf24',
    milestone: '#f87171',
  }
  return typeColors[type as keyof typeof typeColors] || '#9ca3af'
}
</script>

<style scoped>
/* 地图主题 */
.map-dark {
  filter: brightness(0.8) contrast(1.2);
}

.map-light {
  filter: brightness(1.2) contrast(0.9) hue-rotate(15deg);
}

/* 网格背景 */
.map-grid {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
}

/* 路径动画 */
.path-line {
  stroke-dasharray: 5, 5;
  animation: pathFlow 3s linear infinite;
  transition: all 0.3s ease;
}

.path-line:hover,
.path-line.path-active {
  stroke-width: 1;
  stroke-dasharray: 8, 8;
  animation-duration: 2s;
}

@keyframes pathFlow {
  0% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: 20;
  }
}

/* 标记动画 */
.marker-dot {
  transition: all 0.2s ease;
}

.marker-normal {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.marker-active {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  animation: markerPulse 2s ease-in-out infinite;
}

@keyframes markerPulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

/* 聚合标记动画 */
.cluster-marker {
  animation: clusterBounce 0.45s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes clusterBounce {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0;
  }
  60% {
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
}

/* 文本截断 */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .marker-label {
    display: none;
  }

  .absolute.top-4.right-4 {
    top: 1rem;
    right: 1rem;
  }

  .absolute.bottom-4.left-4 {
    bottom: 1rem;
    left: 1rem;
  }
}
</style>
