<!--
  PathReplayController.vue - 路径回放控制器组件
  
  Props:
  - path: MapPath - 路径数据
  - playing: boolean - 是否正在播放
  - speed: number - 播放速度
  - position: number - 当前位置 (0-100)
  
  Features:
  - 路径回放控制
  - 播放速度调节
  - 进度条拖拽
  - 标记点跳转
  - 统计信息显示
-->

<template>
  <div class="path-replay-controller fixed bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
    <!-- 主控制面板 -->
    <div class="bg-glass-bg/95 backdrop-blur-md border border-glass-border rounded-2xl shadow-glass-lg overflow-hidden">
      <!-- 路径信息头部 -->
      <div class="p-4 border-b border-glass-border">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center"
              :style="{ backgroundColor: path.color || '#3b82f6' }"
            >
              <Icon name="heroicons:map" class="w-5 h-5 text-white" />
            </div>
            
            <div>
              <h4 class="text-white font-medium">{{ path.name }}</h4>
              <p class="text-white/60 text-sm">{{ path.description }}</p>
            </div>
          </div>
          
          <button
            @click="$emit('close')"
            class="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-all duration-200"
          >
            <Icon name="heroicons:x-mark" class="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <!-- 播放控制区域 -->
      <div class="p-4">
        <div class="flex items-center space-x-4">
          <!-- 播放/暂停按钮 -->
          <button
            @click="$emit('playPause')"
            class="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 hover:scale-105"
          >
            <Icon
              :name="playing ? 'heroicons:pause' : 'heroicons:play'"
              class="w-6 h-6"
              :class="{ 'ml-0.5': !playing }"
            />
          </button>
          
          <!-- 进度控制 -->
          <div class="flex-1 min-w-0">
            <!-- 进度信息 -->
            <div class="flex items-center justify-between mb-2">
              <span class="text-white/70 text-sm">回放进度</span>
              <div class="flex items-center space-x-2 text-white/60 text-sm">
                <span>{{ formatTime(currentTime) }}</span>
                <span>/</span>
                <span>{{ formatTime(totalTime) }}</span>
              </div>
            </div>
            
            <!-- 进度条 -->
            <div
              class="relative h-3 bg-white/20 rounded-full cursor-pointer group"
              @click="handleProgressClick"
              ref="progressBar"
            >
              <!-- 进度背景 -->
              <div
                class="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-200"
                :style="{ width: `${position}%` }"
              />
              
              <!-- 标记点 -->
              <div
                v-for="(marker, index) in path.markers"
                :key="marker.id"
                class="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border-2 border-primary-400 cursor-pointer hover:scale-125 transition-transform duration-200"
                :style="{ left: `${getMarkerPosition(index)}%` }"
                :title="marker.title"
                @click.stop="jumpToMarker(index)"
              />
              
              <!-- 播放头 */
              <div
                class="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full border-2 border-primary-500 shadow-lg cursor-grab active:cursor-grabbing transition-all duration-200 hover:scale-110"
                :style="{ left: `calc(${position}% - 10px)` }"
                @mousedown="handleProgressMouseDown"
              >
                <div class="absolute inset-1 bg-primary-500 rounded-full" />
              </div>
              
              <!-- 悬浮提示 -->
              <div
                v-if="hoverPosition !== null"
                class="absolute -top-8 bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none"
                :style="{ left: `${hoverPosition}%`, transform: 'translateX(-50%)' }"
              >
                {{ formatTime(getTimeAtPosition(hoverPosition)) }}
              </div>
            </div>
          </div>
          
          <!-- 播放速度控制 -->
          <div class="flex items-center space-x-2">
            <span class="text-white/70 text-sm">速度:</span>
            <div class="flex items-center bg-white/10 rounded-lg p-1">
              <button
                v-for="speedOption in speedOptions"
                :key="speedOption"
                @click="$emit('speedChange', speedOption)"
                class="px-2 py-1 text-xs rounded transition-all duration-200"
                :class="[
                  speed === speedOption
                    ? 'bg-primary-500 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                ]"
              >
                {{ speedOption }}x
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 路径统计信息 -->
      <div class="px-4 pb-4">
        <div class="grid grid-cols-4 gap-4 text-center">
          <div class="bg-white/5 rounded-lg p-3">
            <div class="text-white font-medium text-lg">{{ path.distance }}</div>
            <div class="text-white/60 text-xs">公里</div>
          </div>
          
          <div class="bg-white/5 rounded-lg p-3">
            <div class="text-white font-medium text-lg">{{ formatDuration(path.duration) }}</div>
            <div class="text-white/60 text-xs">用时</div>
          </div>
          
          <div class="bg-white/5 rounded-lg p-3">
            <div class="text-white font-medium text-lg">{{ path.markers.length }}</div>
            <div class="text-white/60 text-xs">标记点</div>
          </div>
          
          <div class="bg-white/5 rounded-lg p-3">
            <div class="text-white font-medium text-lg">{{ Math.round(averageSpeed) }}</div>
            <div class="text-white/60 text-xs">km/h</div>
          </div>
        </div>
      </div>
      
      <!-- 标记点列表 -->
      <div class="border-t border-glass-border">
        <div class="p-3">
          <div class="flex items-center justify-between mb-3">
            <span class="text-white/80 text-sm font-medium">路径标记</span>
            <button
              @click="showMarkersList = !showMarkersList"
              class="text-primary-400 hover:text-primary-300 text-xs transition-colors duration-200"
            >
              {{ showMarkersList ? '收起' : '展开' }}
            </button>
          </div>
          
          <div
            v-if="showMarkersList"
            class="space-y-2 max-h-32 overflow-y-auto"
          >
            <button
              v-for="(marker, index) in path.markers"
              :key="marker.id"
              @click="jumpToMarker(index)"
              class="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-all duration-200 group"
              :class="{ 'bg-primary-500/20': currentMarkerIndex === index }"
            >
              <div
                class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
                :style="{ backgroundColor: getMarkerColor(marker.type) }"
              >
                {{ index + 1 }}
              </div>
              
              <div class="flex-1 min-w-0 text-left">
                <div class="text-white text-sm font-medium line-clamp-1">{{ marker.title }}</div>
                <div class="text-white/60 text-xs line-clamp-1">{{ marker.description }}</div>
              </div>
              
              <div class="flex-shrink-0 text-white/40 group-hover:text-white/60 transition-colors duration-200">
                <Icon name="heroicons:chevron-right" class="w-4 h-4" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 播放状态指示器 -->
    <div
      v-if="playing"
      class="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm flex items-center space-x-2"
    >
      <div class="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
      <span>正在回放</span>
      <span class="text-white/60">{{ speed }}x</span>
    </div>
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

