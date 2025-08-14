<!--
  TrackFilter.vue - 轨道类型过滤器组件
  
  Props:
  - tracks: TrackType[] - 可用轨道类型
  - activeTracks: string[] - 激活的轨道类型
  - layout: 'horizontal' | 'vertical' - 布局方向
  
  Features:
  - 轨道类型切换
  - 批量操作 (全选/全不选)
  - 轨道统计显示
  - 颜色标识
-->

<template>
  <div class="track-filter" :class="layoutClass">
    <!-- 批量操作 -->
    <div v-if="showBatchActions" class="batch-actions mb-3">
      <div class="flex items-center space-x-2">
        <button
          @click="selectAll"
          class="text-xs text-primary-400 hover:text-primary-300 transition-colors duration-200"
        >
          全选
        </button>
        <span class="text-white/30">|</span>
        <button
          @click="selectNone"
          class="text-xs text-white/60 hover:text-white/80 transition-colors duration-200"
        >
          全不选
        </button>
        <span class="text-white/30">|</span>
        <button
          @click="invertSelection"
          class="text-xs text-white/60 hover:text-white/80 transition-colors duration-200"
        >
          反选
        </button>
      </div>
    </div>

    <!-- 轨道过滤器 -->
    <div class="track-toggles" :class="togglesClass">
      <button
        v-for="track in tracks"
        :key="track.type"
        @click="toggleTrack(track.type)"
        class="track-toggle group relative flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-white/10"
        :class="[
          isTrackActive(track.type)
            ? 'bg-white/10 border border-white/20'
            : 'border border-transparent hover:border-white/10',
        ]"
        :title="`${track.label} (${track.count} 个事件)`"
      >
        <!-- 轨道颜色指示器 -->
        <div class="relative">
          <div
            class="w-4 h-4 rounded-full border-2 border-white/30 transition-all duration-200"
            :style="{
              backgroundColor: isTrackActive(track.type)
                ? track.color
                : 'transparent',
            }"
          />

          <!-- 激活状态指示 -->
          <div
            v-if="isTrackActive(track.type)"
            class="absolute inset-0 rounded-full border-2 animate-pulse"
            :style="{ borderColor: track.color }"
          />
        </div>

        <!-- 轨道图标 -->
        <div
          class="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded transition-all duration-200"
          :style="{
            backgroundColor: isTrackActive(track.type)
              ? `${track.color}20`
              : 'transparent',
            color: isTrackActive(track.type) ? track.color : '#9ca3af',
          }"
        >
          <Icon :name="track.icon" class="w-4 h-4" />
        </div>

        <!-- 轨道标签和统计 -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between">
            <span
              class="text-sm font-medium transition-colors duration-200"
              :class="[
                isTrackActive(track.type)
                  ? $colorMode.value === 'dark'
                    ? 'text-white'
                    : 'text-gray-900'
                  : $colorMode.value === 'dark'
                  ? 'text-white/60 group-hover:text-white/80'
                  : 'text-gray-500 group-hover:text-gray-700',
              ]"
            >
              {{ track.label }}
            </span>

            <!-- 事件计数 -->
            <span
              class="text-xs px-2 py-0.5 rounded-full transition-all duration-200"
              :class="[
                isTrackActive(track.type)
                  ? $colorMode.value === 'dark'
                    ? 'bg-white/20 text-white/90'
                    : 'bg-gray-200 text-gray-800'
                  : $colorMode.value === 'dark'
                  ? 'bg-white/10 text-white/50 group-hover:bg-white/15 group-hover:text-white/70'
                  : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-700',
              ]"
            >
              {{ track.count }}
            </span>
          </div>

          <!-- 轨道描述 (可选) -->
          <div
            v-if="track.description && showDescriptions"
            :class="
              $colorMode.value === 'dark' ? 'text-white/50' : 'text-gray-400'
            "
            class="text-xs mt-1 line-clamp-1"
          >
            {{ track.description }}
          </div>
        </div>

        <!-- 悬浮效果 -->
        <div
          class="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
          :style="{
            background: `linear-gradient(90deg, transparent, ${track.color}10, transparent)`,
          }"
        />
      </button>
    </div>

    <!-- 统计信息 -->
    <div
      v-if="showStatistics"
      class="track-statistics mt-4 pt-3 border-t border-white/10"
    >
      <div class="flex items-center justify-between text-xs text-white/60">
        <span
          >已选择 {{ activeTracks.length }} / {{ tracks.length }} 个轨道</span
        >
        <span>共 {{ totalEvents }} 个事件</span>
      </div>

      <!-- 活跃度指示器 -->
      <div class="mt-2">
        <div class="flex items-center space-x-1">
          <span class="text-xs text-white/50">活跃度:</span>
          <div class="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              v-for="track in activeTracks"
              :key="track"
              class="h-full float-left transition-all duration-300"
              :style="{
                width: `${getTrackPercentage(track)}%`,
                backgroundColor: getTrackColor(track),
              }"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 快速过滤预设 -->
    <div
      v-if="showPresets"
      class="filter-presets mt-4 pt-3 border-t border-white/10"
    >
      <div class="text-xs text-white/60 mb-2">快速过滤:</div>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="preset in filterPresets"
          :key="preset.name"
          @click="applyPreset(preset)"
          class="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 text-white/70 hover:text-white rounded transition-all duration-200"
        >
          {{ preset.name }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface TrackType {
  type: string
  label: string
  color: string
  icon: string
  count: number
  description?: string
}

interface FilterPreset {
  name: string
  tracks: string[]
}

interface Props {
  tracks: TrackType[]
  activeTracks: string[]
  layout?: 'horizontal' | 'vertical'
  showBatchActions?: boolean
  showDescriptions?: boolean
  showStatistics?: boolean
  showPresets?: boolean
}

interface Emits {
  trackToggle: [track: string]
  tracksChange: [tracks: string[]]
}

const props = withDefaults(defineProps<Props>(), {
  layout: 'vertical',
  showBatchActions: true,
  showDescriptions: false,
  showStatistics: true,
  showPresets: true,
})

const emit = defineEmits<Emits>()

// 计算属性
const layoutClass = computed(() => ({
  'track-filter-horizontal': props.layout === 'horizontal',
  'track-filter-vertical': props.layout === 'vertical',
}))

const togglesClass = computed(() => ({
  'flex flex-wrap gap-2': props.layout === 'horizontal',
  'space-y-1': props.layout === 'vertical',
}))

const totalEvents = computed(() => {
  return props.tracks.reduce((sum, track) => sum + track.count, 0)
})

const activeEvents = computed(() => {
  return props.tracks
    .filter((track) => props.activeTracks.includes(track.type))
    .reduce((sum, track) => sum + track.count, 0)
})

// 过滤预设
const filterPresets = computed<FilterPreset[]>(() => [
  {
    name: '全部',
    tracks: props.tracks.map((t) => t.type),
  },
  {
    name: '内容创作',
    tracks: ['article', 'photo'],
  },
  {
    name: '生活记录',
    tracks: ['moment', 'milestone'],
  },
  {
    name: '重要事件',
    tracks: ['milestone'],
  },
])

// 方法
const isTrackActive = (trackType: string) => {
  return props.activeTracks.includes(trackType)
}

const toggleTrack = (trackType: string) => {
  emit('trackToggle', trackType)
}

const selectAll = () => {
  const allTracks = props.tracks.map((track) => track.type)
  emit('tracksChange', allTracks)
}

const selectNone = () => {
  emit('tracksChange', [])
}

const invertSelection = () => {
  const invertedTracks = props.tracks
    .filter((track) => !props.activeTracks.includes(track.type))
    .map((track) => track.type)
  emit('tracksChange', invertedTracks)
}

const applyPreset = (preset: FilterPreset) => {
  emit('tracksChange', preset.tracks)
}

const getTrackColor = (trackType: string) => {
  const track = props.tracks.find((t) => t.type === trackType)
  return track?.color || '#6b7280'
}

const getTrackPercentage = (trackType: string) => {
  const track = props.tracks.find((t) => t.type === trackType)
  if (!track || totalEvents.value === 0) return 0
  return (track.count / totalEvents.value) * 100
}

// 键盘快捷键
onMounted(() => {
  const handleKeydown = (event: KeyboardEvent) => {
    if (event.target instanceof HTMLInputElement) return

    // Ctrl/Cmd + A: 全选
    if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
      event.preventDefault()
      selectAll()
    }

    // Ctrl/Cmd + D: 全不选
    if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
      event.preventDefault()
      selectNone()
    }

    // Ctrl/Cmd + I: 反选
    if ((event.ctrlKey || event.metaKey) && event.key === 'i') {
      event.preventDefault()
      invertSelection()
    }

    // 数字键快速切换轨道
    const num = parseInt(event.key)
    if (num >= 1 && num <= props.tracks.length) {
      event.preventDefault()
      const track = props.tracks[num - 1]
      if (track) {
        toggleTrack(track.type)
      }
    }
  }

  document.addEventListener('keydown', handleKeydown)

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })
})
</script>

<style scoped>
/* 布局样式 */
.track-filter-horizontal {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.track-filter-vertical {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* 轨道切换按钮 */
.track-toggle {
  position: relative;
  overflow: hidden;
}

.track-toggle::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transition: left 0.5s ease;
}

.track-toggle:hover::before {
  left: 100%;
}

/* 活跃度指示器动画 */
.track-statistics .h-1 > div {
  transition: width 0.3s ease, background-color 0.3s ease;
}

/* 文本截断 */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .track-filter-horizontal .track-toggles {
    flex-direction: column;
    gap: 0.5rem;
  }

  .batch-actions {
    flex-direction: column;
    gap: 0.5rem;
  }

  .batch-actions .flex {
    justify-content: center;
  }
}

/* 动画效果 */
@keyframes trackActivate {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.track-toggle.activating {
  animation: trackActivate 0.3s ease;
}

/* 无障碍支持 */
.track-toggle:focus {
  outline: 2px solid theme('colors.primary.500');
  outline-offset: 2px;
}

.track-toggle:focus:not(:focus-visible) {
  outline: none;
}
</style>
