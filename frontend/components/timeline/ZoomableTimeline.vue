<!--
  ZoomableTimeline.vue - 可缩放时间轴组件
  
  Props:
  - events: TimelineEvent[] - 时间轴事件数组
  - zoomLevel: 'year' | 'month' | 'day' - 缩放级别
  - playMode: boolean - 播放模式
  - activeTrack: string[] - 激活的轨道类型
  
  Mock Data Structure:
  interface TimelineEvent {
    id: string
    title: string
    description: string
    date: string
    type: 'article' | 'photo' | 'moment' | 'milestone'
    content?: any
    location?: string
    tags: string[]
    mood?: string
    track: string
  }
-->

<template>
  <div
    class="zoomable-timeline relative w-full h-full bg-gradient-to-br from-bg-primary to-bg-secondary overflow-hidden"
  >
    <!-- 优化后的时间轴控制栏 -->
    <div
      class="timeline-controls absolute top-0 left-0 right-0 z-20 bg-gradient-to-r from-glass-bg/95 to-glass-bg/90 backdrop-blur-xl border-b border-glass-border shadow-glass-lg"
    >
      <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <!-- 左侧控制组 -->
          <div class="flex items-center space-x-6">
            <!-- 缩放控制 - 改进设计 -->
            <div class="flex items-center space-x-3">
              <div class="flex items-center space-x-2">
                <Icon
                  name="heroicons:magnifying-glass"
                  class="w-4 h-4 text-white/60"
                />
                <span class="text-white/80 text-sm font-medium">视图</span>
              </div>
              <div
                class="flex items-center bg-white/10 backdrop-blur-md rounded-xl p-1 border border-white/20 shadow-inner"
              >
                <button
                  v-for="level in zoomLevels"
                  :key="level.value"
                  @click="setZoomLevel(level.value)"
                  class="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 hover:scale-105"
                  :class="[
                    zoomLevel === level.value
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg transform scale-105'
                      : 'text-white/70 hover:text-white hover:bg-white/10',
                  ]"
                >
                  {{ level.label }}
                </button>
              </div>
            </div>

            <!-- 播放控制 - 改进设计 -->
            <div class="flex items-center space-x-3">
              <button
                @click="togglePlayMode"
                class="group relative w-12 h-12 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 backdrop-blur-md border border-primary-400/30 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary-500/25"
                :class="{
                  'bg-gradient-to-br from-primary-500/40 to-secondary-500/40 border-primary-400/50 shadow-lg shadow-primary-500/20':
                    playMode,
                }"
              >
                <Icon
                  :name="playMode ? 'heroicons:pause' : 'heroicons:play'"
                  class="w-6 h-6 transition-all duration-300"
                  :class="
                    playMode
                      ? 'text-primary-300'
                      : 'text-white/80 group-hover:text-white'
                  "
                />
                <div
                  class="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
              </button>

              <button
                @click="resetTimeline"
                class="group w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
                title="重置时间轴"
              >
                <Icon
                  name="heroicons:arrow-path"
                  class="w-5 h-5 transition-transform duration-300 group-hover:rotate-180"
                />
              </button>
            </div>
          </div>

          <!-- 中央时间范围显示 - 改进设计 -->
          <div
            class="text-center bg-white/5 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/10"
          >
            <div class="text-white font-bold text-lg mb-1">
              {{ formatTimeRange() }}
            </div>
            <div
              class="flex items-center justify-center space-x-2 text-white/60 text-sm"
            >
              <Icon name="heroicons:calendar-days" class="w-4 h-4" />
              <span>{{ filteredEvents.length }} 个事件</span>
            </div>
          </div>

          <!-- 右侧轨道过滤 - 改进设计 -->
          <div class="flex items-center space-x-3">
            <div class="flex items-center space-x-2">
              <Icon name="heroicons:funnel" class="w-4 h-4 text-white/60" />
              <span class="text-white/80 text-sm font-medium">筛选</span>
            </div>
            <TrackFilter
              :tracks="availableTracks"
              :active-tracks="activeTrack"
              :layout="'horizontal'"
              :show-batch-actions="false"
              :show-descriptions="false"
              @track-toggle="handleTrackToggle"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 主时间轴区域 -->
    <div class="timeline-main absolute inset-0 pt-20" ref="timelineContainer">
      <!-- 时间刻度 -->
      <div
        class="timeline-scale absolute top-0 left-0 right-0 h-16 bg-glass-bg/50 backdrop-blur-sm border-b border-glass-border"
      >
        <div class="relative h-full" ref="scaleContainer">
          <!-- 时间刻度标记 -->
          <div
            v-for="mark in timeMarks"
            :key="mark.id"
            class="absolute top-0 bottom-0 flex flex-col justify-center border-l border-white/20"
            :style="{ left: `${mark.position}%` }"
          >
            <div class="text-white/80 text-xs font-medium px-2">
              {{ mark.label }}
            </div>
            <div v-if="mark.sublabel" class="text-white/50 text-xs px-2">
              {{ mark.sublabel }}
            </div>
          </div>
        </div>
      </div>

      <!-- 播放头 -->
      <PlayHead
        v-if="playMode"
        :position="playheadPosition"
        :playing="isPlaying"
        :duration="playDuration"
        @position-change="handlePlayheadChange"
        @play-pause="handlePlayPause"
      />

      <!-- 事件轨道 -->
      <div
        class="timeline-tracks absolute top-16 left-0 right-0 bottom-0 overflow-y-auto"
      >
        <div
          v-for="track in visibleTracks"
          :key="track.type"
          class="track-row group relative h-28 border-b border-white/5 hover:border-white/20 transition-all duration-300"
          :class="`track-${track.type}`"
        >
          <!-- 优化后的轨道标签 -->
          <div
            class="track-label absolute left-0 top-0 bottom-0 w-36 bg-gradient-to-r from-glass-bg/90 to-glass-bg/70 backdrop-blur-xl border-r border-glass-border flex items-center px-5 z-10 group-hover:from-glass-bg/95 group-hover:to-glass-bg/80 transition-all duration-300"
          >
            <div class="flex items-center space-x-3">
              <!-- 轨道图标和颜色指示器 -->
              <div class="relative">
                <div
                  class="w-4 h-4 rounded-full border-2 border-white/30 transition-all duration-300 group-hover:scale-110"
                  :style="{ backgroundColor: track.color }"
                />
                <div
                  class="absolute inset-0 rounded-full animate-pulse opacity-0 group-hover:opacity-50 transition-opacity duration-300"
                  :style="{ backgroundColor: track.color }"
                />
              </div>

              <!-- 轨道信息 -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-2">
                  <span class="text-white/90 text-sm font-semibold">{{
                    track.label
                  }}</span>
                  <div
                    class="px-2 py-0.5 bg-white/10 text-white/70 text-xs rounded-full border border-white/20 transition-all duration-300 group-hover:bg-white/20"
                  >
                    {{ track.events.length }}
                  </div>
                </div>
                <div class="text-white/50 text-xs mt-0.5">
                  {{ getTrackDescription(track.type) }}
                </div>
              </div>
            </div>
          </div>

          <!-- 优化后的轨道事件 -->
          <div class="track-events absolute left-36 top-0 right-0 bottom-0">
            <!-- 增强的热力图背景 -->
            <div class="heatmap-bg absolute inset-0 opacity-20">
              <div
                v-for="segment in track.heatmap"
                :key="segment.id"
                class="absolute top-0 bottom-0 bg-gradient-to-r from-transparent via-current to-transparent transition-all duration-500"
                :style="{
                  left: `${segment.start}%`,
                  width: `${segment.width}%`,
                  color: track.color,
                  opacity: segment.intensity,
                }"
              />
            </div>

            <!-- 优化后的事件点 -->
            <div
              v-for="event in track.events"
              :key="event.id"
              class="event-dot absolute top-1/2 -translate-y-1/2 cursor-pointer group"
              :style="{ left: `${getEventPosition(event.date)}%` }"
              @click="handleEventClick(event)"
              @mouseenter="showEventPreview(event, $event)"
              @mouseleave="hideEventPreview"
            >
              <!-- 增强的事件点设计 -->
              <div class="relative">
                <!-- 外圈光晕 -->
                <div
                  class="absolute inset-0 w-6 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 group-hover:opacity-30 transition-all duration-300 animate-pulse"
                  :style="{ backgroundColor: track.color }"
                />

                <!-- 主事件点 -->
                <div
                  class="w-5 h-5 rounded-full border-2 border-white shadow-lg transition-all duration-300 group-hover:scale-125 group-hover:shadow-xl relative z-10"
                  :style="{ backgroundColor: track.color }"
                  :class="{
                    'animate-playhead-pulse scale-125 shadow-xl':
                      playMode && isEventActive(event),
                    'ring-4 ring-primary-400/50 scale-110':
                      selectedEvent?.id === event.id,
                  }"
                >
                  <!-- 事件类型图标 -->
                  <div
                    class="absolute inset-0 flex items-center justify-center"
                  >
                    <Icon
                      :name="getEventTypeIcon(event.type)"
                      class="w-2.5 h-2.5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </div>
                </div>

                <!-- 激活状态的脉冲环 -->
                <div
                  v-if="selectedEvent?.id === event.id"
                  class="absolute inset-0 w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary-400 animate-ping"
                />
              </div>

              <!-- 事件连接线 -->
              <div
                v-if="event.duration"
                class="absolute top-1/2 left-3 h-1 bg-current opacity-40 rounded-full transition-all duration-300 group-hover:opacity-70"
                :style="{
                  width: `${getEventDuration(event)}px`,
                  backgroundColor: track.color,
                }"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 当前时间指示线 -->
      <div
        class="current-time-line absolute top-16 bottom-0 w-0.5 bg-accent-500 shadow-lg z-10 pointer-events-none"
        :style="{ left: `${getCurrentTimePosition()}%` }"
      >
        <div
          class="absolute -top-2 -left-2 w-4 h-4 bg-accent-500 rounded-full shadow-lg"
        />
      </div>
    </div>

    <!-- 事件预览卡片 -->
    <div
      v-if="previewEvent && previewPosition"
      class="event-preview absolute z-30 max-w-sm p-4 bg-black/90 backdrop-blur-md border border-white/20 rounded-lg shadow-2xl pointer-events-none"
      :style="previewPosition"
    >
      <div class="flex items-start space-x-3">
        <div
          class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
          :style="{ backgroundColor: getTrackColor(previewEvent.type) }"
        >
          <Icon
            :name="getTrackIcon(previewEvent.type)"
            class="w-4 h-4 text-white"
          />
        </div>

        <div class="flex-1 min-w-0">
          <h4 class="text-white font-medium text-sm mb-1 line-clamp-1">
            {{ previewEvent.title }}
          </h4>
          <p class="text-white/70 text-xs mb-2 line-clamp-2">
            {{ previewEvent.description }}
          </p>

          <div class="flex items-center justify-between text-white/50 text-xs">
            <span>{{ formatEventDate(previewEvent.date) }}</span>
            <span v-if="previewEvent.location">{{
              previewEvent.location
            }}</span>
          </div>

          <!-- 标签 -->
          <div
            v-if="previewEvent.tags.length > 0"
            class="flex flex-wrap gap-1 mt-2"
          >
            <span
              v-for="tag in previewEvent.tags.slice(0, 3)"
              :key="tag"
              class="px-2 py-0.5 bg-white/10 text-white/70 text-xs rounded-full"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 缩放手势提示 -->
    <div class="zoom-hint absolute bottom-4 right-4 text-white/50 text-xs">
      <div class="flex items-center space-x-2">
        <Icon name="heroicons:magnifying-glass" class="w-3 h-3" />
        <span>滚轮缩放 • 拖拽平移</span>
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
  content?: any
  location?: string
  tags: string[]
  mood?: string
  track: string
  duration?: number
}

