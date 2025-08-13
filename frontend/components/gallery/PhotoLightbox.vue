<!--
  PhotoLightbox.vue - 照片灯箱查看器组件
  
  Props:
  - photos: Photo[] - 照片数组
  - initialIndex: number - 初始索引
  - show: boolean - 是否显示
  
  Features:
  - 全屏照片查看
  - 键盘导航
  - 触摸手势支持
  - 缩放功能
  - 照片信息显示
-->

<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="photo-lightbox fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm flex items-center justify-center"
      @click="handleBackdropClick"
      @keydown.esc="$emit('close')"
      tabindex="0"
    >
      <!-- 顶部工具栏 -->
      <div class="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-6">
        <div class="flex items-center justify-between">
          <!-- 照片计数 -->
          <div class="text-white/80 text-sm">
            {{ currentIndex + 1 }} / {{ photos.length }}
          </div>
          
          <!-- 工具按钮 -->
          <div class="flex items-center space-x-3">
            <!-- 信息切换 -->
            <button
              @click="toggleInfo"
              class="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-all duration-200"
              :class="{ 'bg-primary-500/20 text-primary-300': showInfo }"
              title="显示/隐藏信息"
            >
              <Icon name="heroicons:information-circle" class="w-5 h-5" />
            </button>
            
            <!-- 缩放重置 -->
            <button
              @click="resetZoom"
              class="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-all duration-200"
              title="重置缩放"
            >
              <Icon name="heroicons:arrows-pointing-out" class="w-5 h-5" />
            </button>
            
            <!-- 下载 -->
            <button
              @click="downloadPhoto"
              class="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-all duration-200"
              title="下载照片"
            >
              <Icon name="heroicons:arrow-down-tray" class="w-5 h-5" />
            </button>
            
            <!-- 分享 -->
            <button
              @click="sharePhoto"
              class="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-all duration-200"
              title="分享照片"
            >
              <Icon name="heroicons:share" class="w-5 h-5" />
            </button>
            
            <!-- 关闭 -->
            <button
              @click="$emit('close')"
              class="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-all duration-200"
              title="关闭"
            >
              <Icon name="heroicons:x-mark" class="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <!-- 主要照片区域 -->
      <div class="photo-main relative w-full h-full flex items-center justify-center p-20">
        <!-- 当前照片 -->
        <div
          ref="photoContainer"
          class="photo-container relative max-w-full max-h-full cursor-grab active:cursor-grabbing"
          :style="photoContainerStyle"
          @mousedown="handleMouseDown"
          @wheel="handleWheel"
        >
          <picture>
            <source
              :srcset="`${currentPhoto.url}?format=webp&w=1920 1920w, ${currentPhoto.url}?format=webp&w=2560 2560w`"
              type="image/webp"
            />
            <img
              :src="currentPhoto.url"
              :alt="currentPhoto.title"
              class="max-w-full max-h-full object-contain select-none transition-all duration-350"
              :class="{ 'animate-image-focus-zoom': imageLoading }"
              @load="imageLoading = false"
              @error="handleImageError"
              draggable="false"
            />
          </picture>
          
          <!-- 加载状态 -->
          <div
            v-if="imageLoading"
            class="absolute inset-0 flex items-center justify-center bg-black/20"
          >
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        </div>

        <!-- 导航箭头 -->
        <button
          v-if="currentIndex > 0"
          @click="previousPhoto"
          class="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-all duration-200 hover:scale-110"
        >
          <Icon name="heroicons:chevron-left" class="w-6 h-6" />
        </button>

        <button
          v-if="currentIndex < photos.length - 1"
          @click="nextPhoto"
          class="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-all duration-200 hover:scale-110"
        >
          <Icon name="heroicons:chevron-right" class="w-6 h-6" />
        </button>
      </div>

      <!-- 底部信息面板 -->
      <div
        v-if="showInfo"
        class="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/90 to-transparent p-6 transition-all duration-350"
      >
        <div class="max-w-4xl mx-auto">
          <div class="flex items-start space-x-6">
            <!-- 照片信息 -->
            <div class="flex-1">
              <h3 class="text-white font-bold text-xl mb-2">{{ currentPhoto.title }}</h3>
              <p v-if="currentPhoto.description" class="text-white/80 text-sm mb-4">{{ currentPhoto.description }}</p>
              
              <div class="flex flex-wrap items-center gap-4 text-white/70 text-sm">
                <div v-if="currentPhoto.camera" class="flex items-center space-x-2">
                  <Icon name="heroicons:camera" class="w-4 h-4" />
                  <span>{{ currentPhoto.camera.make }} {{ currentPhoto.camera.model }}</span>
                </div>
                
                <div class="flex items-center space-x-2">
                  <Icon name="heroicons:calendar-days" class="w-4 h-4" />
                  <span>{{ formatDate(currentPhoto.takenAt) }}</span>
                </div>
                
                <div v-if="currentPhoto.location" class="flex items-center space-x-2">
                  <Icon name="heroicons:map-pin" class="w-4 h-4" />
                  <span>{{ currentPhoto.location.name }}</span>
                </div>
              </div>
              
              <!-- 标签 -->
              <div v-if="currentPhoto.tags.length > 0" class="flex flex-wrap gap-2 mt-4">
                <span
                  v-for="tag in currentPhoto.tags"
                  :key="tag"
                  class="px-3 py-1 bg-white/10 text-white/80 text-xs rounded-full hover:bg-white/20 transition-colors duration-200 cursor-pointer"
                  @click="$emit('tagClick', tag)"
                >
                  #{{ tag }}
                </span>
              </div>
            </div>
            
            <!-- 相机设置 -->
            <div v-if="currentPhoto.camera" class="flex-shrink-0 w-48">
              <h4 class="text-white font-medium mb-3">拍摄参数</h4>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-white/60">相机</span>
                  <span class="text-white">{{ currentPhoto.camera.make }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-white/60">型号</span>
                  <span class="text-white">{{ currentPhoto.camera.model }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-white/60">设置</span>
                  <span class="text-white">{{ currentPhoto.camera.settings }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 缩略图导航 -->
      <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 max-w-full overflow-x-auto px-4">
        <button
          v-for="(photo, index) in photos"
          :key="photo.id"
          class="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200"
          :class="[
            index === currentIndex
              ? 'border-primary-400 ring-2 ring-primary-400/50 scale-110'
              : 'border-white/30 hover:border-white/60 hover:scale-105'
          ]"
          @click="setCurrentIndex(index)"
        >
          <img
            :src="photo.thumbnail"
            :alt="photo.title"
            class="w-full h-full object-cover"
            loading="lazy"
          />
        </button>
      </div>

      <!-- 缩放指示器 -->
      <div
        v-if="scale !== 1"
        class="absolute top-20 right-6 px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-sm rounded-full"
      >
        {{ Math.round(scale * 100) }}%
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
interface Photo {
  id: string
  url: string
  thumbnail: string
  title: string
  description?: string
  location?: {
    name: string
    coordinates: [number, number]
  }
  takenAt: string
  camera?: {
    make: string
    model: string
    settings: string
  }
  tags: string[]
}

interface Props {
  photos: Photo[]
  initialIndex?: number
  show?: boolean
}

interface Emits {
  close: []
  indexChange: [index: number]
  tagClick: [tag: string]
}

const props = withDefaults(defineProps<Props>(), {
  initialIndex: 0,
  show: true
})

const emit = defineEmits<Emits>()

// 响应式状态
const currentIndex = ref(props.initialIndex)
const imageLoading = ref(false)
const showInfo = ref(false)
const scale = ref(1)
const translateX = ref(0)
const translateY = ref(0)
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })

