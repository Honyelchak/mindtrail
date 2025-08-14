<template>
  <div
    class="article-detail-page min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-tertiary"
  >
    <!-- 文章 Hero -->
    <ArticleHero
      v-if="article"
      :article="article"
      :scroll-progress="scrollProgress"
      :reading-progress="readingProgress"
      @scroll-to-content="scrollToContent"
      @share="handleShare"
    />

    <!-- 主要内容区域 -->
    <div class="relative">
      <!-- 专注模式切换 -->
      <FocusToggle
        :focus-mode="focusMode"
        position="fixed"
        @toggle-focus-mode="toggleFocusMode"
        @font-size-change="handleFontSizeChange"
        @line-spacing-change="handleLineSpacingChange"
        @page-width-change="handlePageWidthChange"
      />

      <!-- 粘性目录 -->
      <StickyTOC
        v-if="!focusMode && headings.length > 0"
        :headings="headings"
        :active-heading="activeHeading"
        :reading-progress="readingProgress"
        :collapsed="tocCollapsed"
        @toggle-collapsed="tocCollapsed = !tocCollapsed"
        @heading-click="handleHeadingClick"
        @scroll-to-top="scrollToTop"
        @scroll-to-bottom="scrollToBottom"
      />

      <!-- 文章内容 -->
      <ArticleContent
        v-if="article"
        :article="article"
        :focus-mode="focusMode"
        @tag-click="handleTagClick"
        @share="handleShare"
      />

      <!-- 相关文章推荐 -->
      <section
        v-if="relatedArticles.length > 0"
        class="related-articles py-16 bg-glass-bg/30"
      >
        <div class="container mx-auto px-4">
          <h2 class="text-display-sm text-white font-bold text-center mb-12">
            相关文章
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <article
              v-for="relatedArticle in relatedArticles"
              :key="relatedArticle.id"
              class="group cursor-pointer bg-glass-bg backdrop-blur-md rounded-2xl overflow-hidden border border-glass-border hover:border-primary-400/50 transition-all duration-350 hover:-translate-y-2 hover:shadow-glass-lg"
              @click="navigateToArticle(relatedArticle.id)"
            >
              <div class="relative aspect-video overflow-hidden">
                <picture>
                  <source
                    :srcset="`${relatedArticle.coverImage.url}?format=webp&w=600 600w`"
                    type="image/webp"
                  />
                  <img
                    :src="relatedArticle.coverImage.url"
                    :alt="relatedArticle.coverImage.alt"
                    loading="lazy"
                    class="w-full h-full object-cover transition-transform duration-350 group-hover:scale-105"
                  />
                </picture>
              </div>

              <div class="p-6">
                <div class="mb-2">
                  <span
                    class="text-xs font-medium text-primary-400 uppercase tracking-wider"
                  >
                    {{ relatedArticle.category }}
                  </span>
                </div>

                <h3
                  class="text-white font-bold text-lg mb-3 line-clamp-2 group-hover:text-primary-300 transition-colors duration-200"
                >
                  {{ relatedArticle.title }}
                </h3>

                <p class="text-white/70 text-sm line-clamp-2 mb-4">
                  {{ relatedArticle.excerpt }}
                </p>

                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <img
                      :src="relatedArticle.author.avatar"
                      :alt="relatedArticle.author.name"
                      class="w-6 h-6 rounded-full"
                      loading="lazy"
                    />
                    <span class="text-white/70 text-xs">{{
                      relatedArticle.author.name
                    }}</span>
                  </div>
                  <span class="text-white/50 text-xs">
                    {{ formatDate(relatedArticle.publishedAt) }}
                  </span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
// 页面参数
const route = useRoute()
const articleId = route.params.id as string

// 响应式状态
const article = ref(null)
const headings = ref([])
const activeHeading = ref('')
const scrollProgress = ref(0)
const readingProgress = ref(0)
const focusMode = ref(false)
const tocCollapsed = ref(false)

// 相关文章
const relatedArticles = ref([
  {
    id: '2',
    title: '现代前端开发的最佳实践',
    excerpt: '前端开发生态系统日新月异，新的框架、工具和最佳实践层出不穷。',
    coverImage: {
      url: 'https://picsum.photos/600/400?random=2',
      alt: '前端开发',
    },
    author: {
      name: '李四',
      avatar: 'https://picsum.photos/100/100?random=2',
    },
    publishedAt: '2024-01-10T14:30:00Z',
    category: '技术',
  },
  {
    id: '3',
    title: '设计系统的构建与维护',
    excerpt: '一个好的设计系统不仅能提高设计效率，还能确保产品的一致性。',
    coverImage: {
      url: 'https://picsum.photos/600/400?random=3',
      alt: '设计系统',
    },
    author: {
      name: '王五',
      avatar: 'https://picsum.photos/100/100?random=3',
    },
    publishedAt: '2024-01-05T09:15:00Z',
    category: '设计',
  },
  {
    id: '4',
    title: '微服务架构的演进之路',
    excerpt: '从单体应用到微服务架构，这是一个充满挑战和机遇的转变过程。',
    coverImage: {
      url: 'https://picsum.photos/600/400?random=4',
      alt: '微服务架构',
    },
    author: {
      name: '赵六',
      avatar: 'https://picsum.photos/100/100?random=4',
    },
    publishedAt: '2024-01-01T16:45:00Z',
    category: '技术',
  },
])

