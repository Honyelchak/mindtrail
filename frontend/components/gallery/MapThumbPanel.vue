<!--
  MapThumbPanel.vue - 地图缩略图面板组件
  
  Props:
  - locations: Location[] - 位置数组
  - activeLocation: string - 当前激活的位置
  - route: Route - 路线数据
  - mapStyle: 'light' | 'dark' - 地图样式
  
  Features:
  - 小地图显示
  - 位置标记点击
  - 路线轨迹显示
  - 滚动到对应照片
-->

<template>
  <div class="map-thumb-panel h-full flex flex-col">
    <!-- 面板头部 -->
    <header class="panel-header p-4 border-b border-glass-border">
      <div class="flex items-center justify-between">
        <h3 class="text-white font-medium">位置导航</h3>
        <div class="flex items-center space-x-2">
          <button
            @click="toggleMapStyle"
            class="w-8 h-8 bg-glass-bg backdrop-blur-sm border border-glass-border rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
            :title="mapStyle === 'dark' ? '切换到亮色' : '切换到暗色'"
          >
            <Icon :name="mapStyle === 'dark' ? 'heroicons:sun' : 'heroicons:moon'" class="w-4 h-4" />
          </button>
          
          <button
            @click="fitBounds"
            class="w-8 h-8 bg-glass-bg backdrop-blur-sm border border-glass-border rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
            title="适应边界"
          >
            <Icon name="heroicons:arrows-pointing-out" class="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>

    <!-- 地图容器 -->
    <div class="map-container flex-1 relative">
      <div
        ref="mapContainer"
        class="absolute inset-0 rounded-lg overflow-hidden"
        :class="mapStyle === 'dark' ? 'map-dark' : 'map-light'"
      >
        <!-- 模拟地图背景 -->
        <div class="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900">
          <!-- 网格线 -->
          <div class="absolute inset-0 opacity-20">
            <div class="grid-lines"></div>
          </div>
          
          <!-- 路线轨迹 -->
          <svg
            v-if="route && route.coordinates.length > 1"
            class="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              :d="getRoutePath()"
              stroke="url(#routeGradient)"
              stroke-width="0.5"
              fill="none"
              class="route-path"
            />
            
            <!-- 渐变定义 -->
            <defs>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:0.8" />
                <stop offset="50%" style="stop-color:#8b5cf6;stop-opacity:0.9" />
                <stop offset="100%" style="stop-color:#ec4899;stop-opacity:0.8" />
              </linearGradient>
            </defs>
          </svg>
          
          <!-- 位置标记 -->
          <div
            v-for="(location, index) in locations"
            :key="location.name"
            class="location-marker absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            :style="getMarkerPosition(location.coordinates)"
            @click="handleLocationClick(location)"
          >
            <!-- 标记点 -->
            <div
              class="marker-dot relative w-6 h-6 rounded-full border-2 border-white shadow-lg transition-all duration-200 hover:scale-125"
              :class="[
                location.name === activeLocation
                  ? 'bg-primary-500 ring-4 ring-primary-400/50 animate-pulse'
                  : 'bg-white/80 hover:bg-white'
              ]"
            >
              <!-- 照片缩略图 -->
              <div
                v-if="location.photo"
                class="absolute inset-0.5 rounded-full overflow-hidden"
              >
                <img
                  :src="location.photo.thumbnail"
                  :alt="location.name"
                  class="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              
              <!-- 激活指示器 -->
              <div
                v-if="location.name === activeLocation"
                class="absolute -inset-2 rounded-full border-2 border-primary-400 animate-ping"
              />
            </div>
            
            <!-- 标记标签 -->
            <div
              class="marker-label absolute top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black/80 backdrop-blur-sm text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
            >
              {{ location.name }}
            </div>
          </div>
        </div>
      </div>
      
      <!-- 地图控制 -->
      <div class="absolute top-4 right-4 flex flex-col space-y-2">
        <button
          @click="zoomIn"
          class="w-8 h-8 bg-black/60 backdrop-blur-sm border border-white/20 rounded text-white/80 hover:text-white hover:bg-black/80 transition-all duration-200 flex items-center justify-center"
        >
          <Icon name="heroicons:plus" class="w-4 h-4" />
        </button>
        
        <button
          @click="zoomOut"
          class="w-8 h-8 bg-black/60 backdrop-blur-sm border border-white/20 rounded text-white/80 hover:text-white hover:bg-black/80 transition-all duration-200 flex items-center justify-center"
        >
          <Icon name="heroicons:minus" class="w-4 h-4" />
        </button>
      </div>
      
      <!-- 比例尺 -->
      <div class="absolute bottom-4 left-4 text-white/60 text-xs">
        <div class="flex items-center space-x-2">
          <div class="w-12 h-0.5 bg-white/60"></div>
          <span>{{ scaleText }}</span>
        </div>
      </div>
    </div>

    <!-- 位置列表 -->
    <div class="locations-list p-4 border-t border-glass-border max-h-48 overflow-y-auto">
      <h4 class="text-white/80 font-medium text-sm mb-3">所有位置 ({{ locations.length }})</h4>
      <div class="space-y-2">
        <button
          v-for="(location, index) in locations"
          :key="location.name"
          @click="handleLocationClick(location)"
          class="w-full flex items-center space-x-3 p-2 rounded-lg transition-all duration-200 hover:bg-white/10"
          :class="[
            location.name === activeLocation
              ? 'bg-primary-500/20 border border-primary-400/50'
              : 'hover:bg-white/5'
          ]"
        >
          <!-- 位置缩略图 -->
          <div class="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden border border-white/20">
            <img
              v-if="location.photo"
              :src="location.photo.thumbnail"
              :alt="location.name"
              class="w-full h-full object-cover"
              loading="lazy"
            />
            <div v-else class="w-full h-full bg-white/20 flex items-center justify-center">
              <Icon name="heroicons:map-pin" class="w-4 h-4 text-white/60" />
            </div>
          </div>
          
          <!-- 位置信息 -->
          <div class="flex-1 text-left">
            <div class="text-white text-sm font-medium">{{ location.name }}</div>
            <div class="text-white/60 text-xs">
              {{ location.coordinates[0].toFixed(4) }}, {{ location.coordinates[1].toFixed(4) }}
            </div>
          </div>
          
          <!-- 激活指示器 -->
          <div
            v-if="location.name === activeLocation"
            class="flex-shrink-0 w-2 h-2 bg-primary-500 rounded-full"
          />
        </button>
      </div>
    </div>

    <!-- 路线信息 -->
    <div v-if="route" class="route-info p-4 border-t border-glass-border">
      <h4 class="text-white/80 font-medium text-sm mb-3">路线信息</h4>
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div class="text-center">
          <div class="text-white/60">总距离</div>
          <div class="text-white font-medium">{{ route.distance }}km</div>
        </div>
        <div class="text-center">
          <div class="text-white/60">用时</div>
          <div class="text-white font-medium">{{ formatDuration(route.duration) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Location {
  name: string
  coordinates: [number, number]
  photo?: {
    id: string
    thumbnail: string
    title: string
  }
}

interface Route {
  coordinates: [number, number][]
  distance: number
  duration: number
}

interface Props {
  locations: Location[]
  activeLocation?: string
  route?: Route
  mapStyle?: 'light' | 'dark'
}

interface Emits {
  locationClick: [location: Location]
  mapStyleChange: [style: string]
}

const props = withDefaults(defineProps<Props>(), {
  activeLocation: '',
  mapStyle: 'dark'
})

const emit = defineEmits<Emits>()

// 响应式状态
const mapContainer = ref<HTMLElement>()
const zoom = ref(1)
const center = ref([0, 0])
const internalMapStyle = ref(props.mapStyle)

// 计算属性
const mapStyle = computed({
  get: () => internalMapStyle.value,
  set: (value) => {
    internalMapStyle.value = value
    emit('mapStyleChange', value)
  }
})

const scaleText = computed(() => {
  const scale = Math.round(100 / zoom.value)
  return `${scale}km`
})

// 方法
const getMarkerPosition = (coordinates: [number, number]) => {
  // 简化的坐标转换，实际应用中需要使用真实的地图投影
  const [lng, lat] = coordinates
  const x = ((lng + 180) / 360) * 100
  const y = ((90 - lat) / 180) * 100
  
  return {
    left: `${x}%`,
    top: `${y}%`
  }
}

const getRoutePath = () => {
  if (!props.route || props.route.coordinates.length < 2) return ''
  
  const points = props.route.coordinates.map(([lng, lat]) => {
    const x = ((lng + 180) / 360) * 100
    const y = ((90 - lat) / 180) * 100
    return `${x},${y}`
  })
  
  return `M ${points.join(' L ')}`
}

const handleLocationClick = (location: Location) => {
  emit('locationClick', location)
}

const toggleMapStyle = () => {
  mapStyle.value = mapStyle.value === 'dark' ? 'light' : 'dark'
}

const zoomIn = () => {
  zoom.value = Math.min(zoom.value * 1.5, 5)
}

const zoomOut = () => {
  zoom.value = Math.max(zoom.value / 1.5, 0.5)
}

const fitBounds = () => {
  if (props.locations.length === 0) return
  
  // 计算边界并调整视图
  zoom.value = 1
  // 实际实现中应该计算所有位置的边界框
}

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  if (hours > 0) {
    return `${hours}h ${mins}m`
  }
  return `${mins}m`
}

// 监听 props 变化
watch(() => props.mapStyle, (newStyle) => {
  internalMapStyle.value = newStyle
})
</script>

<style scoped>
/* 地图样式 */
.map-dark {
  filter: brightness(0.8) contrast(1.2);
}

.map-light {
  filter: brightness(1.2) contrast(0.9);
}

/* 网格线 */
.grid-lines {
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
}

/* 路线路径动画 */
.route-path {
  stroke-dasharray: 5, 5;
  animation: routeFlow 3s linear infinite;
}

@keyframes routeFlow {
  0% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: 20;
  }
}

/* 位置标记动画 */
.location-marker {
  transition: all 0.2s ease;
}

.location-marker:hover {
  z-index: 10;
}

.marker-dot {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

/* 自定义滚动条 */
.locations-list::-webkit-scrollbar {
  width: 4px;
}

.locations-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.locations-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.locations-list::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .locations-list {
    max-height: 120px;
  }
}
</style>
