<!--
  GalleryMosaic.vue - 混排 Mosaic 布局组件
  
  Props:
  - photos: Photo[] - 照片数组
  - stories: Story[] - 故事数组
  - viewMode: 'mosaic' | 'grid' - 视图模式
  - loading: boolean - 加载状态
  
  Mock Data Structure:
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
    aspectRatio: number
  }
  
  interface Story {
    id: string
    title: string
    description: string
    coverPhoto: Photo
    photos: Photo[]
    route?: {
      coordinates: [number, number][]
      distance: number
      duration: number
    }
    createdAt: string
  }
-->

<template>
  <div class="gallery-mosaic-container">
    <!-- 顶部故事入口 -->
    <section class="stories-section mb-12">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-display-sm text-white font-bold">精选故事</h2>
        <button
          @click="$emit('viewAllStories')"
          class="text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors duration-200"
        >
          查看全部 →
        </button>
      </div>
      
      <!-- 故事轮播 -->
      <div class="relative">
        <div 
          class="flex space-x-6 overflow-x-auto scrollbar-hide pb-4"
          ref="storiesContainer"
        >
          <div
            v-for="story in stories"
            :key="story.id"
            class="story-card group cursor-pointer flex-shrink-0 w-80 bg-glass-bg backdrop-blur-md rounded-2xl overflow-hidden border border-glass-border hover:border-primary-400/50 transition-all duration-350 hover:-translate-y-2 hover:shadow-glass-lg"
            @click="$emit('storyClick', story)"
          >
            <!-- 故事封面 -->
            <div class="relative aspect-video overflow-hidden">
              <picture>
                <source
                  :srcset="`${story.coverPhoto.url}?format=webp&w=640 640w`"
                  type="image/webp"
                />
                <img
                  :src="story.coverPhoto.thumbnail"
                  :alt="story.title"
                  loading="lazy"
                  class="w-full h-full object-cover transition-transform duration-350 group-hover:animate-gallery-mosaic-hover"
                />
              </picture>
              
              <!-- 故事标识 -->
              <div class="absolute top-4 left-4">
                <div class="flex items-center space-x-2 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-xs">
                  <Icon name="heroicons:photo" class="w-3 h-3" />
                  <span>{{ story.photos.length }} 张照片</span>
                </div>
              </div>
              
              <!-- 播放按钮 -->
              <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-350">
                <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                  <Icon name="heroicons:play" class="w-6 h-6 text-white ml-1" />
                </div>
              </div>
            </div>
            
            <!-- 故事信息 -->
            <div class="p-6">
              <h3 class="text-white font-bold text-lg mb-2 line-clamp-1">{{ story.title }}</h3>
              <p class="text-white/70 text-sm line-clamp-2 mb-4">{{ story.description }}</p>
              
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2 text-white/60 text-xs">
                  <Icon name="heroicons:calendar-days" class="w-3 h-3" />
                  <span>{{ formatDate(story.createdAt) }}</span>
                </div>
                
                <div v-if="story.route" class="flex items-center space-x-2 text-white/60 text-xs">
                  <Icon name="heroicons:map-pin" class="w-3 h-3" />
                  <span>{{ story.route.distance }}km</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 滚动指示器 -->
        <div class="flex justify-center mt-4 space-x-2">
          <div
            v-for="(story, index) in stories"
            :key="`indicator-${story.id}`"
            class="w-2 h-2 rounded-full transition-all duration-200"
            :class="index === 0 ? 'bg-primary-500' : 'bg-white/30'"
          />
        </div>
      </div>
    </section>

    <!-- 视图模式切换 -->
    <div class="flex justify-between items-center mb-8">
      <div class="flex items-center space-x-4">
        <h2 class="text-display-sm text-white font-bold">照片集合</h2>
        <span class="text-white/60 text-sm">{{ photos.length }} 张照片</span>
      </div>
      
      <div class="flex items-center bg-glass-bg backdrop-blur-md rounded-xl p-1 border border-glass-border">
        <button
          @click="$emit('viewModeChange', 'mosaic')"
          class="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200"
          :class="[
            viewMode === 'mosaic'
              ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          ]"
        >
          <Icon name="heroicons:squares-plus" class="w-4 h-4" />
          <span class="text-sm font-medium">拼贴</span>
        </button>
        
        <button
          @click="$emit('viewModeChange', 'grid')"
          class="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200"
          :class="[
            viewMode === 'grid'
              ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          ]"
        >
          <Icon name="heroicons:squares-2x2" class="w-4 h-4" />
          <span class="text-sm font-medium">网格</span>
        </button>
      </div>
    </div>

    <!-- Mosaic 布局 -->
    <div v-if="viewMode === 'mosaic'" class="mosaic-grid">
      <div
        v-for="(photo, index) in photos"
        :key="photo.id"
        class="mosaic-item group cursor-pointer relative overflow-hidden rounded-2xl"
        :class="getMosaicItemClass(index, photo.aspectRatio)"
        @click="$emit('photoClick', photo, index)"
      >
        <picture>
          <source
            :srcset="`${photo.url}?format=webp&w=800 800w, ${photo.url}?format=webp&w=1200 1200w`"
            type="image/webp"
          />
          <img
            :src="photo.thumbnail"
            :alt="photo.title"
            :loading="index > 6 ? 'lazy' : 'eager'"
            class="w-full h-full object-cover transition-all duration-350 group-hover:animate-gallery-mosaic-hover"
          />
        </picture>
        
        <!-- 悬浮信息 -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-350">
          <div class="absolute bottom-0 left-0 right-0 p-4">
            <h3 class="text-white font-medium text-sm mb-1 line-clamp-1">{{ photo.title }}</h3>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2 text-white/80 text-xs">
                <Icon name="heroicons:camera" class="w-3 h-3" />
                <span v-if="photo.camera">{{ photo.camera.make }}</span>
              </div>
              <div v-if="photo.location" class="flex items-center space-x-1 text-white/80 text-xs">
                <Icon name="heroicons:map-pin" class="w-3 h-3" />
                <span>{{ photo.location.name }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 标签 -->
        <div class="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-350">
          <div class="flex flex-wrap gap-1">
            <span
              v-for="tag in photo.tags.slice(0, 2)"
              :key="tag"
              class="px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-xs rounded-full"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 网格布局 -->
    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      <div
        v-for="(photo, index) in photos"
        :key="photo.id"
        class="group cursor-pointer relative aspect-square overflow-hidden rounded-xl"
        @click="$emit('photoClick', photo, index)"
      >
        <picture>
          <source
            :srcset="`${photo.url}?format=webp&w=400 400w`"
            type="image/webp"
          />
          <img
            :src="photo.thumbnail"
            :alt="photo.title"
            :loading="index > 10 ? 'lazy' : 'eager'"
            class="w-full h-full object-cover transition-all duration-350 group-hover:animate-gallery-mosaic-hover"
          />
        </picture>
        
        <!-- 悬浮信息 -->
        <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-350 flex items-center justify-center">
          <div class="text-center text-white">
            <h3 class="font-medium text-sm mb-1">{{ photo.title }}</h3>
            <p class="text-xs text-white/80">{{ formatDate(photo.takenAt) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
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
  aspectRatio: number
}

interface Story {
  id: string
  title: string
  description: string
  coverPhoto: Photo
  photos: Photo[]
  route?: {
    coordinates: [number, number][]
    distance: number
    duration: number
  }
  createdAt: string
}

interface Props {
  photos: Photo[]
  stories: Story[]
  viewMode?: 'mosaic' | 'grid'
  loading?: boolean
}

interface Emits {
  photoClick: [photo: Photo, index: number]
  storyClick: [story: Story]
  viewModeChange: [mode: string]
  viewAllStories: []
}

const props = withDefaults(defineProps<Props>(), {
  viewMode: 'mosaic',
  loading: false
})

const emit = defineEmits<Emits>()

// 获取 Mosaic 项目的样式类
const getMosaicItemClass = (index: number, aspectRatio: number) => {
  // 根据索引和宽高比决定网格占用
  const patterns = [
    'col-span-2 row-span-2', // 大图
    'col-span-1 row-span-1', // 小图
    'col-span-1 row-span-2', // 竖图
    'col-span-2 row-span-1', // 横图
    'col-span-1 row-span-1', // 小图
    'col-span-1 row-span-1', // 小图
  ]
  
  // 根据宽高比调整
  if (aspectRatio > 1.5) {
    return 'col-span-2 row-span-1' // 横图
  } else if (aspectRatio < 0.7) {
    return 'col-span-1 row-span-2' // 竖图
  }
  
  return patterns[index % patterns.length]
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
</script>

<style scoped>
/* Mosaic 网格布局 */
.mosaic-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 200px;
  gap: 1rem;
}

.mosaic-item {
  transition: all 0.35s ease;
}

.mosaic-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.4);
}

/* 滚动条隐藏 */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
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
  .mosaic-grid {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 150px;
  }
  
  .mosaic-item.col-span-2 {
    grid-column: span 2;
  }
  
  .mosaic-item.row-span-2 {
    grid-row: span 2;
  }
}

@media (max-width: 640px) {
  .story-card {
    width: 280px;
  }
}
</style>
