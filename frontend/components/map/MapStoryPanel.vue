<!--
  MapStoryPanel.vue - 地图故事面板组件
  
  Props:
  - story: MapStory - 地图故事数据
  - position: 'left' | 'right' - 面板位置
  - collapsed: boolean - 是否折叠
  
  Features:
  - 故事内容展示
  - 相关标记列表
  - 路径信息
  - 折叠/展开动画
-->

<template>
  <div
    class="map-story-panel absolute top-0 bottom-0 w-96 bg-glass-bg/95 backdrop-blur-md border border-glass-border transition-all duration-350 z-20"
    :class="[
      position === 'left' ? 'left-0 border-r' : 'right-0 border-l',
      collapsed
        ? position === 'left'
          ? '-translate-x-full'
          : 'translate-x-full'
        : 'translate-x-0',
    ]"
  >
    <!-- 折叠/展开按钮 -->
    <button
      @click="toggleCollapsed"
      class="absolute top-1/2 -translate-y-1/2 w-8 h-16 bg-glass-bg/90 backdrop-blur-md border border-glass-border rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
      :class="position === 'left' ? '-right-4' : '-left-4'"
    >
      <Icon
        :name="
          collapsed
            ? position === 'left'
              ? 'heroicons:chevron-right'
              : 'heroicons:chevron-left'
            : position === 'left'
            ? 'heroicons:chevron-left'
            : 'heroicons:chevron-right'
        "
        class="w-4 h-4"
      />
    </button>

    <!-- 面板内容 -->
    <div class="h-full flex flex-col overflow-hidden">
      <!-- 故事头部 -->
      <div class="p-6 border-b border-glass-border">
        <div class="flex items-start space-x-4">
          <!-- 故事封面 -->
          <div
            v-if="story.coverImage"
            class="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border border-white/20"
          >
            <img
              :src="story.coverImage"
              :alt="story.title"
              class="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <!-- 故事信息 -->
          <div class="flex-1 min-w-0">
            <h3
              :class="
                $colorMode.value === 'dark' ? 'text-white' : 'text-gray-900'
              "
              class="font-bold text-xl mb-2 line-clamp-2"
            >
              {{ story.title }}
            </h3>
            <p
              :class="
                $colorMode.value === 'dark' ? 'text-white/70' : 'text-gray-600'
              "
              class="text-sm mb-3 line-clamp-3"
            >
              {{ story.description }}
            </p>

            <!-- 故事元信息 -->
            <div
              :class="
                $colorMode.value === 'dark' ? 'text-white/60' : 'text-gray-500'
              "
              class="flex items-center space-x-4 text-xs"
            >
              <div class="flex items-center space-x-1">
                <Icon name="heroicons:calendar-days" class="w-3 h-3" />
                <span>{{ formatDate(story.createdAt) }}</span>
              </div>

              <div class="flex items-center space-x-1">
                <Icon name="heroicons:map-pin" class="w-3 h-3" />
                <span>{{ story.markers.length }} 个地点</span>
              </div>

              <div v-if="story.distance" class="flex items-center space-x-1">
                <Icon name="heroicons:arrow-trending-up" class="w-3 h-3" />
                <span>{{ story.distance }}km</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 故事内容 -->
      <div class="flex-1 overflow-y-auto">
        <!-- 故事正文 -->
        <div v-if="story.content" class="p-6 border-b border-glass-border">
          <h4
            :class="
              $colorMode.value === 'dark' ? 'text-white' : 'text-gray-900'
            "
            class="font-medium mb-3"
          >
            故事内容
          </h4>
          <div
            :class="
              $colorMode.value === 'dark'
                ? 'text-white/80 prose-invert'
                : 'text-gray-700'
            "
            class="text-sm leading-relaxed prose max-w-none"
            v-html="story.content"
          />
        </div>

        <!-- 路径信息 -->
        <div v-if="story.path" class="p-6 border-b border-glass-border">
          <div class="flex items-center justify-between mb-3">
            <h4
              :class="
                $colorMode.value === 'dark' ? 'text-white' : 'text-gray-900'
              "
              class="font-medium"
            >
              路径信息
            </h4>
            <button
              @click="$emit('pathReplay', story.path)"
              class="flex items-center space-x-1 px-3 py-1 bg-primary-500/20 hover:bg-primary-500/30 text-primary-300 hover:text-primary-200 text-xs rounded-full transition-all duration-200"
            >
              <Icon name="heroicons:play" class="w-3 h-3" />
              <span>回放路径</span>
            </button>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-4">
            <div class="bg-white/5 rounded-lg p-3 text-center">
              <div class="text-white font-medium">
                {{ story.path.distance }}
              </div>
              <div class="text-white/60 text-xs">总距离 (km)</div>
            </div>

            <div class="bg-white/5 rounded-lg p-3 text-center">
              <div class="text-white font-medium">
                {{ formatDuration(story.path.duration) }}
              </div>
              <div class="text-white/60 text-xs">总用时</div>
            </div>
          </div>

          <!-- 路径预览 -->
          <div class="relative h-24 bg-white/5 rounded-lg overflow-hidden">
            <svg
              class="absolute inset-0 w-full h-full"
              viewBox="0 0 100 50"
              preserveAspectRatio="none"
            >
              <path
                :d="getPathPreview(story.path)"
                :stroke="story.path.color || '#3b82f6'"
                stroke-width="1"
                fill="none"
                class="path-preview"
              />
            </svg>

            <!-- 路径点 -->
            <div
              v-for="(point, index) in story.path.coordinates.slice(0, 5)"
              :key="index"
              class="absolute w-2 h-2 bg-primary-400 rounded-full"
              :style="getPathPointPosition(point, index)"
            />
          </div>
        </div>

        <!-- 相关标记 -->
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-white font-medium">
              相关标记 ({{ story.markers.length }})
            </h4>
            <div class="flex items-center space-x-2">
              <button
                @click="showAllMarkers"
                class="text-primary-400 hover:text-primary-300 text-xs transition-colors duration-200"
              >
                显示全部
              </button>
              <span class="text-white/30">|</span>
              <button
                @click="fitToMarkers"
                class="text-white/60 hover:text-white/80 text-xs transition-colors duration-200"
              >
                适应视图
              </button>
            </div>
          </div>

          <!-- 标记列表 -->
          <div class="space-y-3">
            <div
              v-for="(marker, index) in story.markers"
              :key="marker.id"
              class="marker-item group cursor-pointer p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-200"
              @click="$emit('markerClick', marker)"
            >
              <div class="flex items-start space-x-3">
                <!-- 标记序号 -->
                <div
                  class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium border-2 border-white/30"
                  :style="{ backgroundColor: getMarkerColor(marker.type) }"
                >
                  {{ index + 1 }}
                </div>

                <!-- 标记缩略图 -->
                <div
                  v-if="marker.thumbnail"
                  class="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border border-white/20"
                >
                  <img
                    :src="marker.thumbnail"
                    :alt="marker.title"
                    class="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                <!-- 标记信息 -->
                <div class="flex-1 min-w-0">
                  <h5
                    class="text-white font-medium text-sm mb-1 line-clamp-1 group-hover:text-primary-300 transition-colors duration-200"
                  >
                    {{ marker.title }}
                  </h5>
                  <p class="text-white/70 text-xs mb-2 line-clamp-2">
                    {{ marker.description }}
                  </p>

                  <div class="flex items-center justify-between">
                    <div
                      class="flex items-center space-x-2 text-white/50 text-xs"
                    >
                      <Icon
                        :name="getMarkerIcon(marker.type)"
                        class="w-3 h-3"
                      />
                      <span>{{ getMarkerTypeLabel(marker.type) }}</span>
                    </div>

                    <span class="text-white/50 text-xs">{{
                      formatDate(marker.date)
                    }}</span>
                  </div>
                </div>

                <!-- 箭头指示 -->
                <div
                  class="flex-shrink-0 text-white/40 group-hover:text-white/60 transition-colors duration-200"
                >
                  <Icon name="heroicons:chevron-right" class="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 故事标签 -->
        <div
          v-if="story.tags && story.tags.length > 0"
          class="p-6 border-t border-glass-border"
        >
          <h4 class="text-white font-medium mb-3">相关标签</h4>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in story.tags"
              :key="tag"
              class="px-3 py-1 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-xs rounded-full cursor-pointer transition-all duration-200"
              @click="$emit('tagClick', tag)"
            >
              #{{ tag }}
            </span>
          </div>
        </div>
      </div>

      <!-- 面板底部操作 -->
      <div class="p-4 border-t border-glass-border">
        <div class="flex items-center space-x-2">
          <button
            @click="$emit('editStory', story)"
            class="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-sm rounded-lg transition-all duration-200"
          >
            编辑故事
          </button>

          <button
            @click="$emit('shareStory', story)"
            class="px-4 py-2 bg-primary-500/20 hover:bg-primary-500/30 text-primary-300 hover:text-primary-200 text-sm rounded-lg transition-all duration-200"
          >
            分享
          </button>
        </div>
      </div>
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
  coordinates: [number, number][]
  distance: number
  duration: number
  color?: string
}