interface Props {
  events: TimelineEvent[]
  zoomLevel?: 'year' | 'month' | 'day'
  playMode?: boolean
  activeTrack?: string[]
}

interface Emits {
  eventClick: [event: TimelineEvent]
  zoomLevelChange: [level: string]
  playModeChange: [playing: boolean]
  trackToggle: [track: string]
}

const props = withDefaults(defineProps<Props>(), {
  zoomLevel: 'month',
  playMode: false,
  activeTrack: () => ['article', 'photo', 'moment', 'milestone'],
})

const emit = defineEmits<Emits>()

// 响应式状态
const timelineContainer = ref<HTMLElement>()
const scaleContainer = ref<HTMLElement>()
const selectedEvent = ref<TimelineEvent | null>(null)
const previewEvent = ref<TimelineEvent | null>(null)
const previewPosition = ref<any>(null)
const playheadPosition = ref(0)
const isPlaying = ref(false)
const playDuration = ref(10000) // 10秒播放完整时间轴

// 配置数据
const zoomLevels = [
  { value: 'year', label: '年' },
  { value: 'month', label: '月' },
  { value: 'day', label: '日' },
]

const trackTypes = {
  article: { label: '文章', color: '#3b82f6', icon: 'heroicons:document-text' },
  photo: { label: '照片', color: '#10b981', icon: 'heroicons:photo' },
  moment: {
    label: '说说',
    color: '#f59e0b',
    icon: 'heroicons:chat-bubble-left',
  },
  milestone: { label: '里程碑', color: '#ef4444', icon: 'heroicons:flag' },
}

