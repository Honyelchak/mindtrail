<!--
  ArticleCategories.vue - 文章分类组件
  
  Features:
  - 分类筛选
  - 分类统计
  - 响应式设计
-->

<template>
  <div class="article-categories">
    <!-- 分类标题 -->
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-white">文章分类</h3>
      <span class="text-sm text-white/60">{{ totalArticles }} 篇文章</span>
    </div>

    <!-- 分类列表 -->
    <div class="space-y-2">
      <!-- 全部分类 -->
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
            <Icon name="heroicons:squares-2x2" class="w-4 h-4 text-white" />
          </div>
          <span class="font-medium">全部文章</span>
        </div>
        <span class="text-sm opacity-80">{{ totalArticles }}</span>
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

    <!-- 分类管理 -->
    <div class="mt-6 pt-6 border-t border-white/10">
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
      <div class="bg-neutral-900 border border-white/20 rounded-2xl p-6 max-w-md w-full">
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
          <div class="flex space-x-2">
            <input
              v-model="newCategoryName"
              type="text"
              placeholder="分类名称"
              class="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            />
            <button
              @click="addCategory"
              :disabled="!newCategoryName.trim()"
              class="px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 disabled:from-gray-500 disabled:to-gray-600 text-white rounded-lg transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
            >
              添加
            </button>
          </div>
        </div>

        <!-- 现有分类列表 -->
        <div class="space-y-2">
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
              <span class="text-white">{{ category.name }}</span>
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
interface ArticleCategory {
  id: string
  name: string
  icon: string
  color: string
  count: number
  description?: string
}

// Props
interface Props {
  selectedCategory?: string
}

const props = withDefaults(defineProps<Props>(), {
  selectedCategory: 'all'
})

// Emits
const emit = defineEmits<{
  categoryChange: [categoryId: string]
}>()

// 响应式数据
const selectedCategory = ref(props.selectedCategory)
const showCategoryManager = ref(false)
const newCategoryName = ref('')

// Mock数据 - 文章分类
const categories = ref<ArticleCategory[]>([
  {
    id: 'life-thoughts',
    name: '生活感悟',
    icon: 'heroicons:heart',
    color: '#ef4444',
    count: 12,
    description: '记录生活中的点点滴滴和感悟'
  },
  {
    id: 'reading-notes',
    name: '读书笔记',
    icon: 'heroicons:book-open',
    color: '#3b82f6',
    count: 8,
    description: '阅读过程中的思考和总结'
  },
  {
    id: 'tech-learning',
    name: '技术学习',
    icon: 'heroicons:code-bracket',
    color: '#10b981',
    count: 15,
    description: '技术学习和实践的记录'
  },
  {
    id: 'travel-diary',
    name: '旅行日记',
    icon: 'heroicons:map-pin',
    color: '#f59e0b',
    count: 6,
    description: '旅行途中的见闻和感受'
  },
  {
    id: 'work-reflection',
    name: '工作反思',
    icon: 'heroicons:briefcase',
    color: '#8b5cf6',
    count: 9,
    description: '工作中的经验和反思'
  }
])

// 计算总文章数
const totalArticles = computed(() => {
  return categories.value.reduce((total, category) => total + category.count, 0)
})

// 选择分类
const selectCategory = (categoryId: string) => {
  selectedCategory.value = categoryId
  emit('categoryChange', categoryId)
}

// 添加新分类
const addCategory = () => {
  if (!newCategoryName.value.trim()) return

  const newCategory: ArticleCategory = {
    id: `category-${Date.now()}`,
    name: newCategoryName.value.trim(),
    icon: 'heroicons:folder',
    color: '#6b7280',
    count: 0
  }

  categories.value.push(newCategory)
  newCategoryName.value = ''
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
</script>

<style scoped>
/* 自定义滚动条 */
.space-y-2::-webkit-scrollbar {
  width: 4px;
}

.space-y-2::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.space-y-2::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.space-y-2::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>
