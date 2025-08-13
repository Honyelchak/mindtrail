<template>
  <div
    class="map-page h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-tertiary overflow-hidden"
  >
    <!-- 主导航 -->
    <MainNavigation />

    <!-- 页面头部 -->
    <header
      class="relative z-30 bg-glass-bg/80 backdrop-blur-md border-b border-glass-border p-4 mt-16"
    >
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-display-md text-white font-bold mb-1">叙事地图</h1>
          <p class="text-white/70 text-sm">
            用地理位置串联生活的点点滴滴，探索空间中的故事
          </p>
        </div>

        <!-- 页面操作 -->
        <div class="flex items-center space-x-4">
          <!-- 视图模式切换 -->
          <div
            class="flex items-center bg-glass-bg backdrop-blur-md rounded-lg p-1 border border-glass-border"
          >
            <button
              v-for="mode in viewModes"
              :key="mode.value"
              @click="setViewMode(mode.value)"
              class="flex items-center space-x-2 px-3 py-2 rounded transition-all duration-200"
              :class="[
                viewMode === mode.value
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10',
              ]"
            >
              <Icon :name="mode.icon" class="w-4 h-4" />
              <span class="text-sm">{{ mode.label }}</span>
            </button>
          </div>

          <!-- 故事切换 -->
          <div
            class="flex items-center bg-glass-bg backdrop-blur-md rounded-lg border border-glass-border overflow-hidden"
          >
            <select
              v-model="selectedStoryId"
              class="bg-transparent text-white text-sm px-3 py-2 border-none outline-none cursor-pointer"
              @change="handleStoryChange"
            >
              <option value="" class="bg-slate-800">所有标记</option>
              <option
                v-for="story in stories"
                :key="story.id"
                :value="story.id"
                class="bg-slate-800"
              >
                {{ story.title }}
              </option>
            </select>
          </div>

          <!-- 搜索按钮 -->
          <button
            @click="showSearch = !showSearch"
            class="w-10 h-10 bg-glass-bg backdrop-blur-md border border-glass-border rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
            :class="{ 'bg-primary-500/20 text-primary-300': showSearch }"
          >
            <Icon name="heroicons:magnifying-glass" class="w-5 h-5" />
          </button>

          <!-- 设置按钮 -->
          <button
            @click="showSettings = !showSettings"
            class="w-10 h-10 bg-glass-bg backdrop-blur-md border border-glass-border rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
            :class="{ 'bg-primary-500/20 text-primary-300': showSettings }"
          >
            <Icon name="heroicons:cog-6-tooth" class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- 搜索栏 -->
      <div v-if="showSearch" class="mt-4 transition-all duration-300">
        <div class="relative max-w-md">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索地点、标记或故事..."
            class="w-full bg-glass-bg backdrop-blur-md border border-glass-border rounded-xl px-4 py-3 pl-12 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all duration-200"
          />
          <Icon
            name="heroicons:magnifying-glass"
            class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60"
          />
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="relative h-full">
      <!-- 主地图 -->
      <MapMain
        :markers="filteredMarkers"
        :paths="visiblePaths"
        :theme="mapTheme"
        :active-marker="activeMarkerId"
        :show-clusters="showClusters"
        @marker-click="handleMarkerClick"
        @path-click="handlePathClick"
        @cluster-click="handleClusterClick"
        @theme-change="handleThemeChange"
        @clusters-toggle="handleClustersToggle"
      />

      <!-- 地图故事面板 -->
      <MapStoryPanel
        v-if="selectedStory"
        :story="selectedStory"
        :position="storyPanelPosition"
        :collapsed="storyPanelCollapsed"
        @marker-click="handleMarkerClick"
        @path-replay="handlePathReplay"
        @tag-click="handleTagClick"
        @edit-story="handleEditStory"
        @share-story="handleShareStory"
        @toggle-collapsed="toggleStoryPanel"
        @show-all-markers="showAllStoryMarkers"
        @fit-to-markers="fitToStoryMarkers"
      />

      <!-- 标记详情面板 -->
      <div
        v-if="selectedMarker && !selectedStory"
        class="absolute top-4 right-4 w-80 bg-glass-bg/95 backdrop-blur-md border border-glass-border rounded-2xl shadow-glass-lg z-20 overflow-hidden"
      >
        <!-- 标记详情头部 -->
        <div class="p-4 border-b border-glass-border">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center"
                :style="{
                  backgroundColor: getMarkerColor(selectedMarker.type),
                }"
              >
                <Icon
                  :name="getMarkerIcon(selectedMarker.type)"
                  class="w-5 h-5 text-white"
                />
              </div>
              <div>
                <h4 class="text-white font-medium">
                  {{ selectedMarker.title }}
                </h4>
                <p class="text-white/60 text-sm">
                  {{ getMarkerTypeLabel(selectedMarker.type) }}
                </p>
              </div>
            </div>

            <button
              @click="selectedMarker = null"
              class="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-all duration-200"
            >
              <Icon name="heroicons:x-mark" class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- 标记详情内容 -->
        <div class="p-4">
          <div class="space-y-4">
            <!-- 缩略图 -->
            <div
              v-if="selectedMarker.thumbnail"
              class="aspect-video rounded-lg overflow-hidden border border-white/20"
            >
              <img
                :src="selectedMarker.thumbnail"
                :alt="selectedMarker.title"
                class="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <!-- 描述 -->
            <p class="text-white/80 text-sm">
              {{ selectedMarker.description }}
            </p>

            <!-- 元信息 -->
            <div class="space-y-2 text-sm">
              <div class="flex items-center space-x-2 text-white/60">
                <Icon name="heroicons:calendar-days" class="w-4 h-4" />
                <span>{{ formatMarkerDate(selectedMarker.date) }}</span>
              </div>

              <div class="flex items-center space-x-2 text-white/60">
                <Icon name="heroicons:map-pin" class="w-4 h-4" />
                <span
                  >{{ selectedMarker.coordinates[0].toFixed(4) }},
                  {{ selectedMarker.coordinates[1].toFixed(4) }}</span
                >
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="flex space-x-2 pt-2">
              <button
                @click="viewMarkerDetail"
                class="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm rounded-lg transition-colors duration-200"
              >
                查看详情
              </button>

              <button
                @click="centerOnMarker"
                class="px-4 py-2 bg-white/10 hover:bg-white/20 text-white/80 text-sm rounded-lg transition-colors duration-200"
              >
                居中
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 设置面板 -->
    <div
      v-if="showSettings"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
      @click="showSettings = false"
    >
      <div
        class="bg-glass-bg/90 backdrop-blur-md border border-glass-border rounded-2xl p-6 max-w-md w-full mx-4"
        @click.stop
      >
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-white font-medium text-lg">地图设置</h3>
          <button
            @click="showSettings = false"
            class="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-all duration-200"
          >
            <Icon name="heroicons:x-mark" class="w-4 h-4" />
          </button>
        </div>

        <div class="space-y-4">
          <!-- 地图主题 -->
          <div class="space-y-2">
            <label class="text-white/80 text-sm">地图主题</label>
            <div class="flex items-center space-x-2">
              <button
                v-for="theme in mapThemes"
                :key="theme.value"
                @click="mapTheme = theme.value"
                class="flex-1 px-3 py-2 rounded-lg transition-all duration-200"
                :class="[
                  mapTheme === theme.value
                    ? 'bg-primary-500 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20',
                ]"
              >
                {{ theme.label }}
              </button>
            </div>
          </div>

          <!-- 显示选项 */
          <div class="space-y-3">
            <label class="text-white/80 text-sm">显示选项</label>
            
            <div class="space-y-2">
              <label class="flex items-center space-x-3">
                <input
                  v-model="showClusters"
                  type="checkbox"
                  class="w-4 h-4 text-primary-500 bg-white/20 border-white/30 rounded focus:ring-primary-500"
                />
                <span class="text-white/70 text-sm">显示标记聚合</span>
              </label>
              
              <label class="flex items-center space-x-3">
                <input
                  v-model="showPaths"
                  type="checkbox"
                  class="w-4 h-4 text-primary-500 bg-white/20 border-white/30 rounded focus:ring-primary-500"
                />
                <span class="text-white/70 text-sm">显示路径轨迹</span>
              </label>
              
              <label class="flex items-center space-x-3">
                <input
                  v-model="showMarkerLabels"
                  type="checkbox"
                  class="w-4 h-4 text-primary-500 bg-white/20 border-white/30 rounded focus:ring-primary-500"
                />
                <span class="text-white/70 text-sm">显示标记标签</span>
              </label>
            </div>
          </div>
          
          <!-- 重置按钮 -->
          <div class="pt-4 border-t border-white/10">
            <button
              @click="resetSettings"
              class="w-full px-4 py-2 bg-white/10 hover:bg-white/20 text-white/80 text-sm rounded-lg transition-colors duration-200"
            >
              重置为默认设置
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 页面元数据
useHead({
  title: '叙事地图 - Mindtrail',
  meta: [
    {
      name: 'description',
      content: '用地理位置串联生活的点点滴滴，探索空间中的故事。',
    },
  ],
})

