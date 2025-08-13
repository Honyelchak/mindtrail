<!--
  PhotoStory.vue - 照片故事展示组件
  
  Props:
  - story: Story - 故事数据
  - currentIndex: number - 当前照片索引
  - showMap: boolean - 是否显示地图
  
  Features:
  - 左右切换故事
  - 右侧地图缩略图
  - 左侧叙事文字+照片
  - 地图联动高亮
-->

<template>
  <div class="photo-story-container h-screen flex">
    <!-- 左侧内容区域 -->
    <div class="story-content flex-1 flex flex-col">
      <!-- 故事头部 -->
      <header class="story-header p-8 bg-glass-bg/50 backdrop-blur-md border-b border-glass-border">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-display-md text-white font-bold mb-2">{{ story.title }}</h1>
            <p class="text-white/70 text-body-lg">{{ story.description }}</p>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- 进度指示 -->
            <div class="flex items-center space-x-2 text-white/60 text-sm">
              <span>{{ currentIndex + 1 }}</span>
              <span>/</span>
              <span>{{ story.photos.length }}</span>
            </div>
            
            <!-- 控制按钮 -->
            <div class="flex items-center space-x-2">
              <button
                @click="previousPhoto"
                :disabled="currentIndex <= 0"
                class="w-10 h-10 bg-glass-bg backdrop-blur-md border border-glass-border rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <Icon name="heroicons:chevron-left" class="w-5 h-5" />
              </button>
              
              <button
                @click="nextPhoto"
                :disabled="currentIndex >= story.photos.length - 1"
                class="w-10 h-10 bg-glass-bg backdrop-blur-md border border-glass-border rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <Icon name="heroicons:chevron-right" class="w-5 h-5" />
              </button>
              
              <button
                @click="toggleMap"
                class="w-10 h-10 bg-glass-bg backdrop-blur-md border border-glass-border rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
                :class="{ 'bg-primary-500/20 border-primary-400/50 text-primary-300': showMap }"
              >
                <Icon name="heroicons:map" class="w-5 h-5" />
              </button>
              
              <button
                @click="$emit('close')"
                class="w-10 h-10 bg-glass-bg backdrop-blur-md border border-glass-border rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <Icon name="heroicons:x-mark" class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- 主要内容区域 -->
      <div class="story-main flex-1 flex">
        <!-- 照片展示区域 -->
        <div class="photo-section flex-1 relative">
          <div class="absolute inset-0 flex items-center justify-center p-8">
            <div class="relative max-w-full max-h-full">
              <!-- 当前照片 -->
              <div class="relative">
                <picture>
                  <source
                    :srcset="`${currentPhoto.url}?format=webp&w=1200 1200w, ${currentPhoto.url}?format=webp&w=1600 1600w`"
                    type="image/webp"
                  />
                  <img
                    :src="currentPhoto.url"
                    :alt="currentPhoto.title"
                    class="max-w-full max-h-full object-contain rounded-2xl shadow-2xl transition-all duration-450"
                    :key="currentPhoto.id"
                  />
                </picture>
                
                <!-- 照片信息覆盖层 -->
                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 rounded-b-2xl">
                  <h3 class="text-white font-bold text-xl mb-2">{{ currentPhoto.title }}</h3>
                  <p v-if="currentPhoto.description" class="text-white/80 text-sm mb-3">{{ currentPhoto.description }}</p>
                  
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4 text-white/70 text-sm">
                      <div v-if="currentPhoto.camera" class="flex items-center space-x-2">
                        <Icon name="heroicons:camera" class="w-4 h-4" />
                        <span>{{ currentPhoto.camera.make }} {{ currentPhoto.camera.model }}</span>
                      </div>
                      
                      <div class="flex items-center space-x-2">
                        <Icon name="heroicons:calendar-days" class="w-4 h-4" />
                        <span>{{ formatDate(currentPhoto.takenAt) }}</span>
                      </div>
                    </div>
                    
                    <div v-if="currentPhoto.location" class="flex items-center space-x-2 text-white/70 text-sm">
                      <Icon name="heroicons:map-pin" class="w-4 h-4" />
                      <span>{{ currentPhoto.location.name }}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 导航箭头 -->
              <button
                v-if="currentIndex > 0"
                @click="previousPhoto"
                class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-black/70 transition-all duration-200"
              >
                <Icon name="heroicons:chevron-left" class="w-6 h-6" />
              </button>
              
              <button
                v-if="currentIndex < story.photos.length - 1"
                @click="nextPhoto"
                class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-black/70 transition-all duration-200"
              >
                <Icon name="heroicons:chevron-right" class="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        <!-- 叙事文字区域 -->
        <div class="narrative-section w-80 bg-glass-bg/30 backdrop-blur-md border-l border-glass-border p-6 overflow-y-auto">
          <div class="space-y-6">
            <!-- 故事进度 -->
            <div class="progress-section">
              <div class="flex items-center justify-between mb-2">
                <span class="text-white/70 text-sm">故事进度</span>
                <span class="text-white/50 text-sm">{{ Math.round(((currentIndex + 1) / story.photos.length) * 100) }}%</span>
              </div>
              <div class="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-450 rounded-full"
                  :style="{ width: `${((currentIndex + 1) / story.photos.length) * 100}%` }"
                />
              </div>
            </div>
            
            <!-- 当前照片详情 -->
            <div class="photo-details">
              <h4 class="text-white font-medium mb-3">照片详情</h4>
              <div class="space-y-3 text-sm">
                <div v-if="currentPhoto.camera" class="flex items-start space-x-3">
                  <Icon name="heroicons:camera" class="w-4 h-4 text-white/60 mt-0.5" />
                  <div>
                    <div class="text-white/80">{{ currentPhoto.camera.make }} {{ currentPhoto.camera.model }}</div>
                    <div class="text-white/60">{{ currentPhoto.camera.settings }}</div>
                  </div>
                </div>
                
                <div class="flex items-center space-x-3">
                  <Icon name="heroicons:calendar-days" class="w-4 h-4 text-white/60" />
                  <span class="text-white/80">{{ formatDateTime(currentPhoto.takenAt) }}</span>
                </div>
                
                <div v-if="currentPhoto.location" class="flex items-center space-x-3">
                  <Icon name="heroicons:map-pin" class="w-4 h-4 text-white/60" />
                  <span class="text-white/80">{{ currentPhoto.location.name }}</span>
                </div>
              </div>
            </div>
            
            <!-- 标签 -->
            <div v-if="currentPhoto.tags.length > 0" class="photo-tags">
              <h4 class="text-white font-medium mb-3">标签</h4>
              <div class="flex flex-wrap gap-2">
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
            
            <!-- 缩略图导航 -->
            <div class="thumbnail-nav">
              <h4 class="text-white font-medium mb-3">所有照片</h4>
              <div class="grid grid-cols-3 gap-2">
                <button
                  v-for="(photo, index) in story.photos"
                  :key="photo.id"
                  @click="setCurrentIndex(index)"
                  class="relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200"
                  :class="[
                    index === currentIndex
                      ? 'border-primary-400 ring-2 ring-primary-400/50'
                      : 'border-transparent hover:border-white/30'
                  ]"
                >
                  <img
                    :src="photo.thumbnail"
                    :alt="photo.title"
                    class="w-full h-full object-cover"
                    loading="lazy"
                  />
                  
                  <!-- 当前指示器 -->
                  <div
                    v-if="index === currentIndex"
                    class="absolute inset-0 bg-primary-500/20 flex items-center justify-center"
                  >
                    <div class="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                      <Icon name="heroicons:play" class="w-3 h-3 text-white" />
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧地图区域 -->
    <div
      v-if="showMap"
      class="map-section w-96 bg-glass-bg/50 backdrop-blur-md border-l border-glass-border transition-all duration-350"
    >
      <MapThumbPanel
        :locations="storyLocations"
        :active-location="currentPhoto.location?.name"
        :route="story.route"
        @location-click="handleLocationClick"
      />
    </div>
  </div>
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