// 计算属性
const currentPhoto = computed(() => props.photos[currentIndex.value])

const photoContainerStyle = computed(() => ({
  transform: `scale(${scale.value}) translate(${translateX.value}px, ${translateY.value}px)`,
  transition: isDragging.value ? 'none' : 'transform 0.2s ease'
}))

// 方法
const previousPhoto = () => {
  if (currentIndex.value > 0) {
    setCurrentIndex(currentIndex.value - 1)
  }
}

const nextPhoto = () => {
  if (currentIndex.value < props.photos.length - 1) {
    setCurrentIndex(currentIndex.value + 1)
  }
}

const setCurrentIndex = (index: number) => {
  if (index >= 0 && index < props.photos.length) {
    currentIndex.value = index
    imageLoading.value = true
    resetZoom()
    emit('indexChange', index)
  }
}

const toggleInfo = () => {
  showInfo.value = !showInfo.value
}

const resetZoom = () => {
  scale.value = 1
  translateX.value = 0
  translateY.value = 0
}

const downloadPhoto = () => {
  const link = document.createElement('a')
  link.href = currentPhoto.value.url
  link.download = `${currentPhoto.value.title}.jpg`
  link.click()
}

const sharePhoto = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: currentPhoto.value.title,
        text: currentPhoto.value.description,
        url: currentPhoto.value.url
      })
    } catch (error) {
      console.error('分享失败:', error)
    }
  } else {
    // 降级到复制链接
    await navigator.clipboard.writeText(currentPhoto.value.url)
  }
}

const handleBackdropClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}

const handleImageError = () => {
  imageLoading.value = false
  console.error('图片加载失败:', currentPhoto.value.url)
}

// 鼠标拖拽
const handleMouseDown = (event: MouseEvent) => {
  if (scale.value <= 1) return
  
  isDragging.value = true
  dragStart.value = {
    x: event.clientX - translateX.value,
    y: event.clientY - translateY.value
  }
  
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.value) return
    
    translateX.value = e.clientX - dragStart.value.x
    translateY.value = e.clientY - dragStart.value.y
  }
  
  const handleMouseUp = () => {
    isDragging.value = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }
  
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

// 滚轮缩放
const handleWheel = (event: WheelEvent) => {
  event.preventDefault()
  
  const delta = event.deltaY > 0 ? 0.9 : 1.1
  const newScale = Math.max(0.5, Math.min(3, scale.value * delta))
  
  scale.value = newScale
  
  if (newScale <= 1) {
    translateX.value = 0
    translateY.value = 0
  }
}

// 键盘导航
onMounted(() => {
  const handleKeydown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault()
        previousPhoto()
        break
      case 'ArrowRight':
        event.preventDefault()
        nextPhoto()
        break
      case 'Escape':
        event.preventDefault()
        emit('close')
        break
      case 'i':
      case 'I':
        event.preventDefault()
        toggleInfo()
        break
      case '0':
        event.preventDefault()
        resetZoom()
        break
    }
  }
  
  document.addEventListener('keydown', handleKeydown)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })
})

// 监听初始索引变化
watch(() => props.initialIndex, (newIndex) => {
  setCurrentIndex(newIndex)
}, { immediate: true })

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
/* 缩略图导航滚动条 */
.overflow-x-auto::-webkit-scrollbar {
  height: 4px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* 照片容器 */
.photo-container {
  transform-origin: center center;
}

/* 防止文本选择 */
.photo-lightbox {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .photo-main {
    padding: 4rem 1rem 8rem;
  }
  
  .absolute.bottom-0 {
    padding: 1rem;
  }
  
  .flex.items-start {
    flex-direction: column;
    space-x: 0;
    gap: 1rem;
  }
}
</style>
