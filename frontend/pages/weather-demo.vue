<template>
  <div class="relative min-h-screen overflow-hidden">
    <!-- 动态天气背景系统 -->
    <WeatherBackground
      :weather="demoWeather"
      :time-of-day="demoTimeOfDay"
      :intensity="demoIntensity"
      :enable-g-p-u-acceleration="true"
    />
    
    <!-- 控制面板 -->
    <div class="fixed top-4 left-4 z-50 bg-black/20 backdrop-blur-md rounded-lg p-4 text-white">
      <h3 class="text-lg font-bold mb-4">天气背景演示</h3>
      
      <!-- 天气条件选择 -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">天气条件</label>
        <select 
          v-model="demoWeather.condition" 
          class="bg-white/10 border border-white/20 rounded px-3 py-1 text-white"
        >
          <option value="sunny">晴天</option>
          <option value="cloudy">多云</option>
          <option value="rainy">雨天</option>
          <option value="snowy">雪天</option>
          <option value="stormy">雷雨</option>
          <option value="foggy">雾天</option>
        </select>
      </div>
      
      <!-- 时间段选择 -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">时间段</label>
        <select 
          v-model="demoTimeOfDay" 
          class="bg-white/10 border border-white/20 rounded px-3 py-1 text-white"
        >
          <option value="dawn">黎明</option>
          <option value="morning">早晨</option>
          <option value="noon">正午</option>
          <option value="afternoon">下午</option>
          <option value="dusk">黄昏</option>
          <option value="night">夜晚</option>
        </select>
      </div>
      
      <!-- 强度选择 -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">特效强度</label>
        <select 
          v-model="demoIntensity" 
          class="bg-white/10 border border-white/20 rounded px-3 py-1 text-white"
        >
          <option value="low">低</option>
          <option value="medium">中</option>
          <option value="high">高</option>
        </select>
      </div>
      
      <!-- 温度滑块 -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">
          温度: {{ demoWeather.temperature }}°C
        </label>
        <input 
          v-model="demoWeather.temperature" 
          type="range" 
          min="-20" 
          max="40" 
          class="w-full"
        />
      </div>
      
      <!-- 湿度滑块 -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">
          湿度: {{ demoWeather.humidity }}%
        </label>
        <input 
          v-model="demoWeather.humidity" 
          type="range" 
          min="0" 
          max="100" 
          class="w-full"
        />
      </div>
      
      <!-- 自动循环按钮 -->
      <button 
        @click="toggleAutoDemo"
        class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
      >
        {{ isAutoDemo ? '停止自动演示' : '开始自动演示' }}
      </button>
    </div>
    
    <!-- 信息显示 -->
    <div class="fixed bottom-4 left-4 z-50 bg-black/20 backdrop-blur-md rounded-lg p-4 text-white">
      <h4 class="font-bold mb-2">当前状态</h4>
      <p>天气: {{ weatherNames[demoWeather.condition] }}</p>
      <p>时间: {{ timeNames[demoTimeOfDay] }}</p>
      <p>温度: {{ demoWeather.temperature }}°C</p>
      <p>湿度: {{ demoWeather.humidity }}%</p>
      <p>强度: {{ intensityNames[demoIntensity] }}</p>
    </div>
    
    <!-- 中央标题 -->
    <div class="absolute inset-0 flex items-center justify-center z-10">
      <div class="text-center text-white">
        <h1 class="text-6xl font-bold mb-4 drop-shadow-lg">
          Mindtrail
        </h1>
        <p class="text-xl opacity-80 drop-shadow">
          动态天气背景系统演示
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 演示数据
const demoWeather = ref({
  condition: 'sunny' as const,
  temperature: 22,
  humidity: 60
})

const demoTimeOfDay = ref<'dawn' | 'morning' | 'noon' | 'afternoon' | 'dusk' | 'night'>('noon')
const demoIntensity = ref<'low' | 'medium' | 'high'>('medium')

// 自动演示
const isAutoDemo = ref(false)
let autoInterval: NodeJS.Timeout | null = null

// 名称映射
const weatherNames = {
  sunny: '晴天',
  cloudy: '多云',
  rainy: '雨天',
  snowy: '雪天',
  stormy: '雷雨',
  foggy: '雾天'
}

const timeNames = {
  dawn: '黎明',
  morning: '早晨',
  noon: '正午',
  afternoon: '下午',
  dusk: '黄昏',
  night: '夜晚'
}

const intensityNames = {
  low: '低',
  medium: '中',
  high: '高'
}

// 自动演示配置
const demoSequence = [
  { condition: 'sunny', timeOfDay: 'morning', temperature: 25, humidity: 40 },
  { condition: 'cloudy', timeOfDay: 'afternoon', temperature: 20, humidity: 70 },
  { condition: 'rainy', timeOfDay: 'dusk', temperature: 15, humidity: 90 },
  { condition: 'stormy', timeOfDay: 'night', temperature: 18, humidity: 85 },
  { condition: 'snowy', timeOfDay: 'dawn', temperature: -5, humidity: 80 },
  { condition: 'foggy', timeOfDay: 'morning', temperature: 10, humidity: 95 }
] as const

let currentDemoIndex = 0

const toggleAutoDemo = () => {
  isAutoDemo.value = !isAutoDemo.value
  
  if (isAutoDemo.value) {
    startAutoDemo()
  } else {
    stopAutoDemo()
  }
}

const startAutoDemo = () => {
  autoInterval = setInterval(() => {
    const demo = demoSequence[currentDemoIndex]
    demoWeather.value.condition = demo.condition
    demoTimeOfDay.value = demo.timeOfDay
    demoWeather.value.temperature = demo.temperature
    demoWeather.value.humidity = demo.humidity
    
    currentDemoIndex = (currentDemoIndex + 1) % demoSequence.length
  }, 5000) // 每5秒切换一次
}

const stopAutoDemo = () => {
  if (autoInterval) {
    clearInterval(autoInterval)
    autoInterval = null
  }
}

// 页面元数据
useHead({
  title: '天气背景演示 - Mindtrail',
  meta: [
    {
      name: 'description',
      content: 'Mindtrail 动态天气背景系统演示页面'
    }
  ]
})

// 清理
onUnmounted(() => {
  stopAutoDemo()
})
</script>

<style scoped>
/* 自定义滑块样式 */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: #3b82f6;
  border-radius: 50%;
  cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: #3b82f6;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

select option {
  background: #1f2937;
  color: white;
}
</style>
