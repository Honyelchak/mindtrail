<template>
  <div
    class="relative w-full h-full bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden"
  >
    <!-- 地图容器 -->
    <div ref="mapContainer" class="w-full h-full relative">
      <!-- 地图加载状态 -->
      <div
        v-if="loading"
        class="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 z-10"
      >
        <div class="text-center">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-2"
          ></div>
          <p class="text-sm text-gray-600 dark:text-gray-400">加载地图中...</p>
        </div>
      </div>

      <!-- 高德地图容器 -->
      <div v-show="mapLoaded" ref="amapContainer" class="w-full h-full"></div>

      <!-- 简化版地图（当真实地图不可用时） -->
      <div
        v-if="!mapLoaded && !loading"
        class="w-full h-full flex items-center justify-center"
      >
        <div class="text-center">
          <div class="text-4xl mb-4">🗺️</div>
          <h3 class="text-lg font-semibold mb-2">高德地图视图</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">显示你的内容足迹</p>
          <button
            @click="initMap"
            class="neu-button px-4 py-2"
            :disabled="loading"
          >
            {{ loading ? '加载中...' : '加载地图' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 地图控制面板 -->
    <div v-if="showControls" class="absolute top-4 left-4 z-20">
      <div class="glass-card p-3 space-y-2">
        <!-- 视图切换 -->
        <div class="flex space-x-1">
          <button
            v-for="view in mapViews"
            :key="view.key"
            @click="currentView = view.key"
            class="p-2 rounded-lg transition-colors text-xs"
            :class="
              currentView === view.key
                ? 'bg-primary-500 text-white'
                : 'hover:bg-white/20 text-gray-600 dark:text-gray-400'
            "
            :title="view.label"
          >
            <component :is="view.icon" class="w-4 h-4" />
          </button>
        </div>

        <!-- 内容类型筛选 -->
        <div class="flex space-x-1">
          <button
            v-for="type in contentTypes"
            :key="type.key"
            @click="toggleContentType(type.key)"
            class="p-2 rounded-lg transition-colors text-xs"
            :class="
              visibleTypes.includes(type.key)
                ? 'bg-green-500 text-white'
                : 'hover:bg-white/20 text-gray-600 dark:text-gray-400'
            "
            :title="type.label"
          >
            <component :is="type.icon" class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- 位置信息面板 -->
    <div v-if="showControls" class="absolute top-4 right-4 z-20">
      <div class="glass-card p-3">
        <div class="text-xs text-gray-600 dark:text-gray-400 mb-1">
          当前位置
        </div>
        <div v-if="currentLocation" class="text-sm font-medium">
          {{ currentLocation.address || '获取地址中...' }}
        </div>
        <div v-else class="text-sm text-gray-500">未获取位置</div>
        <button
          @click="getCurrentLocation"
          class="mt-2 text-xs text-primary-600 hover:text-primary-700 transition-colors"
          :disabled="loading"
        >
          {{ loading ? '定位中...' : '重新定位' }}
        </button>
      </div>
    </div>

    <!-- 内容详情弹窗 -->
    <div
      v-if="selectedContent"
      class="absolute inset-x-4 bottom-4 z-30"
      @click.stop
    >
      <div class="glass-card p-4 max-h-64 overflow-y-auto">
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center space-x-2">
            <div
              class="w-8 h-8 rounded-lg flex items-center justify-center"
              :class="getContentTypeConfig(selectedContent.contentType).bgClass"
            >
              <component
                :is="getContentTypeConfig(selectedContent.contentType).icon"
                class="w-4 h-4 text-white"
              />
            </div>
            <div>
              <h3 class="font-semibold text-gray-800 dark:text-gray-200">
                {{ selectedContent.title }}
              </h3>
              <p class="text-xs text-gray-500">
                {{ formatDate(selectedContent.createdAt) }}
              </p>
            </div>
          </div>
          <button
            @click="selectedContent = null"
            class="p-1 rounded-lg hover:bg-white/20 transition-colors"
          >
            <XMarkIcon class="w-4 h-4" />
          </button>
        </div>

        <!-- 内容预览 -->
        <div v-if="selectedContent.preview" class="mb-3">
          <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {{ selectedContent.preview }}
          </p>
        </div>

        <!-- 缩略图 -->
        <div v-if="selectedContent.thumbnail" class="mb-3">
          <img
            :src="selectedContent.thumbnail"
            :alt="selectedContent.title"
            class="w-full h-32 object-cover rounded-lg"
            @error="handleImageError"
          />
        </div>

        <!-- 回访记录 -->
        <div
          v-if="selectedContent.revisits && selectedContent.revisits.length > 0"
          class="mb-3"
        >
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            回访记录 ({{ selectedContent.revisits.length }})
          </h4>
          <div class="space-y-2 max-h-32 overflow-y-auto">
            <div
              v-for="revisit in selectedContent.revisits"
              :key="revisit.id"
              class="p-2 bg-white/20 dark:bg-gray-800/20 rounded-lg"
            >
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs text-gray-500">
                  {{ formatDate(revisit.visitDate, 'short') }}
                </span>
                <div v-if="revisit.rating" class="flex">
                  <span
                    v-for="i in 5"
                    :key="i"
                    class="text-xs"
                    :class="
                      i <= revisit.rating ? 'text-yellow-400' : 'text-gray-300'
                    "
                  >
                    ⭐
                  </span>
                </div>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ revisit.reflection }}
              </p>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex space-x-2">
          <button
            @click="viewContent(selectedContent)"
            class="flex-1 neu-button py-2 text-sm"
          >
            查看详情
          </button>
          <button
            @click="addRevisit(selectedContent)"
            class="flex-1 neu-button py-2 text-sm"
          >
            添加回访
          </button>
        </div>
      </div>
    </div>

    <!-- 添加回访弹窗 -->
    <RevisitModal
      v-if="showRevisitModal"
      :content-location="selectedContent"
      @close="showRevisitModal = false"
      @submit="handleRevisitSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import {
  MapIcon,
  ViewColumnsIcon,
  Squares2X2Icon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  PhotoIcon,
  VideoCameraIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import { formatDate } from '~/utils'
