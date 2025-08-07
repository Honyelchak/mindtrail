<template>
  <div class="min-h-screen relative">
    <!-- 天气特效背景 -->
    <WeatherEffects :effects="weatherEffects" />

    <!-- 主要内容 -->
    <div class="relative z-10">
      <!-- 英雄区域 -->
      <section class="mb-12">
        <!-- 动态背景 -->
        <div class="relative overflow-hidden rounded-3xl p-8 mb-8">
          <!-- 天气相关背景渐变 -->
          <div
            class="absolute inset-0 bg-gradient-to-br opacity-20 transition-all duration-1000"
            :class="weatherGradient"
          />

          <!-- 装饰性背景元素 -->
          <div
            class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary-300/20 to-transparent rounded-full blur-3xl animate-pulse"
          />
          <div
            class="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-accent-300/20 to-transparent rounded-full blur-2xl animate-pulse"
            style="animation-delay: 1s"
          />

          <!-- 浮动装饰元素 -->
          <div
            class="absolute top-1/4 left-1/4 w-2 h-2 bg-primary-400 rounded-full animate-ping opacity-30"
          />
          <div
            class="absolute top-3/4 right-1/3 w-1 h-1 bg-accent-400 rounded-full animate-ping opacity-40"
            style="animation-delay: 2s"
          />

          <div class="relative z-10 text-center">
            <!-- 个人头像 -->
            <div class="w-24 h-24 mx-auto mb-6 relative group">
              <img
                src="/avatars/author.jpg"
                alt="作者头像"
                class="w-full h-full rounded-full object-cover shadow-neu-large group-hover:scale-105 transition-transform duration-300"
                @error="handleAvatarError"
              />
              <!-- 在线状态指示器 -->
              <div
                class="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-neutral-800 flex items-center justify-center animate-pulse"
              >
                <span class="text-white text-xs">{{ currentMoodEmoji }}</span>
              </div>
              <!-- 悬浮光环效果 -->
              <div
                class="absolute inset-0 rounded-full bg-gradient-to-r from-primary-400 to-accent-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 animate-spin"
                style="animation-duration: 8s"
              />
            </div>

            <!-- 动态标题 -->
            <h1 class="text-5xl font-bold mb-3 animate-fade-in-up">
              <span
                class="bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent"
              >
                思维轨迹
              </span>
            </h1>

            <!-- 动态副标题 -->
            <p
              class="text-xl text-neutral-600 dark:text-neutral-400 mb-4 max-w-2xl mx-auto animate-fade-in-up"
              style="animation-delay: 0.2s"
            >
              {{ dynamicSubtitle }} {{ currentWeatherEmoji }}
            </p>

            <!-- 个人标签 -->
            <div
              class="flex flex-wrap justify-center gap-2 mb-6 animate-fade-in-up"
              style="animation-delay: 0.4s"
            >
              <span
                v-for="(tag, index) in personalTags"
                :key="tag.text"
                class="px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105"
                :class="tag.class"
                :style="{ animationDelay: `${0.6 + index * 0.1}s` }"
              >
                {{ tag.text }}
              </span>
            </div>

            <!-- 实时信息 -->
            <div
              class="flex justify-center items-center space-x-6 mb-6 text-sm text-neutral-600 dark:text-neutral-400 animate-fade-in-up"
              style="animation-delay: 0.8s"
            >
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
        <!-- 左侧：时间流和快速操作 -->
        <div class="lg:col-span-2 space-y-8">
          <!-- 快速操作 -->
          <section class="animate-fade-in-up" style="animation-delay: 1s">
            <h2 class="text-2xl font-bold text-gradient mb-6">快速开始</h2>
            <QuickActions />
          </section>

          <!-- 精选时间流 -->
          <section class="animate-fade-in-up" style="animation-delay: 1.2s">
            <FeaturedTimeline :limit="5" />
          </section>
        </div>

        <!-- 右侧：天气和生活状态 -->
        <div class="space-y-6">
          <!-- 天气卡片 -->
          <section class="animate-fade-in-up" style="animation-delay: 1.4s">
            <WeatherCard :api-key="weatherApiKey" :auto-refresh="true" />
          </section>

          <!-- 生活状态卡片 -->
          <section class="animate-fade-in-up" style="animation-delay: 1.6s">
            <LifeStatusCard />
          </section>

          <!-- 最近足迹 -->
          <section class="animate-fade-in-up" style="animation-delay: 1.8s">
            <div class="glass-card p-6">
              <div class="flex items-center justify-between mb-4">
                <h3
                  class="text-lg font-semibold text-gray-800 dark:text-gray-200"
                >
                  最近足迹
                </h3>
                <NuxtLink
                  to="/map"
                  class="text-sm text-primary-600 hover:text-primary-700 transition-colors"
                >
                  查看地图 →
                </NuxtLink>
              </div>

              <div class="space-y-3">
                <div
                  v-for="location in recentLocations"
                  :key="location.name"
                  class="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
                  @click="navigateToLocation(location)"
                >
                  <div
                    class="w-8 h-8 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center"
                  >
                    <MapPinIcon class="w-4 h-4 text-white" />
                  </div>
                  <div class="flex-1">
                    <div class="font-medium text-gray-800 dark:text-gray-200">
                      {{ location.name }}
                    </div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">
                      {{ location.count }} 次记录
                    </div>
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ formatDate(location.lastVisit, 'relative') }}
                  </div>
                </div>
              </div>

              <div v-if="recentLocations.length === 0" class="text-center py-8">
                <div class="text-4xl mb-2">🗺️</div>
                <p class="text-gray-600 dark:text-gray-400 mb-4">
                  还没有足迹记录
                </p>
                <NuxtLink
                  to="/create"
                  class="text-sm text-primary-600 hover:text-primary-700"
                >
                  创建第一条记录 →
                </NuxtLink>
              </div>
            </div>
          </section>
        </div>
      </div>

      <!-- 统计概览 -->
      <section class="mb-12 animate-fade-in-up" style="animation-delay: 2s">
        <h2 class="text-2xl font-bold text-gradient mb-6">数据概览</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            v-for="(stat, index) in stats"
            :key="stat.label"
            class="glass-card p-6 text-center hover:scale-105 transition-all duration-300 group"
            :class="{ 'animate-fade-in-up': true }"
            :style="{ animationDelay: `${2.2 + index * 0.1}s` }"
          >
            <div
              class="text-3xl mb-2 group-hover:scale-110 transition-transform"
            >
              {{ stat.icon }}
            </div>
            <div class="text-2xl font-bold text-gradient mb-1">
              {{ stat.value }}
            </div>
            <div class="text-sm text-neutral-600 dark:text-neutral-400">
              {{ stat.label }}
            </div>
            <div class="text-xs text-neutral-500 mt-1">
              {{ stat.change }}
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ClockIcon, MapPinIcon } from '@heroicons/vue/24/outline'
import { formatDate } from '~/utils'

