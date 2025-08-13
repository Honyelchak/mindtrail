<!--
  ArticleHero.vue - 文章详情页 Hero 区域组件
  
  Props:
  - article: Article - 文章数据
  - scrollProgress: number - 滚动进度 (0-1)
  
  Features:
  - 视差滚动效果
  - 大封面图片
  - 引语展示
  - 作者信息
  - 阅读进度指示
-->

<template>
  <section class="article-hero relative h-screen flex items-center justify-center overflow-hidden">
    <!-- 背景图片 - 视差效果 -->
    <div 
      class="absolute inset-0 z-0"
      :style="{ transform: `translateY(${scrollProgress * 50}px) scale(${1 + scrollProgress * 0.1})` }"
    >
      <picture>
        <source
          :srcset="`${article.coverImage.url}?format=webp&w=1920 1920w, ${article.coverImage.url}?format=webp&w=2560 2560w`"
          type="image/webp"
        />
        <img
          :src="article.coverImage.url"
          :alt="article.coverImage.alt"
          class="w-full h-full object-cover animate-parallax-hero"
        />
      </picture>
      
      <!-- 渐变遮罩 -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
      <div class="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
    </div>

    <!-- 内容区域 -->
    <div class="relative z-10 container mx-auto px-4 text-center">
      <!-- 分类标签 -->
      <div class="mb-6 animate-fade-in-up" style="animation-delay: 0.2s;">
        <span class="inline-block px-4 py-2 bg-primary-500/20 backdrop-blur-sm border border-primary-400/30 text-primary-300 text-sm font-medium rounded-full uppercase tracking-wider">
          {{ article.category }}
        </span>
      </div>

      <!-- 标题 -->
      <h1 class="font-display text-display-lg md:text-display-xl text-white font-bold mb-8 max-w-4xl mx-auto leading-tight animate-fade-in-up" style="animation-delay: 0.4s;">
        {{ article.title }}
      </h1>

      <!-- 引语 -->
      <blockquote 
        v-if="article.quote" 
        class="text-body-xl md:text-2xl text-white/90 font-light italic mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up"
        style="animation-delay: 0.6s;"
      >
        "{{ article.quote }}"
      </blockquote>

      <!-- 文章元信息 -->
      <div class="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 mb-12 animate-fade-in-up" style="animation-delay: 0.8s;">
        <!-- 作者信息 -->
        <div class="flex items-center space-x-3">
          <img
            :src="article.author.avatar"
            :alt="article.author.name"
            class="w-12 h-12 rounded-full border-2 border-white/20"
            loading="eager"
          />
          <div class="text-left">
            <div class="text-white font-medium">{{ article.author.name }}</div>
            <div class="text-white/60 text-sm">{{ article.author.title || '作者' }}</div>
          </div>
        </div>

        <!-- 分隔线 -->
        <div class="hidden sm:block w-px h-8 bg-white/20"></div>

        <!-- 发布信息 -->
        <div class="flex items-center space-x-6 text-white/70 text-sm">
          <div class="flex items-center space-x-2">
            <Icon name="heroicons:calendar-days" class="w-4 h-4" />
            <span>{{ formatDate(article.publishedAt) }}</span>
          </div>
          
          <div class="flex items-center space-x-2">
            <Icon name="heroicons:clock" class="w-4 h-4" />
            <span>{{ article.readingTime }}分钟阅读</span>
          </div>
          
          <div class="flex items-center space-x-2">
            <Icon name="heroicons:eye" class="w-4 h-4" />
            <span>{{ formatViews(article.views || 0) }}次浏览</span>
          </div>
        </div>
      </div>

      <!-- 标签 -->
      <div v-if="article.tags && article.tags.length > 0" class="flex flex-wrap justify-center gap-2 mb-12 animate-fade-in-up" style="animation-delay: 1s;">
        <span
          v-for="tag in article.tags"
          :key="tag"
          class="px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-sm rounded-full hover:bg-white/20 transition-colors duration-200"
        >
          #{{ tag }}
        </span>
      </div>

      <!-- 滚动提示 -->
      <div class="animate-bounce-gentle animate-fade-in-up" style="animation-delay: 1.2s;">
        <button
          @click="scrollToContent"
          class="flex flex-col items-center space-y-2 text-white/60 hover:text-white/80 transition-colors duration-200 group"
        >
          <span class="text-sm">开始阅读</span>
          <Icon name="heroicons:chevron-down" class="w-6 h-6 group-hover:translate-y-1 transition-transform duration-200" />
        </button>
      </div>
    </div>

    <!-- 阅读进度条 -->
    <div class="fixed top-0 left-0 right-0 z-50 h-1 bg-black/20">
      <div 
        class="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-200 ease-out"
        :style="{ width: `${readingProgress * 100}%` }"
      />
    </div>

    <!-- 社交分享按钮 -->
    <div class="absolute right-6 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col space-y-3">
      <button
        v-for="social in socialButtons"
        :key="social.name"
        @click="shareToSocial(social.name)"
        class="w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all duration-200 hover:scale-110"
        :title="`分享到${social.label}`"
      >
        <Icon :name="social.icon" class="w-5 h-5" />
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Article {
  id: string
  title: string
  excerpt: string
  content: string
  quote?: string
  coverImage: {
    url: string
    alt: string
    width: number
    height: number
  }
  author: {
    name: string
    avatar: string
    title?: string
  }
  publishedAt: string
  readingTime: number
  tags: string[]
  category: string
  views?: number
}

interface Props {
  article: Article
  scrollProgress?: number
  readingProgress?: number
}

interface Emits {
  scrollToContent: []
  share: [platform: string]
}

const props = withDefaults(defineProps<Props>(), {
  scrollProgress: 0,
  readingProgress: 0
})

const emit = defineEmits<Emits>()

// 社交分享按钮
const socialButtons = [
  { name: 'twitter', label: 'Twitter', icon: 'simple-icons:twitter' },
  { name: 'facebook', label: 'Facebook', icon: 'simple-icons:facebook' },
  { name: 'linkedin', label: 'LinkedIn', icon: 'simple-icons:linkedin' },
  { name: 'weibo', label: '微博', icon: 'simple-icons:sinaweibo' },
  { name: 'wechat', label: '微信', icon: 'simple-icons:wechat' }
]

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 格式化浏览量
const formatViews = (views: number) => {
  if (views >= 10000) {
    return `${(views / 10000).toFixed(1)}万`
  } else if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}k`
  }
  return views.toString()
}

// 滚动到内容区域
const scrollToContent = () => {
  emit('scrollToContent')
}

// 社交分享
const shareToSocial = (platform: string) => {
  emit('share', platform)
}
</script>

<style scoped>
.article-hero {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%);
}

/* 视差动画优化 */
@media (prefers-reduced-motion: reduce) {
  .animate-parallax-hero {
    animation: none;
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .article-hero {
    height: 80vh;
  }
}

/* 自定义动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out both;
}
</style>
