<!--
  PlayHead.vue - 时间轴播放头组件
  
  Props:
  - position: number - 播放头位置 (0-100)
  - playing: boolean - 是否正在播放
  - duration: number - 播放总时长 (毫秒)
  - speed: number - 播放速度倍数
  
  Features:
  - 播放头拖拽控制
  - 播放/暂停切换
  - 播放速度调节
  - 自动播放动画
-->

<template>
  <div class="playhead-container absolute top-16 left-0 right-0 bottom-0 pointer-events-none z-15">
    <!-- 播放头线条 -->
    <div
      class="playhead-line absolute top-0 bottom-0 w-0.5 bg-accent-500 shadow-lg pointer-events-auto cursor-ew-resize"
      :style="{ left: `${position}%` }"
      @mousedown="handleMouseDown"
    >
      <!-- 播放头指示器 -->
      <div class="playhead-indicator absolute -top-2 -left-3 w-6 h-6 bg-accent-500 rounded-full shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing">
        <div
          class="w-3 h-3 bg-white rounded-full transition-all duration-200"
          :class="{ 'animate-playhead-pulse': playing }"
        />
      </div>
      
      <!-- 播放头标签 -->
      <div class="playhead-label absolute -top-12 -left-8 px-3 py-1 bg-black/80 backdrop-blur-sm text-white text-xs rounded-lg whitespace-nowrap">
        {{ formatTime(currentTime) }}
      </div>
    </div>

    <!-- 播放控制面板 -->
    <div
      class="playhead-controls absolute bottom-4 left-1/2 -translate-x-1/2 bg-glass-bg/90 backdrop-blur-md border border-glass-border rounded-2xl p-4 shadow-glass-lg pointer-events-auto"
      :class="{ 'opacity-0 pointer-events-none': !showControls }"
    >
      <div class="flex items-center space-x-4">
        <!-- 播放/暂停按钮 -->
        <button
          @click="togglePlayPause"
          class="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 hover:scale-105"
        >
          <Icon
            :name="playing ? 'heroicons:pause' : 'heroicons:play'"
            class="w-6 h-6"
            :class="{ 'ml-0.5': !playing }"
          />
        </button>
        
        <!-- 播放进度条 -->
        <div class="flex-1 min-w-48">
          <div class="flex items-center justify-between mb-2">
            <span class="text-white/70 text-xs">播放进度</span>
            <span class="text-white/70 text-xs">{{ Math.round(position) }}%</span>
          </div>
          
          <div
            class="relative h-2 bg-white/20 rounded-full cursor-pointer"
            @click="handleProgressClick"
            ref="progressBar"
          >
            <div
              class="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-200"
              :style="{ width: `${position}%` }"
            />
            
            <!-- 进度点 -->
            <div
              class="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg cursor-grab active:cursor-grabbing transition-all duration-200 hover:scale-110"
              :style="{ left: `calc(${position}% - 8px)` }"
              @mousedown="handleProgressMouseDown"
            />
          </div>
        </div>
        
        <!-- 播放速度控制 -->
        <div class="flex items-center space-x-2">
          <span class="text-white/70 text-xs">速度:</span>
          <div class="flex items-center bg-white/10 rounded-lg p-1">
            <button
              v-for="speedOption in speedOptions"
              :key="speedOption"
              @click="setSpeed(speedOption)"
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
        
        <!-- 时间显示 -->
        <div class="text-white/70 text-sm font-mono">
          {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
        </div>
        
        <!-- 关闭按钮 -->
        <button
          @click="$emit('close')"
          class="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-all duration-200"
        >
          <Icon name="heroicons:x-mark" class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- 播放状态指示器 -->
    <div
      v-if="playing"
      class="play-indicator absolute top-4 right-4 flex items-center space-x-2 bg-black/60 backdrop-blur-sm px-3 py-2 rounded-full text-white text-sm pointer-events-auto"
    >
      <div class="w-2 h-2 bg-accent-500 rounded-full animate-pulse" />
      <span>正在播放</span>
      <span class="text-white/60">{{ speed }}x</span>
    </div>

    <!-- 事件弹出卡片 -->
    <div
      v-if="activeEvent"
      class="event-popup absolute pointer-events-auto"
      :style="eventPopupStyle"
    >
      <div class="bg-black/90 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-2xl max-w-sm">
        <div class="flex items-start space-x-3">
          <div
            class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
            :style="{ backgroundColor: getEventColor(activeEvent.type) }"
          >
            <Icon :name="getEventIcon(activeEvent.type)" class="w-5 h-5 text-white" />
          </div>
          
          <div class="flex-1 min-w-0">
            <h4 class="text-white font-medium mb-1">{{ activeEvent.title }}</h4>
            <p class="text-white/70 text-sm mb-2 line-clamp-2">{{ activeEvent.description }}</p>
            
            <div class="flex items-center justify-between text-white/50 text-xs">
              <span>{{ formatEventDate(activeEvent.date) }}</span>
              <span v-if="activeEvent.location">{{ activeEvent.location }}</span>
            </div>
            
            <!-- 情绪标识 -->
            <div v-if="activeEvent.mood" class="flex items-center space-x-2 mt-2">
              <div
                class="w-4 h-4 rounded-full"
                :style="{ backgroundColor: getMoodColor(activeEvent.mood) }"
              />
              <span class="text-white/60 text-xs">{{ getMoodLabel(activeEvent.mood) }}</span>
            </div>
            
            <!-- 操作按钮 -->
            <div class="flex items-center space-x-2 mt-3">
              <button
                @click="$emit('eventClick', activeEvent)"
                class="px-3 py-1 bg-primary-500/20 hover:bg-primary-500/30 text-primary-300 text-xs rounded-full transition-colors duration-200"
              >
                查看详情
              </button>
              
              <button
                @click="pauseAtEvent"
                class="px-3 py-1 bg-white/10 hover:bg-white/20 text-white/70 text-xs rounded-full transition-colors duration-200"
              >
                暂停播放
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface TimelineEvent {
  id: string
  title: string
  description: string
  date: string
  type: 'article' | 'photo' | 'moment' | 'milestone'
  location?: string
  mood?: string
}

interface Props {
  position: number
  playing?: boolean
  duration?: number
  speed?: number
  events?: TimelineEvent[]
}

interface Emits {
  positionChange: [position: number]
  playPause: []
  speedChange: [speed: number]
  eventClick: [event: TimelineEvent]
  close: []
}

const props = withDefaults(defineProps<Props>(), {
  playing: false,
  duration: 10000,
  speed: 1,
  events: () => []
})

const emit = defineEmits<Emits>()

// 响应式状态
const showControls = ref(true)
const isDragging = ref(false)
const progressBar = ref<HTMLElement>()
const activeEvent = ref<TimelineEvent | null>(null)
const animationId = ref<number>()

// 配置数据
const speedOptions = [0.5, 1, 1.5, 2, 3]

const eventTypes = {
  article: { color: '#3b82f6', icon: 'heroicons:document-text' },
  photo: { color: '#10b981', icon: 'heroicons:photo' },
  moment: { color: '#f59e0b', icon: 'heroicons:chat-bubble-left' },
  milestone: { color: '#ef4444', icon: 'heroicons:flag' }
}

const moodColors = {
  happy: '#fbbf24',
  excited: '#f472b6',
  calm: '#34d399',
  thinking: '#a78bfa',
  love: '#fb7185',
  sad: '#60a5fa',
  angry: '#f87171',
  tired: '#9ca3af'
}

const moodLabels = {
  happy: '开心',
  excited: '兴奋',
  calm: '平静',
  thinking: '思考',
  love: '爱意',
  sad: '难过',
  angry: '愤怒',
  tired: '疲惫'
}

// 计算属性
const currentTime = computed(() => {
  return (props.position / 100) * props.duration
})

const eventPopupStyle = computed(() => {
  if (!activeEvent.value) return {}
  
  return {
    left: `${props.position}%`,
    top: '50%',
    transform: 'translate(-50%, -50%)'
  }
})

// 方法
const togglePlayPause = () => {
  emit('playPause')
}

const setSpeed = (newSpeed: number) => {
  emit('speedChange', newSpeed)
}

const handleMouseDown = (event: MouseEvent) => {
  isDragging.value = true
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
  event.preventDefault()
}

const handleMouseMove = (event: MouseEvent) => {
  if (!isDragging.value) return
  
  const container = document.querySelector('.zoomable-timeline')
  if (!container) return
  
  const rect = container.getBoundingClientRect()
  const newPosition = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100))
  
  emit('positionChange', newPosition)
}