// 响应式状态
const viewMode = ref('explore')
const selectedStoryId = ref('')
const searchQuery = ref('')
const showSearch = ref(false)
const showSettings = ref(false)
const mapTheme = ref<'light' | 'dark'>('dark')
const showClusters = ref(true)
const showPaths = ref(true)
const showMarkerLabels = ref(false)
const activeMarkerId = ref('')
const selectedMarker = ref(null)
const selectedStory = ref(null)
const storyPanelPosition = ref<'left' | 'right'>('right')
const storyPanelCollapsed = ref(false)

// 配置数据
const viewModes = [
  { value: 'explore', label: '探索', icon: 'heroicons:globe-asia-australia' },
  { value: 'stories', label: '故事', icon: 'heroicons:book-open' },
  { value: 'timeline', label: '时间线', icon: 'heroicons:clock' },
]

const mapThemes = [
  { value: 'light', label: '亮色' },
  { value: 'dark', label: '暗色' },
]

// 模拟标记数据
const markers = ref([
  {
    id: '1',
    coordinates: [121.4944, 31.2396] as [number, number],
    title: '上海外滩夜景',
    description: '在外滩拍摄了一组城市夜景照片，记录了上海的繁华夜色。',
    type: 'photo',
    thumbnail: 'https://picsum.photos/400/300?random=1',
    date: '2024-01-15T20:30:00Z',
    content: { photoId: '1' },
  },
  {
    id: '2',
    coordinates: [118.1667, 30.1333] as [number, number],
    title: '黄山日出',
    description: '清晨在黄山顶峰观看日出，云海翻腾，美不胜收。',
    type: 'photo',
    thumbnail: 'https://picsum.photos/400/300?random=2',
    date: '2024-01-10T06:45:00Z',
    content: { photoId: '2' },
  },
  {
    id: '3',
    coordinates: [120.1551, 30.2741] as [number, number],
    title: '杭州西湖游记',
    description: '春天的西湖，柳絮飞舞，游人如织，写下了这篇游记。',
    type: 'article',
    date: '2024-01-08T14:20:00Z',
    content: { articleId: '3' },
  },
  {
    id: '4',
    coordinates: [109.5119, 18.2577] as [number, number],
    title: '三亚海滩度假',
    description: '在三亚度过了愉快的假期，阳光、沙滩、海浪。',
    type: 'moment',
    thumbnail: 'https://picsum.photos/400/300?random=4',
    date: '2024-01-05T16:00:00Z',
    content: { momentId: '4' },
  },
  {
    id: '5',
    coordinates: [116.4074, 39.9042] as [number, number],
    title: '完成北京马拉松',
    description: '人生第一次全程马拉松，在北京完成了这个重要的里程碑。',
    type: 'milestone',
    date: '2024-01-01T08:00:00Z',
    content: { milestoneId: '5' },
  },
])

