<!--
  统计主页 - home-stats.vue
  
  Features:
  - 专注于统计展示
  - 鼓励话语
  - 活动热力图
  - 简洁设计
-->

<template>
  <div class="home-stats min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
    <!-- 导航栏 -->
    <MainNavigation />

    <!-- 主要内容 -->
    <main class="pt-20 pb-16">
      <div class="container mx-auto px-6 max-w-6xl">
        
        <!-- 统计概览 -->
        <section class="py-16">
          <div class="text-center mb-16">
            <h1 class="text-5xl font-bold text-white mb-8">你的记录足迹</h1>
            
            <!-- 主要统计数据 -->
            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div class="bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-8 text-center group hover:scale-105 transition-all duration-300">
                <div class="text-5xl font-bold text-blue-400 mb-3">{{ stats.articles }}</div>
                <div class="text-white/80 text-lg font-medium">篇文章记录</div>
                <div class="text-blue-300/60 text-sm mt-2">思维的结晶</div>
              </div>
              <div class="bg-gradient-to-br from-green-500/20 to-green-600/10 backdrop-blur-xl border border-green-500/30 rounded-2xl p-8 text-center group hover:scale-105 transition-all duration-300">
                <div class="text-5xl font-bold text-green-400 mb-3">{{ stats.photos }}</div>
                <div class="text-white/80 text-lg font-medium">张照片记录</div>
                <div class="text-green-300/60 text-sm mt-2">光影的瞬间</div>
              </div>
              <div class="bg-gradient-to-br from-purple-500/20 to-purple-600/10 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8 text-center group hover:scale-105 transition-all duration-300">
                <div class="text-5xl font-bold text-purple-400 mb-3">{{ stats.moments }}</div>
                <div class="text-white/80 text-lg font-medium">条心情记录</div>
                <div class="text-purple-300/60 text-sm mt-2">情感的表达</div>
              </div>
              <div class="bg-gradient-to-br from-orange-500/20 to-orange-600/10 backdrop-blur-xl border border-orange-500/30 rounded-2xl p-8 text-center group hover:scale-105 transition-all duration-300">
                <div class="text-5xl font-bold text-orange-400 mb-3">{{ stats.days }}</div>
                <div class="text-white/80 text-lg font-medium">天坚持记录</div>
                <div class="text-orange-300/60 text-sm mt-2">时光的见证</div>
              </div>
            </div>
            
            <!-- 鼓励话语 -->
            <div class="max-w-4xl mx-auto mb-16">
              <div class="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
                <p class="text-2xl text-white/90 leading-relaxed mb-4 animate-fade-in">
                  {{ encouragementText }}
                </p>
                <p class="text-lg text-white/70 leading-relaxed animate-fade-in">
                  {{ futureText }}
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- 活动热力图 -->
        <section class="py-16">
          <ActivityHeatmap />
        </section>

        <!-- 快速导航 -->
        <section class="py-16">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-white mb-4">开始记录</h2>
            <p class="text-white/70">选择一种方式，继续你的记录之旅</p>
          </div>
          
          <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <NuxtLink
              v-for="module in quickActions"
              :key="module.path"
              :to="module.path"
              class="group flex flex-col items-center space-y-4 p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl hover:from-white/15 hover:to-white/10 transition-all duration-300 hover:scale-105"
            >
              <div
                class="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110"
                :style="{ backgroundColor: module.color }"
              >
                <Icon :name="module.icon" class="w-8 h-8 text-white" />
              </div>
              <div class="text-center">
                <div class="text-white font-semibold text-lg">{{ module.name }}</div>
                <div class="text-white/60 text-sm mt-1">{{ module.description }}</div>
              </div>
            </NuxtLink>
          </div>
        </section>

        <!-- 最近活动预览 -->
        <section class="py-16">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-white mb-4">最近活动</h2>
            <p class="text-white/70">查看你最近的记录动态</p>
          </div>
          
          <div class="grid md:grid-cols-3 gap-6">
            <div
              v-for="activity in recentActivities"
              :key="activity.id"
              class="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:from-white/15 hover:to-white/10 transition-all duration-300"
            >
              <div class="flex items-start space-x-4">
                <div
                  class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  :style="{ backgroundColor: activity.color }"
                >
                  <Icon :name="activity.icon" class="w-6 h-6 text-white" />
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-white font-medium mb-1 truncate">{{ activity.title }}</h3>
                  <p class="text-white/70 text-sm mb-2 line-clamp-2">{{ activity.description }}</p>
                  <div class="text-white/50 text-xs">{{ activity.time }}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="text-center mt-8">
            <NuxtLink
              to="/timeline-optimized"
              class="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 rounded-xl transition-all duration-300 text-white font-medium"
            >
              <span>查看全部活动</span>
              <Icon name="heroicons:arrow-right" class="w-4 h-4" />
            </NuxtLink>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// 页面元数据