interface Story {
  id: string
  title: string
  description: string
  photos: Photo[]
  route?: {
    coordinates: [number, number][]
    distance: number
    duration: number
  }
}

interface Props {
  story: Story
  currentIndex?: number
  showMap?: boolean
}

interface Emits {
  close: []
  photoChange: [index: number]
  tagClick: [tag: string]
  locationClick: [location: string]
}

const props = withDefaults(defineProps<Props>(), {
  currentIndex: 0,
  showMap: false
})

const emit = defineEmits<Emits>()

// 响应式状态
const internalCurrentIndex = ref(props.currentIndex)
const internalShowMap = ref(props.showMap)

// 计算属性
const currentPhoto = computed(() => props.story.photos[internalCurrentIndex.value])

const storyLocations = computed(() => {
  return props.story.photos
    .filter(photo => photo.location)
    .map(photo => ({
      name: photo.location!.name,
      coordinates: photo.location!.coordinates,
      photo: photo
    }))
})

// 监听 props 变化
watch(() => props.currentIndex, (newIndex) => {
  internalCurrentIndex.value = newIndex
})

watch(() => props.showMap, (newShowMap) => {
  internalShowMap.value = newShowMap
})

// 计算属性的 getter/setter
const showMap = computed({
  get: () => internalShowMap.value,
  set: (value) => {
    internalShowMap.value = value
  }
})

// 方法
const previousPhoto = () => {
  if (internalCurrentIndex.value > 0) {
    internalCurrentIndex.value--
    emit('photoChange', internalCurrentIndex.value)
  }
}

const nextPhoto = () => {
  if (internalCurrentIndex.value < props.story.photos.length - 1) {
    internalCurrentIndex.value++
    emit('photoChange', internalCurrentIndex.value)
  }
}

const setCurrentIndex = (index: number) => {
  internalCurrentIndex.value = index
  emit('photoChange', index)
}

const toggleMap = () => {
  showMap.value = !showMap.value
}

const handleLocationClick = (location: string) => {
  // 找到对应位置的照片
  const photoIndex = props.story.photos.findIndex(
    photo => photo.location?.name === location
  )
  if (photoIndex !== -1) {
    setCurrentIndex(photoIndex)
  }
  emit('locationClick', location)
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
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
      case 'm':
      case 'M':
        if (!event.ctrlKey && !event.metaKey) {
          event.preventDefault()
          toggleMap()
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
/* 自定义滚动条 */
.narrative-section::-webkit-scrollbar {
  width: 4px;
}

.narrative-section::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.narrative-section::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.narrative-section::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* 照片切换动画 */
.photo-section img {
  animation: photoFadeIn 0.45s ease-out;
}

@keyframes photoFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 响应式调整 */
@media (max-width: 1024px) {
  .narrative-section {
    width: 320px;
  }
  
  .map-section {
    width: 320px;
  }
}

@media (max-width: 768px) {
  .photo-story-container {
    flex-direction: column;
  }
  
  .narrative-section,
  .map-section {
    width: 100%;
    height: 300px;
  }
}
</style>
