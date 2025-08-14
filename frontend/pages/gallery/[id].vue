<!--
  图片详情页 - [id].vue
  
  Features:
  - 图片展示
  - 图片信息
  - 评价/感悟功能
  - 地图位置
-->

<template>
  <div class="photo-detail min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
    <!-- 导航栏 -->
    <MainNavigation />

    <!-- 主要内容 -->
    <main class="pt-20 pb-16">
      <div class="container mx-auto px-6 max-w-7xl">
        <div class="grid lg:grid-cols-3 gap-8">
          <!-- 图片展示区域 -->
          <div class="lg:col-span-2">
            <!-- 图片容器 -->
            <div class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden mb-8">
              <div class="relative">
                <img
                  :src="photo.url"
                  :alt="photo.title"
                  class="w-full h-auto object-cover"
                  loading="eager"
                />
                
                <!-- 图片操作按钮 -->
                <div class="absolute top-4 right-4 flex space-x-2">
                  <button
                    @click="downloadPhoto"
                    class="w-10 h-10 bg-black/50 backdrop-blur-md hover:bg-black/70 rounded-full flex items-center justify-center transition-colors duration-200"
                  >
                    <Icon name="heroicons:arrow-down-tray" class="w-5 h-5 text-white" />
                  </button>
                  <button
                    @click="sharePhoto"
                    class="w-10 h-10 bg-black/50 backdrop-blur-md hover:bg-black/70 rounded-full flex items-center justify-center transition-colors duration-200"
                  >
                    <Icon name="heroicons:share" class="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              <!-- 图片信息 -->
              <div class="p-6">
                <h1 class="text-2xl font-bold text-white mb-2">{{ photo.title }}</h1>
                <p class="text-white/80 mb-4">{{ photo.description }}</p>
                
                <!-- 标签 -->
                <div class="flex flex-wrap gap-2 mb-4">
                  <span
                    v-for="tag in photo.tags"
                    :key="tag"
                    class="px-3 py-1 bg-white/10 text-white/70 rounded-full text-sm hover:bg-white/20 transition-colors duration-200 cursor-pointer"
                    @click="handleTagClick(tag)"
                  >
                    {{ tag }}
                  </span>
                </div>

                <!-- 拍摄信息 -->
                <div class="grid md:grid-cols-2 gap-4 text-sm text-white/60">
                  <div>
                    <div class="flex items-center space-x-2 mb-2">
                      <Icon name="heroicons:calendar" class="w-4 h-4" />
                      <span>{{ formatDate(photo.takenAt) }}</span>
                    </div>
                    <div v-if="photo.location" class="flex items-center space-x-2 mb-2">
                      <Icon name="heroicons:map-pin" class="w-4 h-4" />
                      <span>{{ photo.location.name }}</span>
                    </div>
                  </div>
                  <div>
                    <div class="flex items-center space-x-2 mb-2">
                      <Icon name="heroicons:camera" class="w-4 h-4" />
                      <span>{{ photo.camera.make }} {{ photo.camera.model }}</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <Icon name="heroicons:cog-6-tooth" class="w-4 h-4" />
                      <span>{{ photo.camera.settings }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 地图位置 -->
            <div v-if="photo.location" class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <h3 class="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <Icon name="heroicons:map" class="w-5 h-5" />
                <span>拍摄位置</span>
              </h3>
              <div class="h-64 bg-white/10 rounded-xl flex items-center justify-center">
                <div class="text-center text-white/60">
                  <Icon name="heroicons:map-pin" class="w-8 h-8 mx-auto mb-2" />
                  <p>{{ photo.location.name }}</p>
                  <p class="text-sm">地图功能开发中...</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 侧边栏 -->
          <div class="lg:col-span-1">
            <!-- 图片评价/感悟 -->
            <div class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <PhotoReflection :photo-id="photo.id" />
            </div>
          </div>
        </div>

        <!-- 返回按钮 -->
        <div class="mt-8 flex items-center justify-between">
          <NuxtLink
            to="/gallery-enhanced"
            class="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 rounded-xl transition-all duration-300 text-white"
          >
            <Icon name="heroicons:arrow-left" class="w-4 h-4" />
            <span>返回相册</span>
          </NuxtLink>
          
          <!-- 相邻图片导航 -->
          <div class="flex items-center space-x-2">
            <button
              v-if="prevPhoto"
              @click="navigateToPhoto(prevPhoto.id)"
              class="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors duration-200 text-white"
            >
              <Icon name="heroicons:chevron-left" class="w-4 h-4" />
              <span>上一张</span>
            </button>
            <button
              v-if="nextPhoto"
              @click="navigateToPhoto(nextPhoto.id)"
              class="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors duration-200 text-white"
            >
              <span>下一张</span>
              <Icon name="heroicons:chevron-right" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// 图片接口
interface Photo {
  id: string
  url: string
  thumbnail: string
  title: string
  description: string
  location?: {
    name: string
    coordinates: [number, number]
  }
  takenAt: string
  camera: {
    make: string
    model: string
    settings: string
  }
  tags: string[]
  category: string
  aspectRatio: number
}

// 获取路由参数
const route = useRoute()
const photoId = route.params.id as string

// Mock照片数据（实际应该从API获取）
const allPhotos: Photo[] = [
  {
    id: '1',
    url: 'https://picsum.photos/1200/800?random=1',
    thumbnail: 'https://picsum.photos/400/300?random=1',
    title: '城市夜景',
    description: '繁华都市的夜晚，霓虹灯光交织成美丽的光影画卷。这张照片拍摄于上海外滩，记录了这座城市最美丽的夜晚时刻。',
    location: {
      name: '上海外滩',
      coordinates: [121.4944, 31.2396],
    },
    takenAt: '2024-01-15T20:30:00Z',
    camera: {
      make: 'Canon',
      model: 'EOS R5',
      settings: 'f/2.8, 1/60s, ISO 800',
    },
    tags: ['城市', '夜景', '建筑', '灯光'],
    category: 'nature',
    aspectRatio: 1.5,
  },
  {
    id: '2',
    url: 'https://picsum.photos/800/1200?random=2',
    thumbnail: 'https://picsum.photos/300/400?random=2',
    title: '山间晨雾',
    description: '清晨的山谷中，薄雾缭绕，宛如仙境。',
    location: {
      name: '黄山',
      coordinates: [118.1667, 30.1333],
    },
    takenAt: '2024-01-10T06:45:00Z',
    camera: {
      make: 'Sony',
      model: 'A7R IV',
      settings: 'f/8, 1/125s, ISO 200',
    },
    tags: ['自然', '山景', '晨雾', '风光'],
    category: 'nature',
    aspectRatio: 0.67,
  },
  // 可以添加更多照片...
]

// 当前照片
const photo = computed(() => {
  return allPhotos.find(p => p.id === photoId) || allPhotos[0]
})

// 上一张和下一张照片
const currentIndex = computed(() => {
  return allPhotos.findIndex(p => p.id === photoId)
})

const prevPhoto = computed(() => {
  const index = currentIndex.value
  return index > 0 ? allPhotos[index - 1] : null
})

const nextPhoto = computed(() => {
  const index = currentIndex.value
  return index < allPhotos.length - 1 ? allPhotos[index + 1] : null
})

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 事件处理
const handleTagClick = (tag: string) => {
  // 跳转到相册页面并筛选该标签
  navigateTo(`/gallery-enhanced?tag=${encodeURIComponent(tag)}`)
}

const downloadPhoto = () => {
  // 实现图片下载功能
  const link = document.createElement('a')
  link.href = photo.value.url
  link.download = `${photo.value.title}.jpg`
  link.click()
}

const sharePhoto = async () => {
  // 实现图片分享功能
  if (navigator.share) {
    try {
      await navigator.share({
        title: photo.value.title,
        text: photo.value.description,
        url: window.location.href
      })
    } catch (error) {
      console.log('分享失败:', error)
    }
  } else {
    // 复制链接到剪贴板
    await navigator.clipboard.writeText(window.location.href)
    // 这里可以显示一个提示
  }
}

const navigateToPhoto = (photoId: string) => {
  navigateTo(`/gallery/${photoId}`)
}

// SEO设置
useHead({
  title: `${photo.value.title} - 视觉画廊 - Mindtrail`,
  meta: [
    { name: 'description', content: photo.value.description },
    { property: 'og:title', content: photo.value.title },
    { property: 'og:description', content: photo.value.description },
    { property: 'og:image', content: photo.value.url }
  ]
})
</script>

<style scoped>
/* 图片容器样式 */
.photo-detail img {
  max-height: 70vh;
  width: 100%;
  object-fit: contain;
}

/* 响应式调整 */
@media (max-width: 1024px) {
  .photo-detail img {
    max-height: 50vh;
  }
}
</style>