useHead({
  title: '统计概览 - Mindtrail',
  meta: [
    {
      name: 'description',
      content: '查看你的记录统计和活动热力图，见证成长的每一步。',
    },
  ],
})

// 统计数据
const stats = ref({
  articles: 156,
  photos: 2847,
  moments: 423,
  days: 365
})

// 鼓励话语
const encouragementTexts = [
  `累计记录了 ${stats.value.articles} 篇文章，${stats.value.photos} 张照片，${stats.value.moments} 条心情，坚持了 ${stats.value.days} 天`,
  '每一次记录都是对生活的珍视，每一个瞬间都值得被铭记',
  '你的坚持让时光有了意义，让回忆有了温度',
  '在这个数字化的世界里，你用心记录着属于自己的故事'
]

const futureTexts = [
  '等你老了，翻看这些记录，会发现原来自己的人生如此精彩',
  '多年后的某一天，这些文字和照片会成为你最珍贵的财富',
  '时间会淡化很多东西，但这些记录会让美好永远鲜活',
  '当回忆模糊时，这些记录会帮你找回那些美好的时光'
]

// 当前显示的文字
const encouragementText = ref(encouragementTexts[0])
const futureText = ref(futureTexts[0])

// 快速操作
const quickActions = [
  {
    name: '写文章',
    description: '记录思考与感悟',
    icon: 'heroicons:pencil-square',
    color: '#3b82f6',
    path: '/articles-enhanced'
  },
  {
    name: '上传照片',
    description: '保存美好瞬间',
    icon: 'heroicons:camera',
    color: '#10b981',
    path: '/gallery-enhanced'
  },
  {
    name: '记录心情',
    description: '表达当下感受',
    icon: 'heroicons:heart',
    color: '#ef4444',
    path: '/moments-new'
  },
  {
    name: '查看时间轴',
    description: '回顾历史足迹',
    icon: 'heroicons:clock',
    color: '#f59e0b',
    path: '/timeline-optimized'
  }
]

// 最近活动
const recentActivities = [
  {
    id: '1',
    title: '发布了新文章《深度学习的思考》',
    description: '探讨了人工智能在现代社会中的应用和挑战...',
    icon: 'heroicons:document-text',
    color: '#3b82f6',
    time: '2小时前'
  },
  {
    id: '2',
    title: '上传了5张旅行照片',
    description: '记录了在京都的美好时光，古都的宁静让人心醉...',
    icon: 'heroicons:photo',
    color: '#10b981',
    time: '5小时前'
  },
  {
    id: '3',
    title: '记录了今天的心情',
    description: '今天天气很好，心情也格外舒畅，感谢生活中的小确幸...',
    icon: 'heroicons:heart',
    color: '#ef4444',
    time: '1天前'
  }
]

// 定期更换鼓励话语
const rotateTexts = () => {
  const encouragementIndex = Math.floor(Math.random() * encouragementTexts.length)
  const futureIndex = Math.floor(Math.random() * futureTexts.length)
  encouragementText.value = encouragementTexts[encouragementIndex]
  futureText.value = futureTexts[futureIndex]
}

// 启动定时器
onMounted(() => {
  // 每30秒更换一次鼓励话语
  setInterval(rotateTexts, 30000)
})
</script>

<style scoped>
/* 动画效果 */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 1s ease-out;
}

/* 文字截断 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
  
  .lg\:grid-cols-4 {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