import type { ContentLocation } from '~/types'

interface Props {
  height?: string
  showControls?: boolean
  initialCenter?: { lat: number; lng: number }
  initialZoom?: number
}

interface Emits {
  (e: 'location-selected', location: ContentLocation): void
  (e: 'revisit-added', data: any): void
}

const props = withDefaults(defineProps<Props>(), {
  height: '400px',
  showControls: true,
  initialZoom: 13,
})

const emit = defineEmits<Emits>()

// 使用位置数据
const {
  currentLocation,
  locationHistory,
  locationClusters,
  loading,
  getCurrentLocation,
} = useLocation()

// 地图状态
const mapContainer = ref<HTMLElement | null>(null)
const amapContainer = ref<HTMLElement | null>(null)
const mapLoaded = ref<boolean>(false)
const selectedContent = ref<ContentLocation | null>(null)
const showRevisitModal = ref<boolean>(false)
const currentView = ref<string>('map')
const visibleTypes = ref<string[]>(['moment', 'article', 'gallery', 'video'])
const amapInstance = ref<any>(null)
const markers = ref<any[]>([])

// 地图视图选项
const mapViews = [
  { key: 'map', label: '地图视图', icon: MapIcon },
  { key: 'satellite', label: '卫星视图', icon: ViewColumnsIcon },
  { key: 'hybrid', label: '混合视图', icon: Squares2X2Icon },
]

// 内容类型配置
const contentTypes = [
  { key: 'moment', label: '说说', icon: ChatBubbleLeftRightIcon },
  { key: 'article', label: '文章', icon: DocumentTextIcon },
  { key: 'gallery', label: '相册', icon: PhotoIcon },
  { key: 'video', label: '视频', icon: VideoCameraIcon },
]

// 获取内容类型配置
const getContentTypeConfig = (type: string) => {
  const configs: Record<string, any> = {
    moment: { icon: ChatBubbleLeftRightIcon, bgClass: 'bg-green-500' },
    article: { icon: DocumentTextIcon, bgClass: 'bg-blue-500' },
    gallery: { icon: PhotoIcon, bgClass: 'bg-purple-500' },
    video: { icon: VideoCameraIcon, bgClass: 'bg-red-500' },
  }
  return configs[type] || configs.moment
}

// 切换内容类型显示
const toggleContentType = (type: string): void => {
  const index = visibleTypes.value.indexOf(type)
  if (index > -1) {
    visibleTypes.value.splice(index, 1)
  } else {
    visibleTypes.value.push(type)
  }
}

