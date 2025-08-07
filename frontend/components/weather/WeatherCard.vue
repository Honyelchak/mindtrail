<template>
  <div class="glass-card p-6 relative overflow-hidden">
    <!-- 背景渐变 -->
    <div
      class="absolute inset-0 bg-gradient-to-br opacity-10 transition-all duration-1000"
      :class="weatherGradient"
    />

    <div class="relative z-10">
      <!-- 头部 -->
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
          天气信息
        </h3>
        <button
          v-if="autoRefresh"
          @click="refreshWeather"
          :disabled="loading"
          class="p-2 rounded-lg hover:bg-white/20 transition-colors"
          :class="{ 'animate-spin': loading }"
        >
          <ArrowPathIcon class="w-4 h-4" />
        </button>
      </div>

      <!-- 主要天气信息 -->
      <div v-if="weather" class="space-y-4">
        <!-- 当前天气 -->
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="text-4xl">{{ weather.icon }}</div>
            <div>
              <div class="text-2xl font-bold text-gray-800 dark:text-gray-200">
                {{ weather.temperature }}°C
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                {{ weather.description }}
              </div>
            </div>
          </div>

          <!-- 体感温度 -->
          <div class="text-right">
            <div class="text-sm text-gray-500 dark:text-gray-400">体感</div>
            <div class="text-lg font-medium text-gray-700 dark:text-gray-300">
              {{ weather.feelsLike }}°C
            </div>
          </div>
        </div>

        <!-- 详细信息 -->
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span
                class="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-1"
              >
                <EyeIcon class="w-4 h-4" />
                <span>能见度</span>
              </span>
              <span class="text-sm font-medium"
                >{{ weather.visibility }}km</span
              >
            </div>

            <div class="flex items-center justify-between">
              <span
                class="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-1"
              >
                <CloudIcon class="w-4 h-4" />
                <span>湿度</span>
              </span>
              <span class="text-sm font-medium">{{ weather.humidity }}%</span>
            </div>

            <div class="flex items-center justify-between">
              <span
                class="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-1"
              >
                <SunIcon class="w-4 h-4" />
                <span>紫外线</span>
              </span>
              <span class="text-sm font-medium">{{ weather.uvIndex }}</span>
            </div>
          </div>

          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span
                class="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-1"
              >
                <ArrowUpIcon class="w-4 h-4" />
                <span>气压</span>
              </span>
              <span class="text-sm font-medium">{{ weather.pressure }}hPa</span>
            </div>

            <div class="flex items-center justify-between">
              <span
                class="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-1"
              >
                <WindIcon class="w-4 h-4" />
                <span>风速</span>
              </span>
              <span class="text-sm font-medium"
                >{{ weather.windSpeed }}km/h</span
              >
            </div>

            <div class="flex items-center justify-between">
              <span
                class="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-1"
              >
                <ArrowUpIcon class="w-4 h-4" />
                <span>风向</span>
              </span>
              <span class="text-sm font-medium">{{
                weather.windDirection
              }}</span>
            </div>
          </div>
        </div>

        <!-- 日出日落 -->
        <div
          class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700"
        >
          <div class="flex items-center space-x-2">
            <SunIcon class="w-4 h-4 text-orange-500" />
            <div>
              <div class="text-xs text-gray-500 dark:text-gray-400">日出</div>
              <div class="text-sm font-medium">{{ weather.sunrise }}</div>
            </div>
          </div>

          <div class="flex items-center space-x-2">
            <MoonIcon class="w-4 h-4 text-blue-500" />
            <div>
              <div class="text-xs text-gray-500 dark:text-gray-400">日落</div>
              <div class="text-sm font-medium">{{ weather.sunset }}</div>
            </div>
          </div>
        </div>

        <!-- 位置和更新时间 -->
        <div
          class="flex items-center justify-between pt-2 text-xs text-gray-500 dark:text-gray-400"
        >
          <div class="flex items-center space-x-1">
            <MapPinIcon class="w-3 h-3" />
            <span>{{ weather.location }}</span>
          </div>
          <div class="flex items-center space-x-1">
            <ClockIcon class="w-3 h-3" />
            <span>{{ formatDate(weather.updatedAt, 'time') }}</span>
          </div>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-else-if="loading" class="text-center py-8">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-2"
        ></div>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          获取天气信息中...
        </p>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="text-center py-8">
        <div class="text-4xl mb-2">⚠️</div>
        <p class="text-sm text-red-600 dark:text-red-400 mb-2">{{ error }}</p>
        <button
          @click="refreshWeather"
          class="text-sm text-primary-600 hover:text-primary-700 transition-colors"
        >
          重试
        </button>
      </div>

      <!-- 空状态 -->
      <div v-else class="text-center py-8">
        <div class="text-4xl mb-2">🌤️</div>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
          暂无天气信息
        </p>
        <button
          @click="refreshWeather"
          class="text-sm text-primary-600 hover:text-primary-700 transition-colors"
        >
          获取天气
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowPathIcon,
  EyeIcon,
  CloudIcon,
  SunIcon,
  MoonIcon,
  ArrowUpIcon,
  MapPinIcon,
  ClockIcon,
} from '@heroicons/vue/24/outline'
import { WindowIcon } from '@heroicons/vue/24/solid'
import { formatDate } from '~/utils'

interface Props {
  autoRefresh?: boolean
  refreshInterval?: number
}

const props = withDefaults(defineProps<Props>(), {
  autoRefresh: false,
  refreshInterval: 300000, // 5分钟
})

// 使用天气数据
const { weather, loading, error, weatherGradient, refreshWeather } =
  useWeather()

// 自动刷新定时器
let refreshTimer: NodeJS.Timeout | null = null

// 开始自动刷新
const startAutoRefresh = (): void => {
  if (props.autoRefresh && props.refreshInterval > 0) {
    refreshTimer = setInterval(() => {
      refreshWeather()
    }, props.refreshInterval)
  }
}

// 停止自动刷新
const stopAutoRefresh = (): void => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
}

// 组件挂载时开始自动刷新
onMounted(() => {
  startAutoRefresh()
})

// 组件卸载时停止自动刷新
onUnmounted(() => {
  stopAutoRefresh()
})

// 监听 autoRefresh 属性变化
watch(
  () => props.autoRefresh,
  (newValue) => {
    if (newValue) {
      startAutoRefresh()
    } else {
      stopAutoRefresh()
    }
  }
)
</script>

<style scoped>
.glass-card {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.dark .glass-card {
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}
</style>