// 计算属性
const filteredEvents = computed(() => {
  return props.events.filter((event) => props.activeTrack.includes(event.type))
})

const availableTracks = computed(() => {
  return Object.entries(trackTypes).map(([type, config]) => ({
    type,
    ...config,
    count: props.events.filter((e) => e.type === type).length,
  }))
})

const visibleTracks = computed(() => {
  return availableTracks.value
    .filter((track) => props.activeTrack.includes(track.type))
    .map((track) => ({
      ...track,
      events: filteredEvents.value.filter((e) => e.type === track.type),
      heatmap: generateHeatmap(
        filteredEvents.value.filter((e) => e.type === track.type)
      ),
    }))
})

const timeMarks = computed(() => {
  // 根据缩放级别生成时间刻度
  const marks = []
  const now = new Date()
  const startDate = new Date(now.getFullYear() - 2, 0, 1)
  const endDate = new Date(now.getFullYear() + 1, 11, 31)

  if (props.zoomLevel === 'year') {
    for (
      let year = startDate.getFullYear();
      year <= endDate.getFullYear();
      year++
    ) {
      marks.push({
        id: `year-${year}`,
        position: getDatePosition(new Date(year, 0, 1)),
        label: `${year}年`,
        sublabel: '',
      })
    }
  } else if (props.zoomLevel === 'month') {
    for (
      let year = startDate.getFullYear();
      year <= endDate.getFullYear();
      year++
    ) {
      for (let month = 0; month < 12; month++) {
        const date = new Date(year, month, 1)
        if (date >= startDate && date <= endDate) {
          marks.push({
            id: `month-${year}-${month}`,
            position: getDatePosition(date),
            label: `${month + 1}月`,
            sublabel: year === now.getFullYear() ? '' : `${year}`,
          })
        }
      }
    }
  }

  return marks
})