// 模拟故事数据
const stories = ref([
  {
    id: 'story-1',
    title: '华东摄影之旅',
    description: '用镜头记录华东地区的美丽风光，从繁华都市到自然山水。',
    content: '<p>这次华东摄影之旅让我收获颇丰...</p>',
    coverImage: 'https://picsum.photos/400/300?random=1',
    markers: [markers.value[0], markers.value[1], markers.value[2]],
    path: {
      id: 'path-1',
      coordinates: [
        [121.4944, 31.2396],
        [118.1667, 30.1333],
        [120.1551, 30.2741],
      ] as [number, number][],
      distance: 350,
      duration: 180,
      color: '#3b82f6',
    },
    tags: ['摄影', '旅行', '华东'],
    createdAt: '2024-01-15T10:00:00Z',
    distance: 350,
  },
  {
    id: 'story-2',
    title: '南方度假记',
    description: '从海南的阳光沙滩到北京的马拉松挑战，记录生活的精彩瞬间。',
    content: '<p>这次南北之行体验了不同的生活...</p>',
    coverImage: 'https://picsum.photos/400/300?random=4',
    markers: [markers.value[3], markers.value[4]],
    path: {
      id: 'path-2',
      coordinates: [
        [109.5119, 18.2577],
        [116.4074, 39.9042],
      ] as [number, number][],
      distance: 1800,
      duration: 300,
      color: '#10b981',
    },
    tags: ['度假', '运动', '挑战'],
    createdAt: '2024-01-05T10:00:00Z',
    distance: 1800,
  },
])

