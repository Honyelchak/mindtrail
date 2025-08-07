<template>
  <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
    <!-- 雨滴效果 -->
    <div v-if="showRain" class="absolute inset-0">
      <div
        v-for="drop in raindrops"
        :key="`rain-${drop.id}`"
        class="absolute w-0.5 bg-gradient-to-b from-blue-300 to-blue-500 opacity-60 animate-rain"
        :style="{
          left: drop.x + '%',
          height: drop.length + 'px',
          animationDelay: drop.delay + 's',
          animationDuration: drop.duration + 's',
        }"
      />
    </div>

    <!-- 雪花效果 -->
    <div v-if="showSnow" class="absolute inset-0">
      <div
        v-for="flake in snowflakes"
        :key="`snow-${flake.id}`"
        class="absolute text-white opacity-80 animate-snow"
        :style="{
          left: flake.x + '%',
          fontSize: flake.size + 'px',
          animationDelay: flake.delay + 's',
          animationDuration: flake.duration + 's',
        }"
      >
        ❄
      </div>
    </div>

    <!-- 阳光光斑效果 -->
    <div v-if="showSunshine" class="absolute inset-0">
      <div
        v-for="ray in sunRays"
        :key="`sun-${ray.id}`"
        class="absolute rounded-full bg-gradient-radial from-yellow-200/30 to-transparent animate-sunshine"
        :style="{
          left: ray.x + '%',
          top: ray.y + '%',
          width: ray.size + 'px',
          height: ray.size + 'px',
          animationDelay: ray.delay + 's',
          animationDuration: ray.duration + 's',
        }"
      />
    </div>

    <!-- 星空效果 -->
    <div v-if="showStars" class="absolute inset-0">
      <div
        v-for="star in stars"
        :key="`star-${star.id}`"
        class="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
        :style="{
          left: star.x + '%',
          top: star.y + '%',
          animationDelay: star.delay + 's',
          animationDuration: star.duration + 's',
        }"
      />
    </div>

    <!-- 云朵效果 -->
    <div v-if="showClouds" class="absolute inset-0">
      <div
        v-for="cloud in clouds"
        :key="`cloud-${cloud.id}`"
        class="absolute text-gray-300 dark:text-gray-600 opacity-40 animate-float"
        :style="{
          left: cloud.x + '%',
          top: cloud.y + '%',
          fontSize: cloud.size + 'px',
          animationDelay: cloud.delay + 's',
          animationDuration: cloud.duration + 's',
        }"
      >
        ☁
      </div>
    </div>

    <!-- 雾气效果 -->
    <div v-if="showFog" class="absolute inset-0">
      <div
        v-for="fog in fogParticles"
        :key="`fog-${fog.id}`"
        class="absolute rounded-full bg-gradient-radial from-gray-200/20 to-transparent animate-fog"
        :style="{
          left: fog.x + '%',
          top: fog.y + '%',
          width: fog.size + 'px',
          height: fog.size + 'px',
          animationDelay: fog.delay + 's',
          animationDuration: fog.duration + 's',
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface WeatherEffect {
  id: number
  x: number
  y?: number
  size?: number
  length?: number
  delay: number
  duration: number
}

// 使用 useAttrs 来避免 props 验证问题
const attrs = useAttrs()
const effects = computed(() => attrs.effects || {})
const intensity = computed(() => attrs.intensity || 'medium')

// 响应式数据
const raindrops = ref<WeatherEffect[]>([])
const snowflakes = ref<WeatherEffect[]>([])
const sunRays = ref<WeatherEffect[]>([])
const stars = ref<WeatherEffect[]>([])
const clouds = ref<WeatherEffect[]>([])
const fogParticles = ref<WeatherEffect[]>([])

// 计算属性
const showRain = computed(() => (effects.value as any)?.showRaindrops || false)
const showSnow = computed(() => (effects.value as any)?.showSnowflakes || false)
const showSunshine = computed(
  () => (effects.value as any)?.showSunbeams || false
)
const showStars = computed(() => (effects.value as any)?.showStars || false)
const showClouds = computed(() => (effects.value as any)?.showClouds || false)
const showFog = computed(() => (effects.value as any)?.showFog || false)

