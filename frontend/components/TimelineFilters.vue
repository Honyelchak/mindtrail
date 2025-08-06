<template>
  <div class="neu-card p-6">
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
      <!-- 搜索框 -->
      <div class="flex-1 max-w-md">
        <div class="relative">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索内容..."
            class="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            @input="updateFilter('searchQuery', $event.target.value)"
          >
        </div>
      </div>

      <!-- 过滤器选项 -->
      <div class="flex flex-wrap items-center gap-3">
        <!-- 类型过滤 -->
        <div class="flex items-center space-x-2">
          <label class="text-sm font-medium text-neutral-700 dark:text-neutral-300">类型:</label>
          <select
            v-model="typeFilter"
            class="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            @change="updateFilter('type', $event.target.value)"
          >
            <option value="all">全部</option>
            <option value="moment">说说</option>
            <option value="article">文章</option>
            <option value="gallery">相册</option>
          </select>
        </div>

        <!-- 标签过滤 -->
        <div class="flex items-center space-x-2">
          <label class="text-sm font-medium text-neutral-700 dark:text-neutral-300">标签:</label>
          <select
            v-model="tagFilter"
            class="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            @change="updateFilter('tag', $event.target.value)"
          >
            <option value="">全部标签</option>
            <option v-for="tag in tags" :key="tag.name" :value="tag.name">
              {{ tag.name }} ({{ tag.count }})
            </option>
          </select>
        </div>

        <!-- 情绪过滤 -->
        <div class="flex items-center space-x-2">
          <label class="text-sm font-medium text-neutral-700 dark:text-neutral-300">情绪:</label>
          <select
            v-model="emotionFilter"
            class="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            @change="updateFilter('emotion', $event.target.value)"
          >
            <option value="">全部情绪</option>
            <option v-for="emotion in emotions" :key="emotion.type" :value="emotion.type">
              {{ emotion.icon }} {{ emotion.label }}
            </option>
          </select>
        </div>

        <!-- 清除过滤器按钮 -->
        <button
          v-if="hasActiveFilters"
          @click="clearAllFilters"
          class="px-4 py-1.5 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
        >
          清除过滤器
        </button>
      </div>
    </div>

    <!-- 活跃过滤器标签 -->
    <div v-if="hasActiveFilters" class="mt-4 pt-4 border-t border-neutral-200/50 dark:border-neutral-700/50">
      <div class="flex flex-wrap items-center gap-2">
        <span class="text-sm text-neutral-500 dark:text-neutral-400">当前过滤:</span>
        
        <span v-if="filters.type !== 'all'" 
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300">
          类型: {{ getTypeLabel(filters.type) }}
          <button @click="updateFilter('type', 'all')" class="ml-1 hover:text-primary-900 dark:hover:text-primary-100">
            <XMarkIcon class="w-3 h-3" />
          </button>
        </span>

        <span v-if="filters.tag" 
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-100 dark:bg-secondary-900/20 text-secondary-700 dark:text-secondary-300">
          标签: {{ filters.tag }}
          <button @click="updateFilter('tag', '')" class="ml-1 hover:text-secondary-900 dark:hover:text-secondary-100">
            <XMarkIcon class="w-3 h-3" />
          </button>
        </span>

        <span v-if="filters.emotion" 
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-100 dark:bg-accent-900/20 text-accent-700 dark:text-accent-300">
          情绪: {{ getEmotionLabel(filters.emotion) }}
          <button @click="updateFilter('emotion', '')" class="ml-1 hover:text-accent-900 dark:hover:text-accent-100">
            <XMarkIcon class="w-3 h-3" />
          </button>
        </span>

        <span v-if="filters.searchQuery" 
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
          搜索: "{{ filters.searchQuery }}"
          <button @click="updateFilter('searchQuery', '')" class="ml-1 hover:text-neutral-900 dark:hover:text-neutral-100">
            <XMarkIcon class="w-3 h-3" />
          </button>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/24/outline'

// Props
const props = defineProps({
  filters: {
    type: Object,
    required: true
  },
  tags: {
    type: Array,
    default: () => []
  },
  emotions: {
    type: Array,
    default: () => []
  }
})

// Emits
const emit = defineEmits(['update-filter', 'clear-filters'])

// 本地响应式数据
const searchQuery = ref(props.filters.searchQuery || '')
const typeFilter = ref(props.filters.type || 'all')
const tagFilter = ref(props.filters.tag || '')
const emotionFilter = ref(props.filters.emotion || '')

// 监听 props 变化
watch(() => props.filters, (newFilters) => {
  searchQuery.value = newFilters.searchQuery || ''
  typeFilter.value = newFilters.type || 'all'
  tagFilter.value = newFilters.tag || ''
  emotionFilter.value = newFilters.emotion || ''
}, { deep: true })

// 计算属性
const hasActiveFilters = computed(() => {
  return props.filters.type !== 'all' || 
         props.filters.tag || 
         props.filters.emotion || 
         props.filters.searchQuery
})

// 方法
const updateFilter = (key, value) => {
  emit('update-filter', key, value)
}

const clearAllFilters = () => {
  emit('clear-filters')
}

const getTypeLabel = (type) => {
  const labels = {
    moment: '说说',
    article: '文章',
    gallery: '相册'
  }
  return labels[type] || type
}

const getEmotionLabel = (emotionType) => {
  const emotion = props.emotions.find(e => e.type === emotionType)
  return emotion ? `${emotion.icon} ${emotion.label}` : emotionType
}
</script>