// 计算属性
const filteredMarkers = computed(() => {
  let result = markers.value

  // 根据选中的故事过滤
  if (selectedStoryId.value) {
    const story = stories.value.find((s) => s.id === selectedStoryId.value)
    if (story) {
      result = story.markers
    }
  }

  // 根据搜索查询过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (marker) =>
        marker.title.toLowerCase().includes(query) ||
        marker.description.toLowerCase().includes(query)
    )
  }

  return result
})

const visiblePaths = computed(() => {
  if (!showPaths.value) return []

  if (selectedStoryId.value) {
    const story = stories.value.find((s) => s.id === selectedStoryId.value)
    return story?.path ? [story.path] : []
  }

  return stories.value.map((s) => s.path).filter(Boolean)
})

// 方法
const setViewMode = (mode: string) => {
  viewMode.value = mode
}

const handleStoryChange = () => {
  const story = stories.value.find((s) => s.id === selectedStoryId.value)
  selectedStory.value = story || null

  if (story) {
    storyPanelCollapsed.value = false
  }
}

const handleMarkerClick = (marker: any) => {
  activeMarkerId.value = marker.id
  selectedMarker.value = marker
}

const handlePathClick = (path: any) => {
  // 实现路径点击逻辑
  console.log('Path clicked:', path)
}

const handleClusterClick = (cluster: any) => {
  // 实现聚合点击逻辑
  console.log('Cluster clicked:', cluster)
}

const handleThemeChange = (theme: string) => {
  mapTheme.value = theme as 'light' | 'dark'
}

const handleClustersToggle = (show: boolean) => {
  showClusters.value = show
}

const handlePathReplay = (path: any) => {
  // 实现路径回放逻辑
  console.log('Path replay:', path)
}

const handleTagClick = (tag: string) => {
  searchQuery.value = tag
  showSearch.value = true
}

const handleEditStory = (story: any) => {
  // 实现故事编辑逻辑
  console.log('Edit story:', story)
}

const handleShareStory = (story: any) => {
  // 实现故事分享逻辑
  console.log('Share story:', story)
}

const toggleStoryPanel = () => {
  storyPanelCollapsed.value = !storyPanelCollapsed.value
}

const showAllStoryMarkers = () => {
  // 显示故事的所有标记
  if (selectedStory.value) {
    // 实现显示逻辑
  }
}

const fitToStoryMarkers = () => {
  // 适应故事标记的视图
  if (selectedStory.value) {
    // 实现适应逻辑
  }
}

const viewMarkerDetail = () => {
  if (selectedMarker.value) {
    const marker = selectedMarker.value
    if (marker.type === 'article') {
      navigateTo(`/articles/${marker.content?.articleId}`)
    } else if (marker.type === 'photo') {
      navigateTo(`/gallery?photo=${marker.content?.photoId}`)
    }
  }
}

const centerOnMarker = () => {
  // 实现标记居中逻辑
  console.log('Center on marker:', selectedMarker.value)
}

const resetSettings = () => {
  mapTheme.value = 'dark'
  showClusters.value = true
  showPaths.value = true
  showMarkerLabels.value = false
}

const getMarkerColor = (type: string) => {
  const colors = {
    photo: '#10b981',
    article: '#3b82f6',
    moment: '#f59e0b',
    milestone: '#ef4444',
  }
  return colors[type as keyof typeof colors] || '#6b7280'
}

const getMarkerIcon = (type: string) => {
  const icons = {
    photo: 'heroicons:photo',
    article: 'heroicons:document-text',
    moment: 'heroicons:chat-bubble-left',
    milestone: 'heroicons:flag',
  }
  return icons[type as keyof typeof icons] || 'heroicons:map-pin'
}

const getMarkerTypeLabel = (type: string) => {
  const labels = {
    photo: '照片',
    article: '文章',
    moment: '说说',
    milestone: '里程碑',
  }
  return labels[type as keyof typeof labels] || type
}

const formatMarkerDate = (date: string) => {
  const d = new Date(date)
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<style scoped>
/* 页面特定样式 */
.map-page {
  height: 100vh;
  overflow: hidden;
}

/* 复选框样式 */
input[type='checkbox']:checked {
  background-color: theme('colors.primary.500');
  border-color: theme('colors.primary.500');
}

/* 选择框样式 */
select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .map-page header {
    padding: 1rem;
  }

  .map-page header .flex {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .absolute.top-4.right-4 {
    position: fixed;
    top: 1rem;
    right: 1rem;
    left: 1rem;
    width: auto;
  }
}
</style>
