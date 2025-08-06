<template>
  <section v-if="relatedItems.length > 0" class="neu-card p-6">
    <h3 class="text-xl font-semibold mb-6 flex items-center space-x-2">
      <SparklesIcon class="w-5 h-5" />
      <span>相关推荐</span>
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink
        v-for="item in relatedItems"
        :key="item.id"
        :to="`/${getItemTypeRoute(item.type)}/${item.id}`"
        class="group block"
      >
        <article class="neu-card p-4 hover:shadow-lg transition-all duration-300 h-full">
          <!-- 类型图标和标题 -->
          <div class="flex items-start space-x-3 mb-3">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                 :class="getTypeConfig(item.type).bgClass">
              <component :is="getTypeConfig(item.type).icon" class="w-4 h-4 text-white" />
            </div>
            
            <div class="flex-1 min-w-0">
              <h4 class="font-medium text-neutral-800 dark:text-neutral-200 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {{ item.title }}
              </h4>
            </div>
          </div>

          <!-- 媒体预览 -->
          <div v-if="item.media && item.media.length > 0" class="mb-3">
            <img
              :src="item.media[0].url"
              :alt="item.media[0].alt"
              class="w-full h-32 object-cover rounded-lg"
              @error="handleImageError"
            >
          </div>

          <!-- 内容摘要 -->
          <div class="text-sm text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-3">
            {{ item.excerpt || item.content }}
          </div>

          <!-- 元信息 -->
          <div class="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <div class="flex items-center space-x-2">
              <!-- 情绪图标 -->
              <span v-if="item.emotion" class="text-sm">
                {{ getEmotionIcon(item.emotion.type) }}
              </span>
              
              <!-- 时间 -->
              <time>{{ formatDate(item.createdAt) }}</time>
            </div>

            <!-- 统计信息 -->
            <div class="flex items-center space-x-3">
              <div class="flex items-center space-x-1">
                <EyeIcon class="w-3 h-3" />
                <span>{{ item.stats?.views || 0 }}</span>
              </div>
              <div class="flex items-center space-x-1">
                <HeartIcon class="w-3 h-3" />
                <span>{{ item.stats?.likes || 0 }}</span>
              </div>
            </div>
          </div>

          <!-- 标签 -->
          <div v-if="item.tags && item.tags.length > 0" class="mt-3">
            <div class="flex flex-wrap gap-1">
              <span
                v-for="tag in item.tags.slice(0, 3)"
                :key="tag"
                class="inline-block px-2 py-0.5 text-xs rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
              >
                #{{ tag }}
              </span>
              <span v-if="item.tags.length > 3" class="text-xs text-neutral-500 dark:text-neutral-400">
                +{{ item.tags.length - 3 }}
              </span>
            </div>
          </div>
        </article>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup>
import {
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  PhotoIcon,
  EyeIcon,
  HeartIcon
} from '@heroicons/vue/24/outline'

// Props
const props = defineProps({
  currentContent: {
    type: Object,
    required: true
  },
  maxItems: {
    type: Number,
    default: 6
  }
})

// 响应式数据
const relatedItems = ref([])

// 获取类型配置
const getTypeConfig = (type) => {
  const configs = {
    moment: {
      icon: ChatBubbleLeftRightIcon,
      bgClass: 'bg-gradient-to-r from-accent-500 to-accent-600'
    },
    article: {
      icon: DocumentTextIcon,
      bgClass: 'bg-gradient-to-r from-primary-500 to-primary-600'
    },
    gallery: {
      icon: PhotoIcon,
      bgClass: 'bg-gradient-to-r from-secondary-500 to-secondary-600'
    }
  }
  return configs[type] || configs.moment
}

// 获取类型路由
const getItemTypeRoute = (type) => {
  const routes = {
    moment: 'moments',
    article: 'articles',
    gallery: 'galleries'
  }
  return routes[type] || 'moments'
}

// 获取情绪图标
const getEmotionIcon = (emotionType) => {
  const emotions = {
    happy: '😊',
    sad: '😢',
    excited: '🤩',
    peaceful: '😌',
    focused: '🤔',
    productive: '💪',
    satisfied: '😋',
    tired: '😴'
  }
  return emotions[emotionType] || '😊'
}

// 格式化时间
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    month: 'long',
    day: 'numeric'
  })
}

// 计算标签相似度
const calculateTagSimilarity = (tags1, tags2) => {
  const set1 = new Set(tags1.map(tag => tag.toLowerCase()))
  const set2 = new Set(tags2.map(tag => tag.toLowerCase()))
  const intersection = new Set([...set1].filter(x => set2.has(x)))
  const union = new Set([...set1, ...set2])
  
  return intersection.size / union.size
}

// 加载相关内容
const loadRelatedContent = async () => {
  try {
    // 从 Mock 数据中获取相关内容
    const mockData = await import('../data/mock-data.json')
    
    // 过滤掉当前内容
    const otherItems = mockData.timeline.filter(item => item.id !== props.currentContent.id)
    
    // 计算相似度并排序
    const itemsWithSimilarity = otherItems.map(item => ({
      ...item,
      similarity: calculateTagSimilarity(props.currentContent.tags || [], item.tags || [])
    }))
    
    // 按相似度排序，然后按时间排序
    itemsWithSimilarity.sort((a, b) => {
      if (a.similarity !== b.similarity) {
        return b.similarity - a.similarity
      }
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
    
    // 取前 N 个
    relatedItems.value = itemsWithSimilarity.slice(0, props.maxItems)
    
  } catch (error) {
    console.error('Error loading related content:', error)
  }
}

// 处理图片加载错误
const handleImageError = (event) => {
  event.target.src = '/images/placeholder.jpg'
}

// 监听当前内容变化
watch(() => props.currentContent, () => {
  if (props.currentContent) {
    loadRelatedContent()
  }
}, { immediate: true })
</script>

<style scoped>
/* 文本截断 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 悬停效果 */
.group:hover .neu-card {
  transform: translateY(-2px);
}
</style>
