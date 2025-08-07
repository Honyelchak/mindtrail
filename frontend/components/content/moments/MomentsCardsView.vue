<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div
      v-for="moment in moments"
      :key="moment.id"
      class="neu-card p-6 hover:shadow-neu-large transition-all duration-300 cursor-pointer"
      @click="() => $emit('moment-click', moment)"
    >
      <!-- 头部信息 -->
      <div class="flex items-center space-x-3 mb-4">
        <img
          :src="moment.author?.avatar || '/avatars/default.jpg'"
          :alt="moment.author?.name || '作者'"
          class="w-10 h-10 rounded-full"
          @error="handleImageError"
        />
        <div class="flex-1">
          <h3 class="font-medium text-neutral-800 dark:text-neutral-200">
            {{ moment.author?.name || '匿名用户' }}
          </h3>
          <time class="text-sm text-neutral-500 dark:text-neutral-400">
            {{ formatDate(moment.createdAt) }}
          </time>
        </div>
        
        <!-- 心情图标 -->
        <div v-if="moment.mood" class="text-2xl">
          {{ getMoodEmoji(moment.mood) }}
        </div>
      </div>

      <!-- 内容 -->
      <div class="mb-4">
        <p class="text-neutral-700 dark:text-neutral-300 leading-relaxed line-clamp-4">
          {{ moment.content }}
        </p>
      </div>

      <!-- 图片网格 -->
      <div v-if="moment.images && moment.images.length > 0" class="mb-4">
        <div 
          class="grid gap-2"
          :class="getImageGridClass(moment.images.length)"
        >
          <img
            v-for="(image, index) in moment.images.slice(0, 4)"
            :key="index"
            :src="image"
            :alt="`图片 ${index + 1}`"
            class="w-full h-24 object-cover rounded-lg"
            @error="handleImageError"
          />
          
          <!-- 更多图片指示器 -->
          <div
            v-if="moment.images.length > 4"
            class="relative w-full h-24 bg-neutral-200 dark:bg-neutral-700 rounded-lg flex items-center justify-center"
          >
            <span class="text-neutral-600 dark:text-neutral-400 font-medium">
              +{{ moment.images.length - 4 }}
            </span>
          </div>
        </div>
      </div>

      <!-- 位置信息 -->
      <div v-if="moment.location" class="flex items-center space-x-1 mb-4 text-sm text-neutral-500 dark:text-neutral-400">
        <MapPinIcon class="w-4 h-4" />
        <span>{{ moment.location.name }}</span>
      </div>

      <!-- 标签 -->
      <div v-if="moment.tags && moment.tags.length > 0" class="flex flex-wrap gap-1 mb-4">
        <span
          v-for="tag in moment.tags.slice(0, 3)"
          :key="tag"
          class="inline-block px-2 py-1 text-xs bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 rounded-full"
        >
          #{{ tag }}
        </span>
        <span
          v-if="moment.tags.length > 3"
          class="inline-block px-2 py-1 text-xs bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 rounded-full"
        >
          +{{ moment.tags.length - 3 }}
        </span>
      </div>

      <!-- 底部操作栏 -->
      <div class="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-700">
        <div class="flex items-center space-x-4">
          <button
            @click.stop="() => $emit('like', moment)"
            class="flex items-center space-x-1 text-sm text-neutral-500 dark:text-neutral-400 hover:text-red-500 transition-colors"
          >
            <HeartIcon class="w-4 h-4" />
            <span>{{ moment.likes || 0 }}</span>
          </button>
          
          <button
            @click.stop="() => $emit('comment', moment)"
            class="flex items-center space-x-1 text-sm text-neutral-500 dark:text-neutral-400 hover:text-blue-500 transition-colors"
          >
            <ChatBubbleLeftIcon class="w-4 h-4" />
            <span>{{ moment.comments || 0 }}</span>
          </button>
          
          <button
            @click.stop="() => $emit('share', moment)"
            class="flex items-center space-x-1 text-sm text-neutral-500 dark:text-neutral-400 hover:text-green-500 transition-colors"
          >
            <ShareIcon class="w-4 h-4" />
          </button>
        </div>
        
        <!-- 更多操作 -->
        <button
          @click.stop="() => $emit('more', moment)"
          class="p-1 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
        >
          <EllipsisHorizontalIcon class="w-4 h-4" />
        </button>
      </div>
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
}

interface Emits {
  (e: 'moment-click', moment: Moment): void
  (e: 'like', moment: Moment): void
  (e: 'comment', moment: Moment): void
  (e: 'share', moment: Moment): void
  (e: 'more', moment: Moment): void
}

defineProps<Props>()
defineEmits<Emits>()

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
  return 'grid-cols-2'
}
</script>

<style scoped>
.line-clamp-4 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
