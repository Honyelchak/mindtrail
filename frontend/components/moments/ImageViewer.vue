<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center"
      @click="handleBackdropClick"
      @keydown.esc="$emit('close')"
      tabindex="0"
    >
      <!-- 关闭按钮 -->
      <button
        class="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-200"
        @click="$emit('close')"
      >
        <Icon name="heroicons:x-mark" class="w-6 h-6" />
      </button>

      <!-- 图片计数器 -->
      <div
        v-if="images.length > 1"
        class="absolute top-4 left-4 z-10 px-4 py-2 rounded-full bg-black/50 text-white text-sm font-medium"
      >
        {{ currentIndex + 1 }} / {{ images.length }}
      </div>

      <!-- 主图片容器 -->
      <div class="relative w-full h-full flex items-center justify-center p-4">
        <div
          class="relative max-w-full max-h-full"
          @click.stop
        >
          <!-- 图片 -->
          <img
            :src="currentImage.url"
            :alt="currentImage.alt || '图片'"
            class="max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-all duration-300"
            :class="{ 'animate-fade-in': imageLoading }"
            @load="imageLoading = false"
            @error="handleImageError"
          />

          <!-- 加载状态 -->
          <div
            v-if="imageLoading"
            class="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg"
          >
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        </div>

        <!-- 左右导航按钮 -->
        <template v-if="images.length > 1">
          <button
            v-if="currentIndex > 0"
            class="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200 hover:scale-110"
            @click="previousImage"
          >
            <Icon name="heroicons:chevron-left" class="w-6 h-6" />
          </button>

          <button
            v-if="currentIndex < images.length - 1"
            class="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200 hover:scale-110"
            @click="nextImage"
          >
            <Icon name="heroicons:chevron-right" class="w-6 h-6" />
          </button>
        </template>
      </div>

      <!-- 缩略图导航 -->
      <div
        v-if="images.length > 1"
        class="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 max-w-full overflow-x-auto px-4"
      >
        <button
          v-for="(image, index) in images"
          :key="image.id"
          class="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200"
          :class="[
            index === currentIndex
              ? 'border-white shadow-lg scale-110'
              : 'border-white/30 hover:border-white/60 hover:scale-105'
          ]"
          @click="setCurrentIndex(index)"
        >
          <img
            :src="image.thumbnail || image.url"
            :alt="image.alt || `缩略图${index + 1}`"
            class="w-full h-full object-cover"
          />
        </button>
      </div>

      <!-- 手势提示 (移动端) -->
      <div
        v-if="isMobile && images.length > 1"
        class="absolute bottom-20 left-1/2 -translate-x-1/2 text-white/60 text-sm text-center"
      >
        <div class="flex items-center space-x-2">
          <Icon name="heroicons:hand-raised" class="w-4 h-4" />
          <span>左右滑动切换图片</span>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
interface ImageItem {
  id: string
  url: string
  thumbnail?: string
  alt?: string
}

interface Props {
  images: ImageItem[]
  initialIndex?: number
  show?: boolean
}

interface Emits {
  close: []
  indexChange: [index: number]
}

const props = withDefaults(defineProps<Props>(), {
  initialIndex: 0,
  show: true
})

const emit = defineEmits<Emits>()

// 响应式状态
const currentIndex = ref(props.initialIndex)
const imageLoading = ref(false)
const isMobile = ref(false)

// 当前图片
const currentImage = computed(() => props.images[currentIndex.value])

// 检测移动设备
onMounted(() => {
  isMobile.value = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  
  // 添加键盘事件监听
  document.addEventListener('keydown', handleKeydown)
  
  // 添加触摸事件监听 (移动端)
  if (isMobile.value) {
    let startX = 0
    let startY = 0
    
    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
    }
    
    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX
      const endY = e.changedTouches[0].clientY
      const diffX = startX - endX
      const diffY = startY - endY
      
      // 水平滑动距离大于垂直滑动距离，且滑动距离超过阈值
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
          // 向左滑动，下一张
          nextImage()
        } else {
          // 向右滑动，上一张
          previousImage()
        }
      }
    }
    
    document.addEventListener('touchstart', handleTouchStart)
    document.addEventListener('touchend', handleTouchEnd)
    
    // 清理事件监听
    onUnmounted(() => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
    })
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// 键盘事件处理
const handleKeydown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'ArrowLeft':
      e.preventDefault()
      previousImage()
      break
    case 'ArrowRight':
      e.preventDefault()
      nextImage()
      break
    case 'Escape':
      e.preventDefault()
      emit('close')
      break
  }
}

// 背景点击处理
const handleBackdropClick = (e: MouseEvent) => {
  if (e.target === e.currentTarget) {
    emit('close')
  }
}

// 上一张图片
const previousImage = () => {
  if (currentIndex.value > 0) {
    setCurrentIndex(currentIndex.value - 1)
  }
}

// 下一张图片
const nextImage = () => {
  if (currentIndex.value < props.images.length - 1) {
    setCurrentIndex(currentIndex.value + 1)
  }
}

// 设置当前索引
const setCurrentIndex = (index: number) => {
  if (index >= 0 && index < props.images.length) {
    currentIndex.value = index
    imageLoading.value = true
    emit('indexChange', index)
  }
}

// 图片加载错误处理
const handleImageError = () => {
  imageLoading.value = false
  console.error('Failed to load image:', currentImage.value.url)
}

// 监听初始索引变化
watch(() => props.initialIndex, (newIndex) => {
  setCurrentIndex(newIndex)
}, { immediate: true })
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

/* 滚动条样式 */
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
</style>
