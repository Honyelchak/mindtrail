<template>
  <div
    class="group relative bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-white/20 hover:border-white/40"
    :class="[
      viewMode === 'waterfall' ? 'break-inside-avoid mb-6' : '',
      viewMode === 'timeline' ? 'ml-8 relative' : ''
    ]"
  >
    <!-- 时间线模式的连接线 -->
    <div
      v-if="viewMode === 'timeline'"
      class="absolute -left-8 top-6 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-4 border-white shadow-lg"
    />
    <div
      v-if="viewMode === 'timeline' && !isLast"
      class="absolute -left-6 top-10 w-0.5 h-full bg-gradient-to-b from-blue-500/50 to-purple-500/50"
    />

    <!-- 卡片发光效果 -->
    <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
    
    <!-- 内容区域 -->
    <div class="relative z-10">
      <!-- 头部信息 -->
      <div class="flex items-start justify-between mb-4">
        <div class="flex items-center space-x-3">
          <!-- 情绪图标 -->
          <div
            class="text-2xl p-2 rounded-full bg-white/20 backdrop-blur-sm"
            :class="getMoodColor(moment.mood)"
          >
            {{ getMoodIcon(moment.mood) }}
          </div>
          
          <!-- 时间信息 -->
          <div class="text-white/80">
            <div class="font-medium">{{ formatTime(moment.createdAt) }}</div>
            <div class="text-sm text-white/60">
              {{ new Date(moment.createdAt).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) }}
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            @click="$emit('like', moment.id)"
            class="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200"
          >
            <Icon name="heroicons:heart" class="w-4 h-4 text-red-400" />
          </button>
          <button
            @click="$emit('comment', moment.id)"
            class="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200"
          >
            <Icon name="heroicons:chat-bubble-left" class="w-4 h-4 text-blue-400" />
          </button>
        </div>
      </div>

      <!-- 内容文本 -->
      <div class="text-white/90 leading-relaxed mb-4 text-sm md:text-base">
        {{ moment.content }}
      </div>

      <!-- 图片展示 -->
      <div v-if="moment.images && moment.images.length > 0" class="mb-4">
        <div
          v-if="moment.images.length === 1"
          class="relative rounded-xl overflow-hidden cursor-pointer group/image"
          @click="openImageViewer(0)"
        >
          <img
            :src="moment.images[0].url"
            :alt="moment.images[0].alt || '图片'"
            class="w-full h-48 md:h-64 object-cover transition-transform duration-300 group-hover/image:scale-105"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-black/20 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Icon name="heroicons:magnifying-glass-plus" class="w-8 h-8 text-white" />
          </div>
        </div>

        <div
          v-else
          class="grid gap-2"
          :class="{
            'grid-cols-2': moment.images.length === 2 || moment.images.length === 4,
            'grid-cols-3': moment.images.length === 3 || moment.images.length > 4
          }"
        >
          <div
            v-for="(image, index) in moment.images.slice(0, 6)"
            :key="image.id"
            class="relative rounded-lg overflow-hidden cursor-pointer group/image aspect-square"
            @click="openImageViewer(index)"
          >
            <img
              :src="image.thumbnail || image.url"
              :alt="image.alt || `图片${index + 1}`"
              class="w-full h-full object-cover transition-transform duration-300 group-hover/image:scale-105"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-black/20 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Icon name="heroicons:magnifying-glass-plus" class="w-6 h-6 text-white" />
            </div>
            
            <!-- 更多图片提示 -->
            <div
              v-if="index === 5 && moment.images.length > 6"
              class="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-medium"
            >
              +{{ moment.images.length - 6 }}
            </div>
          </div>
        </div>
      </div>

      <!-- 标签 -->
      <div v-if="moment.tags && moment.tags.length > 0" class="flex flex-wrap gap-2 mb-4">
        <span
          v-for="tag in moment.tags"
          :key="tag"
          class="px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white/80 hover:bg-white/30 transition-colors duration-200 cursor-pointer"
          @click="$emit('tagClick', tag)"
        >
          #{{ tag }}
        </span>
      </div>

      <!-- 底部信息 -->
      <div class="flex items-center justify-between text-xs text-white/60">
        <div class="flex items-center space-x-4">
          <!-- 位置信息 -->
          <div v-if="moment.location?.name" class="flex items-center space-x-1">
            <Icon name="heroicons:map-pin" class="w-3 h-3" />
            <span>{{ moment.location.name }}</span>
          </div>
          
          <!-- 设备信息 -->
          <div v-if="moment.device" class="flex items-center space-x-1">
            <Icon name="heroicons:device-phone-mobile" class="w-3 h-3" />
            <span>{{ moment.device }}</span>
          </div>
        </div>

        <!-- 互动数据 -->
        <div class="flex items-center space-x-4">
          <div v-if="moment.likes && moment.likes > 0" class="flex items-center space-x-1">
            <Icon name="heroicons:heart" class="w-3 h-3 text-red-400" />
            <span>{{ moment.likes }}</span>
          </div>
          <div v-if="moment.comments && moment.comments > 0" class="flex items-center space-x-1">
            <Icon name="heroicons:chat-bubble-left" class="w-3 h-3 text-blue-400" />
            <span>{{ moment.comments }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 图片查看器 -->
    <ImageViewer
      v-if="showImageViewer"
      :images="moment.images || []"
      :initial-index="currentImageIndex"
      @close="closeImageViewer"
    />
  </div>
</template>

<script setup lang="ts">
import type { Moment } from '~/types'

interface Props {
  moment: Moment
  viewMode?: 'card' | 'waterfall' | 'timeline'
  isLast?: boolean
}

interface Emits {
  like: [momentId: string]
  comment: [momentId: string]
  tagClick: [tag: string]
}

const props = withDefaults(defineProps<Props>(), {
  viewMode: 'card',
  isLast: false
})

const emit = defineEmits<Emits>()

// 图片查看器状态
const showImageViewer = ref(false)
const currentImageIndex = ref(0)

// 获取情绪图标
const getMoodIcon = (mood?: string) => {
  const moodIcons: Record<string, string> = {
    happy: '😊',
    sad: '😢',
    excited: '🤩',
    calm: '😌',
    angry: '😠',
    love: '😍',
    thinking: '🤔',
    tired: '😴',
    surprised: '😲',
    confused: '😕'
  }
  return mood ? moodIcons[mood] || '😐' : '😐'
}

// 获取情绪颜色
const getMoodColor = (mood?: string) => {
  const moodColors: Record<string, string> = {
    happy: 'text-yellow-400',
    sad: 'text-blue-400',
    excited: 'text-pink-400',
    calm: 'text-green-400',
    angry: 'text-red-400',
    love: 'text-red-300',
    thinking: 'text-purple-400',
    tired: 'text-gray-400',
    surprised: 'text-orange-400',
    confused: 'text-indigo-400'
  }
  return mood ? moodColors[mood] || 'text-gray-400' : 'text-gray-400'
}

// 格式化时间
const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric'
  })
}

// 打开图片查看器
const openImageViewer = (index: number) => {
  currentImageIndex.value = index
  showImageViewer.value = true
}

// 关闭图片查看器
const closeImageViewer = () => {
  showImageViewer.value = false
}
</script>

<style scoped>
/* 瀑布流布局优化 */
@supports (column-count: 1) {
  .waterfall-container {
    column-count: 1;
    column-gap: 1.5rem;
  }
  
  @media (min-width: 640px) {
    .waterfall-container {
      column-count: 2;
    }
  }
  
  @media (min-width: 1024px) {
    .waterfall-container {
      column-count: 3;
    }
  }
  
  @media (min-width: 1280px) {
    .waterfall-container {
      column-count: 4;
    }
  }
}
</style>
