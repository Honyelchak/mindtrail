<!--
  ArticlesGrid.vue - 杂志式网格布局组件
  
  Props:
  - articles: Article[] - 文章数组
  - loading: boolean - 加载状态
  - viewMode: 'magazine' | 'grid' | 'list' - 视图模式
  
  Mock Data Structure:
  interface Article {
    id: string
    title: string
    excerpt: string
    content: string
    coverImage: {
      url: string
      alt: string
      width: number
      height: number
    }
    author: {
      name: string
      avatar: string
    }
    publishedAt: string
    readingTime: number
    tags: string[]
    featured: boolean
    category: string
  }
-->

<template>
  <div class="articles-grid-container">
    <!-- 视图模式切换 -->
    <div class="flex justify-end mb-8">
      <div
        :class="
          $colorMode.value === 'dark'
            ? 'bg-white/10 border-white/20'
            : 'bg-gray-100 border-gray-200'
        "
        class="flex items-center backdrop-blur-md rounded-xl p-1"
      >
        <button
          v-for="mode in viewModes"
          :key="mode.value"
          @click="$emit('viewModeChange', mode.value)"
          class="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
          :class="[
            viewMode === mode.value
              ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
              : $colorMode.value === 'dark'
              ? 'text-white/70 hover:text-white hover:bg-white/10'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
          ]"
        >
          <Icon :name="mode.icon" class="w-4 h-4" />
          <span class="text-sm font-medium">{{ mode.label }}</span>
        </button>
      </div>
    </div>

    <!-- 杂志式网格布局 -->
    <div v-if="viewMode === 'magazine'" class="magazine-grid">
      <article
        v-for="(article, index) in articles"
        :key="article.id"
        class="magazine-card group cursor-pointer"
        :class="getMagazineCardClass(index)"
        @click="$emit('articleClick', article)"
      >
        <!-- 图片容器 -->
        <div class="relative overflow-hidden rounded-2xl h-full">
          <picture>
            <source
              :srcset="`${article.coverImage.url}?format=webp&w=800 800w, ${article.coverImage.url}?format=webp&w=1200 1200w`"
              type="image/webp"
            />
            <img
              :src="article.coverImage.url"
              :alt="article.coverImage.alt"
              :loading="index > 2 ? 'lazy' : 'eager'"
              class="w-full h-full object-cover transition-transform duration-350 group-hover:scale-105"
            />
          </picture>

          <!-- 渐变遮罩 -->
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
          />

          <!-- 特色标签 -->
          <div v-if="article.featured" class="absolute top-4 left-4">
            <span
              class="px-3 py-1 bg-accent-500 text-white text-xs font-medium rounded-full"
            >
              精选
            </span>
          </div>

          <!-- 阅读时长 -->
          <div class="absolute top-4 right-4">
            <div
              :class="
                $colorMode.value === 'dark'
                  ? 'bg-black/50 text-white'
                  : 'bg-white/90 text-gray-700'
              "
              class="flex items-center space-x-1 px-2 py-1 backdrop-blur-sm rounded-full text-xs"
            >
              <Icon name="heroicons:clock" class="w-3 h-3" />
              <span>{{ article.readingTime }}分钟</span>
            </div>
          </div>

          <!-- 内容区域 -->
          <div class="absolute bottom-0 left-0 right-0 p-6">
            <!-- 分类 -->
            <div class="mb-2">
              <span
                class="text-xs font-medium text-primary-300 uppercase tracking-wider"
              >
                {{ article.category }}
              </span>
            </div>

            <!-- 标题 -->
            <h3
              :class="[
                $colorMode.value === 'dark' ? 'text-white' : 'text-gray-900',
                index === 0 || index === 3 ? 'text-2xl' : 'text-lg',
              ]"
              class="font-bold mb-2 line-clamp-2"
            >
              {{ article.title }}
            </h3>

            <!-- 摘要 - 仅在大卡片显示 -->
            <p
              v-if="index === 0 || index === 3"
              :class="
                $colorMode.value === 'dark' ? 'text-white/80' : 'text-gray-700'
              "
              class="text-sm line-clamp-3 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-350"
            >
              {{ article.excerpt }}
            </p>

            <!-- 作者和日期 -->
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <img
                  :src="article.author.avatar"
                  :alt="article.author.name"
                  class="w-6 h-6 rounded-full"
                  loading="lazy"
                />
                <span
                  :class="
                    $colorMode.value === 'dark'
                      ? 'text-white/70'
                      : 'text-gray-500'
                  "
                  class="text-xs"
                >
                  {{ article.author.name }}
                </span>
              </div>
              <span
                :class="
                  $colorMode.value === 'dark'
                    ? 'text-white/50'
                    : 'text-gray-400'
                "
                class="text-xs"
              >
                {{ formatDate(article.publishedAt) }}
              </span>
            </div>
          </div>
        </div>
      </article>
    </div>

    <!-- 标准网格布局 -->
    <div
      v-else-if="viewMode === 'grid'"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      <article
        v-for="article in articles"
        :key="article.id"
        class="group cursor-pointer bg-glass-bg backdrop-blur-md rounded-2xl overflow-hidden border border-glass-border hover:border-primary-400/50 transition-all duration-350 hover:-translate-y-2 hover:shadow-glass-lg"
        @click="$emit('articleClick', article)"
      >
        <!-- 图片 -->
        <div class="relative aspect-video overflow-hidden">
          <picture>
            <source
              :srcset="`${article.coverImage.url}?format=webp&w=600 600w`"
              type="image/webp"
            />
            <img
              :src="article.coverImage.url"
              :alt="article.coverImage.alt"
              loading="lazy"
              class="w-full h-full object-cover transition-transform duration-350 group-hover:scale-105"
            />
          </picture>

          <!-- 阅读时长 -->
          <div class="absolute top-3 right-3">
            <div
              class="flex items-center space-x-1 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs"
            >
              <Icon name="heroicons:clock" class="w-3 h-3" />
              <span>{{ article.readingTime }}分钟</span>
            </div>
          </div>
        </div>

        <!-- 内容 -->
        <div class="p-6">
          <div class="mb-2">
            <span
              class="text-xs font-medium text-primary-400 uppercase tracking-wider"
            >
              {{ article.category }}
            </span>
          </div>

          <h3
            :class="
              $colorMode.value === 'dark'
                ? 'text-white group-hover:text-primary-300'
                : 'text-gray-900 group-hover:text-primary-600'
            "
            class="font-bold text-lg mb-3 line-clamp-2 transition-colors duration-200"
          >
            {{ article.title }}
          </h3>

          <p
            :class="
              $colorMode.value === 'dark' ? 'text-white/70' : 'text-gray-600'
            "
            class="text-sm line-clamp-3 mb-4"
          >
            {{ article.excerpt }}
          </p>

          <!-- 标签 -->
          <div class="flex flex-wrap gap-2 mb-4">
            <span
              v-for="tag in article.tags.slice(0, 3)"
              :key="tag"
              :class="
                $colorMode.value === 'dark'
                  ? 'bg-white/10 text-white/60'
                  : 'bg-gray-100 text-gray-600'
              "
              class="px-2 py-1 text-xs rounded-full"
            >
              {{ tag }}
            </span>
          </div>

          <!-- 作者和日期 -->
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <img
                :src="article.author.avatar"
                :alt="article.author.name"
                class="w-6 h-6 rounded-full"
                loading="lazy"
              />
              <span
                :class="
                  $colorMode.value === 'dark'
                    ? 'text-white/70'
                    : 'text-gray-500'
                "
                class="text-xs"
              >
                {{ article.author.name }}
              </span>
            </div>
            <span
              :class="
                $colorMode.value === 'dark' ? 'text-white/50' : 'text-gray-400'
              "
              class="text-xs"
            >
              {{ formatDate(article.publishedAt) }}
            </span>
          </div>
        </div>
      </article>
    </div>

    <!-- 列表布局 -->
    <div v-else class="space-y-6">
      <article
        v-for="article in articles"
        :key="article.id"
        class="group cursor-pointer bg-glass-bg backdrop-blur-md rounded-2xl p-6 border border-glass-border hover:border-primary-400/50 transition-all duration-350 hover:shadow-glass-lg"
        @click="$emit('articleClick', article)"
      >
        <div class="flex gap-6">
          <!-- 图片 -->
          <div
            class="flex-shrink-0 w-48 h-32 relative overflow-hidden rounded-xl"
          >
            <picture>
              <source
                :srcset="`${article.coverImage.url}?format=webp&w=400 400w`"
                type="image/webp"
              />
              <img
                :src="article.coverImage.url"
                :alt="article.coverImage.alt"
                loading="lazy"
                class="w-full h-full object-cover transition-transform duration-350 group-hover:scale-105"
              />
            </picture>
          </div>

          <!-- 内容 -->
          <div class="flex-1">
            <div class="mb-2">
              <span
                class="text-xs font-medium text-primary-400 uppercase tracking-wider"
              >
                {{ article.category }}
              </span>
            </div>

            <h3
              class="text-white font-bold text-xl mb-3 line-clamp-2 group-hover:text-primary-300 transition-colors duration-200"
            >
              {{ article.title }}
            </h3>

            <p class="text-white/70 text-sm line-clamp-2 mb-4">
              {{ article.excerpt }}
            </p>

            <!-- 底部信息 -->
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="flex items-center space-x-2">
                  <img
                    :src="article.author.avatar"
                    :alt="article.author.name"
                    class="w-6 h-6 rounded-full"
                    loading="lazy"
                  />
                  <span class="text-white/70 text-sm">{{
                    article.author.name
                  }}</span>
                </div>

                <div class="flex items-center space-x-1 text-white/50 text-sm">
                  <Icon name="heroicons:clock" class="w-4 h-4" />
                  <span>{{ article.readingTime }}分钟</span>
                </div>
              </div>

              <span class="text-white/50 text-sm">
                {{ formatDate(article.publishedAt) }}
              </span>
            </div>
          </div>
        </div>
      </article>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center py-12">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Article {
  id: string
  title: string
  excerpt: string
  content: string
  coverImage: {
    url: string
    alt: string
    width: number
    height: number
  }
  author: {
    name: string
    avatar: string
  }
  publishedAt: string
  readingTime: number
  tags: string[]
  featured: boolean
  category: string
}