interface MapStory {
  id: string
  title: string
  description: string
  content?: string
  coverImage?: string
  markers: MapMarker[]
  path?: MapPath
  tags?: string[]
  createdAt: string
  distance?: number
}

interface Props {
  story: MapStory
  position?: 'left' | 'right'
  collapsed?: boolean
}

interface Emits {
  markerClick: [marker: MapMarker]
  pathReplay: [path: MapPath]
  tagClick: [tag: string]
  editStory: [story: MapStory]
  shareStory: [story: MapStory]
  toggleCollapsed: []
  showAllMarkers: []
  fitToMarkers: []
}

const props = withDefaults(defineProps<Props>(), {
  position: 'right',
  collapsed: false,
})

const emit = defineEmits<Emits>()

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

// 方法
const toggleCollapsed = () => {
  emit('toggleCollapsed')
}

const showAllMarkers = () => {
  emit('showAllMarkers')
}

const fitToMarkers = () => {
  emit('fitToMarkers')
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

const getPathPreview = (path: MapPath) => {
  if (path.coordinates.length < 2) return ''

  const points = path.coordinates.map(([lng, lat], index) => {
    const x = (index / (path.coordinates.length - 1)) * 100
    const y = 25 + Math.sin(index * 0.5) * 10 // 简化的波形
    return `${x},${y}`
  })

  return `M ${points.join(' L ')}`
}

const getPathPointPosition = (point: [number, number], index: number) => {
  const x = (index / 4) * 100 // 最多显示5个点
  const y = 50

  return {
    left: `${x}%`,
    top: `${y}%`,
    transform: 'translate(-50%, -50%)',
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (hours > 0) {
    return `${hours}h ${mins}m`
  }
  return `${mins}m`
}
</script>

<style scoped>
/* 路径预览动画 */
.path-preview {
  stroke-dasharray: 5, 5;
  animation: pathPreviewFlow 3s linear infinite;
}

@keyframes pathPreviewFlow {
  0% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: 20;
  }
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

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Prose 样式 */
.prose h1,
.prose h2,
.prose h3,
.prose h4,
.prose h5,
.prose h6 {
  color: white;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.prose p {
  margin-bottom: 1rem;
}

.prose ul,
.prose ol {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.prose li {
  margin-bottom: 0.25rem;
}

/* 标记项悬浮效果 */
.marker-item:hover .w-8.h-8 {
  transform: scale(1.05);
  transition: transform 0.2s ease;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .map-story-panel {
    width: 100%;
    max-width: 320px;
  }
}
</style>
