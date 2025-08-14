<template>
  <div class="gallery-page -mx-4 -my-8">
    <!-- 页面头部 -->
    <header class="relative py-16 pt-8 overflow-hidden">
      <!-- 背景装饰 -->
      <div class="absolute inset-0">
        <div
          class="absolute top-10 right-10 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-pulse"
        />
        <div
          class="absolute bottom-10 left-10 w-72 h-72 bg-secondary-500/10 rounded-full blur-3xl animate-pulse"
          style="animation-delay: 1.5s"
        />
      </div>

      <div class="container mx-auto px-4 relative z-10">
        <div class="text-center">
          <h1
            class="font-display text-display-lg md:text-display-xl font-bold mb-6 transition-colors duration-300"
            :class="
              $colorMode.value === 'dark' ? 'text-white' : 'text-gray-900'
            "
          >
            视觉画廊
          </h1>
          <p
            class="text-body-lg max-w-2xl mx-auto mb-8 transition-colors duration-300"
            :class="
              $colorMode.value === 'dark' ? 'text-white/70' : 'text-gray-600'
            "
          >
            用镜头记录世界的美好，用故事连接每一个瞬间。探索光影交织的艺术世界。
          </p>

          <!-- 统计信息 -->
          <div class="flex justify-center space-x-8 text-center">
            <div
              class="backdrop-blur-md rounded-2xl px-6 py-4 border transition-all duration-300"
              :class="
                $colorMode.value === 'dark'
                  ? 'bg-white/10 border-white/20'
                  : 'bg-white/80 border-gray-200'
              "
            >
              <div
                class="text-2xl font-bold mb-1 transition-colors duration-300"
                :class="
                  $colorMode.value === 'dark' ? 'text-white' : 'text-gray-900'
                "
              >
                {{ photos.length }}
              </div>
              <div
                class="text-sm transition-colors duration-300"
                :class="
                  $colorMode.value === 'dark'
                    ? 'text-white/60'
                    : 'text-gray-600'
                "
              >
                张照片
              </div>
            </div>
            <div
              class="backdrop-blur-md rounded-2xl px-6 py-4 border transition-all duration-300"
              :class="
                $colorMode.value === 'dark'
                  ? 'bg-white/10 border-white/20'
                  : 'bg-white/80 border-gray-200'
              "
            >
              <div
                class="text-2xl font-bold mb-1 transition-colors duration-300"
                :class="
                  $colorMode.value === 'dark' ? 'text-white' : 'text-gray-900'
                "
              >
                {{ stories.length }}
              </div>
              <div
                class="text-sm transition-colors duration-300"
                :class="
                  $colorMode.value === 'dark'
                    ? 'text-white/60'
                    : 'text-gray-600'
                "
              >
                个故事
              </div>
            </div>
            <div
              class="backdrop-blur-md rounded-2xl px-6 py-4 border transition-all duration-300"
              :class="
                $colorMode.value === 'dark'
                  ? 'bg-white/10 border-white/20'
                  : 'bg-white/80 border-gray-200'
              "
            >
              <div
                class="text-2xl font-bold mb-1 transition-colors duration-300"
                :class="
                  $colorMode.value === 'dark' ? 'text-white' : 'text-gray-900'
                "
              >
                {{ uniqueLocations }}
              </div>
              <div
                class="text-sm transition-colors duration-300"
                :class="
                  $colorMode.value === 'dark'
                    ? 'text-white/60'
                    : 'text-gray-600'
                "
              >
                个地点
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容 -->
    <main class="container mx-auto px-4 pb-20">
      <div class="flex gap-8">
        <!-- 侧边栏 -->
        <aside class="w-80 flex-shrink-0">
          <div class="sticky top-24 space-y-6">
            <!-- 相册分类 -->
            <div
              class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
            >
              <GalleryCategories
                :selected-category="selectedCategory"
                :selected-tags="selectedTags"
                :selected-time-range="selectedTimeRange"
                @category-change="handleCategoryChange"
                @tags-change="handleTagsChange"
                @time-range-change="handleTimeRangeChange"
              />
            </div>
          </div>
        </aside>

        <!-- 相册内容区域 -->
        <div class="flex-1 min-w-0">
          <GalleryMosaic
            :photos="filteredPhotos"
            :stories="stories"
            :view-mode="viewMode"
            :loading="loading"
            @photo-click="handlePhotoClick"
            @story-click="handleStoryClick"
            @view-mode-change="handleViewModeChange"
            @view-all-stories="handleViewAllStories"
          />
        </div>
      </div>

      <!-- 加载更多 -->
      <div v-if="hasMore" class="text-center mt-12">
        <button
          @click="loadMore"
          :disabled="loading"
          class="px-8 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-medium rounded-xl transition-all duration-200 hover:scale-105 disabled:scale-100 shadow-lg"
        >
          <span v-if="loading" class="flex items-center space-x-2">
            <div
              class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"
            ></div>
            <span>加载中...</span>
          </span>
          <span v-else>加载更多照片</span>
        </button>
      </div>
    </main>

    <!-- 照片灯箱 -->
    <PhotoLightbox
      v-if="showLightbox"
      :photos="photos"
      :initial-index="lightboxIndex"
      :show="showLightbox"
      @close="closeLightbox"
      @index-change="handleLightboxIndexChange"
      @tag-click="handleTagClick"
    />

    <!-- 故事查看器 -->
    <PhotoStory
      v-if="showStoryViewer && currentStory"
      :story="currentStory"
      :current-index="storyPhotoIndex"
      :show-map="showStoryMap"
      @close="closeStoryViewer"
      @photo-change="handleStoryPhotoChange"
      @tag-click="handleTagClick"
      @location-click="handleLocationClick"
    />
  </div>