// 模拟文章数据
const mockArticle = {
  id: articleId,
  title: '深度学习在自然语言处理中的应用与挑战',
  excerpt: '随着深度学习技术的快速发展，自然语言处理领域迎来了前所未有的突破。',
  content: '/articles/sample-article.md', // 指向Markdown文件
  quote: '技术的进步不仅仅是算法的优化，更是对人类智能本质的深度思考。',
  coverImage: {
    url: 'https://picsum.photos/1920/1080?random=1',
    alt: '深度学习概念图',
    width: 1920,
    height: 1080,
  },
  author: {
    name: '张三',
    avatar: 'https://picsum.photos/100/100?random=1',
    title: 'AI研究员',
    bio: '专注于机器学习和自然语言处理研究，发表过多篇顶级会议论文。',
    social: {
      twitter: 'https://twitter.com/zhangsan',
      github: 'https://github.com/zhangsan',
    },
  },
  publishedAt: '2024-01-15T10:00:00Z',
  readingTime: 12,
  tags: ['深度学习', 'NLP', '人工智能', '机器学习'],
  category: '技术',
  views: 1250,
}

// 页面元数据
useHead({
  title: `${mockArticle.title} - Mindtrail`,
  meta: [
    {
      name: 'description',
      content: mockArticle.excerpt,
    },
    {
      property: 'og:title',
      content: mockArticle.title,
    },
    {
      property: 'og:description',
      content: mockArticle.excerpt,
    },
    {
      property: 'og:image',
      content: mockArticle.coverImage.url,
    },
  ],
})

// 生命周期
onMounted(() => {
  // 设置文章数据
  article.value = mockArticle

  // 提取标题
  extractHeadings()

  // 设置滚动监听
  setupScrollListeners()
})

// 提取文章标题
const extractHeadings = () => {
  const content = mockArticle.content
  const headingRegex = /<h([1-6])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[1-6]>/g
  const extractedHeadings = []
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    extractedHeadings.push({
      id: match[2],
      text: match[3].replace(/<[^>]*>/g, ''), // 移除HTML标签
      level: parseInt(match[1]),
    })
  }

  headings.value = extractedHeadings
}

// 设置滚动监听
const setupScrollListeners = () => {
  const handleScroll = () => {
    const scrollTop = window.pageYOffset
    const docHeight = document.documentElement.scrollHeight - window.innerHeight

    // 计算滚动进度
    scrollProgress.value = Math.min(scrollTop / window.innerHeight, 1)
    readingProgress.value = Math.min(scrollTop / docHeight, 1)

    // 更新活跃标题
    updateActiveHeading()
  }

  window.addEventListener('scroll', handleScroll)

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
}

// 更新活跃标题
const updateActiveHeading = () => {
  const headingElements = headings.value
    .map((h) => document.getElementById(h.id))
    .filter(Boolean)
  const scrollTop = window.pageYOffset + 100

  for (let i = headingElements.length - 1; i >= 0; i--) {
    const element = headingElements[i]
    if (element && element.offsetTop <= scrollTop) {
      activeHeading.value = element.id
      break
    }
  }
}

// 事件处理
const scrollToContent = () => {
  const contentElement = document.querySelector('.article-content')
  if (contentElement) {
    contentElement.scrollIntoView({ behavior: 'smooth' })
  }
}

const toggleFocusMode = () => {
  focusMode.value = !focusMode.value
}

const handleFontSizeChange = (size: number) => {
  // 实现字体大小变化逻辑
  console.log('Font size changed:', size)
}

const handleLineSpacingChange = (spacing: number) => {
  // 实现行间距变化逻辑
  console.log('Line spacing changed:', spacing)
}

const handlePageWidthChange = (width: string) => {
  // 实现页面宽度变化逻辑
  console.log('Page width changed:', width)
}

const handleHeadingClick = (id: string) => {
  activeHeading.value = id
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const scrollToBottom = () => {
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: 'smooth',
  })
}

const handleTagClick = (tag: string) => {
  navigateTo(`/articles?tag=${encodeURIComponent(tag)}`)
}

const handleShare = (platform: string) => {
  // 实现社交分享逻辑
  console.log('Share to:', platform)
}

const navigateToArticle = (id: string) => {
  navigateTo(`/articles/${id}`)
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<style scoped>
/* 文本截断 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 专注模式样式调整 */
.article-detail-page.focus-mode {
  /* 隐藏侧边栏等元素 */
}

/* 响应式调整 */
@media (max-width: 768px) {
  .related-articles {
    padding: 3rem 0;
  }
}
</style>