interface Props {
  path: MapPath
  playing?: boolean
  speed?: number
  position?: number
}

interface Emits {
  playPause: []
  speedChange: [speed: number]
  positionChange: [position: number]
  markerJump: [index: number]
  close: []
}

const props = withDefaults(defineProps<Props>(), {
  playing: false,
  speed: 1,
  position: 0
})

const emit = defineEmits<Emits>()

// 响应式状态
const progressBar = ref<HTMLElement>()
const showMarkersList = ref(false)
const hoverPosition = ref<number | null>(null)
const isDragging = ref(false)

// 配置数据
const speedOptions = [0.5, 1, 1.5, 2, 3]

const markerTypes = {
  photo: { color: '#10b981' },
  article: { color: '#3b82f6' },
  moment: { color: '#f59e0b' },
  milestone: { color: '#ef4444' }
}

// 计算属性
const totalTime = computed(() => props.path.duration * 60 * 1000) // 转换为毫秒

const currentTime = computed(() => (props.position / 100) * totalTime.value)

const currentMarkerIndex = computed(() => {
  const progress = props.position / 100
  const totalMarkers = props.path.markers.length
  return Math.floor(progress * totalMarkers)
})

const averageSpeed = computed(() => {
  if (props.path.duration === 0) return 0
  return (props.path.distance / (props.path.duration / 60))
})