</template>

<script setup lang="ts">
// 页面元数据
useHead({
  title: '视觉画廊 - Mindtrail',
  meta: [
    {
      name: 'description',
      content:
        '用镜头记录世界的美好，用故事连接每一个瞬间。探索光影交织的艺术世界。',
    },
  ],
})

// 响应式状态
const viewMode = ref<'mosaic' | 'grid'>('mosaic')
const selectedCategory = ref('all')
const selectedTags = ref<string[]>([])
const selectedTimeRange = ref('all')
const loading = ref(false)
const hasMore = ref(true)
const showLightbox = ref(false)
const lightboxIndex = ref(0)
const showStoryViewer = ref(false)
const currentStory = ref(null)
const storyPhotoIndex = ref(0)
const showStoryMap = ref(false)

// 模拟照片数据
const photos = ref([
  {
    id: '1',
    url: 'https://picsum.photos/1200/800?random=1',
    thumbnail: 'https://picsum.photos/400/300?random=1',
    title: '城市夜景',
    description: '繁华都市的夜晚，霓虹灯光交织成美丽的光影画卷。',
    location: {
      name: '上海外滩',
      coordinates: [121.4944, 31.2396] as [number, number],
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
      coordinates: [118.1667, 30.1333] as [number, number],
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
  {
    id: '3',
    url: 'https://picsum.photos/1600/900?random=3',
    thumbnail: 'https://picsum.photos/400/225?random=3',
    title: '海边日落',
    description: '金色的夕阳洒在海面上，波光粼粼，美不胜收。',
    location: {
      name: '三亚海滩',
      coordinates: [109.5119, 18.2577] as [number, number],
    },
    takenAt: '2024-01-08T18:20:00Z',
    camera: {
      make: 'Nikon',
      model: 'D850',
      settings: 'f/11, 1/250s, ISO 100',
    },
    tags: ['海景', '日落', '自然', '风光'],
    category: 'travel',
    aspectRatio: 1.78,
  },
  {
    id: '4',
    url: 'https://picsum.photos/1000/1000?random=4',
    thumbnail: 'https://picsum.photos/300/300?random=4',
    title: '古镇水乡',
    description: '江南水乡的古朴韵味，小桥流水人家。',
    location: {
      name: '周庄古镇',
      coordinates: [120.8519, 31.1158] as [number, number],
    },
    takenAt: '2024-01-05T14:15:00Z',
    camera: {
      make: 'Fujifilm',
      model: 'X-T4',
      settings: 'f/5.6, 1/200s, ISO 400',
    },
    tags: ['古镇', '水乡', '建筑', '文化'],
    category: 'travel',
    aspectRatio: 1,
  },
  {
    id: '5',
    url: 'https://picsum.photos/1400/800?random=5',
    thumbnail: 'https://picsum.photos/350/200?random=5',
    title: '森林深处',
    description: '阳光透过树叶的缝隙，在森林地面投下斑驳的光影。',
    location: {
      name: '张家界国家森林公园',
      coordinates: [110.4419, 29.1275] as [number, number],
    },
    takenAt: '2024-01-03T10:30:00Z',
    camera: {
      make: 'Canon',
      model: 'EOS R6',
      settings: 'f/4, 1/80s, ISO 320',
    },
    tags: ['森林', '自然', '光影', '绿色'],
    category: 'nature',
    aspectRatio: 1.75,
  },
  // 添加更多不同分类的照片
  {
    id: '6',
    url: 'https://picsum.photos/1200/900?random=6',
    thumbnail: 'https://picsum.photos/400/300?random=6',
    title: '朋友聚餐',
    description: '和好朋友们一起享受美好的聚餐时光。',
    location: {
      name: '北京三里屯',
      coordinates: [116.4551, 39.9389] as [number, number],
    },
    takenAt: '2024-01-12T19:30:00Z',
    camera: {
      make: 'iPhone',
      model: '15 Pro',
      settings: '自动模式',
    },
    tags: ['朋友', '聚餐', '美食', '快乐'],
    category: 'friends',
    aspectRatio: 1.33,
  },
  {
    id: '7',
    url: 'https://picsum.photos/800/1200?random=7',
    thumbnail: 'https://picsum.photos/300/400?random=7',
    title: '家庭晚餐',
    description: '温馨的家庭时光，妈妈做的菜总是最香的。',
    location: {
      name: '家',
      coordinates: [116.3974, 39.9093] as [number, number],
    },
    takenAt: '2024-01-14T18:00:00Z',
    camera: {
      make: 'iPhone',
      model: '15 Pro',
      settings: '人像模式',
    },
    tags: ['家庭', '晚餐', '温馨', '爱'],
    category: 'daily-life',
    aspectRatio: 0.67,
  },
  {
    id: '8',
    url: 'https://picsum.photos/1600/1200?random=8',
    thumbnail: 'https://picsum.photos/400/300?random=8',
    title: '美味拉面',
    description: '热腾腾的拉面，是冬日里最温暖的慰藉。',
    location: {
      name: '一兰拉面',
      coordinates: [116.4074, 39.9042] as [number, number],
    },
    takenAt: '2024-01-11T12:30:00Z',
    camera: {
      make: 'Sony',
      model: 'A7 III',
      settings: 'f/2.8, 1/60s, ISO 800',
    },
    tags: ['美食', '拉面', '日式', '温暖'],
    category: 'food',
    aspectRatio: 1.33,
  },
])

// 模拟故事数据
const stories = ref([
  {
    id: 'story-1',
    title: '城市探索之旅',
    description: '用镜头记录现代都市的繁华与宁静，探索城市中隐藏的美丽角落。',
    coverPhoto: photos.value[0],
    photos: [photos.value[0], photos.value[3]],
    route: {
      coordinates: [
        [121.4944, 31.2396],
        [120.8519, 31.1158],
      ] as [number, number][],
      distance: 85,
      duration: 120,
    },
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'story-2',
    title: '自然风光摄影',
    description: '走进大自然，感受山川湖海的壮美，捕捉最纯净的自然之美。',
    coverPhoto: photos.value[1],
    photos: [photos.value[1], photos.value[2], photos.value[4]],
    route: {
      coordinates: [
        [118.1667, 30.1333],
        [109.5119, 18.2577],
        [110.4419, 29.1275],
      ] as [number, number][],
      distance: 1200,
      duration: 480,
    },
    createdAt: '2024-01-10T08:00:00Z',
  },
])

// 计算属性
const filteredPhotos = computed(() => {
  let filtered = photos.value

  // 分类筛选
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(
      (photo) => photo.category === selectedCategory.value
    )
  }

  // 标签筛选
  if (selectedTags.value.length > 0) {
    filtered = filtered.filter((photo) =>
      selectedTags.value.some((tag) => photo.tags.includes(tag))
    )
  }

  // 时间范围筛选
  if (selectedTimeRange.value !== 'all') {
    const now = new Date()
    const filterDate = new Date()

    switch (selectedTimeRange.value) {
      case 'this-month':
        filterDate.setMonth(now.getMonth())
        break
      case 'last-month':
        filterDate.setMonth(now.getMonth() - 1)
        break
      case 'this-year':
        filterDate.setFullYear(now.getFullYear())
        break
      case 'last-year':
        filterDate.setFullYear(now.getFullYear() - 1)
        break
      case 'older':
        filterDate.setFullYear(now.getFullYear() - 2)
        filtered = filtered.filter(
          (photo) => new Date(photo.takenAt) < filterDate
        )
        return filtered
    }

    if (selectedTimeRange.value !== 'older') {
      filtered = filtered.filter((photo) => {
        const photoDate = new Date(photo.takenAt)
        return photoDate >= filterDate
      })
    }
  }

  return filtered
})

const uniqueLocations = computed(() => {
  const locations = new Set()
  photos.value.forEach((photo) => {
    if (photo.location) {
      locations.add(photo.location.name)
    }
  })
  return locations.size
})

// 事件处理
const handlePhotoClick = (photo: any, index: number) => {
  lightboxIndex.value = index
  showLightbox.value = true
}

const handleStoryClick = (story: any) => {
  currentStory.value = story
  storyPhotoIndex.value = 0
  showStoryViewer.value = true
}

const handleViewModeChange = (mode: string) => {
  viewMode.value = mode as 'mosaic' | 'grid'
}

const handleViewAllStories = () => {
  // 跳转到故事列表页面
  navigateTo('/gallery/stories')
}

const closeLightbox = () => {
  showLightbox.value = false
}

const handleLightboxIndexChange = (index: number) => {
  lightboxIndex.value = index
}

const closeStoryViewer = () => {
  showStoryViewer.value = false
  currentStory.value = null
}

const handleStoryPhotoChange = (index: number) => {
  storyPhotoIndex.value = index
}

const handleCategoryChange = (categoryId: string) => {
  selectedCategory.value = categoryId
}

const handleTagsChange = (tags: string[]) => {
  selectedTags.value = tags
}

const handleTimeRangeChange = (timeRangeId: string) => {
  selectedTimeRange.value = timeRangeId
}

const handleTagClick = (tag: string) => {
  // 切换标签筛选
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
}

const handleLocationClick = (location: string) => {
  // 实现位置跳转逻辑
  console.log('Location clicked:', location)
}

const loadMore = async () => {
  loading.value = true

  // 模拟加载更多数据
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // 这里应该从 API 加载更多照片
  // const newPhotos = await $fetch('/api/photos', { query: { offset: photos.value.length } })
  // photos.value.push(...newPhotos)

  loading.value = false
  hasMore.value = false // 模拟没有更多数据
}
</script>

<style scoped>
/* 页面特定样式 */
.gallery-page {
  min-height: 100vh;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .gallery-page header {
    padding: 2rem 0;
  }

  .flex.justify-center.space-x-8 {
    flex-direction: column;
    space-x: 0;
    gap: 1rem;
    align-items: center;
  }
}
</style>
