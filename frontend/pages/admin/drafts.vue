<template>
  <div class="min-h-screen">
    <!-- 页面头部 -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gradient mb-2">草稿管理</h1>
          <p class="text-neutral-600 dark:text-neutral-400">
            管理你的草稿内容，支持离线编辑
          </p>
        </div>
        
        <div class="flex items-center space-x-4">
          <button
            @click="loadDrafts"
            class="neu-button px-4 py-2 flex items-center space-x-2"
            :disabled="loading"
          >
            <ArrowPathIcon class="w-4 h-4" :class="{ 'animate-spin': loading }" />
            <span>刷新</span>
          </button>
          
          <button
            @click="clearAllDrafts"
            class="neu-button px-4 py-2 flex items-center space-x-2 text-red-600 dark:text-red-400"
            :disabled="loading || drafts.length === 0"
          >
            <TrashIcon class="w-4 h-4" />
            <span>清空全部</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 统计信息 -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div class="neu-card p-4 text-center">
        <div class="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{{ getDraftStats.total }}</div>
        <div class="text-sm text-neutral-500 dark:text-neutral-400">总草稿</div>
      </div>
      <div class="neu-card p-4 text-center">
        <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">{{ getDraftStats.byType.article || 0 }}</div>
        <div class="text-sm text-neutral-500 dark:text-neutral-400">文章</div>
      </div>
      <div class="neu-card p-4 text-center">
        <div class="text-2xl font-bold text-accent-600 dark:text-accent-400">{{ getDraftStats.byType.moment || 0 }}</div>
        <div class="text-sm text-neutral-500 dark:text-neutral-400">说说</div>
      </div>
      <div class="neu-card p-4 text-center">
        <div class="text-2xl font-bold text-secondary-600 dark:text-secondary-400">{{ getDraftStats.byType.gallery || 0 }}</div>
        <div class="text-sm text-neutral-500 dark:text-neutral-400">相册</div>
      </div>
    </div>

    <!-- 搜索和过滤 -->
    <div class="neu-card p-4 mb-8">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div class="flex items-center space-x-4">
          <div class="relative">
            <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索草稿..."
              class="pl-10 pr-4 py-2 w-64 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
          </div>
        </div>

        <div class="flex items-center space-x-2">
          <span class="text-sm font-medium text-neutral-700 dark:text-neutral-300">类型:</span>
          <select
            v-model="filterType"
            class="px-3 py-1 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">全部</option>
            <option value="article">文章</option>
            <option value="moment">说说</option>
            <option value="gallery">相册</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 草稿列表 -->
    <div v-if="filteredDrafts.length > 0" class="space-y-4">
      <div
        v-for="draft in filteredDrafts"
        :key="draft.id"
        class="neu-card p-6 hover:shadow-neu-large transition-all duration-300"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1 min-w-0">
            <!-- 草稿头部 -->
            <div class="flex items-center space-x-3 mb-3">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center"
                   :class="getTypeStyle(draft.type).bg">
                <component :is="getTypeStyle(draft.type).icon" class="w-4 h-4 text-white" />
              </div>
              
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                  {{ draft.title || '无标题' }}
                </h3>
                <div class="flex items-center space-x-2 text-sm text-neutral-500 dark:text-neutral-400">
                  <span>{{ getTypeLabel(draft.type) }}</span>
                  <span>·</span>
                  <time>{{ formatDate(draft.updatedAt) }}</time>
                </div>
              </div>
            </div>

            <!-- 草稿内容预览 -->
            <p class="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed mb-4 line-clamp-2">
              {{ draft.content || '暂无内容' }}
            </p>

            <!-- 标签 -->
            <div v-if="draft.tags && draft.tags.length > 0" class="flex flex-wrap gap-1 mb-3">
              <span
                v-for="tag in draft.tags.slice(0, 3)"
                :key="tag"
                class="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-full text-xs"
              >
                #{{ tag }}
              </span>
              <span v-if="draft.tags.length > 3" class="text-xs text-neutral-500 dark:text-neutral-400">
                +{{ draft.tags.length - 3 }}
              </span>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="flex items-center space-x-2 ml-4">
            <button
              @click="editDraft(draft)"
              class="neu-button p-2"
              title="编辑"
            >
              <PencilIcon class="w-4 h-4" />
            </button>
            
            <button
              @click="deleteDraft(draft.id)"
              class="neu-button p-2 text-red-600 dark:text-red-400"
              title="删除"
            >
              <TrashIcon class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="text-center py-12">
      <div class="neu-card p-8 max-w-md mx-auto">
        <div class="text-6xl mb-4">📝</div>
        <h3 class="text-lg font-semibold mb-2">
          {{ searchQuery || filterType ? '没有找到匹配的草稿' : '还没有草稿' }}
        </h3>
        <p class="text-neutral-600 dark:text-neutral-400 mb-4">
          {{ searchQuery || filterType ? '尝试调整搜索条件' : '开始创建内容时会自动保存草稿' }}
        </p>
        <NuxtLink v-if="!searchQuery && !filterType" to="/create" class="neu-button px-6 py-3">
          开始创建
        </NuxtLink>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="text-center py-8">
      <div class="inline-flex items-center space-x-2 text-neutral-500 dark:text-neutral-400">
        <ArrowPathIcon class="w-4 h-4 animate-spin" />
        <span>加载中...</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ArrowPathIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  PhotoIcon
} from '@heroicons/vue/24/outline'

// 页面元数据
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

useHead({
  title: '草稿管理 - 思维轨迹',
  meta: [
    { name: 'description', content: '管理你的草稿内容，支持离线编辑。' }
  ]
})

// 使用草稿 Composable
const { 
  drafts, 
  loading, 
  error, 
  getDraftStats,
  loadDrafts, 
  deleteDraft: deleteDraftFromDB, 
  clearAllDrafts: clearAllDraftsFromDB 
} = useDrafts()

// 响应式数据
const searchQuery = ref('')
const filterType = ref('')

// 计算属性
const filteredDrafts = computed(() => {
  let filtered = drafts.value

  // 按类型过滤
  if (filterType.value) {
    filtered = filtered.filter(draft => draft.type === filterType.value)
  }

  // 按搜索关键词过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(draft =>
      draft.title.toLowerCase().includes(query) ||
      draft.content.toLowerCase().includes(query)
    )
  }

  return filtered
})

// 方法
const getTypeStyle = (type) => {
  const styles = {
    article: {
      bg: 'bg-gradient-to-r from-primary-500 to-primary-600',
      icon: DocumentTextIcon
    },
    moment: {
      bg: 'bg-gradient-to-r from-accent-500 to-accent-600',
      icon: ChatBubbleLeftRightIcon
    },
    gallery: {
      bg: 'bg-gradient-to-r from-secondary-500 to-secondary-600',
      icon: PhotoIcon
    }
  }
  return styles[type] || styles.article
}

const getTypeLabel = (type) => {
  const labels = {
    article: '文章',
    moment: '说说',
    gallery: '相册'
  }
  return labels[type] || type
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  
  return date.toLocaleDateString('zh-CN')
}

const editDraft = (draft) => {
  // 跳转到创建页面并加载草稿数据
  navigateTo(`/create?draft=${draft.id}`)
}

const deleteDraft = async (id) => {
  if (confirm('确定要删除这个草稿吗？')) {
    await deleteDraftFromDB(id)
  }
}

const clearAllDrafts = async () => {
  if (confirm('确定要清空所有草稿吗？此操作不可恢复。')) {
    await clearAllDraftsFromDB()
  }
}

// 页面加载时获取草稿
onMounted(() => {
  loadDrafts()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