// 页面元数据
useHead({
  title: '思维轨迹 - 记录生活的每一个瞬间',
  meta: [
    {
      name: 'description',
      content:
        '在思维轨迹中记录生活点滴，分享创作灵感，探索世界足迹。支持文章、说说、相册等多种内容形式，让每一个瞬间都有意义。',
    },
    {
      name: 'keywords',
      content: '博客,生活记录,创作分享,足迹地图,个人日记,思维轨迹',
    },
  ],
})

// 使用天气数据
const { weather, effects: weatherEffects, weatherGradient } = useWeather()

// 使用时间流数据
const { timeline, loadMockData } = useTimeline()

// 天气 API Key (可以从环境变量获取)
const weatherApiKey = ref(process.env.OPENWEATHER_API_KEY || '')

// 当前时间
const currentTime = ref('')
const currentMoodEmoji = ref('😊')
const currentWeatherEmoji = ref('🌤️')

// 动态副标题
const dynamicSubtitle = computed(() => {
  const hour = new Date().getHours()
  const subtitles = {
    morning: '在这里，我记录思考的轨迹，分享生活的点滴',
    afternoon: '探索世界的美好，记录每一个精彩瞬间',
    evening: '回顾今日收获，展望明日美好',
    night: '夜深人静，最适合思考与创作',
  }

  if (hour < 6) return subtitles.night
  if (hour < 12) return subtitles.morning
  if (hour < 18) return subtitles.afternoon
  return subtitles.evening
})

