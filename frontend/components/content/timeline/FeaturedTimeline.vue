<template>
  <div class="space-y-6">
    <!-- 标题 -->
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gradient">
        最近动态
      </h2>
      <NuxtLink 
        to="/timeline" 
        class="text-sm text-primary-600 hover:text-primary-700 transition-colors flex items-center space-x-1"
      >
        <span>查看全部</span>
        <ChevronRightIcon class="w-4 h-4" />
      </NuxtLink>
    </div>
    
    <!-- 加载状态 -->
    <div v-if="loading" class="space-y-4">
      <TimelineItemSkeleton v-for="i in 3" :key="i" />
    </div>
    
    <!-- 时间流内容 -->
    <div v-else-if="featuredItems.length > 0" class="space-y-4">
      <div
        v-for="(item, index) in featuredItems"
        :key="item.id"
        class="group"
        :class="{ 'animate-fade-in-up': true }"
        :style="{ animationDelay: `${index * 100}ms` }"
      >
        <!-- 精简版时间流卡片 -->
        <div class="glass-card p-4 hover:scale-[1.02] transition-all duration-300 cursor-pointer"
             @click="navigateToDetail(item)">
          <!-- 头部信息 -->
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center space-x-3">
              <!-- 类型图标 -->
              <div class="flex-shrink-0">
                <div
                  class="w-8 h-8 rounded-lg flex items-center justify-center"
                  :class="getTypeConfig(item.type).bgClass"
                >
                  <component :is="getTypeConfig(item.type).icon" class="w-4 h-4 text-white" />
                </div>
              </div>
              
              <!-- 作者和时间 -->
              <div>
                <div class="flex items-center space-x-2">
                  <img
                    :src="item.author.avatar"
                    :alt="item.author.name"
                    class="w-5 h-5 rounded-full"
                    @error="handleImageError"
                  />
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ item.author.name }}
                  </span>
                  <span class="text-xs text-gray-500">·</span>
                  <time class="text-xs text-gray-500">
                    {{ formatDate(item.createdAt) }}
                  </time>
                </div>
                
                <!-- 位置信息 -->
                <div v-if="item.location" class="flex items-center space-x-1 mt-1">
                  <MapPinIcon class="w-3 h-3 text-gray-400" />
                  <span class="text-xs text-gray-500">{{ item.location.name }}</span>
                </div>
              </div>
            </div>
            
            <!-- 情绪指示器 -->
            <div v-if="item.emotion" class="flex-shrink-0">
              <div class="text-lg">{{ getEmotionEmoji(item.emotion) }}</div>
            </div>
          </div>
          
          <!-- 内容预览 -->
          <div class="mb-3">
            <h3 v-if="item.title" class="font-medium text-gray-800 dark:text-gray-200 mb-1 line-clamp-1">
              {{ item.title }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {{ item.content }}
            </p>
          </div>
          
          <!-- 媒体预览 -->
          <div v-if="item.media && item.media.length > 0" class="mb-3">
            <div class="flex space-x-2 overflow-x-auto">
              <img
                v-for="(media, mediaIndex) in item.media.slice(0, 3)"
                :key="mediaIndex"
                :src="media.thumbnail || media.url"
                :alt="media.alt || '图片'"
                class="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                @error="handleImageError"
              />
              <div
                v-if="item.media.length > 3"
                class="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0"
              >
                <span class="text-xs text-gray-500">+{{ item.media.length - 3 }}</span>
              </div>
            </div>
          </div>
          
          <!-- 标签 -->
          <div v-if="item.tags && item.tags.length > 0" class="mb-3">
            <div class="flex flex-wrap gap-1">
              <span
                v-for="tag in item.tags.slice(0, 3)"
                :key="tag"
                class="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded text-xs"
              >
                #{{ tag }}
              </span>
              <span
                v-if="item.tags.length > 3"
                class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded text-xs"
              >
                +{{ item.tags.length - 3 }}
              </span>
            </div>
          </div>
          
          <!-- 统计信息 -->
          <div class="flex items-center justify-between text-xs text-gray-500">
            <div class="flex items-center space-x-4">
              <div class="flex items-center space-x-1">
                <EyeIcon class="w-3 h-3" />
                <span>{{ item.stats.views }}</span>
              </div>
              <div class="flex items-center space-x-1">
                <HeartIcon class="w-3 h-3" />
                <span>{{ item.stats.likes }}</span>
              </div>
              <div class="flex items-center space-x-1">
                <ChatBubbleLeftIcon class="w-3 h-3" />
                <span>{{ item.stats.comments }}</span>
              </div>
            </div>
            
            <!-- 查看详情提示 -->
            <div class="opacity-0 group-hover:opacity-100 transition-opacity">
              <span class="text-primary-600">查看详情 →</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 空状态 -->
    <div v-else class="text-center py-12">
      <div class="glass-card p-8 max-w-md mx-auto">
        <div class="text-4xl mb-4">📝</div>
        <h3 class="text-lg font-semibold mb-2">暂无动态</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          开始创建你的第一条记录吧！
        </p>
        <NuxtLink to="/create" class="neu-button px-6 py-3">
          创建内容
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ChevronRightIcon,
  MapPinIcon,
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  PhotoIcon
} from '@heroicons/vue/24/outline'
import { formatDate } from '~/utils'
import type { TimelineItem } from '~/types'

interface Props {
  limit?: number
}

const props = withDefaults(defineProps<Props>(), {
  limit: 5
})

// 使用时间流数据
const { timeline, loading, loadMockData } = useTimeline()

// 精选内容（最新的几条）
const featuredItems = computed(() => {
  return timeline.value
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, props.limit)
})

// 获取类型配置
const getTypeConfig = (type: string) => {
  const configs = {
    article: {
      icon: DocumentTextIcon,
      bgClass: 'bg-gradient-to-r from-blue-500 to-blue-600'
    },
    moment: {
      icon: ChatBubbleLeftRightIcon,
      bgClass: 'bg-gradient-to-r from-green-500 to-green-600'
    },
    gallery: {
      icon: PhotoIcon,
      bgClass: 'bg-gradient-to-r from-purple-500 to-purple-600'
    }
  }
  return configs[type as keyof typeof configs] || configs.moment
}

// 获取情绪表情
const getEmotionEmoji = (emotion: any) => {
  if (typeof emotion === 'string') {
    const emojiMap: Record<string, string> = {
      happy: '😊',
      excited: '🤩',
      calm: '😌',
      thoughtful: '🤔',
      grateful: '🙏',
      nostalgic: '😌',
      inspired: '💡',
      peaceful: '🕊️',
      adventurous: '🗺️',
      creative: '🎨'
    }
    return emojiMap[emotion] || '😊'
  }
  return emotion?.emoji || '😊'
}

// 处理图片错误
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = '/avatars/default.jpg'
}

// 导航到详情页
const navigateToDetail = (item: TimelineItem) => {
  navigateTo(`/${item.type}/${item.id}`)
}

// 组件挂载时加载数据
onMounted(() => {
  if (timeline.value.length === 0) {
    loadMockData()
  }
})
</script>

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
  opacity: 0;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
