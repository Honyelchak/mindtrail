<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      @click="$emit('close')"
    >
      <div
        class="neu-card max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        @click.stop
      >
        <!-- 头部 -->
        <div class="flex items-start justify-between p-6 border-b border-neutral-200/50 dark:border-neutral-700/50">
          <div class="flex items-center space-x-3">
            <!-- 类型图标 -->
            <div class="w-10 h-10 rounded-xl flex items-center justify-center"
                 :class="typeConfig.bgClass">
              <component :is="typeConfig.icon" class="w-5 h-5 text-white" />
            </div>
            
            <div>
              <h2 class="text-xl font-semibold text-neutral-800 dark:text-neutral-200">
                {{ content.title }}
              </h2>
              <div class="flex items-center space-x-2 text-sm text-neutral-500 dark:text-neutral-400">
                <MapPinIcon class="w-4 h-4" />
                <span>{{ content.location?.name }}</span>
                <span>·</span>
                <time>{{ formatDate(content.createdAt) }}</time>
              </div>
            </div>
          </div>

          <button
            @click="$emit('close')"
            class="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
          >
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>

        <!-- 内容 -->
        <div class="p-6">
          <!-- 情绪指示器 -->
          <div v-if="content.emotion" class="mb-4">
            <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full"
                 :style="{ backgroundColor: emotionConfig?.color + '20' }">
              <span class="text-sm">{{ emotionConfig?.icon }}</span>
              <span class="text-xs font-medium"
                    :style="{ color: emotionConfig?.color }">
                {{ emotionConfig?.label }}
              </span>
            </div>
          </div>

          <!-- 媒体内容 -->
          <div v-if="content.media && content.media.length > 0" class="mb-4">
            <div class="grid grid-cols-2 gap-2" v-if="content.media.length > 1">
              <img
                v-for="(media, index) in content.media.slice(0, 4)"
                :key="index"
                :src="media.url"
                :alt="media.alt"
                class="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                @click="openImageViewer(index)"
              >
            </div>
            <img
              v-else
              :src="content.media[0].url"
              :alt="content.media[0].alt"
              class="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              @click="openImageViewer(0)"
            >
          </div>

          <!-- 正文 -->
          <div class="prose prose-neutral dark:prose-invert max-w-none mb-4">
            <p class="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {{ content.excerpt || content.content }}
            </p>
          </div>

          <!-- 标签 -->
          <div v-if="content.tags && content.tags.length > 0" class="mb-4">
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in content.tags"
                :key="tag"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
              >
                #{{ tag }}
              </span>
            </div>
          </div>

          <!-- 统计信息 -->
          <div class="flex items-center space-x-6 text-sm text-neutral-500 dark:text-neutral-400 mb-6">
            <div class="flex items-center space-x-1">
              <EyeIcon class="w-4 h-4" />
              <span>{{ content.stats?.views || 0 }} 次浏览</span>
            </div>
            <div class="flex items-center space-x-1">
              <HeartIcon class="w-4 h-4" />
              <span>{{ content.stats?.likes || 0 }} 个赞</span>
            </div>
            <div class="flex items-center space-x-1">
              <ChatBubbleLeftIcon class="w-4 h-4" />
              <span>{{ content.stats?.comments || 0 }} 条评论</span>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <button class="neu-button p-3" title="点赞">
                <HeartIcon class="w-4 h-4" />
              </button>
              <button class="neu-button p-3" title="评论">
                <ChatBubbleLeftIcon class="w-4 h-4" />
              </button>
              <button class="neu-button p-3" title="分享">
                <ShareIcon class="w-4 h-4" />
              </button>
            </div>

            <button
              @click="$emit('navigate', content)"
              class="neu-button px-6 py-3 flex items-center space-x-2"
            >
              <span>查看详情</span>
              <ArrowTopRightOnSquareIcon class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import {
  XMarkIcon,
  MapPinIcon,
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
  ArrowTopRightOnSquareIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  PhotoIcon
} from '@heroicons/vue/24/outline'

// Props
const props = defineProps({
  content: {
    type: Object,
    required: true
  }
})

// Emits
const emit = defineEmits(['close', 'navigate'])

// 类型配置
const typeConfig = computed(() => {
  const configs = {
    moment: {
      icon: ChatBubbleLeftRightIcon,
      bgClass: 'bg-gradient-to-r from-accent-500 to-accent-600',
      label: '说说'
    },
    article: {
      icon: DocumentTextIcon,
      bgClass: 'bg-gradient-to-r from-primary-500 to-primary-600',
      label: '文章'
    },
    gallery: {
      icon: PhotoIcon,
      bgClass: 'bg-gradient-to-r from-secondary-500 to-secondary-600',
      label: '相册'
    }
  }
  return configs[props.content.type] || configs.moment
})

// 情绪配置
const emotionConfig = computed(() => {
  if (!props.content.emotion) return null
  
  const emotions = [
    { type: 'happy', label: '开心', color: '#FCD34D', icon: '😊' },
    { type: 'sad', label: '难过', color: '#60A5FA', icon: '😢' },
    { type: 'excited', label: '兴奋', color: '#F87171', icon: '🤩' },
    { type: 'peaceful', label: '平静', color: '#34D399', icon: '😌' },
    { type: 'focused', label: '专注', color: '#A78BFA', icon: '🤔' },
    { type: 'productive', label: '高效', color: '#FB7185', icon: '💪' },
    { type: 'satisfied', label: '满足', color: '#FBBF24', icon: '😋' },
    { type: 'tired', label: '疲惫', color: '#9CA3AF', icon: '😴' }
  ]
  
  return emotions.find(emotion => emotion.type === props.content.emotion.type)
})

// 方法
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const openImageViewer = (index) => {
  // 这里可以集成图片查看器
  console.log('Open image viewer at index:', index)
}

// 监听 ESC 键关闭模态框
const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
/* 模态框动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .neu-card,
.modal-leave-active .neu-card {
  transition: transform 0.3s ease;
}

.modal-enter-from .neu-card,
.modal-leave-to .neu-card {
  transform: scale(0.9);
}
</style>
