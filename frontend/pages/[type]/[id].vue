<template>
  <div class="min-h-screen">
    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
      <div class="neu-card p-8">
        <div class="animate-pulse space-y-4">
          <div
            class="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4"
          ></div>
          <div
            class="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2"
          ></div>
          <div class="space-y-2">
            <div class="h-4 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
            <div
              class="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-5/6"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 错误状态 -->
    <div
      v-else-if="error"
      class="flex justify-center items-center min-h-[400px]"
    >
      <div class="neu-card p-8 max-w-md text-center">
        <div class="text-red-500 mb-4">
          <ExclamationTriangleIcon class="w-12 h-12 mx-auto" />
        </div>
        <h3 class="text-lg font-semibold mb-2">内容加载失败</h3>
        <p class="text-neutral-600 dark:text-neutral-400 mb-4">{{ error }}</p>
        <button @click="loadContent" class="neu-button">重试</button>
      </div>
    </div>

    <!-- 内容详情 -->
    <div v-else-if="content" class="max-w-4xl mx-auto">
      <!-- 返回按钮 -->
      <div class="mb-6">
        <button @click="goBack" class="neu-button flex items-center space-x-2">
          <ArrowLeftIcon class="w-4 h-4" />
          <span>返回</span>
        </button>
      </div>

      <!-- 主要内容区域 -->
      <article class="neu-card p-8 mb-8">
        <!-- 头部信息 -->
        <header class="mb-6">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center space-x-3">
              <!-- 类型图标 -->
              <div
                class="w-12 h-12 rounded-xl flex items-center justify-center"
                :class="typeConfig.bgClass"
              >
                <component :is="typeConfig.icon" class="w-6 h-6 text-white" />
              </div>

              <!-- 作者和时间信息 -->
              <div>
                <div class="flex items-center space-x-2">
                  <img
                    :src="content.author.avatar"
                    :alt="content.author.name"
                    class="w-8 h-8 rounded-full"
                    @error="handleImageError"
                  />
                  <span
                    class="font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    {{ content.author.name }}
                  </span>
                  <span class="text-sm text-neutral-500 dark:text-neutral-400"
                    >·</span
                  >
                  <time
                    class="text-sm text-neutral-500 dark:text-neutral-400"
                    :datetime="content.createdAt"
                  >
                    {{ formatDate(content.createdAt, 'full') }}
                  </time>
                </div>

                <!-- 位置信息 -->
                <div
                  v-if="content.location"
                  class="flex items-center space-x-1 mt-1"
                >
                  <MapPinIcon class="w-4 h-4 text-neutral-400" />
                  <span class="text-sm text-neutral-500 dark:text-neutral-400">
                    {{ content.location.name }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 情绪指示器 -->
            <div v-if="content.emotion" class="flex-shrink-0">
              <div
                class="flex items-center space-x-2 px-4 py-2 rounded-full"
                :style="{ backgroundColor: emotionConfig?.color + '20' }"
              >
                <span class="text-lg">{{ emotionConfig?.icon }}</span>
                <span
                  class="text-sm font-medium"
                  :style="{ color: emotionConfig?.color }"
                >
                  {{ emotionConfig?.label }}
                </span>
              </div>
            </div>
          </div>

          <!-- 标题 -->
          <h1
            class="text-3xl font-bold mb-4 text-neutral-800 dark:text-neutral-200"
          >
            {{ content.title }}
          </h1>

          <!-- 阅读时间和分类（仅文章） -->
          <div
            v-if="content.type === 'article'"
            class="flex items-center space-x-4 text-sm text-neutral-500 dark:text-neutral-400"
          >
            <div v-if="content.readingTime" class="flex items-center space-x-1">
              <ClockIcon class="w-4 h-4" />
              <span>约 {{ content.readingTime }} 分钟阅读</span>
            </div>
            <div v-if="content.category" class="flex items-center space-x-1">
              <TagIcon class="w-4 h-4" />
              <span>{{ content.category }}</span>
            </div>
          </div>
        </header>

        <!-- 媒体内容 -->
        <div v-if="content.media && content.media.length > 0" class="mb-8">
          <MediaGallery :media="content.media" />
        </div>

        <!-- 正文内容 -->
        <div class="prose prose-lg max-w-none dark:prose-invert mb-8">
          <div
            v-if="content.type === 'article'"
            v-html="formattedContent"
          ></div>
          <p v-else class="text-lg leading-relaxed">{{ content.content }}</p>
        </div>

        <!-- 标签 -->
        <div v-if="content.tags && content.tags.length > 0" class="mb-8">
          <div class="flex flex-wrap gap-2">
            <NuxtLink
              v-for="tag in content.tags"
              :key="tag"
              :to="`/?tag=${encodeURIComponent(tag)}`"
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-primary-100 dark:hover:bg-primary-900/20 transition-colors"
            >
              #{{ tag }}
            </NuxtLink>
          </div>
        </div>

        <!-- 统计和操作 -->
        <div
          class="flex items-center justify-between pt-6 border-t border-neutral-200/50 dark:border-neutral-700/50"
        >
          <!-- 统计信息 -->
          <div
            class="flex items-center space-x-6 text-sm text-neutral-500 dark:text-neutral-400"
          >
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
          <div class="flex items-center space-x-2">
            <button class="neu-button p-3" title="点赞">
              <HeartIcon class="w-5 h-5" />
            </button>
            <button class="neu-button p-3" title="分享">
              <ShareIcon class="w-5 h-5" />
            </button>
            <button class="neu-button p-3" title="收藏">
              <BookmarkIcon class="w-5 h-5" />
            </button>
          </div>
        </div>
      </article>

      <!-- 评论区域 -->
      <CommentSection :content-id="content.id" :content-type="content.type" />

      <!-- 相关推荐 -->
      <RelatedContent :current-content="content" />
    </div>
  </div>
</template>

<script setup>
import {
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  PhotoIcon,
  MapPinIcon,
  ClockIcon,
  TagIcon,
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
  BookmarkIcon,
} from '@heroicons/vue/24/outline'

// 路由参数
const route = useRoute()
const router = useRouter()
const { type, id } = route.params

// 响应式数据
const content = ref(null)
const loading = ref(true)
const error = ref(null)

// 使用 Timeline Composable
const { getItemById, formatDate } = useTimeline()

// 类型配置
const typeConfig = computed(() => {
  const configs = {
    moments: {
      icon: ChatBubbleLeftRightIcon,
      bgClass: 'bg-gradient-to-r from-accent-500 to-accent-600',
      label: '说说',
    },
    articles: {
      icon: DocumentTextIcon,
      bgClass: 'bg-gradient-to-r from-primary-500 to-primary-600',
      label: '文章',
    },
    galleries: {
      icon: PhotoIcon,
      bgClass: 'bg-gradient-to-r from-secondary-500 to-secondary-600',
      label: '相册',
    },
  }
  return configs[type] || configs.moments
})

// 情绪配置
const emotionConfig = computed(() => {
  if (!content.value?.emotion) return null

  const emotions = [
    { type: 'happy', label: '开心', color: '#FCD34D', icon: '😊' },
    { type: 'sad', label: '难过', color: '#60A5FA', icon: '😢' },
    { type: 'excited', label: '兴奋', color: '#F87171', icon: '🤩' },
    { type: 'peaceful', label: '平静', color: '#34D399', icon: '😌' },
    { type: 'focused', label: '专注', color: '#A78BFA', icon: '🤔' },
    { type: 'productive', label: '高效', color: '#FB7185', icon: '💪' },
    { type: 'satisfied', label: '满足', color: '#FBBF24', icon: '😋' },
    { type: 'tired', label: '疲惫', color: '#9CA3AF', icon: '😴' },
  ]

  return emotions.find((emotion) => emotion.type === content.value.emotion.type)
})

// 格式化内容（用于文章的 Markdown 渲染）
const formattedContent = computed(() => {
  if (!content.value || content.value.type !== 'article') return ''

  // 这里可以集成 Markdown 解析器，现在先简单处理
  return content.value.content.replace(/\n/g, '<br>')
})

// 加载内容
const loadContent = async () => {
  loading.value = true
  error.value = null

  try {
    // 模拟 API 调用延迟
    await new Promise((resolve) => setTimeout(resolve, 500))

    // 从 Mock 数据中获取内容
    const mockData = await import('../../data/mock-data.json')
    const item = mockData.timeline.find(
      (item) =>
        item.id === id &&
        ((type === 'moments' && item.type === 'moment') ||
          (type === 'articles' && item.type === 'article') ||
          (type === 'galleries' && item.type === 'gallery'))
    )

    if (!item) {
      throw new Error('内容不存在')
    }

    content.value = item

    // 更新页面元数据
    useHead({
      title: `${item.title} - Mindtrail`,
      meta: [
        {
          name: 'description',
          content: item.excerpt || item.content.substring(0, 160),
        },
      ],
    })
  } catch (err) {
    error.value = err.message || '加载内容失败'
    console.error('Error loading content:', err)
  } finally {
    loading.value = false
  }
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 处理图片加载错误
const handleImageError = (event) => {
  event.target.src = '/avatars/default.jpg'
}

// 页面加载时获取内容
onMounted(() => {
  loadContent()
})

// 监听路由变化
watch(
  () => route.params,
  () => {
    if (route.params.type && route.params.id) {
      loadContent()
    }
  },
  { deep: true }
)
</script>
