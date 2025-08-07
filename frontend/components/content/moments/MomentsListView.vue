<template>
  <div class="space-y-6">
    <div
      v-for="moment in moments"
      :key="moment.id"
      class="neu-card p-6 hover:shadow-neu-large transition-all duration-300"
    >
      <!-- 头部信息 -->
      <div class="flex items-start space-x-4 mb-4">
        <img
          :src="moment.author?.avatar || '/avatars/default.jpg'"
          :alt="moment.author?.name || '作者'"
          class="w-12 h-12 rounded-full flex-shrink-0"
          @error="handleImageError"
        />
        <div class="flex-1 min-w-0">
          <div class="flex items-center space-x-2 mb-1">
            <h3 class="font-semibold text-neutral-800 dark:text-neutral-200">
              {{ moment.author?.name || '匿名用户' }}
            </h3>
            <span v-if="moment.mood" class="text-lg">
              {{ getMoodEmoji(moment.mood) }}
            </span>
          </div>
          <time class="text-sm text-neutral-500 dark:text-neutral-400">
            {{ formatDate(moment.createdAt) }}
          </time>
        </div>
        
        <!-- 更多操作 -->
        <button
          @click="() => $emit('more', moment)"
          class="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <EllipsisHorizontalIcon class="w-5 h-5 text-neutral-500" />
        </button>
      </div>

      <!-- 内容 -->
      <div class="mb-4">
        <p class="text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap">
          {{ moment.content }}
        </p>
      </div>

      <!-- 图片展示 -->
      <div v-if="moment.images && moment.images.length > 0" class="mb-4">
        <div 
          class="grid gap-3"
          :class="getImageGridClass(moment.images.length)"
        >
          <img
            v-for="(image, index) in moment.images"
            :key="index"
            :src="image"
            :alt="`图片 ${index + 1}`"
            class="w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
            :class="getImageSizeClass(moment.images.length, index)"
            @click="() => $emit('image-click', { moment, imageIndex: index })"
            @error="handleImageError"
          />
        </div>
      </div>

      <!-- 位置信息 -->
      <div 
        v-if="moment.location" 
        class="flex items-center space-x-2 mb-4 text-sm text-neutral-600 dark:text-neutral-400 cursor-pointer hover:text-primary-600 transition-colors"
        @click="() => $emit('location-click', moment.location)"
      >
        <MapPinIcon class="w-4 h-4" />
        <span>{{ moment.location.name }}</span>
      </div>

      <!-- 标签 -->
      <div v-if="moment.tags && moment.tags.length > 0" class="flex flex-wrap gap-2 mb-4">
        <span
          v-for="tag in moment.tags"
          :key="tag"
          class="inline-block px-3 py-1 text-sm bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 rounded-full cursor-pointer hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
          @click="() => $emit('tag-click', tag)"
        >
          #{{ tag }}
        </span>
      </div>

      <!-- 底部操作栏 -->
      <div class="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-700">
        <div class="flex items-center space-x-6">
          <button
            @click="() => $emit('like', moment)"
            class="flex items-center space-x-2 text-sm text-neutral-500 dark:text-neutral-400 hover:text-red-500 transition-colors group"
          >
            <HeartIcon class="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>{{ moment.likes || 0 }}</span>
          </button>
          
          <button
            @click="() => $emit('comment', moment)"
            class="flex items-center space-x-2 text-sm text-neutral-500 dark:text-neutral-400 hover:text-blue-500 transition-colors group"
          >
            <ChatBubbleLeftIcon class="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>{{ moment.comments || 0 }}</span>
          </button>
          
          <button
            @click="() => $emit('share', moment)"
            class="flex items-center space-x-2 text-sm text-neutral-500 dark:text-neutral-400 hover:text-green-500 transition-colors group"
          >
            <ShareIcon class="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span class="hidden sm:inline">分享</span>
          </button>
        </div>
        
        <!-- 阅读更多/收起 -->
        <button
          v-if="moment.content.length > 200"
          @click="() => toggleExpanded(moment.id)"
          class="text-sm text-primary-600 hover:text-primary-700 transition-colors"
        >
          {{ expandedMoments.has(moment.id) ? '收起' : '展开' }}
        </button>
      </div>
    </div>

    <!-- 加载更多 -->
    <div v-if="hasMore" class="text-center py-8">
      <button
        @click="$emit('load-more')"
        :disabled="loading"
        class="neu-button px-8 py-3"
      >
        {{ loading ? '加载中...' : '加载更多' }}
      </button>
    </div>

    <!-- 空状态 -->
    <div v-if="moments.length === 0" class="text-center py-12">
      <div class="text-6xl mb-4">💭</div>
      <h3 class="text-xl font-semibold text-neutral-600 dark:text-neutral-400 mb-2">
        还没有说说
      </h3>
      <p class="text-neutral-500 dark:text-neutral-500 mb-6">
        分享你的第一个想法吧！
      </p>
      <button
        @click="$emit('create-moment')"
        class="neu-button-primary px-6 py-3"
      >
        写说说
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  HeartIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
  MapPinIcon,
  EllipsisHorizontalIcon
} from '@heroicons/vue/24/outline'
import { formatDate } from '~/utils'
import type { Moment } from '~/types'

interface Props {
  moments: Moment[]
  loading?: boolean
  hasMore?: boolean
}

interface Emits {
  (e: 'moment-click', moment: Moment): void
  (e: 'like', moment: Moment): void
  (e: 'comment', moment: Moment): void
  (e: 'share', moment: Moment): void
  (e: 'more', moment: Moment): void
  (e: 'image-click', data: { moment: Moment; imageIndex: number }): void
  (e: 'location-click', location: any): void
  (e: 'tag-click', tag: string): void
  (e: 'load-more'): void
  (e: 'create-moment'): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  hasMore: false
})

defineEmits<Emits>()

// 响应式数据
const expandedMoments = ref<Set<string>>(new Set())

// 方法
const handleImageError = (event: Event): void => {
  const target = event.target as HTMLImageElement
  target.src = '/images/placeholder.jpg'
}

const getMoodEmoji = (mood: string): string => {
  const moodEmojis: Record<string, string> = {
    happy: '😊',
    excited: '🤩',
    peaceful: '😌',
    thoughtful: '🤔',
    grateful: '🙏',
    nostalgic: '😌',
    inspired: '💡',
    relaxed: '😎',
    curious: '🧐',
    content: '😇'
  }
  return moodEmojis[mood] || '😊'
}

const getImageGridClass = (count: number): string => {
  if (count === 1) return 'grid-cols-1'
  if (count === 2) return 'grid-cols-2'
  if (count === 3) return 'grid-cols-3'
  if (count === 4) return 'grid-cols-2'
  return 'grid-cols-3'
}

const getImageSizeClass = (totalCount: number, index: number): string => {
  if (totalCount === 1) return 'aspect-video max-h-96 object-cover'
  if (totalCount === 2) return 'aspect-square object-cover'
  if (totalCount === 3) return 'aspect-square object-cover'
  if (totalCount === 4) return 'aspect-square object-cover'
  if (totalCount >= 5) {
    if (index < 4) return 'aspect-square object-cover'
    return 'aspect-square object-cover relative'
  }
  return 'aspect-square object-cover'
}

const toggleExpanded = (momentId: string): void => {
  if (expandedMoments.value.has(momentId)) {
    expandedMoments.value.delete(momentId)
  } else {
    expandedMoments.value.add(momentId)
  }
}
</script>

<style scoped>
.neu-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.dark .neu-card {
  background: rgba(31, 41, 55, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.neu-card:hover {
  transform: translateY(-2px);
}
</style>