interface Props {
  articles: Article[]
  loading?: boolean
  viewMode?: 'magazine' | 'grid' | 'list'
}

interface Emits {
  articleClick: [article: Article]
  viewModeChange: [mode: string]
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  viewMode: 'magazine',
})

const emit = defineEmits<Emits>()

const viewModes = [
  { value: 'magazine', label: '杂志', icon: 'heroicons:squares-plus' },
  { value: 'grid', label: '网格', icon: 'heroicons:squares-2x2' },
  { value: 'list', label: '列表', icon: 'heroicons:list-bullet' },
]

// 获取杂志卡片样式类
const getMagazineCardClass = (index: number) => {
  const patterns = [
    'col-span-2 row-span-2', // 大卡片
    'col-span-1 row-span-1', // 小卡片
    'col-span-1 row-span-1', // 小卡片
    'col-span-2 row-span-2', // 大卡片
    'col-span-1 row-span-1', // 小卡片
    'col-span-1 row-span-1', // 小卡片
  ]
  return patterns[index % patterns.length]
}

// 格式化日期
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
.magazine-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 300px);
  gap: 1.5rem;
}

.magazine-card {
  transition: all 0.35s ease;
}

.magazine-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

@media (max-width: 768px) {
  .magazine-grid {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(auto, 250px);
  }

  .magazine-card {
    grid-column: 1 !important;
    grid-row: auto !important;
  }
}

/* 文本截断 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
