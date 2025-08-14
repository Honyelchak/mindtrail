<template>
  <div class="map-page -mx-4 -my-8">
    <!-- 页面内容区域 -->
    <div>
      <!-- 优化后的页面头部 -->
      <header
        class="relative z-10 bg-gradient-to-r from-glass-bg/95 to-glass-bg/90 backdrop-blur-xl border-b border-glass-border shadow-glass-lg"
      >
        <div class="container mx-auto px-6 py-5">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <!-- 页面图标 -->
              <div
                class="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg"
              >
                <Icon
                  name="heroicons:globe-asia-australia"
                  class="w-6 h-6 text-white"
                />
              </div>

              <div>
                <h1 class="text-display-md text-white font-bold mb-1">
                  叙事地图
                </h1>
                <p class="text-white/70 text-sm">
                  用地理位置串联生活的点点滴滴，探索空间中的故事
                </p>
              </div>
            </div>

            <!-- 页面操作 -->
            <div class="flex items-center space-x-4">
              <!-- 视图模式切换 -->
              <div
                class="flex items-center bg-white/10 backdrop-blur-md rounded-xl p-1 border border-white/20 shadow-inner"
              >
                <button
                  v-for="mode in viewModes"
                  :key="mode.value"
                  @click="setViewMode(mode.value)"
                  class="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
                  :class="[
                    viewMode === mode.value
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg transform scale-105'
                      : 'text-white/70 hover:text-white hover:bg-white/10',
                  ]"
                >
                  <Icon :name="mode.icon" class="w-4 h-4" />
                  <span class="text-sm font-medium">{{ mode.label }}</span>
                </button>
              </div>

              <!-- 故事选择器 -->
              <div class="relative">
                <select
                  v-model="selectedStoryId"
                  class="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white text-sm px-4 py-2 pr-10 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all duration-300 hover:bg-white/15"
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
                <Icon
                  name="heroicons:chevron-down"
                  class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none"
                />
              </div>

              <!-- 快速操作 -->
              <div class="flex items-center space-x-2">
                <button
                  @click="showSearch = !showSearch"
                  class="group w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
                  :class="{
                    'bg-primary-500/20 text-primary-300 border-primary-400/50':
                      showSearch,
                  }"
                >
                  <Icon
                    name="heroicons:magnifying-glass"
                    class="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
                  />
                </button>

                <button
                  @click="showSettings = !showSettings"
                  class="group w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
                  :class="{
                    'bg-primary-500/20 text-primary-300 border-primary-400/50':
                      showSettings,
                  }"
                >
                  <Icon
                    name="heroicons:cog-6-tooth"
                    class="w-5 h-5 transition-transform duration-300 group-hover:rotate-90"
                  />
                </button>
              </div>
            </div>
          </div>

          <!-- 优化后的搜索栏 -->
          <div
            v-if="showSearch"
            class="mt-4 transition-all duration-500 transform"
            :class="
              showSearch
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 -translate-y-4'
            "
          >
            <div class="relative max-w-md">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="搜索地点、标记或故事..."
                class="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 pl-12 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all duration-300 hover:bg-white/15"
              />
              <Icon
                name="heroicons:magnifying-glass"
                class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60"
              />

              <!-- 搜索建议 -->
              <div
                v-if="searchQuery && searchSuggestions.length > 0"
                class="absolute top-full left-0 right-0 mt-2 bg-glass-bg/95 backdrop-blur-xl border border-glass-border rounded-xl shadow-glass-lg overflow-hidden z-10"
              >
                <div
                  v-for="suggestion in searchSuggestions.slice(0, 5)"
                  :key="suggestion.id"
                  class="flex items-center space-x-3 p-3 hover:bg-white/10 cursor-pointer transition-colors duration-200"
                  @click="selectSuggestion(suggestion)"
                >
                  <Icon
                    :name="getMarkerIcon(suggestion.type)"
                    class="w-4 h-4 text-white/60"
                  />
                  <div class="flex-1 min-w-0">
                    <div class="text-white text-sm font-medium">
                      {{ suggestion.title }}
                    </div>
                    <div class="text-white/60 text-xs">
                      {{ suggestion.description }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
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

        <!-- 优化后的标记详情面板 -->
        <div
          v-if="selectedMarker && !selectedStory"
          class="absolute top-6 right-6 w-96 bg-gradient-to-br from-glass-bg/95 to-glass-bg/90 backdrop-blur-xl border border-glass-border rounded-2xl shadow-glass-lg z-20 overflow-hidden"
        >
          <!-- 标记详情头部 -->
          <div
            class="p-6 border-b border-glass-border bg-gradient-to-r from-white/5 to-transparent"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div
                  class="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                  :style="{
                    backgroundColor: getMarkerColor(selectedMarker.type),
                  }"
                >
                  <Icon
                    :name="getMarkerIcon(selectedMarker.type)"
                    class="w-6 h-6 text-white"
                  />
                </div>
                <div>
                  <h4 class="text-white font-bold text-lg">
                    {{ selectedMarker.title }}
                  </h4>
                  <p class="text-white/60 text-sm">
                    {{ getMarkerTypeLabel(selectedMarker.type) }}
                  </p>
                </div>
              </div>

              <button
                @click="selectedMarker = null"
                class="group w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white/70 hover:text-white transition-all duration-300 hover:scale-110"
              >
                <Icon
                  name="heroicons:x-mark"
                  class="w-4 h-4 transition-transform duration-300 group-hover:rotate-90"
                />
              </button>
            </div>
          </div>

          <!-- 标记详情内容 -->
          <div class="p-6">
            <div class="space-y-6">
              <!-- 缩略图 -->
              <div
                v-if="selectedMarker.thumbnail"
                class="aspect-video rounded-xl overflow-hidden border border-white/20 shadow-lg"
              >
                <img
                  :src="selectedMarker.thumbnail"
                  :alt="selectedMarker.title"
                  class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                />
              </div>

              <!-- 描述 -->
              <p class="text-white/80 text-sm leading-relaxed">
                {{ selectedMarker.description }}
              </p>

              <!-- 元信息 -->
              <div class="bg-white/5 rounded-xl p-4 border border-white/10">
                <h5
                  class="text-white/90 font-medium mb-3 flex items-center space-x-2"
                >
                  <Icon name="heroicons:information-circle" class="w-4 h-4" />
                  <span>详细信息</span>
                </h5>

                <div class="space-y-3 text-sm">
                  <div class="flex items-center space-x-3">
                    <Icon
                      name="heroicons:calendar-days"
                      class="w-4 h-4 text-white/60"
                    />
                    <span class="text-white/80">{{
                      formatMarkerDate(selectedMarker.date)
                    }}</span>
                  </div>

                  <div class="flex items-center space-x-3">
                    <Icon
                      name="heroicons:map-pin"
                      class="w-4 h-4 text-white/60"
                    />
                    <span class="text-white/80 font-mono text-xs">
                      {{ selectedMarker.coordinates[0].toFixed(4) }},
                      {{ selectedMarker.coordinates[1].toFixed(4) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- 操作按钮 -->
              <div class="flex space-x-3 pt-2">
                <button
                  @click="viewMarkerDetail"
                  class="flex-1 px-4 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  查看详情
                </button>

                <button
                  @click="centerOnMarker"
                  class="px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white/80 hover:text-white font-medium rounded-xl transition-all duration-300 hover:scale-105"
                >
                  居中
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- 优化后的设置面板 -->
      <div
        v-if="showSettings"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
        @click="showSettings = false"
      >
        <div
          class="bg-gradient-to-br from-glass-bg/95 to-glass-bg/90 backdrop-blur-xl border border-glass-border rounded-2xl shadow-glass-lg p-8 max-w-lg w-full mx-4"
          @click.stop
        >
          <div class="flex items-center justify-between mb-8">
            <div class="flex items-center space-x-3">
              <div
                class="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center"
              >
                <Icon name="heroicons:cog-6-tooth" class="w-5 h-5 text-white" />
              </div>
              <h3 class="text-white font-bold text-xl">地图设置</h3>
            </div>

            <button
              @click="showSettings = false"
              class="group w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white/70 hover:text-white transition-all duration-300 hover:scale-110"
            >
              <Icon
                name="heroicons:x-mark"
                class="w-4 h-4 transition-transform duration-300 group-hover:rotate-90"
              />
            </button>
          </div>

          <div class="space-y-6">
            <!-- 地图主题 -->
            <div class="space-y-3">
              <label
                class="text-white/90 text-sm font-medium flex items-center space-x-2"
              >
                <Icon name="heroicons:swatch" class="w-4 h-4" />
                <span>地图主题</span>
              </label>

              <div class="flex items-center space-x-3">
                <button
                  v-for="theme in mapThemes"
                  :key="theme.value"
                  @click="mapTheme = theme.value"
                  class="flex-1 px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105"
                  :class="[
                    mapTheme === theme.value
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                      : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/20',
                  ]"
                >
                  {{ theme.label }}
                </button>
              </div>
            </div>

            <!-- 显示选项 -->
            <div class="space-y-4">
              <label
                class="text-white/90 text-sm font-medium flex items-center space-x-2"
              >
                <Icon name="heroicons:eye" class="w-4 h-4" />
                <span>显示选项</span>
              </label>

              <div class="space-y-3">
                <label class="flex items-center space-x-3 cursor-pointer group">
                  <input
                    v-model="showClusters"
                    type="checkbox"
                    class="w-4 h-4 text-primary-500 bg-white/20 border-white/30 rounded focus:ring-primary-500 transition-all duration-300"
                  />
                  <span
                    class="text-white/80 text-sm group-hover:text-white transition-colors duration-300"
                    >显示标记聚合</span
                  >
                </label>

                <label class="flex items-center space-x-3 cursor-pointer group">
                  <input
                    v-model="showPaths"
                    type="checkbox"
                    class="w-4 h-4 text-primary-500 bg-white/20 border-white/30 rounded focus:ring-primary-500 transition-all duration-300"
                  />
                  <span
                    class="text-white/80 text-sm group-hover:text-white transition-colors duration-300"
                    >显示路径轨迹</span
                  >
                </label>

                <label class="flex items-center space-x-3 cursor-pointer group">
                  <input
                    v-model="showMarkerLabels"
                    type="checkbox"
                    class="w-4 h-4 text-primary-500 bg-white/20 border-white/30 rounded focus:ring-primary-500 transition-all duration-300"
                  />
                  <span
                    class="text-white/80 text-sm group-hover:text-white transition-colors duration-300"
                    >显示标记标签</span
                  >
                </label>
              </div>
            </div>

            <!-- 重置按钮 -->
            <div class="pt-6 border-t border-white/10">
              <button
                @click="resetSettings"
                class="w-full px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white/80 hover:text-white font-medium rounded-xl transition-all duration-300 hover:scale-105"
              >
                重置为默认设置
              </button>
            </div>
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
])

