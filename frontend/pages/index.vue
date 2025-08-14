<!-- cSpell:ignore heroicons Nuxt Mindtrail minatorial composables -->
<template>
  <div class="home-page">
    <!-- 全屏Banner -->
    <HeroBanner />

    <!-- 历史记录区域 -->
    <HistoryRecords />

    <!-- 主要内容 -->
    <main>
      <!-- 快速导航模块 -->
      <section class="py-16 bg-gradient-to-b from-neutral-800 to-neutral-900">
        <div class="container mx-auto px-6">
          <!-- 统计概览 -->
          <div class="text-center mb-16">
            <h2 class="text-4xl font-bold text-white mb-6">你的记录足迹</h2>
            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div
                class="bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-6 text-center"
              >
                <div class="text-4xl font-bold text-blue-400 mb-2">
                  {{ stats.articles }}
                </div>
                <div class="text-white/80 text-sm">篇文章记录</div>
                <div class="text-blue-300/60 text-xs mt-1">思维的结晶</div>
              </div>
              <div
                class="bg-gradient-to-br from-green-500/20 to-green-600/10 backdrop-blur-xl border border-green-500/30 rounded-2xl p-6 text-center"
              >
                <div class="text-4xl font-bold text-green-400 mb-2">
                  {{ stats.photos }}
                </div>
                <div class="text-white/80 text-sm">张照片记录</div>
                <div class="text-green-300/60 text-xs mt-1">光影的瞬间</div>
              </div>
              <div
                class="bg-gradient-to-br from-purple-500/20 to-purple-600/10 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 text-center"
              >
                <div class="text-4xl font-bold text-purple-400 mb-2">
                  {{ stats.moments }}
                </div>
                <div class="text-white/80 text-sm">条心情记录</div>
                <div class="text-purple-300/60 text-xs mt-1">情感的表达</div>
              </div>
              <div
                class="bg-gradient-to-br from-orange-500/20 to-orange-600/10 backdrop-blur-xl border border-orange-500/30 rounded-2xl p-6 text-center"
              >
                <div class="text-4xl font-bold text-orange-400 mb-2">
                  {{ stats.days }}
                </div>
                <div class="text-white/80 text-sm">天坚持记录</div>
                <div class="text-orange-300/60 text-xs mt-1">时光的见证</div>
              </div>
            </div>

            <!-- 鼓励话语 -->
            <div class="max-w-4xl mx-auto mb-12">
              <p class="text-2xl text-white/90 leading-relaxed mb-4">
                {{ encouragementText }}
              </p>
              <p class="text-lg text-white/70 leading-relaxed">
                {{ futureText }}
              </p>
            </div>
          </div>

          <!-- 快速导航按钮 -->
          <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <NuxtLink
              v-for="module in modules"
              :key="module.path"
              :to="module.path"
              :class="
                $colorMode.value === 'dark'
                  ? 'bg-gradient-to-r from-white/10 to-white/5 border-white/20 hover:from-white/15 hover:to-white/10'
                  : 'bg-gradient-to-r from-gray-100/80 to-gray-50/60 border-gray-200 hover:from-gray-100/90 hover:to-gray-50/70'
              "
              class="group flex items-center space-x-3 px-6 py-4 backdrop-blur-xl border rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <div
                class="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110"
                :style="{ backgroundColor: module.color }"
              >
                <Icon :name="module.icon" class="w-6 h-6 text-white" />
              </div>
              <div class="text-left">
                <div class="text-white font-semibold">{{ module.name }}</div>
                <div class="text-white/60 text-sm">
                  {{ module.description }}
                </div>
              </div>
              <Icon
                name="heroicons:arrow-right"
                class="w-5 h-5 text-white/60 transition-transform duration-300 group-hover:translate-x-1"
              />
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- 统计概览 -->
      <section class="py-16 border-t border-white/10">
        <div class="container mx-auto px-6">
          <div class="text-center mb-12">
            <h2
              :class="
                $colorMode.value === 'dark' ? 'text-white' : 'text-gray-900'
              "
              class="text-3xl font-bold mb-4"
            >
              内容概览
            </h2>
            <p
              :class="
                $colorMode.value === 'dark' ? 'text-white/70' : 'text-gray-600'
              "
            >
              探索已创建的内容和数据统计
            </p>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div
              v-for="stat in statistics"
              :key="stat.label"
              class="group bg-gradient-to-br from-glass-bg/80 to-glass-bg/60 backdrop-blur-xl border border-glass-border rounded-2xl p-6 text-center hover:from-glass-bg/90 hover:to-glass-bg/70 transition-all duration-300 hover:scale-105"
            >
              <div
                class="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110"
                :style="{ backgroundColor: stat.color }"
              >
                <Icon :name="stat.icon" class="w-8 h-8 text-white" />
              </div>
              <div
                :class="
                  $colorMode.value === 'dark' ? 'text-white' : 'text-gray-900'
                "
                class="text-3xl font-bold mb-2"
              >
                {{ stat.count }}
              </div>
              <div
                :class="
                  $colorMode.value === 'dark'
                    ? 'text-white/70'
                    : 'text-gray-600'
                "
                class="text-sm"
              >
                {{ stat.label }}
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 最新内容 -->
      <section class="py-16 border-t border-white/10">
        <div class="container mx-auto px-6">
          <div class="flex items-center justify-between mb-12">
            <div>
              <h2 class="text-3xl font-bold text-white mb-4">最新内容</h2>
              <p class="text-white/70">查看最近创建和更新的内容</p>
            </div>

            <NuxtLink
              to="/timeline-optimized"
              class="group flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border border-primary-400/30 rounded-xl text-primary-300 hover:from-primary-500/30 hover:to-secondary-500/30 transition-all duration-300 hover:scale-105"
            >
              <span class="text-sm font-medium">查看全部</span>
              <Icon
                name="heroicons:arrow-right"
                class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              />
            </NuxtLink>
          </div>

          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="item in recentItems"
              :key="item.id"
              class="group bg-gradient-to-br from-glass-bg/80 to-glass-bg/60 backdrop-blur-xl border border-glass-border rounded-2xl overflow-hidden hover:from-glass-bg/90 hover:to-glass-bg/70 transition-all duration-300 hover:scale-105 cursor-pointer"
              @click="navigateToItem(item)"
            >
              <!-- 内容预览 -->
              <div
                class="aspect-video bg-gradient-to-br from-white/10 to-white/5 relative overflow-hidden"
              >
                <img
                  v-if="item.thumbnail"
                  :src="item.thumbnail"
                  :alt="item.title"
                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center"
                >
                  <Icon
                    :name="getItemIcon(item.type)"
                    class="w-12 h-12 text-white/40"
                  />
                </div>

                <!-- 类型标识 -->
                <div class="absolute top-4 left-4">
                  <div
                    class="flex items-center space-x-2 px-3 py-1.5 rounded-full text-white text-xs font-medium shadow-lg"
                    :style="{ backgroundColor: getItemColor(item.type) }"
                  >
                    <Icon :name="getItemIcon(item.type)" class="w-3 h-3" />
                    <span>{{ getItemTypeLabel(item.type) }}</span>
                  </div>
                </div>

                <!-- 日期 -->
                <div class="absolute bottom-4 right-4">
                  <div
                    class="px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full text-white text-xs"
                  >
                    {{ formatDate(item.date) }}
                  </div>
                </div>
              </div>

              <!-- 内容信息 -->
              <div class="p-6">
                <h3 class="text-white font-semibold text-lg mb-2 line-clamp-1">
                  {{ item.title }}
                </h3>
                <p class="text-white/70 text-sm line-clamp-2 mb-4">
                  {{ item.description }}
                </p>

                <!-- 标签 -->
                <div
                  v-if="item.tags && item.tags.length > 0"
                  class="flex flex-wrap gap-2"
                >
                  <span
                    v-for="tag in item.tags.slice(0, 3)"
                    :key="tag"
                    class="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-full"
                  >
                    #{{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 功能特色 -->
      <section class="py-16 border-t border-white/10">
        <div class="container mx-auto px-6">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-white mb-4">功能特色</h2>
            <p class="text-white/70">发现 Mindtrail 的独特功能和体验</p>
          </div>

          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div
              v-for="feature in features"
              :key="feature.title"
              class="group text-center"
            >
              <div
                class="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110"
                :style="{ backgroundColor: feature.color }"
              >
                <Icon :name="feature.icon" class="w-10 h-10 text-white" />
              </div>
              <h3 class="text-white font-semibold text-xl mb-3">
                {{ feature.title }}
              </h3>
              <p class="text-white/70 leading-relaxed">
                {{ feature.description }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- 活动热力图 -->
      <section class="py-16 border-t border-white/10">
        <div class="container mx-auto px-6">
          <ActivityHeatmap />
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
// 页面元数据
useHead({
  title: 'Mindtrail - 思维轨迹',
  meta: [
    {
      name: 'description',
      content:
        '记录生活的点点滴滴，用不同的维度展现内容之美。从文字到图像，从时间到空间，探索属于你的数字世界。',
    },
  ],
})

// 模块配置
const modules = [
  {
    name: '文章',
    description: '沉浸式阅读体验',
    path: '/articles-enhanced',
    icon: 'heroicons:document-text',
    color: '#3b82f6',
  },
  {
    name: '相册',
    description: '展览/故事/地图联动',
    path: '/gallery-enhanced',
    icon: 'heroicons:photo',
    color: '#10b981',
  },
  {
    name: '时间轴',
    description: '可缩放时间轴',
    path: '/timeline-optimized',
    icon: 'heroicons:clock',
    color: '#f59e0b',
  },
  {
    name: '地图',
    description: '叙事地图系统',
    path: '/map-optimized',
    icon: 'heroicons:globe-asia-australia',
    color: '#ef4444',
  },
]

// 新的统计数据
const stats = ref({
  articles: 156,
  photos: 2847,
  moments: 423,
  days: 365,
})

// 鼓励话语（随机显示）
const encouragementTexts = [
  '累计记录了 ' +
    stats.value.articles +
    ' 篇文章，' +
    stats.value.photos +
    ' 张照片，' +
    stats.value.moments +
    ' 条心情，坚持了 ' +
    stats.value.days +
    ' 天',
  '每一次记录都是对生活的珍视，每一个瞬间都值得被铭记',
  '你的坚持让时光有了意义，让回忆有了温度',
  '在这个数字化的世界里，你用心记录着属于自己的故事',
]

const futureTexts = [
  '等你老了，翻看这些记录，会发现原来自己的人生如此精彩',
  '多年后的某一天，这些文字和照片会成为你最珍贵的财富',
  '时间会淡化很多东西，但这些记录会让美好永远鲜活',
  '当回忆模糊时，这些记录会帮你找回那些美好的时光',
]

// 当前显示的文字
const encouragementText = ref(encouragementTexts[0])
const futureText = ref(futureTexts[0])

// 定期更换鼓励话语
const rotateTexts = () => {
  const encouragementIndex = Math.floor(
    Math.random() * encouragementTexts.length
  )
  const futureIndex = Math.floor(Math.random() * futureTexts.length)
  encouragementText.value = encouragementTexts[encouragementIndex]
  futureText.value = futureTexts[futureIndex]
}

// 启动定时器
onMounted(() => {
  // 每30秒更换一次鼓励话语
  setInterval(rotateTexts, 30000)
})

// 原有统计数据（保留用于其他部分）
const statistics = [
  {
    label: '文章',
    count: 24,
    icon: 'heroicons:document-text',
    color: '#3b82f6',
  },
  { label: '照片', count: 156, icon: 'heroicons:photo', color: '#10b981' },
  {
    label: '时刻',
    count: 89,
    icon: 'heroicons:chat-bubble-left',
    color: '#f59e0b',
  },
  { label: '里程碑', count: 12, icon: 'heroicons:flag', color: '#ef4444' },
]

// 最新内容
const recentItems = [
  {
    id: '1',
    title: '深度学习在NLP中的应用',
    description: '探讨了深度学习技术在自然语言处理领域的最新进展和应用场景。',
    type: 'article',
    date: '2024-01-15T10:00:00Z',
    tags: ['深度学习', 'NLP', '技术'],
    thumbnail: 'https://picsum.photos/400/300?random=1',
  },
  {
    id: '2',
    title: '上海外滩夜景',
    description: '在外滩拍摄了一组城市夜景照片，记录了上海的繁华夜色。',
    type: 'photo',
    date: '2024-01-12T20:30:00Z',
    tags: ['摄影', '夜景', '城市'],
    thumbnail: 'https://picsum.photos/400/300?random=2',
  },
  {
    id: '3',
    title: '完成博客系统重构',
    description: '历时一个月，终于完成了博客系统的全面重构，性能提升了50%。',
    type: 'milestone',
    date: '2024-01-08T18:00:00Z',
    tags: ['项目', '重构', '成就'],
    thumbnail: null,
  },
]

// 功能特色
const features = [
  {
    title: '多维度展示',
    description: '从文章、相册、时间轴到地图，用不同维度展现内容的丰富性。',
    icon: 'heroicons:cube',
    color: '#3b82f6',
  },
  {
    title: '沉浸式体验',
    description: '精心设计的界面和交互，为每种内容类型提供最佳的浏览体验。',
    icon: 'heroicons:eye',
    color: '#10b981',
  },
  {
    title: '智能关联',
    description: '内容间的智能关联和推荐，发现更多有趣的连接和故事。',
    icon: 'heroicons:link',
    color: '#f59e0b',
  },
]

// 方法
const navigateToItem = (item: any) => {
  switch (item.type) {
    case 'article':
      navigateTo(`/articles/${item.id}`)
      break
    case 'photo':
      navigateTo(`/gallery-enhanced?photo=${item.id}`)
      break
    case 'milestone':
      navigateTo(`/timeline-optimized?event=${item.id}`)
      break
    default:
      console.log('Navigate to item:', item)
  }
}

const getItemIcon = (type: string) => {
  const icons = {
    article: 'heroicons:document-text',
    photo: 'heroicons:photo',
    moment: 'heroicons:chat-bubble-left',
    milestone: 'heroicons:flag',
  }
  return icons[type as keyof typeof icons] || 'heroicons:circle'
}

const getItemColor = (type: string) => {
  const colors = {
    article: '#3b82f6',
    photo: '#10b981',
    moment: '#f59e0b',
    milestone: '#ef4444',
  }
  return colors[type as keyof typeof colors] || '#6b7280'
}

const getItemTypeLabel = (type: string) => {
  const labels = {
    article: '文章',
    photo: '照片',
    moment: '说说',
    milestone: '里程碑',
  }
  return labels[type as keyof typeof labels] || type
}

const formatDate = (date: string) => {
  const d = new Date(date)
  return d.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
  })
}
</script>

<style scoped>
/* 文本截断 */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .home-page h1 {
    font-size: 2.5rem;
  }

  .home-page .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>