// 强度配置
const intensityConfig = computed(() => {
  const configs = {
    light: { count: 20, speed: 1.5 },
    medium: { count: 50, speed: 1.0 },
    heavy: { count: 100, speed: 0.7 },
  }
  return configs[intensity.value as keyof typeof configs] || configs.medium
})

// 初始化雨滴
const initRaindrops = (): void => {
  raindrops.value = Array.from(
    { length: intensityConfig.value.count },
    (_, i) => ({
      id: i,
      x: Math.random() * 100,
      length: Math.random() * 20 + 10,
      delay: Math.random() * 2,
      duration: (Math.random() * 1 + 0.5) * intensityConfig.value.speed,
    })
  )
}

// 初始化雪花
const initSnowflakes = (): void => {
  snowflakes.value = Array.from(
    { length: intensityConfig.value.count },
    (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 10 + 8,
      delay: Math.random() * 3,
      duration: (Math.random() * 2 + 2) * intensityConfig.value.speed,
    })
  )
}

// 初始化阳光光斑
const initSunRays = (): void => {
  sunRays.value = Array.from(
    { length: Math.floor(intensityConfig.value.count / 2) },
    (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 100 + 50,
      delay: Math.random() * 5,
      duration: (Math.random() * 3 + 3) * intensityConfig.value.speed,
    })
  )
}

// 初始化星星
const initStars = (): void => {
  stars.value = Array.from(
    { length: intensityConfig.value.count * 2 },
    (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 4,
      duration: (Math.random() * 2 + 1) * intensityConfig.value.speed,
    })
  )
}

// 初始化云朵
const initClouds = (): void => {
  clouds.value = Array.from(
    { length: Math.floor(intensityConfig.value.count / 5) },
    (_, i) => ({
      id: i,
      x: Math.random() * 120 - 10, // 允许云朵从屏幕外开始
      y: Math.random() * 30 + 10,
      size: Math.random() * 30 + 20,
      delay: Math.random() * 10,
      duration: (Math.random() * 20 + 20) * intensityConfig.value.speed,
    })
  )
}

// 初始化雾气
const initFogParticles = (): void => {
  fogParticles.value = Array.from(
    { length: Math.floor(intensityConfig.value.count / 3) },
    (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 200 + 100,
      delay: Math.random() * 5,
      duration: (Math.random() * 10 + 10) * intensityConfig.value.speed,
    })
  )
}

// 监听特效变化
watch(
  effects,
  (newEffects: any) => {
    if (newEffects?.showRaindrops) initRaindrops()
    if (newEffects?.showSnowflakes) initSnowflakes()
    if (newEffects?.showSunbeams) initSunRays()
    if (newEffects?.showStars) initStars()
    if (newEffects?.showClouds) initClouds()
    if (newEffects?.showFog) initFogParticles()
  },
  { immediate: true, deep: true }
)

// 监听强度变化
watch(intensity, () => {
  // 重新初始化所有特效
  if (showRain.value) initRaindrops()
  if (showSnow.value) initSnowflakes()
  if (showSunshine.value) initSunRays()
  if (showStars.value) initStars()
  if (showClouds.value) initClouds()
  if (showFog.value) initFogParticles()
})
</script>

<style scoped>
@keyframes rain {
  0% {
    transform: translateY(-100vh);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(100vh);
    opacity: 0;
  }
}

@keyframes snow {
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(360deg);
    opacity: 0;
  }
}

@keyframes sunshine {
  0%,
  100% {
    opacity: 0;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.5);
  }
}

@keyframes float {
  0% {
    transform: translateX(-10px);
  }
  100% {
    transform: translateX(calc(100vw + 10px));
  }
}

@keyframes fog {
  0%,
  100% {
    opacity: 0;
    transform: scale(0.8) translateX(-20px);
  }
  50% {
    opacity: 0.3;
    transform: scale(1.2) translateX(20px);
  }
}

.animate-rain {
  animation: rain linear infinite;
}

.animate-snow {
  animation: snow linear infinite;
}

.animate-sunshine {
  animation: sunshine ease-in-out infinite;
}

.animate-twinkle {
  animation: twinkle ease-in-out infinite;
}

.animate-float {
  animation: float linear infinite;
}

.animate-fog {
  animation: fog ease-in-out infinite;
}

.bg-gradient-radial {
  background: radial-gradient(circle, var(--tw-gradient-stops));
}
</style>
