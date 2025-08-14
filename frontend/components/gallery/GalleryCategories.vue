<!--
  GalleryCategories.vue - 相册分类组件
  
  Features:
  - 分类筛选
  - 标签管理
  - 分类统计
  - 响应式设计
-->

<template>
  <div class="gallery-categories">
    <!-- 分类标题 -->
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-white">相册分类</h3>
      <span class="text-sm text-white/60">{{ totalPhotos }} 张照片</span>
    </div>

    <!-- 分类列表 -->
    <div class="space-y-2 mb-6">
      <!-- 全部照片 -->
      <button
        @click="selectCategory('all')"
        :class="[
          'w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300',
          selectedCategory === 'all'
            ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
            : 'bg-white/5 hover:bg-white/10 text-white/80 hover:text-white'
        ]"
      >
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center">
            <Icon name="heroicons:photo" class="w-4 h-4 text-white" />
          </div>
          <span class="font-medium">全部照片</span>
        </div>
        <span class="text-sm opacity-80">{{ totalPhotos }}</span>
      </button>

      <!-- 各个分类 -->
      <button
        v-for="category in categories"
        :key="category.id"
        @click="selectCategory(category.id)"
        :class="[
          'w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300',
          selectedCategory === category.id
            ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
            : 'bg-white/5 hover:bg-white/10 text-white/80 hover:text-white'
        ]"
      >
        <div class="flex items-center space-x-3">
          <div 
            class="w-8 h-8 rounded-lg flex items-center justify-center"
            :style="{ backgroundColor: category.color }"
          >
            <Icon :name="category.icon" class="w-4 h-4 text-white" />
          </div>
          <span class="font-medium">{{ category.name }}</span>
        </div>
        <span class="text-sm opacity-80">{{ category.count }}</span>
      </button>
    </div>

    <!-- 标签筛选 -->
    <div class="mb-6">
      <h4 class="text-sm font-medium text-white/80 mb-3">热门标签</h4>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="tag in popularTags"
          :key="tag.name"
          @click="toggleTag(tag.name)"
          :class="[
            'px-3 py-1 rounded-full text-sm transition-all duration-300',
            selectedTags.includes(tag.name)
              ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
              : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
          ]"
        >
          {{ tag.name }}
          <span class="ml-1 opacity-70">({{ tag.count }})</span>
        </button>
      </div>
    </div>

    <!-- 时间筛选 -->
    <div class="mb-6">
      <h4 class="text-sm font-medium text-white/80 mb-3">时间范围</h4>
      <div class="space-y-2">
        <button
          v-for="timeRange in timeRanges"
          :key="timeRange.id"
          @click="selectTimeRange(timeRange.id)"
          :class="[
            'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-300',
            selectedTimeRange === timeRange.id
              ? 'bg-primary-500/20 text-primary-300'
              : 'text-white/70 hover:bg-white/10 hover:text-white'
          ]"
        >
          <span>{{ timeRange.label }}</span>
          <span class="opacity-70">{{ timeRange.count }}</span>
        </button>
      </div>
    </div>

    <!-- 分类管理 -->
    <div class="pt-6 border-t border-white/10">
      <button
        @click="showCategoryManager = true"
        class="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300 text-white/70 hover:text-white"
      >
        <Icon name="heroicons:cog-6-tooth" class="w-4 h-4" />
        <span class="text-sm">管理分类</span>
      </button>
    </div>

    <!-- 分类管理弹窗 -->
    <div
      v-if="showCategoryManager"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      @click.self="showCategoryManager = false"
    >
      <div class="bg-neutral-900 border border-white/20 rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-white">管理分类</h3>
          <button
            @click="showCategoryManager = false"
            class="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors duration-200"
          >
            <Icon name="heroicons:x-mark" class="w-4 h-4 text-white" />
          </button>
        </div>

        <!-- 添加新分类 -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-white/80 mb-2">添加新分类</label>
          <div class="space-y-2">
            <input
              v-model="newCategoryName"
              type="text"
              placeholder="分类名称"
              class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            />
            <input
              v-model="newCategoryDescription"
              type="text"
              placeholder="分类描述（可选）"
              class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            />
            <button
              @click="addCategory"
              :disabled="!newCategoryName.trim()"
              class="w-full px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 disabled:from-gray-500 disabled:to-gray-600 text-white rounded-lg transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
            >
              添加分类
            </button>
          </div>
        </div>

        <!-- 现有分类列表 -->
        <div class="space-y-2">
          <h4 class="text-sm font-medium text-white/80 mb-3">现有分类</h4>
          <div
            v-for="category in categories"
            :key="category.id"
            class="flex items-center justify-between p-3 bg-white/5 rounded-lg"
          >
            <div class="flex items-center space-x-3">
              <div 
                class="w-6 h-6 rounded flex items-center justify-center"
                :style="{ backgroundColor: category.color }"
              >
                <Icon :name="category.icon" class="w-3 h-3 text-white" />
              </div>
              <div>
                <div class="text-white text-sm">{{ category.name }}</div>
                <div class="text-white/50 text-xs">{{ category.description }}</div>
              </div>
              <span class="text-xs text-white/50">({{ category.count }})</span>
            </div>
            <button
              @click="deleteCategory(category.id)"
              class="w-6 h-6 bg-red-500/20 hover:bg-red-500/30 rounded flex items-center justify-center transition-colors duration-200"
            >
              <Icon name="heroicons:trash" class="w-3 h-3 text-red-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 分类接口