// 方法
const getMarkerPosition = (index: number) => {
  const totalMarkers = props.path.markers.length
  if (totalMarkers <= 1) return 0
  return (index / (totalMarkers - 1)) * 100
}

const getMarkerColor = (type: string) => {
  return markerTypes[type as keyof typeof markerTypes]?.color || '#6b7280'
}

const jumpToMarker = (index: number) => {
  const position = getMarkerPosition(index)
  emit('positionChange', position)
  emit('markerJump', index)
}

const handleProgressClick = (event: MouseEvent) => {
  if (!progressBar.value) return
  
  const rect = progressBar.value.getBoundingClientRect()
  const position = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100))
  
  emit('positionChange', position)
}

const handleProgressMouseDown = (event: MouseEvent) => {
  isDragging.value = true
  document.addEventListener('mousemove', handleProgressMouseMove)
  document.addEventListener('mouseup', handleProgressMouseUp)
  event.preventDefault()
}

const handleProgressMouseMove = (event: MouseEvent) => {
  if (!isDragging.value || !progressBar.value) return
  
  const rect = progressBar.value.getBoundingClientRect()
  const position = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100))
  
  emit('positionChange', position)
}

const handleProgressMouseUp = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', handleProgressMouseMove)
  document.removeEventListener('mouseup', handleProgressMouseUp)
}

const getTimeAtPosition = (position: number) => {
  return (position / 100) * totalTime.value
}

const formatTime = (milliseconds: number) => {
  const totalSeconds = Math.floor(milliseconds / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  if (hours > 0) {
    return `${hours}h ${mins}m`
  }
  return `${mins}m`
}

// 进度条悬浮效果
onMounted(() => {
  const handleMouseMove = (event: MouseEvent) => {
    if (!progressBar.value) return
    
    const rect = progressBar.value.getBoundingClientRect()
    const isOverProgressBar = event.clientY >= rect.top && event.clientY <= rect.bottom &&
                             event.clientX >= rect.left && event.clientX <= rect.right
    
    if (isOverProgressBar) {
      hoverPosition.value = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100))
    } else {
      hoverPosition.value = null
    }
  }
  
  document.addEventListener('mousemove', handleMouseMove)
  
  onUnmounted(() => {
    document.removeEventListener('mousemove', handleMouseMove)
  })
})

// 键盘快捷键
onMounted(() => {
  const handleKeydown = (event: KeyboardEvent) => {
    if (event.target instanceof HTMLInputElement) return
    
    switch (event.key) {
      case ' ':
        event.preventDefault()
        emit('playPause')
        break
      case 'ArrowLeft':
        event.preventDefault()
        emit('positionChange', Math.max(0, props.position - 5))
        break
      case 'ArrowRight':
        event.preventDefault()
        emit('positionChange', Math.min(100, props.position + 5))
        break
      case 'Home':
        event.preventDefault()
        emit('positionChange', 0)
        break
      case 'End':
        event.preventDefault()
        emit('positionChange', 100)
        break
    }
  }
  
  document.addEventListener('keydown', handleKeydown)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })
})
</script>

<style scoped>
/* 进度条样式 */
.group:hover .absolute.-top-8 {
  opacity: 1;
}

/* 滚动条样式 */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* 文本截断 */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 播放头动画 */
.cursor-grab:active {
  cursor: grabbing;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .path-replay-controller {
    left: 1rem;
    right: 1rem;
    transform: none;
    max-width: none;
  }
  
  .grid-cols-4 {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }
  
  .flex.items-center.space-x-4 {
    flex-direction: column;
    space-x: 0;
    gap: 1rem;
    align-items: stretch;
  }
}
</style>
