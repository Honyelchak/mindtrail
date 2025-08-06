<template>
  <article class="neu-card p-6 hover:shadow-lg transition-all duration-300">
    <!-- 头部信息 -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center space-x-3">
        <!-- 类型图标 -->
        <div class="flex-shrink-0">
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center"
            :class="typeConfig.bgClass"
          >
            <component :is="typeConfig.icon" class="w-5 h-5 text-white" />
          </div>
        </div>

        <!-- 作者和时间信息 -->
        <div>
          <div class="flex items-center space-x-2">
            <img
              :src="item.author.avatar"
              :alt="item.author.name"
              class="w-6 h-6 rounded-full"
              @error="handleImageError"
            />
            <span class="font-medium text-neutral-700 dark:text-neutral-300">
              {{ item.author.name }}
            </span>
            <span class="text-sm text-neutral-500 dark:text-neutral-400"
              >·</span
            >
            <time
              class="text-sm text-neutral-500 dark:text-neutral-400"
              :datetime="item.createdAt"
            >
              {{ formatDate(item.createdAt) }}
            </time>
          </div>

          <!-- 位置信息 -->
          <div v-if="item.location" class="flex items-center space-x-1 mt-1">
            <MapPinIcon class="w-4 h-4 text-neutral-400" />
            <span class="text-sm text-neutral-500 dark:text-neutral-400">
              {{ item.location.name }}
            </span>
          </div>
        </div>
      </div>

      <!-- 情绪指示器 -->
      <div v-if="item.emotion" class="flex-shrink-0">
        <div
          class="flex items-center space-x-2 px-3 py-1 rounded-full"
          :style="{ backgroundColor: emotionConfig?.color + '20' }"
        >
          <span class="text-sm">{{ emotionConfig?.icon }}</span>
          <span
            class="text-xs font-medium"
            :style="{ color: emotionConfig?.color }"
          >
            {{ emotionConfig?.label }}
          </span>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="mb-4">
      <!-- 标题 -->
      <h2
        class="text-xl font-semibold mb-2 text-neutral-800 dark:text-neutral-200"
      >
        <NuxtLink
          :to="`/${getItemTypeRoute(item.type)}/${item.id}`"
          class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          {{ item.title }}
        </NuxtLink>
      </h2>

      <!-- 摘要/内容 -->
      <div class="text-neutral-600 dark:text-neutral-400 leading-relaxed">
        <p v-if="item.type === 'article' && item.excerpt">
          {{ item.excerpt }}
        </p>
        <p v-else class="line-clamp-3">
          {{ item.content }}
        </p>
      </div>

      <!-- 阅读时间（仅文章） -->
      <div
        v-if="item.type === 'article' && item.readingTime"
        class="flex items-center space-x-1 mt-2"
      >
        <ClockIcon class="w-4 h-4 text-neutral-400" />
        <span class="text-sm text-neutral-500 dark:text-neutral-400">
          约 {{ item.readingTime }} 分钟阅读
        </span>
      </div>
    </div>

    <!-- 媒体内容 -->
    <div v-if="item.media && item.media.length > 0" class="mb-4">
      <MediaGallery :media="item.media" :max-preview="3" />
    </div>

    <!-- 标签 -->
    <div v-if="item.tags && item.tags.length > 0" class="mb-4">
      <div class="flex flex-wrap gap-2">
        <span
          v-for="tag in item.tags"
          :key="tag"
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-primary-100 dark:hover:bg-primary-900/20 cursor-pointer transition-colors"
          @click="$emit('tag-click', tag)"
        >
          #{{ tag }}
        </span>
      </div>
    </div>

    <!-- 底部操作栏 -->
    <div
      class="flex items-center justify-between pt-4 border-t border-neutral-200/50 dark:border-neutral-700/50"
    >
      <!-- 统计信息 -->
      <div
        class="flex items-center space-x-4 text-sm text-neutral-500 dark:text-neutral-400"
      >
        <div class="flex items-center space-x-1">
          <EyeIcon class="w-4 h-4" />
          <span>{{ item.stats?.views || 0 }}</span>
        </div>
        <div class="flex items-center space-x-1">
          <HeartIcon class="w-4 h-4" />
          <span>{{ item.stats?.likes || 0 }}</span>
        </div>
        <div class="flex items-center space-x-1">
          <ChatBubbleLeftIcon class="w-4 h-4" />
          <span>{{ item.stats?.comments || 0 }}</span>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex items-center space-x-2">
        <button
          class="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          title="点赞"
        >
          <HeartIcon class="w-4 h-4" />
        </button>
        <button
          class="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          title="评论"
        >
          <ChatBubbleLeftIcon class="w-4 h-4" />
        </button>
        <button
          class="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          title="分享"
        >
          <ShareIcon class="w-4 h-4" />
        </button>
      </div>
    </div>
  </article>
</template>

<script setup>
import {
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  PhotoIcon,
  MapPinIcon,
  ClockIcon,
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
} from '@heroicons/vue/24/outline'

// Props
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  emotions: {
    type: Array,
    default: () => [],
  },
})

// Emits
const emit = defineEmits(['tag-click'])

// 使用 Timeline Composable 的格式化方法
const { formatDate } = useTimeline()

// 类型配置
const typeConfig = computed(() => {
  const configs = {
    moment: {
      icon: ChatBubbleLeftRightIcon,
      bgClass: 'bg-gradient-to-r from-accent-500 to-accent-600',
      label: '说说',
    },
    article: {
      icon: DocumentTextIcon,
      bgClass: 'bg-gradient-to-r from-primary-500 to-primary-600',
      label: '文章',
    },
    gallery: {
      icon: PhotoIcon,
      bgClass: 'bg-gradient-to-r from-secondary-500 to-secondary-600',
      label: '相册',
    },
  }
  return configs[props.item.type] || configs.moment
})

// 情绪配置
const emotionConfig = computed(() => {
  if (!props.item.emotion) return null
  return props.emotions.find(
    (emotion) => emotion.type === props.item.emotion.type
  )
})

// 获取类型路由
const getItemTypeRoute = (type) => {
  const routes = {
    moment: 'moments',
    article: 'articles',
    gallery: 'galleries',
  }
  return routes[type] || 'moments'
}

// 处理图片加载错误
const handleImageError = (event) => {
  event.target.src = '/avatars/default.jpg'
}
</script>

<style scoped>
/* 文本截断 */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 悬停效果 */
.neu-card:hover {
  transform: translateY(-2px);
}
</style>
