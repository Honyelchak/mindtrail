<!--
  HeroBanner.vue - 主页全屏Banner组件
  
  Features:
  - 全屏背景图片
  - 可在后台更换
  - 响应式设计
  - 优雅的文字叠加
-->

<template>
  <section class="hero-banner relative h-screen w-full overflow-hidden">
    <!-- 背景图片 -->
    <div class="absolute inset-0">
      <img
        :src="bannerData.image"
        :alt="bannerData.title"
        class="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        loading="eager"
      />
      <!-- 渐变遮罩 -->
      <div class="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60"></div>
    </div>

    <!-- 内容区域 -->
    <div class="relative z-10 h-full flex items-center justify-center">
      <div class="text-center px-6 max-w-4xl mx-auto">
        <!-- 主标题 -->
        <h1 class="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in-up">
          {{ bannerData.title }}
        </h1>
        
        <!-- 副标题 -->
        <p class="text-xl md:text-2xl text-white/90 mb-8 animate-fade-in-up animation-delay-200">
          {{ bannerData.subtitle }}
        </p>
        
        <!-- 描述文字 -->
        <p class="text-lg text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-400">
          {{ bannerData.description }}
        </p>
        
        <!-- 行动按钮 -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-600">
          <NuxtLink
            to="/articles-enhanced"
            class="group px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <span class="flex items-center space-x-2">
              <Icon name="heroicons:book-open" class="w-5 h-5" />
              <span>开始阅读</span>
              <Icon name="heroicons:arrow-right" class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </NuxtLink>
          
          <NuxtLink
            to="/moments-new"
            class="group px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold rounded-xl transition-all duration-300 hover:bg-white/20 hover:scale-105"
          >
            <span class="flex items-center space-x-2">
              <Icon name="heroicons:heart" class="w-5 h-5" />
              <span>记录心情</span>
            </span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- 滚动指示器 -->
    <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
      <div class="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
        <div class="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Banner数据接口
interface BannerData {
  id: string
  title: string
  subtitle: string
  description: string
  image: string
  isActive: boolean
  createdAt: string
}

// Mock数据 - 后续可以从API获取
const bannerData = ref<BannerData>({
  id: '1',
  title: 'Mindtrail',
  subtitle: '记录思维的轨迹',
  description: '在这里，每一个想法都值得被记录，每一段经历都值得被珍藏。探索思维的边界，记录知识的轨迹，让时间见证成长的足迹。',
  image: 'https://picsum.photos/1920/1080?random=1',
  isActive: true,
  createdAt: new Date().toISOString()
})

// 可以添加多个Banner的轮播功能
const banners = ref<BannerData[]>([
  bannerData.value,
  {
    id: '2',
    title: '探索内心',
    subtitle: '发现更好的自己',
    description: '通过记录和反思，我们能够更好地了解自己，发现内心的声音，找到前进的方向。',
    image: 'https://picsum.photos/1920/1080?random=2',
    isActive: false,
    createdAt: new Date().toISOString()
  }
])

// 当前Banner索引
const currentBannerIndex = ref(0)

// 自动轮播（可选）
const autoPlay = ref(false)
let autoPlayTimer: NodeJS.Timeout | null = null

const startAutoPlay = () => {
  if (!autoPlay.value) return
  
  autoPlayTimer = setInterval(() => {
    currentBannerIndex.value = (currentBannerIndex.value + 1) % banners.value.length
    bannerData.value = banners.value[currentBannerIndex.value]
  }, 5000)
}

const stopAutoPlay = () => {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer)
    autoPlayTimer = null
  }
}

onMounted(() => {
  if (autoPlay.value) {
    startAutoPlay()
  }
})

onUnmounted(() => {
  stopAutoPlay()
})
</script>

<style scoped>
.hero-banner {
  /* 确保全屏显示 */
  min-height: 100vh;
  min-height: 100dvh; /* 动态视口高度 */
}

/* 动画延迟类 */
.animation-delay-200 {
  animation-delay: 0.2s;
}

.animation-delay-400 {
  animation-delay: 0.4s;
}

.animation-delay-600 {
  animation-delay: 0.6s;
}

/* 自定义动画 */
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
  opacity: 0;
}
</style>
