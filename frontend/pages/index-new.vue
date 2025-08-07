<template>
  <div class="min-h-screen relative">
    <!-- 天气特效背景 -->
    <WeatherEffects :effects="weatherEffects" />
    
    <!-- 主要内容 -->
    <div class="relative z-10 container mx-auto px-4 py-8">
      <!-- 英雄区域 -->
      <section class="mb-12">
        <div class="relative overflow-hidden rounded-3xl p-8 mb-8 glass-card">
          <!-- 天气相关背景渐变 -->
          <div
            class="absolute inset-0 bg-gradient-to-br opacity-20 transition-all duration-1000"
            :class="weatherGradient"
          />
          
          <div class="relative z-10 text-center">
            <!-- 个人头像 -->
            <div class="w-24 h-24 mx-auto mb-6 relative group">
              <img
                src="/avatars/author.jpg"
                alt="作者头像"
                class="w-full h-full rounded-full object-cover shadow-lg group-hover:scale-105 transition-transform duration-300"
                @error="handleAvatarError"
              />
              <!-- 在线状态指示器 -->
              <div class="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center animate-pulse">
                <span class="text-white text-xs">{{ currentMoodEmoji }}</span>
              </div>
            </div>

            <!-- 动态标题 -->
            <h1 class="text-5xl font-bold mb-3">
              <span class="bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent">
                思维轨迹
              </span>
            </h1>
            
            <!-- 动态副标题 -->
            <p class="text-xl text-gray-600 dark:text-gray-400 mb-4 max-w-2xl mx-auto">
              {{ dynamicSubtitle }} {{ currentWeatherEmoji }}
            </p>

            <!-- 实时信息 -->
            <div class="flex justify-center items-center space-x-6 mb-6 text-sm text-gray-600 dark:text-gray-400">
              <div class="flex items-center space-x-1">
                <ClockIcon class="w-4 h-4" />
                <span>{{ currentTime }}</span>
              </div>
              <div v-if="weather" class="flex items-center space-x-1">
                <span>{{ weather.icon }}</span>
                <span>{{ weather.temperature }}°C</span>
              </div>
              <div class="flex items-center space-x-1">
                <MapPinIcon class="w-4 h-4" />
                <span>{{ weather?.location || '北京' }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 主要内容区域 -->
      <div class="grid lg:grid-cols-3 gap-8 mb-12">
        <!-- 左侧：快速操作和时间流 -->
        <div class="lg:col-span-2 space-y-8">
          <!-- 快速操作 -->
          <section>
            <h2 class="text-2xl font-bold text-gradient mb-6">快速开始</h2>
            <QuickActions />
          </section>
          
          <!-- 精选时间流 -->
          <section>
            <FeaturedTimeline :limit="5" />
          </section>
        </div>
        
        <!-- 右侧：天气和生活状态 -->
        <div class="space-y-6">
          <!-- 天气卡片 -->
          <section>
            <WeatherCard :auto-refresh="true" />
          </section>
          
          <!-- 生活状态卡片 -->
          <section>
            <LifeStatusCard />
          </section>
        </div>
      </div>
      
      <!-- 统计概览 -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold text-gradient mb-6">数据概览</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            v-for="(stat, index) in stats"
            :key="stat.label"
            class="glass-card p-6 text-center hover:scale-105 transition-all duration-300 group"
          >
            <div class="text-3xl mb-2 group-hover:scale-110 transition-transform">
              {{ stat.icon }}
            </div>
            <div class="text-2xl font-bold text-gradient mb-1">
              {{ stat.value }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              {{ stat.label }}
            </div>
            <div class="text-xs text-gray-500 mt-1">
              {{ stat.change }}
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import {
  ClockIcon,
  MapPinIcon,
} from '@heroicons/vue/24/outline'

// 页面元数据
useHead({
  title: '思维轨迹 - 记录生活的每一个瞬间',
  meta: [
    {
      name: 'description',
      content: '在思维轨迹中记录生活点滴，分享创作灵感，探索世界足迹。',
    },
  ],
})

// 使用天气数据
const { weather, effects: weatherEffects, weatherGradient } = useWeather()

// 使用时间流数据
const { timeline, loadMockData } = useTimeline()

// 当前时间和状态
const currentTime = ref('')
const currentMoodEmoji = ref('😊')
const currentWeatherEmoji = ref('🌤️')

// 动态副标题
const dynamicSubtitle = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '夜深人静，最适合思考与创作'
  if (hour < 12) return '在这里，我记录思考的轨迹，分享生活的点滴'
  if (hour < 18) return '探索世界的美好，记录每一个精彩瞬间'
  return '回顾今日收获，展望明日美好'
})

// 统计数据
const stats = computed(() => {
  const articles = timeline.value.filter(item => item.type === 'article').length
  const moments = timeline.value.filter(item => item.type === 'moment').length
  const galleries = timeline.value.filter(item => item.type === 'gallery').length
  const locations = new Set(
    timeline.value
      .filter(item => item.location)
      .map(item => item.location.name)
  ).size

  return [
    { icon: '📝', value: articles, label: '深度文章', change: '+2 本周' },
    { icon: '💭', value: moments, label: '生活说说', change: '+5 本周' },
    { icon: '📸', value: galleries, label: '精彩相册', change: '+1 本周' },
    { icon: '📍', value: locations, label: '足迹地点', change: '+3 本月' }
  ]
})

// 更新时间
const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
  
  const hour = now.getHours()
  if (hour < 6) currentMoodEmoji.value = '😴'
  else if (hour < 12) currentMoodEmoji.value = '😊'
  else if (hour < 18) currentMoodEmoji.value = '😎'
  else currentMoodEmoji.value = '😌'
}

// 根据天气更新表情
watch(weather, (newWeather) => {
  if (newWeather) {
    currentWeatherEmoji.value = newWeather.icon
  }
}, { immediate: true })

// 处理头像错误
const handleAvatarError = (event) => {
  event.target.src = '/avatars/default.jpg'
}

// 定时器
let timeInterval

// 组件挂载时初始化
onMounted(() => {
  loadMockData()
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
})

// 组件卸载时清理
onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>

<style scoped>
.glass-card {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.dark .glass-card {
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.text-gradient {
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