interface GalleryCategory {
  id: string
  name: string
  description: string
  icon: string
  color: string
  count: number
}

// 标签接口
interface Tag {
  name: string
  count: number
}

// 时间范围接口
interface TimeRange {
  id: string
  label: string
  count: number
}

// Props
interface Props {
  selectedCategory?: string
  selectedTags?: string[]
  selectedTimeRange?: string
}

const props = withDefaults(defineProps<Props>(), {
  selectedCategory: 'all',
  selectedTags: () => [],
  selectedTimeRange: 'all'
})

// Emits
const emit = defineEmits<{
  categoryChange: [categoryId: string]
  tagsChange: [tags: string[]]
  timeRangeChange: [timeRangeId: string]
}>()

// 响应式数据
const selectedCategory = ref(props.selectedCategory)
const selectedTags = ref([...props.selectedTags])
const selectedTimeRange = ref(props.selectedTimeRange)
const showCategoryManager = ref(false)
const newCategoryName = ref('')
const newCategoryDescription = ref('')

// Mock数据 - 相册分类
const categories = ref<GalleryCategory[]>([
  {
    id: 'daily-life',
    name: '日常生活',
    description: '记录生活中的美好瞬间',
    icon: 'heroicons:home',
    color: '#ef4444',
    count: 156
  },
  {
    id: 'travel',
    name: '旅游',
    description: '旅行途中的风景和回忆',
    icon: 'heroicons:map-pin',
    color: '#3b82f6',
    count: 89
  },
  {
    id: 'friends',
    name: '好友',
    description: '与朋友们的珍贵合影',
    icon: 'heroicons:user-group',
    color: '#10b981',
    count: 67
  },
  {
    id: 'food',
    name: '美食',
    description: '各种美味的食物照片',
    icon: 'heroicons:cake',
    color: '#f59e0b',
    count: 43
  },
  {
    id: 'nature',
    name: '自然风光',
    description: '大自然的美丽景色',
    icon: 'heroicons:sun',
    color: '#8b5cf6',
    count: 78
  },
  {
    id: 'pets',
    name: '宠物',
    description: '可爱的毛孩子们',
    icon: 'heroicons:heart',
    color: '#ec4899',
    count: 34
  }
])

// 热门标签
const popularTags = ref<Tag[]>([
  { name: '风景', count: 45 },
  { name: '人像', count: 38 },
  { name: '美食', count: 32 },
  { name: '城市', count: 28 },
  { name: '夜景', count: 25 },
  { name: '海边', count: 22 },
  { name: '山景', count: 19 },
  { name: '建筑', count: 16 }
])

// 时间范围
const timeRanges = ref<TimeRange[]>([
  { id: 'all', label: '全部时间', count: 467 },
  { id: 'this-month', label: '本月', count: 23 },
  { id: 'last-month', label: '上个月', count: 34 },
  { id: 'this-year', label: '今年', count: 156 },
  { id: 'last-year', label: '去年', count: 189 },
  { id: 'older', label: '更早', count: 65 }
])

// 计算总照片数
const totalPhotos = computed(() => {
  return categories.value.reduce((total, category) => total + category.count, 0)
})

// 选择分类
const selectCategory = (categoryId: string) => {
  selectedCategory.value = categoryId
  emit('categoryChange', categoryId)
}

// 切换标签
const toggleTag = (tagName: string) => {
  const index = selectedTags.value.indexOf(tagName)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tagName)
  }
  emit('tagsChange', [...selectedTags.value])
}

// 选择时间范围
const selectTimeRange = (timeRangeId: string) => {
  selectedTimeRange.value = timeRangeId
  emit('timeRangeChange', timeRangeId)
}

// 添加新分类
const addCategory = () => {
  if (!newCategoryName.value.trim()) return

  const newCategory: GalleryCategory = {
    id: `category-${Date.now()}`,
    name: newCategoryName.value.trim(),
    description: newCategoryDescription.value.trim() || '自定义分类',
    icon: 'heroicons:folder',
    color: '#6b7280',
    count: 0
  }

  categories.value.push(newCategory)
  newCategoryName.value = ''
  newCategoryDescription.value = ''
}

// 删除分类
const deleteCategory = (categoryId: string) => {
  const index = categories.value.findIndex(cat => cat.id === categoryId)
  if (index > -1) {
    categories.value.splice(index, 1)
  }
}

// 监听props变化
watch(() => props.selectedCategory, (newValue) => {
  selectedCategory.value = newValue
})

watch(() => props.selectedTags, (newValue) => {
  selectedTags.value = [...newValue]
})

watch(() => props.selectedTimeRange, (newValue) => {
  selectedTimeRange.value = newValue
})
</script>

<style scoped>
/* 自定义滚动条 */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>