// 方法
const setZoomLevel = (level: string) => {
  emit('zoomLevelChange', level)
}

const togglePlayMode = () => {
  emit('playModeChange', !props.playMode)
}

const resetTimeline = () => {
  playheadPosition.value = 0
  selectedEvent.value = null
  isPlaying.value = false
}

const handleTrackToggle = (track: string) => {
  emit('trackToggle', track)
}

const handleEventClick = (event: TimelineEvent) => {
  selectedEvent.value = event
  emit('eventClick', event)
}

const handlePlayheadChange = (position: number) => {
  playheadPosition.value = position
}

const handlePlayPause = () => {
  isPlaying.value = !isPlaying.value
}

const getEventPosition = (date: string) => {
  return getDatePosition(new Date(date))
}

const getDatePosition = (date: Date) => {
  const now = new Date()
  const startDate = new Date(now.getFullYear() - 2, 0, 1)
  const endDate = new Date(now.getFullYear() + 1, 11, 31)

  const totalTime = endDate.getTime() - startDate.getTime()
  const eventTime = date.getTime() - startDate.getTime()

  return Math.max(0, Math.min(100, (eventTime / totalTime) * 100))
}

const getCurrentTimePosition = () => {
  return getDatePosition(new Date())
}

const getEventDuration = (event: TimelineEvent) => {
  if (!event.duration) return 0
  // 简化的持续时间计算
  return Math.min(event.duration * 2, 100)
}