// 个人标签
const personalTags = ref([
  {
    text: '🎨 创作者',
    class:
      'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300',
  },
  {
    text: '💻 开发者',
    class:
      'bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300',
  },
  {
    text: '🌍 探索者',
    class:
      'bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300',
  },
])

// 统计数据
const stats = computed(() => {
  const articles = timeline.value.filter(
    (item) => item.type === 'article'
  ).length
  const moments = timeline.value.filter((item) => item.type === 'moment').length
  const galleries = timeline.value.filter(
    (item) => item.type === 'gallery'
  ).length
  const locations = new Set(
    timeline.value
      .filter((item) => item.location)
      .map((item) => item.location.name)
  ).size

  return [
    {
      icon: '📝',
      value: articles,
      label: '深度文章',
      change: '+2 本周',
    },
    {
      icon: '💭',
      value: moments,
      label: '生活说说',
      change: '+5 本周',
    },
    {
      icon: '📸',
      value: galleries,
      label: '精彩相册',
      change: '+1 本周',
    },
    {
      icon: '📍',
      value: locations,
      label: '足迹地点',
      change: '+3 本月',
    },
  ]
})

// 最近足迹
const recentLocations = computed(() => {
  const locationMap = new Map()

  timeline.value
    .filter((item) => item.location)
    .forEach((item) => {
      const name = item.location.name
      if (locationMap.has(name)) {
        locationMap.get(name).count++
        if (
          new Date(item.createdAt) > new Date(locationMap.get(name).lastVisit)
        ) {
          locationMap.get(name).lastVisit = item.createdAt
        }
      } else {
        locationMap.set(name, {
          name,
          count: 1,
          lastVisit: item.createdAt,
        })
      }
    })

  return Array.from(locationMap.values())
    .sort(
      (a, b) =>
        new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime()
    )
    .slice(0, 5)
})

// 更新时间
const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  })

  // 根据时间设置心情表情
  const hour = now.getHours()
  if (hour < 6) {
    currentMoodEmoji.value = '😴'
  } else if (hour < 12) {
    currentMoodEmoji.value = '😊'
  } else if (hour < 18) {
    currentMoodEmoji.value = '😎'
  } else {
    currentMoodEmoji.value = '😌'
  }
}

// 根据天气更新表情
watch(
  weather,
  (newWeather) => {
    if (newWeather) {
      currentWeatherEmoji.value = newWeather.icon
    }
  },
  { immediate: true }
)

// 导航到位置
const navigateToLocation = (location) => {
  navigateTo(`/map?location=${encodeURIComponent(location.name)}`)
}

// 处理头像错误
const handleAvatarError = (event) => {
  const target = event.target
  target.src = '/avatars/default.jpg'
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
/* 动画定义 */
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

/* 玻璃态卡片样式 */
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

.glass-card:hover {
  transform: translateY(-2px);
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.dark .glass-card:hover {
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

/* 文本渐变 */
.text-gradient {
  background: linear-gradient(
    135deg,
    var(--color-primary),
    var(--color-secondary)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .animate-fade-in-up {
    animation-duration: 0.6s;
  }

  .glass-card {
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
  }
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

.dark ::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.dark ::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
