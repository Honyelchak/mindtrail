<!--
  ArticleContent.vue - 文章内容区域组件
  
  Props:
  - article: Article - 文章数据
  - focusMode: boolean - 专注模式
  
  Features:
  - 居中阅读区域
  - 首段 Drop Cap 效果
  - 注释 hover 卡片
  - 代码高亮
  - 图片懒加载
-->

<template>
  <article class="article-content relative">
    <div class="container mx-auto px-4 py-16">
      <!-- 主要内容区域 -->
      <div class="max-w-4xl mx-auto" :class="{ 'max-w-5xl': focusMode }">
        <!-- 文章正文 -->
        <div
          class="max-w-none"
          :class="{
            'text-xl': focusMode,
            'text-2xl': focusMode,
          }"
        >
          <!-- Markdown内容渲染 -->
          <MarkdownRenderer
            :content="markdownContent"
            :source="contentSource"
            @mouseover="handleMouseOver"
            @mouseout="handleMouseOut"
          />
        </div>

        <!-- 文章底部信息 -->
        <footer class="mt-16 pt-8 border-t border-white/10">
          <!-- 标签 -->
          <div v-if="article.tags && article.tags.length > 0" class="mb-8">
            <h4 class="text-white font-medium mb-4">相关标签</h4>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="tag in article.tags"
                :key="tag"
                class="px-4 py-2 bg-glass-bg backdrop-blur-sm border border-glass-border text-white/80 text-sm rounded-full hover:bg-primary-500/20 hover:border-primary-400/50 hover:text-primary-300 transition-all duration-200"
                @click="$emit('tagClick', tag)"
              >
                #{{ tag }}
              </button>
            </div>
          </div>

          <!-- 作者信息卡片 -->
          <div
            class="bg-glass-bg backdrop-blur-md border border-glass-border rounded-2xl p-6"
          >
            <div class="flex items-start space-x-4">
              <img
                :src="article.author.avatar"
                :alt="article.author.name"
                class="w-16 h-16 rounded-full border-2 border-white/20"
                loading="lazy"
              />
              <div class="flex-1">
                <h4 class="text-white font-bold text-lg mb-1">
                  {{ article.author.name }}
                </h4>
                <p
                  v-if="article.author.title"
                  class="text-primary-300 text-sm mb-3"
                >
                  {{ article.author.title }}
                </p>
                <p
                  v-if="article.author.bio"
                  class="text-white/70 text-sm leading-relaxed"
                >
                  {{ article.author.bio }}
                </p>

                <!-- 社交链接 -->
                <div
                  v-if="article.author.social"
                  class="flex items-center space-x-3 mt-4"
                >
                  <a
                    v-for="(link, platform) in article.author.social"
                    :key="platform"
                    :href="link"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-white/60 hover:text-primary-400 transition-colors duration-200"
                  >
                    <Icon :name="`simple-icons:${platform}`" class="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- 分享按钮 -->
          <div class="mt-8 flex items-center justify-center space-x-4">
            <span class="text-white/60 text-sm">分享这篇文章</span>
            <div class="flex items-center space-x-2">
              <button
                v-for="social in socialButtons"
                :key="social.name"
                @click="$emit('share', social.name)"
                class="w-10 h-10 bg-glass-bg backdrop-blur-sm border border-glass-border rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-primary-500/20 hover:border-primary-400/50 transition-all duration-200 hover:scale-110"
                :title="`分享到${social.label}`"
              >
                <Icon :name="social.icon" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>

    <!-- 注释悬浮卡片 -->
    <div
      v-if="showAnnotation && currentAnnotation"
      class="fixed z-50 max-w-sm p-4 bg-black/90 backdrop-blur-md border border-white/20 rounded-lg shadow-2xl pointer-events-none"
      :style="annotationStyle"
    >
      <div class="text-white text-sm" v-html="currentAnnotation.content" />
    </div>
  </article>
</template>

<script setup lang="ts">
interface Article {
  id: string
  title: string
  content: string
  tags: string[]
  author: {
    name: string
    avatar: string
    title?: string
    bio?: string
    social?: Record<string, string>
  }
}

interface Annotation {
  id: string
  content: string
  position: { x: number; y: number }
}

interface Props {
  article: Article
  focusMode?: boolean
}

interface Emits {
  tagClick: [tag: string]
  share: [platform: string]
}

const props = withDefaults(defineProps<Props>(), {
  focusMode: false,
})

const emit = defineEmits<Emits>()

// 注释相关状态
const showAnnotation = ref(false)
const currentAnnotation = ref<Annotation | null>(null)
const annotationStyle = ref({})

