<!--
  新主页 - home-new.vue
  
  Features:
  - 全屏Banner
  - 历史记录展示
  - 快速导航
  - 统计概览
-->

<template>
  <div class="home-page">
    <!-- 全屏Banner -->
    <HeroBanner />
    
    <!-- 历史记录区域 -->
    <HistoryRecords />

    <!-- 快速导航模块 -->
    <section class="py-16 bg-gradient-to-b from-neutral-800 to-neutral-900">
      <div class="container mx-auto px-6">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-white mb-4">探索你的数字世界</h2>
          <p class="text-white/70 max-w-2xl mx-auto">
            记录思维的边界，记录知识的轨迹。在这里，每一篇文章都是一次深度思考的结晶。
          </p>
        </div>

        <!-- 快速导航按钮 -->
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <NuxtLink
            v-for="module in modules"
            :key="module.path"
            :to="module.path"
            class="group flex items-center space-x-3 px-6 py-4 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl hover:from-white/15 hover:to-white/10 transition-all duration-300 hover:scale-105 hover:shadow-lg"
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
    <section class="py-16 bg-gradient-to-b from-neutral-900 to-neutral-800">
      <div class="container mx-auto px-6">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-white mb-4">数据概览</h2>
          <p class="text-white/70 max-w-2xl mx-auto">
            记录你的创作足迹，见证成长的每一步。
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105"
          >
            <div class="text-3xl font-bold text-white mb-2">
              {{ stat.count }}
            </div>
            <div class="text-white/70 text-sm">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// 页面元数据
useHead({
  title: 'Mindtrail - 思维的轨迹',
  meta: [
    {
      name: 'description',
      content: '记录生活的点点滴滴，用不同的维度展现内容之美。从文字到图像，从时间到空间，探索属于你的数字世界。',
    },
  ],
})

// 快速导航模块
const modules = ref([
  {
    name: '文章集合',
    description: '深度思考的结晶',
    icon: 'heroicons:document-text',
    color: '#3b82f6',
    path: '/articles-enhanced',
  },
  {
    name: '视觉画廊',
    description: '光影交织的艺术',
    icon: 'heroicons:photo',
    color: '#10b981',
    path: '/gallery-enhanced',
  },
  {
    name: '时光轴',
    description: '时间的印记',
    icon: 'heroicons:clock',
    color: '#f59e0b',
    path: '/timeline-optimized',
  },
  {
    name: '心情说说',
    description: '情感的表达',
    icon: 'heroicons:heart',
    color: '#ef4444',
    path: '/moments-new',
  },
  {
    name: '地图足迹',
    description: '探索的轨迹',
    icon: 'heroicons:map-pin',
    color: '#8b5cf6',
    path: '/map-enhanced',
  },
  {
    name: '数据统计',
    description: '成长的见证',
    icon: 'heroicons:chart-bar',
    color: '#06b6d4',
    path: '/analytics-enhanced',
  },
  {
    name: '设置中心',
    description: '个性化配置',
    icon: 'heroicons:cog-6-tooth',
    color: '#6b7280',
    path: '/settings-enhanced',
  },
  {
    name: '关于我们',
    description: '了解更多',
    icon: 'heroicons:information-circle',
    color: '#ec4899',
    path: '/about-enhanced',
  },
])

// 统计数据
const stats = ref([
  {
    label: '文章总数',
    count: '156',
  },
  {
    label: '照片总数',
    count: '2,847',
  },
  {
    label: '说说总数',
    count: '423',
  },
  {
    label: '足迹地点',
    count: '89',
  },
])
</script>

<style scoped>
/* 页面特定样式 */
.home-page {
  min-height: 100vh;
}

/* 动画效果 */
@keyframes fade-in-up {
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
  animation: fade-in-up 0.8s ease-out forwards;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 1024px) {
  .lg\:grid-cols-4 {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