// 计算属性
const filteredMarkers = computed(() => {
  let result = markers.value

  if (selectedStoryId.value) {
    const story = stories.value.find((s) => s.id === selectedStoryId.value)
    if (story) {
      result = story.markers
    }
  }

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

const searchSuggestions = computed(() => {
  if (!searchQuery.value) return []

  const query = searchQuery.value.toLowerCase()
  return markers.value.filter(
    (marker) =>
      marker.title.toLowerCase().includes(query) ||
      marker.description.toLowerCase().includes(query)
  )
})

// 事件处理方法
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
  console.log('Path clicked:', path)
}

const handleClusterClick = (cluster: any) => {
  console.log('Cluster clicked:', cluster)
}

const handleThemeChange = (theme: string) => {
  mapTheme.value = theme as 'light' | 'dark'
}

const handleClustersToggle = (show: boolean) => {
  showClusters.value = show
}

const selectSuggestion = (suggestion: any) => {
  searchQuery.value = suggestion.title
  handleMarkerClick(suggestion)
  showSearch.value = false
}

const resetSettings = () => {
  mapTheme.value = 'dark'
  showClusters.value = true
  showPaths.value = true
  showMarkerLabels.value = false
}

// 辅助方法
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
  console.log('Center on marker:', selectedMarker.value)
}

// 其他事件处理方法的占位符
const handlePathReplay = (path: any) => {
  console.log('Path replay:', path)
}
const handleTagClick = (tag: string) => {
  console.log('Tag click:', tag)
}
const handleEditStory = (story: any) => {
  console.log('Edit story:', story)
}
const handleShareStory = (story: any) => {
  console.log('Share story:', story)
}
const toggleStoryPanel = () => {
  storyPanelCollapsed.value = !storyPanelCollapsed.value
}
const showAllStoryMarkers = () => {
  console.log('Show all story markers')
}
const fitToStoryMarkers = () => {
  console.log('Fit to story markers')
}
</script>

<style scoped>
/* 复选框样式 */
input[type='checkbox']:checked {
  background: linear-gradient(
    135deg,
    theme('colors.primary.500'),
    theme('colors.secondary.500')
  );
  border-color: theme('colors.primary.500');
}

/* 选择框样式 */
select {
  background-image: none;
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

  .absolute.top-6.right-6 {
    position: fixed;
    top: 1rem;
    right: 1rem;
    left: 1rem;
    width: auto;
  }
}
</style>
