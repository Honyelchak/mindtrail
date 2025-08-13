<template>
  <div class="articles-page -mx-4 -my-8 -mt-20">
    <!-- 页面头部 -->
    <header class="relative py-20 pt-8 overflow-hidden">
      <!-- 背景装饰 -->
      <div class="absolute inset-0">
        <div
          class="absolute top-10 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-pulse"
        />
        <div
          class="absolute bottom-10 right-10 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl animate-pulse"
          style="animation-delay: 2s"
        />
      </div>

      <div class="container mx-auto px-4 relative z-10">
        <div class="text-center">
          <h1
            class="font-display text-display-lg md:text-display-xl text-white font-bold mb-6"
          >
            文章集合
          </h1>
          <p class="text-body-lg text-white/70 max-w-2xl mx-auto mb-8">
            探索思维的边界，记录知识的轨迹。在这里，每一篇文章都是一次深度思考的结晶。
          </p>

          <!-- 搜索栏 -->
          <div class="max-w-md mx-auto">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="搜索文章..."
                class="w-full bg-glass-bg backdrop-blur-md border border-glass-border rounded-2xl px-6 py-4 pl-12 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all duration-200"
              />
              <Icon
                name="heroicons:magnifying-glass"
                class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60"
              />
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- 文章网格 -->
    <main class="container mx-auto px-4 pb-20">
      <ArticlesGrid
        :articles="filteredArticles"
        :loading="loading"
        :view-mode="viewMode"
        @article-click="handleArticleClick"
        @view-mode-change="handleViewModeChange"
      />

      <!-- 加载更多 -->
      <div v-if="hasMore" class="text-center mt-12">
        <button
          @click="loadMore"
          :disabled="loading"
          class="px-8 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-medium rounded-xl transition-all duration-200 hover:scale-105 disabled:scale-100 shadow-lg"
        >
          <span v-if="loading" class="flex items-center space-x-2">
            <div
              class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"
            ></div>
            <span>加载中...</span>
          </span>
          <span v-else>加载更多</span>
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// 页面元数据
useHead({
  title: '文章集合 - Mindtrail',
  meta: [
    {
      name: 'description',
      content: '探索思维的边界，记录知识的轨迹。深度思考的文章集合。',
    },
  ],
})

// 响应式状态
const searchQuery = ref('')
const viewMode = ref<'magazine' | 'grid' | 'list'>('magazine')
const loading = ref(false)
const hasMore = ref(true)

// 模拟文章数据
const articles = ref([
  {
    id: '1',
    title: '深度学习在自然语言处理中的应用与挑战',
    excerpt:
      '随着深度学习技术的快速发展，自然语言处理领域迎来了前所未有的突破。本文将深入探讨当前主流的深度学习模型在NLP中的应用，分析其优势与局限性。',
    content: '<p>深度学习技术的兴起...</p>',
    quote: '技术的进步不仅仅是算法的优化，更是对人类智能本质的深度思考。',
    coverImage: {
      url: 'https://picsum.photos/1200/800?random=1',
      alt: '深度学习概念图',
      width: 1200,
      height: 800,
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
    featured: true,
    category: '技术',
    views: 1250,
  },
  {
    id: '2',
    title: '现代前端开发的最佳实践',
    excerpt:
      '前端开发生态系统日新月异，新的框架、工具和最佳实践层出不穷。本文总结了2024年前端开发的核心理念和实用技巧。',
    content: '<p>现代前端开发...</p>',
    coverImage: {
      url: 'https://picsum.photos/1200/800?random=2',
      alt: '前端开发',
      width: 1200,
      height: 800,
    },
    author: {
      name: '李四',
      avatar: 'https://picsum.photos/100/100?random=2',
      title: '前端架构师',
    },
    publishedAt: '2024-01-10T14:30:00Z',
    readingTime: 8,
    tags: ['前端', 'JavaScript', 'Vue', 'React'],
    featured: false,
    category: '技术',
    views: 890,
  },
  {
    id: '3',
    title: '设计系统的构建与维护',
    excerpt:
      '一个好的设计系统不仅能提高设计效率，还能确保产品的一致性。本文分享了构建和维护设计系统的经验和方法。',
    content: '<p>设计系统...</p>',
    coverImage: {
      url: 'https://picsum.photos/1200/800?random=3',
      alt: '设计系统',
      width: 1200,
      height: 800,
    },
    author: {
      name: '王五',
      avatar: 'https://picsum.photos/100/100?random=3',
      title: 'UI/UX设计师',
    },
    publishedAt: '2024-01-05T09:15:00Z',
    readingTime: 15,
    tags: ['设计系统', 'UI设计', 'UX', '用户体验'],
    featured: true,
    category: '设计',
    views: 2100,
  },
  {
    id: '4',
    title: '微服务架构的演进之路',
    excerpt:
      '从单体应用到微服务架构，这是一个充满挑战和机遇的转变过程。本文回顾了微服务架构的发展历程和未来趋势。',
    content: '<p>微服务架构...</p>',
    coverImage: {
      url: 'https://picsum.photos/1200/800?random=4',
      alt: '微服务架构',
      width: 1200,
      height: 800,
    },
    author: {
      name: '赵六',
      avatar: 'https://picsum.photos/100/100?random=4',
      title: '后端架构师',
    },
    publishedAt: '2024-01-01T16:45:00Z',
    readingTime: 20,
    tags: ['微服务', '架构设计', '后端开发', '分布式系统'],
    featured: false,
    category: '技术',
    views: 1680,
  },
  {
    id: '5',
    title: '数据可视化的艺术与科学',
    excerpt:
      '数据可视化是连接数据与洞察的桥梁。本文探讨了如何通过有效的可视化设计来传达复杂的数据故事。',
    content: '<p>数据可视化...</p>',
    coverImage: {
      url: 'https://picsum.photos/1200/800?random=5',
      alt: '数据可视化',
      width: 1200,
      height: 800,
    },
    author: {
      name: '孙七',
      avatar: 'https://picsum.photos/100/100?random=5',
      title: '数据分析师',
    },
    publishedAt: '2023-12-28T11:20:00Z',
    readingTime: 10,
    tags: ['数据可视化', '数据分析', '图表设计', 'D3.js'],
    featured: false,
    category: '数据',
    views: 950,
  },
])

// 计算属性
const filteredArticles = computed(() => {
  if (!searchQuery.value) {
    return articles.value
  }

  const query = searchQuery.value.toLowerCase()
  return articles.value.filter(
    (article) =>
      article.title.toLowerCase().includes(query) ||
      article.excerpt.toLowerCase().includes(query) ||
      article.tags.some((tag) => tag.toLowerCase().includes(query)) ||
      article.category.toLowerCase().includes(query)
  )
})

// 事件处理
const handleArticleClick = (article: any) => {
  navigateTo(`/articles/${article.id}`)
}

const handleViewModeChange = (mode: string) => {
  viewMode.value = mode as 'magazine' | 'grid' | 'list'
}

const loadMore = async () => {
  loading.value = true

  // 模拟加载更多数据
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // 这里应该从 API 加载更多文章
  // const newArticles = await $fetch('/api/articles', { query: { offset: articles.value.length } })
  // articles.value.push(...newArticles)

  loading.value = false
  hasMore.value = false // 模拟没有更多数据
}
</script>

<style scoped>
/* 页面特定样式 */
.articles-page {
  min-height: 100vh;
}

/* 搜索框动画 */
input:focus {
  transform: scale(1.02);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .articles-page header {
    padding: 3rem 0;
  }
}
</style>
