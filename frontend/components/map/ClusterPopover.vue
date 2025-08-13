<!--
  ClusterPopover.vue - 聚合标记弹窗组件
  
  Props:
  - cluster: MarkerCluster - 聚合数据
  - position: { left: string, top: string } - 弹窗位置
  
  Features:
  - 聚合标记列表
  - 标记类型过滤
  - 快速跳转
  - 展开/收起动画
-->

<template>
  <div
    class="cluster-popover absolute z-40 pointer-events-auto"
    :style="popoverStyle"
  >
    <!-- 弹窗箭头 -->
    <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-black/90 border border-white/20 rotate-45 border-t-0 border-l-0" />
    
    <!-- 弹窗内容 -->
    <div class="bg-black/90 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl overflow-hidden animate-cluster-popover-in">
      <!-- 弹窗头部 -->
      <div class="p-4 border-b border-white/10">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {{ cluster.count }}
            </div>
            <div>
              <h4 class="text-white font-medium">{{ cluster.count }} 个标记</h4>
              <p class="text-white/60 text-xs">点击查看详情</p>
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
      
      <!-- 类型过滤 -->
      <div class="p-3 border-b border-white/10">
        <div class="flex items-center space-x-2">
          <span class="text-white/60 text-xs">类型:</span>
          <div class="flex items-center space-x-1">
            <button
              v-for="type in availableTypes"
              :key="type.type"
              @click="toggleTypeFilter(type.type)"
              class="flex items-center space-x-1 px-2 py-1 rounded transition-all duration-200"
              :class="[
                activeTypes.includes(type.type)
                  ? 'bg-white/20 text-white'
                  : 'bg-white/10 text-white/60 hover:bg-white/15 hover:text-white/80'
              ]"
            >
              <div
                class="w-2 h-2 rounded-full"
                :style="{ backgroundColor: type.color }"
              />
              <span class="text-xs">{{ type.label }}</span>
              <span class="text-xs text-white/50">({{ type.count }})</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- 标记列表 -->
      <div class="max-h-64 overflow-y-auto">
        <div class="p-2 space-y-1">
          <button
            v-for="marker in filteredMarkers"
            :key="marker.id"
            @click="handleMarkerClick(marker)"
            class="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-all duration-200 group"
          >
            <!-- 标记图标 -->
            <div
              class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border border-white/20"
              :style="{ backgroundColor: getMarkerColor(marker.type) }"
            >
              <Icon :name="getMarkerIcon(marker.type)" class="w-4 h-4 text-white" />
            </div>
            
            <!-- 缩略图 -->
            <div
              v-if="marker.thumbnail"
              class="flex-shrink-0 w-8 h-8 rounded overflow-hidden border border-white/20"
            >
              <img
                :src="marker.thumbnail"
                :alt="marker.title"
                class="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            
            <!-- 标记信息 -->
            <div class="flex-1 min-w-0 text-left">
              <h5 class="text-white text-sm font-medium line-clamp-1 group-hover:text-primary-300 transition-colors duration-200">
                {{ marker.title }}
              </h5>
              <p class="text-white/60 text-xs line-clamp-1">{{ marker.description }}</p>
              
              <div class="flex items-center space-x-2 mt-1">
                <span class="text-white/50 text-xs">{{ formatMarkerDate(marker.date) }}</span>
                <span class="text-white/30">•</span>
                <span class="text-white/50 text-xs">{{ getMarkerTypeLabel(marker.type) }}</span>
              </div>
            </div>
            
            <!-- 箭头指示 -->
            <div class="flex-shrink-0 text-white/40 group-hover:text-white/60 transition-colors duration-200">
              <Icon name="heroicons:chevron-right" class="w-4 h-4" />
            </div>
          </button>
        </div>
        
        <!-- 空状态 -->
        <div v-if="filteredMarkers.length === 0" class="p-4 text-center">
          <div class="text-white/50 text-sm">没有匹配的标记</div>
          <button
            @click="clearTypeFilter"
            class="text-primary-400 hover:text-primary-300 text-xs mt-1 transition-colors duration-200"
          >
            清除过滤器
          </button>
        </div>
      </div>
      
      <!-- 弹窗底部 -->
      <div class="p-3 border-t border-white/10 bg-white/5">
        <div class="flex items-center justify-between">
          <!-- 统计信息 -->
          <div class="text-white/60 text-xs">
            显示 {{ filteredMarkers.length }} / {{ cluster.markers.length }} 个标记
          </div>
          
          <!-- 操作按钮 -->
          <div class="flex items-center space-x-2">
            <button
              @click="zoomToCluster"
              class="flex items-center space-x-1 px-2 py-1 bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-xs rounded transition-all duration-200"
            >
              <Icon name="heroicons:magnifying-glass-plus" class="w-3 h-3" />
              <span>缩放到此区域</span>
            </button>
            
            <button
              @click="showAllMarkers"
              class="flex items-center space-x-1 px-2 py-1 bg-primary-500/20 hover:bg-primary-500/30 text-primary-300 hover:text-primary-200 text-xs rounded transition-all duration-200"
            >
              <Icon name="heroicons:eye" class="w-3 h-3" />
              <span>显示全部</span>
            </button>
          </div>
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
  content?: any
}

