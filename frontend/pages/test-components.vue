<!--
  组件测试页面 - test-components.vue
  
  用于测试我们创建的各种组件
-->

<template>
  <div class="test-page min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
    <!-- 导航栏 -->
    <MainNavigation />

    <!-- 主要内容 -->
    <main class="pt-20 pb-16">
      <div class="container mx-auto px-6 max-w-7xl">
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-white mb-4">组件测试页面</h1>
          <p class="text-white/70">测试我们创建的各种组件功能</p>
        </div>

        <!-- 组件测试区域 -->
        <div class="space-y-16">
          <!-- Banner组件测试 -->
          <section>
            <h2 class="text-2xl font-bold text-white mb-6">1. Hero Banner 组件</h2>
            <div class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
              <HeroBanner />
            </div>
          </section>

          <!-- 历史记录组件测试 -->
          <section>
            <h2 class="text-2xl font-bold text-white mb-6">2. 历史记录组件</h2>
            <div class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
              <HistoryRecords />
            </div>
          </section>

          <!-- 文章分类组件测试 -->
          <section>
            <h2 class="text-2xl font-bold text-white mb-6">3. 文章分类组件</h2>
            <div class="grid lg:grid-cols-2 gap-8">
              <div class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <ArticleCategories
                  :selected-category="selectedArticleCategory"
                  @category-change="handleArticleCategoryChange"
                />
              </div>
              <div class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h3 class="text-lg font-semibold text-white mb-4">当前选择的分类</h3>
                <p class="text-white/80">{{ selectedArticleCategory }}</p>
              </div>
            </div>
          </section>

          <!-- 相册分类组件测试 -->
          <section>
            <h2 class="text-2xl font-bold text-white mb-6">4. 相册分类组件</h2>
            <div class="grid lg:grid-cols-2 gap-8">
              <div class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <GalleryCategories
                  :selected-category="selectedGalleryCategory"
                  :selected-tags="selectedGalleryTags"
                  :selected-time-range="selectedTimeRange"
                  @category-change="handleGalleryCategoryChange"
                  @tags-change="handleGalleryTagsChange"
                  @time-range-change="handleTimeRangeChange"
                />
              </div>
              <div class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h3 class="text-lg font-semibold text-white mb-4">当前筛选条件</h3>
                <div class="space-y-2 text-white/80">
                  <p><strong>分类:</strong> {{ selectedGalleryCategory }}</p>
                  <p><strong>标签:</strong> {{ selectedGalleryTags.join(', ') || '无' }}</p>
                  <p><strong>时间:</strong> {{ selectedTimeRange }}</p>
                </div>
              </div>
            </div>
          </section>

          <!-- 图片评价组件测试 -->
          <section>
            <h2 class="text-2xl font-bold text-white mb-6">5. 图片评价组件</h2>
            <div class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <PhotoReflection photo-id="test-photo-1" />
            </div>
          </section>

          <!-- Markdown渲染组件测试 -->
          <section>
            <h2 class="text-2xl font-bold text-white mb-6">6. Markdown 渲染组件</h2>
            <div class="grid lg:grid-cols-2 gap-8">
              <div class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h3 class="text-lg font-semibold text-white mb-4">从文件加载</h3>
                <MarkdownRenderer 
                  content="/articles/sample-article.md"
                  source="url"
                />
              </div>
              <div class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h3 class="text-lg font-semibold text-white mb-4">直接内容</h3>
                <MarkdownRenderer 
                  :content="sampleMarkdown"
                  source="string"
                />
              </div>
            </div>
          </section>
        </div>

        <!-- 返回按钮 -->
        <div class="mt-16 text-center">
          <NuxtLink
            to="/"
            class="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 rounded-xl transition-all duration-300 text-white font-medium"
          >
            <Icon name="heroicons:arrow-left" class="w-4 h-4" />
            <span>返回主页</span>
          </NuxtLink>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// 页面元数据
useHead({
  title: '组件测试 - Mindtrail',
  meta: [
    {
      name: 'description',
      content: '测试页面，用于验证各种组件的功能',
    },
  ],
})

// 响应式状态
const selectedArticleCategory = ref('all')
const selectedGalleryCategory = ref('all')
const selectedGalleryTags = ref<string[]>([])
const selectedTimeRange = ref('all')

// 示例Markdown内容
const sampleMarkdown = ref(`
# 测试标题

这是一个**粗体文字**和*斜体文字*的示例。

## 代码示例

\`\`\`javascript
function hello() {
  console.log('Hello, World!');
}
\`\`\`

## 列表示例

- 项目 1
- 项目 2
- 项目 3

## 引用示例

> 这是一个引用块的示例。

## 表格示例

| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 数据1 | 数据2 | 数据3 |
| 数据4 | 数据5 | 数据6 |
`)

// 事件处理函数
const handleArticleCategoryChange = (categoryId: string) => {
  selectedArticleCategory.value = categoryId
}

const handleGalleryCategoryChange = (categoryId: string) => {
  selectedGalleryCategory.value = categoryId
}

const handleGalleryTagsChange = (tags: string[]) => {
  selectedGalleryTags.value = tags
}

const handleTimeRangeChange = (timeRangeId: string) => {
  selectedTimeRange.value = timeRangeId
}
</script>

<style scoped>
/* 页面特定样式 */
.test-page {
  min-height: 100vh;
}

/* 动画效果 */
section {
  animation: fade-in-up 0.6s ease-out forwards;
  opacity: 0;
}

section:nth-child(1) { animation-delay: 0.1s; }
section:nth-child(2) { animation-delay: 0.2s; }
section:nth-child(3) { animation-delay: 0.3s; }
section:nth-child(4) { animation-delay: 0.4s; }
section:nth-child(5) { animation-delay: 0.5s; }
section:nth-child(6) { animation-delay: 0.6s; }

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
