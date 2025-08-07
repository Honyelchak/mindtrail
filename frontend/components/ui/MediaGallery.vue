<template>
  <div class="media-gallery">
    <!-- 单张图片 -->
    <div v-if="displayMedia.length === 1" class="single-image">
      <img
        :src="displayMedia[0].url"
        :alt="displayMedia[0].alt"
        class="w-full h-64 object-cover rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
        @click="openLightbox(0)"
        @error="handleImageError"
      >
      <p v-if="displayMedia[0].caption" class="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
        {{ displayMedia[0].caption }}
      </p>
    </div>

    <!-- 两张图片 -->
    <div v-else-if="displayMedia.length === 2" class="grid grid-cols-2 gap-2">
      <div v-for="(item, index) in displayMedia" :key="index">
        <img
          :src="item.url"
          :alt="item.alt"
          class="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
          @click="openLightbox(index)"
          @error="handleImageError"
        >
      </div>
    </div>

    <!-- 三张图片 -->
    <div v-else-if="displayMedia.length === 3" class="grid grid-cols-3 gap-2">
      <div v-for="(item, index) in displayMedia" :key="index">
        <img
          :src="item.url"
          :alt="item.alt"
          class="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
          @click="openLightbox(index)"
          @error="handleImageError"
        >
      </div>
    </div>

    <!-- 四张或更多图片 -->
    <div v-else-if="displayMedia.length >= 4" class="grid grid-cols-2 gap-2">
      <div v-for="(item, index) in displayMedia.slice(0, 3)" :key="index">
        <img
          :src="item.url"
          :alt="item.alt"
          class="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
          @click="openLightbox(index)"
          @error="handleImageError"
        >
      </div>
      
      <!-- 更多图片指示器 -->
      <div 
        class="relative cursor-pointer"
        @click="openLightbox(3)"
      >
        <img
          :src="displayMedia[3].url"
          :alt="displayMedia[3].alt"
          class="w-full h-32 object-cover rounded-lg hover:opacity-90 transition-opacity"
          @error="handleImageError"
        >
        <div v-if="remainingCount > 0" 
             class="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
          <span class="text-white text-lg font-semibold">+{{ remainingCount }}</span>
        </div>
      </div>
    </div>

    <!-- 图片灯箱 -->
    <Teleport to="body">
      <div v-if="lightboxOpen" 
           class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
           @click="closeLightbox">
        <div class="relative max-w-4xl max-h-full">
          <!-- 关闭按钮 -->
          <button
            @click="closeLightbox"
            class="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <XMarkIcon class="w-6 h-6 mx-auto" />
          </button>

          <!-- 图片 -->
          <img
            :src="media[currentImageIndex]?.url"
            :alt="media[currentImageIndex]?.alt"
            class="max-w-full max-h-full object-contain rounded-lg"
            @click.stop
          >

          <!-- 图片信息 -->
          <div v-if="media[currentImageIndex]?.caption" 
               class="absolute bottom-4 left-4 right-4 bg-black/50 text-white p-3 rounded-lg">
            <p class="text-sm">{{ media[currentImageIndex].caption }}</p>
          </div>

          <!-- 导航按钮 -->
          <button v-if="media.length > 1 && currentImageIndex > 0"
                  @click.stop="previousImage"
                  class="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors">
            <ChevronLeftIcon class="w-6 h-6 mx-auto" />
          </button>

          <button v-if="media.length > 1 && currentImageIndex < media.length - 1"
                  @click.stop="nextImage"
                  class="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors">
            <ChevronRightIcon class="w-6 h-6 mx-auto" />
          </button>

          <!-- 图片计数器 -->
          <div v-if="media.length > 1" 
               class="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {{ currentImageIndex + 1 }} / {{ media.length }}
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

// Props
const props = defineProps({
  media: {
    type: Array,
    required: true
  },
  maxPreview: {
    type: Number,
    default: 4
  }
})

// 响应式数据
const lightboxOpen = ref(false)
const currentImageIndex = ref(0)

// 计算属性
const displayMedia = computed(() => {
  return props.media.slice(0, props.maxPreview)
})

const remainingCount = computed(() => {
  return Math.max(0, props.media.length - props.maxPreview)
})

// 方法
const openLightbox = (index) => {
  currentImageIndex.value = index
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
  lightboxOpen.value = false
  document.body.style.overflow = ''
}

const nextImage = () => {
  if (currentImageIndex.value < props.media.length - 1) {
    currentImageIndex.value++
  }
}

const previousImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  }
}

const handleImageError = (event) => {
  event.target.src = '/images/placeholder.jpg'
}

// 键盘事件监听
const handleKeydown = (event) => {
  if (!lightboxOpen.value) return
  
  switch (event.key) {
    case 'Escape':
      closeLightbox()
      break
    case 'ArrowLeft':
      previousImage()
      break
    case 'ArrowRight':
      nextImage()
      break
  }
}

// 生命周期
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.media-gallery {
  @apply w-full;
}

/* 确保图片比例一致 */
.single-image img {
  aspect-ratio: 16/9;
}

/* 灯箱动画 */
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.3s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}
</style>