// 社交分享按钮
const socialButtons = [
  { name: 'twitter', label: 'Twitter', icon: 'simple-icons:twitter' },
  { name: 'facebook', label: 'Facebook', icon: 'simple-icons:facebook' },
  { name: 'linkedin', label: 'LinkedIn', icon: 'simple-icons:linkedin' },
  { name: 'wechat', label: '微信', icon: 'simple-icons:wechat' },
]

// Markdown内容和来源
const markdownContent = computed(() => {
  // 如果内容是Markdown文件路径，返回路径
  if (props.article.content.endsWith('.md')) {
    return props.article.content
  }
  // 否则返回内容本身
  return props.article.content
})

const contentSource = computed(() => {
  // 如果内容是Markdown文件路径，设置为URL模式
  if (props.article.content.endsWith('.md')) {
    return 'url'
  }
  // 否则是字符串模式
  return 'string'
})

// 处理鼠标悬浮事件
const handleMouseOver = (event: MouseEvent) => {
  const target = event.target as HTMLElement

  // 检查是否是注释元素
  if (target.classList.contains('annotation')) {
    const annotationId = target.dataset.annotationId
    if (annotationId) {
      showAnnotationCard(target, annotationId)
    }
  }
}

// 处理鼠标离开事件
const handleMouseOut = (event: MouseEvent) => {
  const target = event.target as HTMLElement

  if (target.classList.contains('annotation')) {
    hideAnnotationCard()
  }
}

// 显示注释卡片
const showAnnotationCard = (element: HTMLElement, annotationId: string) => {
  // 这里应该从 API 或数据中获取注释内容
  const annotation = {
    id: annotationId,
    content: element.dataset.annotationContent || '这是一个注释说明。',
    position: { x: 0, y: 0 },
  }

  const rect = element.getBoundingClientRect()
  annotationStyle.value = {
    left: `${rect.left + rect.width / 2}px`,
    top: `${rect.top - 10}px`,
    transform: 'translateX(-50%) translateY(-100%)',
  }

  currentAnnotation.value = annotation
  showAnnotation.value = true
}

// 隐藏注释卡片
const hideAnnotationCard = () => {
  showAnnotation.value = false
  currentAnnotation.value = null
}
</script>

<style scoped>
/* 文章内容样式 */
.article-content :deep(.prose) {
  color: rgba(255, 255, 255, 0.9);
}

.article-content :deep(.prose h1),
.article-content :deep(.prose h2),
.article-content :deep(.prose h3),
.article-content :deep(.prose h4),
.article-content :deep(.prose h5),
.article-content :deep(.prose h6) {
  color: white;
  font-weight: 700;
}

.article-content :deep(.prose h2) {
  font-size: 2rem;
  margin-top: 3rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.article-content :deep(.prose h3) {
  font-size: 1.5rem;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
}

.article-content :deep(.prose p) {
  margin-bottom: 1.5rem;
  line-height: 1.8;
}

.article-content :deep(.prose a) {
  color: theme('colors.primary.400');
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: all 0.2s ease;
}

.article-content :deep(.prose a:hover) {
  color: theme('colors.primary.300');
  border-bottom-color: theme('colors.primary.400');
}

.article-content :deep(.prose blockquote) {
  border-left: 4px solid theme('colors.primary.500');
  background: rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  margin: 2rem 0;
  border-radius: 0.5rem;
  font-style: italic;
}

.article-content :deep(.prose code) {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
  color: theme('colors.primary.300');
}

.article-content :deep(.prose pre) {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin: 2rem 0;
  overflow-x: auto;
}

.article-content :deep(.prose pre code) {
  background: none;
  padding: 0;
  color: rgba(255, 255, 255, 0.9);
}

.article-content :deep(.prose img) {
  border-radius: 0.75rem;
  margin: 2rem auto;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
}

.article-content :deep(.prose ul),
.article-content :deep(.prose ol) {
  margin: 1.5rem 0;
  padding-left: 2rem;
}

.article-content :deep(.prose li) {
  margin: 0.5rem 0;
}

/* 注释样式 */
.article-content :deep(.annotation) {
  background: rgba(59, 130, 246, 0.2);
  border-bottom: 2px dotted theme('colors.primary.400');
  cursor: help;
  transition: all 0.2s ease;
}

.article-content :deep(.annotation:hover) {
  background: rgba(59, 130, 246, 0.3);
}

/* 首字下沉效果 */
.first-paragraph p::first-letter {
  font-family: theme('fontFamily.display');
  line-height: 0.8;
  margin-right: 0.5rem;
  margin-top: 0.2rem;
}

/* 专注模式样式调整 */
.prose-2xl {
  font-size: 1.375rem;
  line-height: 1.8;
}

.prose-2xl h2 {
  font-size: 2.5rem;
}

.prose-2xl h3 {
  font-size: 2rem;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .first-paragraph p::first-letter {
    font-size: 4rem;
    margin-right: 0.25rem;
  }
}
</style>