const handleMouseUp = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
}

const handleProgressClick = (event: MouseEvent) => {
  if (!progressBar.value) return
  
  const rect = progressBar.value.getBoundingClientRect()
  const newPosition = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100))
  
  emit('positionChange', newPosition)
}

const handleProgressMouseDown = (event: MouseEvent) => {
  event.stopPropagation()
  handleMouseDown(event)
}

const pauseAtEvent = () => {
  emit('playPause')
  activeEvent.value = null
}

const getEventColor = (type: string) => {
  return eventTypes[type as keyof typeof eventTypes]?.color || '#6b7280'
}

const getEventIcon = (type: string) => {
  return eventTypes[type as keyof typeof eventTypes]?.icon || 'heroicons:circle'
}

const getMoodColor = (mood: string) => {
  return moodColors[mood as keyof typeof moodColors] || '#6b7280'
}

const getMoodLabel = (mood: string) => {
  return moodLabels[mood as keyof typeof moodLabels] || mood
}

const formatTime = (milliseconds: number) => {
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const formatEventDate = (date: string) => {
  const d = new Date(date)
  return d.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 自动播放逻辑
const startAutoPlay = () => {
  if (!props.playing) return
  
  const animate = () => {
    if (!props.playing) return
    
    const increment = (props.speed / props.duration) * 100 * 16 // 60fps
    const newPosition = Math.min(100, props.position + increment)
    
    emit('positionChange', newPosition)
    
    // 检查是否有事件在当前位置
    checkEventsAtPosition(newPosition)
    
    if (newPosition < 100) {
      animationId.value = requestAnimationFrame(animate)
    }
  }
  
  animationId.value = requestAnimationFrame(animate)
}

const stopAutoPlay = () => {
  if (animationId.value) {
    cancelAnimationFrame(animationId.value)
    animationId.value = undefined
  }
}

const checkEventsAtPosition = (position: number) => {
  const tolerance = 2 // 2% 容差
  const currentEvent = props.events.find(event => {
    const eventPosition = getEventPosition(event.date)
    return Math.abs(eventPosition - position) < tolerance
  })
  
  if (currentEvent && currentEvent.id !== activeEvent.value?.id) {
    activeEvent.value = currentEvent
    
    // 3秒后自动隐藏事件卡片
    setTimeout(() => {
      if (activeEvent.value?.id === currentEvent.id) {
        activeEvent.value = null
      }
    }, 3000)
  }
}

const getEventPosition = (date: string) => {
  // 简化的位置计算，实际应该与时间轴组件保持一致
  const now = new Date()
  const startDate = new Date(now.getFullYear() - 2, 0, 1)
  const endDate = new Date(now.getFullYear() + 1, 11, 31)
  const eventDate = new Date(date)
  
  const totalTime = endDate.getTime() - startDate.getTime()
  const eventTime = eventDate.getTime() - startDate.getTime()
  
  return Math.max(0, Math.min(100, (eventTime / totalTime) * 100))
}

// 监听播放状态变化
watch(() => props.playing, (playing) => {
  if (playing) {
    startAutoPlay()
  } else {
    stopAutoPlay()
  }
}, { immediate: true })

// 组件卸载时清理动画
onUnmounted(() => {
  stopAutoPlay()
})

// 键盘快捷键
onMounted(() => {
  const handleKeydown = (event: KeyboardEvent) => {
    if (event.target instanceof HTMLInputElement) return
    
    switch (event.key) {
      case ' ':
        event.preventDefault()
        togglePlayPause()
        break
      case 'ArrowLeft':
        event.preventDefault()
        emit('positionChange', Math.max(0, props.position - 5))
        break
      case 'ArrowRight':
        event.preventDefault()
        emit('positionChange', Math.min(100, props.position + 5))
        break
      case '1':
      case '2':
      case '3':
        event.preventDefault()
        const speed = parseFloat(event.key)
        if (speedOptions.includes(speed)) {
          setSpeed(speed)
        }
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
/* 播放头动画 */
.playhead-indicator {
  transition: all 0.2s ease;
}

.playhead-indicator:hover {
  transform: scale(1.1);
}

/* 播放控制面板动画 */
.playhead-controls {
  transition: all 0.3s ease;
}

/* 事件弹出动画 */
.event-popup {
  animation: eventPopupIn 0.3s ease-out;
}

@keyframes eventPopupIn {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

/* 文本截断 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .playhead-controls {
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem;
  }
  
  .playhead-controls .flex-1 {
    min-width: auto;
    width: 100%;
  }
}
</style>