// 加载高德地图API
const loadAmapAPI = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (window.AMap) {
      resolve(window.AMap)
      return
    }

    const script = document.createElement('script')
    script.src =
      'https://webapi.amap.com/maps?v=2.0&key=YOUR_AMAP_KEY&plugin=AMap.Scale,AMap.ToolBar,AMap.ControlBar'
    script.onload = () => {
      if (window.AMap) {
        resolve(window.AMap)
      } else {
        reject(new Error('高德地图API加载失败'))
      }
    }
    script.onerror = () => reject(new Error('高德地图API加载失败'))
    document.head.appendChild(script)
  })
}

// 初始化地图
const initMap = async (): Promise<void> => {
  try {
    loading.value = true

    // 加载高德地图API
    const AMap = await loadAmapAPI()

    // 创建地图实例
    amapInstance.value = new AMap.Map(amapContainer.value, {
      zoom: props.initialZoom,
      center: props.initialCenter
        ? [props.initialCenter.lng, props.initialCenter.lat]
        : [116.397428, 39.90923],
      mapStyle: 'amap://styles/normal',
      viewMode: '3D',
      pitch: 0,
      rotation: 0,
      showLabel: true,
      features: ['bg', 'road', 'building', 'point'],
    })

    // 添加地图控件
    amapInstance.value.addControl(new AMap.Scale())
    amapInstance.value.addControl(new AMap.ToolBar())
    amapInstance.value.addControl(new AMap.ControlBar())

    mapLoaded.value = true

    // 添加标记点
    addMarkersToMap()

    // 如果没有当前位置，尝试获取
    if (!currentLocation.value) {
      await getCurrentLocation()
    }
  } catch (error) {
    console.error('地图初始化失败:', error)
    // 即使失败也显示占位图
    mapLoaded.value = false
  } finally {
    loading.value = false
  }
}

// 添加标记点到地图
const addMarkersToMap = (): void => {
  if (!amapInstance.value || !locationHistory.value.length) return

  // 清除现有标记
  markers.value.forEach((marker) => amapInstance.value.remove(marker))
  markers.value = []

  // 添加新标记
  locationHistory.value.forEach((location) => {
    if (!visibleTypes.value.includes(location.contentType)) return

    const marker = new window.AMap.Marker({
      position: [location.longitude, location.latitude],
      title: location.title,
      content: createMarkerContent(location),
      offset: new window.AMap.Pixel(-12, -24),
    })

    marker.on('click', () => {
      selectedContent.value = location
    })

    amapInstance.value.add(marker)
    markers.value.push(marker)
  })
}

// 创建标记点内容
const createMarkerContent = (location: ContentLocation): string => {
  const config = getContentTypeConfig(location.contentType)
  return `
    <div class="w-6 h-6 rounded-full ${config.bgClass} flex items-center justify-center shadow-lg">
      <div class="w-3 h-3 bg-white rounded-full"></div>
    </div>
  `
}

// 查看内容详情
const viewContent = (content: ContentLocation): void => {
  navigateTo(`/${content.contentType}/${content.contentId}`)
}

// 添加回访记录
const addRevisit = (content: ContentLocation): void => {
  selectedContent.value = content
  showRevisitModal.value = true
}

// 处理回访提交
const handleRevisitSubmit = (revisitData: any): void => {
  emit('revisit-added', revisitData)
  showRevisitModal.value = false
}

// 处理图片错误
const handleImageError = (event: Event): void => {
  const target = event.target as HTMLImageElement
  target.src = '/images/placeholder.jpg'
}

// 监听内容类型变化
watch(
  visibleTypes,
  () => {
    if (mapLoaded.value) {
      addMarkersToMap()
    }
  },
  { deep: true }
)

// 监听位置历史变化
watch(
  locationHistory,
  () => {
    if (mapLoaded.value) {
      addMarkersToMap()
    }
  },
  { deep: true }
)

// 组件挂载时初始化
onMounted(() => {
  if (props.showControls) {
    initMap()
  }
})

// 组件卸载时清理
onUnmounted(() => {
  if (amapInstance.value) {
    amapInstance.value.destroy()
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.glass-card {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.dark .glass-card {
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}
</style>