const isEventActive = (event: TimelineEvent) => {
  // 检查事件是否在播放头位置附近
  const eventPos = getEventPosition(event.date)
  return Math.abs(eventPos - playheadPosition.value) < 2
}

const generateHeatmap = (events: TimelineEvent[]) => {
  // 生成热力图数据
  const segments = []
  const segmentCount = 50

  for (let i = 0; i < segmentCount; i++) {
    const start = (i / segmentCount) * 100
    const width = (1 / segmentCount) * 100
    const eventsInSegment = events.filter((event) => {
      const pos = getEventPosition(event.date)
      return pos >= start && pos < start + width
    })

    if (eventsInSegment.length > 0) {
      segments.push({
        id: `segment-${i}`,
        start,
        width,
        intensity: Math.min(eventsInSegment.length / 5, 1),
      })
    }
  }

  return segments
}

const showEventPreview = (event: TimelineEvent, mouseEvent: MouseEvent) => {
  previewEvent.value = event

  const rect = timelineContainer.value?.getBoundingClientRect()
  if (rect) {
    previewPosition.value = {
      left: `${mouseEvent.clientX - rect.left + 10}px`,
      top: `${mouseEvent.clientY - rect.top - 10}px`,
    }
  }
}

const hideEventPreview = () => {
  previewEvent.value = null
  previewPosition.value = null
}

const getTrackColor = (type: string) => {
  return trackTypes[type as keyof typeof trackTypes]?.color || '#6b7280'
}

const getTrackIcon = (type: string) => {
  return trackTypes[type as keyof typeof trackTypes]?.icon || 'heroicons:circle'
}

const formatTimeRange = () => {
  const now = new Date()
  if (props.zoomLevel === 'year') {
    return `${now.getFullYear() - 2} - ${now.getFullYear() + 1}`
  } else if (props.zoomLevel === 'month') {
    return `${now.getFullYear()}年`
  } else {
    return `${now.getFullYear()}年${now.getMonth() + 1}月`
  }
}

const formatEventDate = (date: string) => {
  const d = new Date(date)
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// 新增的辅助方法
const getTrackDescription = (type: string) => {
  const descriptions = {
    article: '文章和博客内容',
    photo: '照片和图片记录',
    moment: '生活动态和想法',
    milestone: '重要成就和里程碑',
  }
  return descriptions[type as keyof typeof descriptions] || '其他内容'
}

const getEventTypeIcon = (type: string) => {
  return trackTypes[type as keyof typeof trackTypes]?.icon || 'heroicons:circle'
}
</script>

<style scoped>
/* 轨道样式 */
.track-article {
  border-left: 4px solid #3b82f6;
}
.track-photo {
  border-left: 4px solid #10b981;
}
.track-moment {
  border-left: 4px solid #f59e0b;
}
.track-milestone {
  border-left: 4px solid #ef4444;
}

/* 事件点动画 */
.event-dot {
  transition: all 0.2s ease;
}

.event-dot:hover {
  z-index: 10;
}

/* 热力图动画 */
.heatmap-bg {
  animation: heatmapPulse 3s ease-in-out infinite;
}

@keyframes heatmapPulse {
  0%,
  100% {
    opacity: 0.2;
  }
  50% {
    opacity: 0.4;
  }
}

/* 滚动条样式 */
.timeline-tracks::-webkit-scrollbar {
  width: 6px;
}

.timeline-tracks::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.timeline-tracks::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.timeline-tracks::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
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
  .track-label {
    width: 80px;
  }

  .track-events {
    left: 80px;
  }

  .timeline-controls {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