interface MarkerCluster {
  id: string
  center: [number, number]
  count: number
  markers: MapMarker[]
}

interface Props {
  cluster: MarkerCluster
  position: { left: string; top: string }
}

interface Emits {
  markerClick: [marker: MapMarker]
  close: []
  zoomToCluster: [cluster: MarkerCluster]
  showAllMarkers: [markers: MapMarker[]]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 响应式状态
const activeTypes = ref<string[]>(['photo', 'article', 'moment', 'milestone'])

// 配置数据
const markerTypes = {
  photo: { color: '#10b981', icon: 'heroicons:photo', label: '照片' },
  article: { color: '#3b82f6', icon: 'heroicons:document-text', label: '文章' },
  moment: { color: '#f59e0b', icon: 'heroicons:chat-bubble-left', label: '说说' },
  milestone: { color: '#ef4444', icon: 'heroicons:flag', label: '里程碑' }
}

// 计算属性
const popoverStyle = computed(() => {
  const left = parseFloat(props.position.left)
  const top = parseFloat(props.position.top)
  
  // 调整位置避免超出边界
  const adjustedLeft = Math.min(Math.max(left, 10), 90)
  const adjustedTop = Math.max(top - 10, 5)
  
  return {
    left: `${adjustedLeft}%`,
    top: `${adjustedTop}%`,
    transform: 'translate(-50%, -100%)'
  }
})

const availableTypes = computed(() => {
  const typeCounts: Record<string, number> = {}
  
  props.cluster.markers.forEach(marker => {
    typeCounts[marker.type] = (typeCounts[marker.type] || 0) + 1
  })
  
  return Object.entries(markerTypes)
    .filter(([type]) => typeCounts[type] > 0)
    .map(([type, config]) => ({
      type,
      ...config,
      count: typeCounts[type]
    }))
})

const filteredMarkers = computed(() => {
  return props.cluster.markers
    .filter(marker => activeTypes.value.includes(marker.type))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

// 方法
const getMarkerColor = (type: string) => {
  return markerTypes[type as keyof typeof markerTypes]?.color || '#6b7280'
}

const getMarkerIcon = (type: string) => {
  return markerTypes[type as keyof typeof markerTypes]?.icon || 'heroicons:map-pin'
}

const getMarkerTypeLabel = (type: string) => {
  return markerTypes[type as keyof typeof markerTypes]?.label || type
}

const toggleTypeFilter = (type: string) => {
  const index = activeTypes.value.indexOf(type)
  if (index > -1) {
    activeTypes.value.splice(index, 1)
  } else {
    activeTypes.value.push(type)
  }
}

const clearTypeFilter = () => {
  activeTypes.value = ['photo', 'article', 'moment', 'milestone']
}

const handleMarkerClick = (marker: MapMarker) => {
  emit('markerClick', marker)
  emit('close')
}

const zoomToCluster = () => {
  emit('zoomToCluster', props.cluster)
}

const showAllMarkers = () => {
  emit('showAllMarkers', props.cluster.markers)
  emit('close')
}

const formatMarkerDate = (date: string) => {
  const d = new Date(date)
  return d.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 点击外部关闭
onMounted(() => {
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (!target.closest('.cluster-popover')) {
      emit('close')
    }
  }
  
  document.addEventListener('click', handleClickOutside)
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>

<style scoped>
/* 弹窗动画 */
@keyframes clusterPopoverIn {
  from {
    opacity: 0;
    transform: translate(-50%, -100%) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -100%) scale(1);
  }
}

.animate-cluster-popover-in {
  animation: clusterPopoverIn 0.2s ease-out;
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

/* 悬浮效果 */
.group:hover .w-8.h-8.rounded-full {
  transform: scale(1.05);
  transition: transform 0.2s ease;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .cluster-popover {
    max-width: calc(100vw - 2rem);
  }
  
  .max-h-64 {
    max-height: 200px;
  }
}
</style>
