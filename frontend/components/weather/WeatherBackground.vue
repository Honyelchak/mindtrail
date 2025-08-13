<template>
  <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
    <!-- 动态渐变背景 -->
    <div
      class="absolute inset-0 transition-all duration-[3000ms] ease-in-out"
      :style="{ background: dynamicGradient }"
    />

    <!-- Canvas 特效层 -->
    <canvas
      ref="canvasRef"
      class="absolute inset-0 w-full h-full"
      :class="{ 'opacity-50': isLowPerformance }"
    />

    <!-- 玻璃雨滴效果 -->
    <div v-if="showGlassRaindrops" class="absolute inset-0">
      <div
        v-for="drop in glassRaindrops"
        :key="`glass-rain-${drop.id}`"
        class="absolute glass-raindrop"
        :style="{
          left: drop.x + '%',
          top: drop.y + '%',
          width: drop.width + 'px',
          height: drop.height + 'px',
          animationDelay: drop.delay + 's',
          animationDuration: drop.duration + 's',
        }"
      />
    </div>

    <!-- 光影波纹效果 -->
    <div v-if="showLightRipples" class="absolute inset-0">
      <div
        v-for="ripple in lightRipples"
        :key="`ripple-${ripple.id}`"
        class="absolute light-ripple"
        :style="{
          left: ripple.x + '%',
          top: ripple.y + '%',
          width: ripple.size + 'px',
          height: ripple.size + 'px',
          animationDelay: ripple.delay + 's',
          animationDuration: ripple.duration + 's',
        }"
      />
    </div>

    <!-- 闪电效果 -->
    <div v-if="showLightning" class="absolute inset-0">
      <div
        v-for="lightning in lightningBolts"
        :key="`lightning-${lightning.id}`"
        class="absolute lightning-bolt"
        :style="{
          left: lightning.x + '%',
          top: lightning.y + '%',
          width: lightning.width + 'px',
          height: lightning.height + 'px',
          animationDelay: lightning.delay + 's',
        }"
      />
    </div>

    <!-- 流星效果 -->
    <div v-if="showMeteors" class="absolute inset-0">
      <div
        v-for="meteor in meteors"
        :key="`meteor-${meteor.id}`"
        class="absolute meteor"
        :style="{
          left: meteor.x + '%',
          top: meteor.y + '%',
          animationDelay: meteor.delay + 's',
          animationDuration: meteor.duration + 's',
        }"
      />
    </div>

    <!-- 时间遮罩层 -->
    <div
      class="absolute inset-0 transition-opacity duration-[2000ms]"
      :style="{
        background: timeMask,
        opacity: timeMaskOpacity,
      }"
    />
  </div>
</template>

<script setup lang="ts">
interface BackgroundEffect {
  id: number
  x: number
  y: number
  size?: number
  width?: number
  height?: number
  delay: number
  duration: number
}

interface Props {
  weather?: {
    condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy' | 'foggy'
    temperature: number
    humidity: number
  }
  timeOfDay?: 'dawn' | 'morning' | 'noon' | 'afternoon' | 'dusk' | 'night'
  intensity?: 'low' | 'medium' | 'high'
  enableGPUAcceleration?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  weather: () => ({ condition: 'sunny', temperature: 20, humidity: 50 }),
  timeOfDay: 'noon',
  intensity: 'medium',
  enableGPUAcceleration: true,
})

// Canvas 引用
const canvasRef = ref<HTMLCanvasElement>()
let ctx: CanvasRenderingContext2D | null = null
let animationId: number | null = null

// 性能检测
const isLowPerformance = ref(false)

// 特效状态
const glassRaindrops = ref<BackgroundEffect[]>([])
const lightRipples = ref<BackgroundEffect[]>([])
const lightningBolts = ref<BackgroundEffect[]>([])
const meteors = ref<BackgroundEffect[]>([])

// 计算属性
const showGlassRaindrops = computed(
  () =>
    props.weather.condition === 'rainy' || props.weather.condition === 'stormy'
)

const showLightRipples = computed(
  () =>
    props.weather.condition === 'sunny' &&
    (props.timeOfDay === 'morning' || props.timeOfDay === 'afternoon')
)

const showLightning = computed(() => props.weather.condition === 'stormy')

const showMeteors = computed(
  () => props.timeOfDay === 'night' && props.weather.condition !== 'cloudy'
)

// 动态渐变背景
const dynamicGradient = computed(() => {
  const { condition } = props.weather
  const timeOfDay = props.timeOfDay

  const gradients = {
    sunny: {
      dawn: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
      morning: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      noon: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
      afternoon: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
      dusk: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      night: 'linear-gradient(135deg, #434343 0%, #000000 100%)',
    },
    cloudy: {
      dawn: 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)',
      morning: 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)',
      noon: 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)',
      afternoon: 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)',
      dusk: 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)',
      night: 'linear-gradient(135deg, #2c3e50 0%, #000000 100%)',
    },
    rainy: {
      dawn: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
      morning: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
      noon: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
      afternoon: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
      dusk: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
      night: 'linear-gradient(135deg, #2d3436 0%, #636e72 100%)',
    },
    snowy: {
      dawn: 'linear-gradient(135deg, #e17055 0%, #f8f9fa 100%)',
      morning: 'linear-gradient(135deg, #ddd6fe 0%, #f8f9fa 100%)',
      noon: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      afternoon: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      dusk: 'linear-gradient(135deg, #a29bfe 0%, #f8f9fa 100%)',
      night: 'linear-gradient(135deg, #2d3436 0%, #636e72 100%)',
    },
    stormy: {
      dawn: 'linear-gradient(135deg, #2d3436 0%, #636e72 100%)',
      morning: 'linear-gradient(135deg, #2d3436 0%, #636e72 100%)',
      noon: 'linear-gradient(135deg, #2d3436 0%, #636e72 100%)',
      afternoon: 'linear-gradient(135deg, #2d3436 0%, #636e72 100%)',
      dusk: 'linear-gradient(135deg, #2d3436 0%, #636e72 100%)',
      night: 'linear-gradient(135deg, #000000 0%, #2d3436 100%)',
    },
    foggy: {
      dawn: 'linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%)',
      morning: 'linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%)',
      noon: 'linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%)',
      afternoon: 'linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%)',
      dusk: 'linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%)',
      night: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
    },
  }

  return gradients[condition]?.[timeOfDay] || gradients.sunny.noon
})

// 时间遮罩
const timeMask = computed(() => {
  const masks = {
    dawn: 'linear-gradient(to bottom, rgba(255, 154, 158, 0.3) 0%, transparent 100%)',
    morning:
      'linear-gradient(to bottom, rgba(255, 223, 186, 0.2) 0%, transparent 100%)',
    noon: 'transparent',
    afternoon:
      'linear-gradient(to bottom, rgba(255, 183, 77, 0.2) 0%, transparent 100%)',
    dusk: 'linear-gradient(to bottom, rgba(247, 112, 154, 0.4) 0%, transparent 100%)',
    night:
      'linear-gradient(to bottom, rgba(45, 52, 54, 0.6) 0%, transparent 100%)',
  }
  return masks[props.timeOfDay] || 'transparent'
})

const timeMaskOpacity = computed(() => {
  const opacities = {
    dawn: 0.7,
    morning: 0.4,
    noon: 0,
    afternoon: 0.3,
    dusk: 0.8,
    night: 0.9,
  }
  return opacities[props.timeOfDay] || 0
})

// 性能检测
const detectPerformance = () => {
  const canvas = document.createElement('canvas')
  const gl =
    canvas.getContext('webgl') || canvas.getContext('experimental-webgl')

  if (!gl) {
    isLowPerformance.value = true
    return
  }

  // 检测GPU性能
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
  if (debugInfo) {
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
    // 简单的性能检测逻辑
    isLowPerformance.value =
      renderer.includes('Intel') && !renderer.includes('Iris')
  }
}

// Canvas 粒子系统
class Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  life: number
  maxLife: number
  color: string

  constructor(x: number, y: number, config: any = {}) {
    this.x = x
    this.y = y
    this.vx = (Math.random() - 0.5) * (config.speed || 2)
    this.vy = (Math.random() - 0.5) * (config.speed || 2)
    this.size = Math.random() * (config.maxSize || 3) + (config.minSize || 1)
    this.opacity = Math.random() * 0.8 + 0.2
    this.life = 0
    this.maxLife =
      Math.random() * (config.maxLife || 300) + (config.minLife || 100)
    this.color = config.color || '#ffffff'
  }

  update() {
    this.x += this.vx
    this.y += this.vy
    this.life++

    // 生命周期透明度变化
    const lifeRatio = this.life / this.maxLife
    this.opacity = Math.sin(lifeRatio * Math.PI) * 0.8

    return this.life < this.maxLife
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.globalAlpha = this.opacity
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

// 粒子系统管理
const particles = ref<Particle[]>([])

const createParticles = () => {
  if (!ctx || isLowPerformance.value) return

  const canvas = canvasRef.value!
  const particleCount = {
    low: 20,
    medium: 50,
    high: 100,
  }[props.intensity]

  // 根据天气条件创建不同的粒子
  const configs = {
    sunny: {
      color: '#ffd700',
      speed: 0.5,
      maxSize: 2,
      minSize: 0.5,
      maxLife: 400,
      minLife: 200,
    },
    cloudy: {
      color: '#e0e0e0',
      speed: 0.3,
      maxSize: 4,
      minSize: 2,
      maxLife: 600,
      minLife: 300,
    },
    rainy: {
      color: '#87ceeb',
      speed: 1.5,
      maxSize: 1,
      minSize: 0.5,
      maxLife: 200,
      minLife: 100,
    },
    snowy: {
      color: '#ffffff',
      speed: 0.8,
      maxSize: 3,
      minSize: 1,
      maxLife: 500,
      minLife: 250,
    },
    stormy: {
      color: '#4682b4',
      speed: 2,
      maxSize: 2,
      minSize: 1,
      maxLife: 150,
      minLife: 75,
    },
    foggy: {
      color: '#d3d3d3',
      speed: 0.2,
      maxSize: 8,
      minSize: 4,
      maxLife: 800,
      minLife: 400,
    },
  }

  const config = configs[props.weather.condition] || configs.sunny

  // 创建粒子
  for (let i = 0; i < particleCount; i++) {
    particles.value.push(
      new Particle(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        config
      )
    )
  }
}

const animateParticles = () => {
  if (!ctx || !canvasRef.value) return

  const canvas = canvasRef.value
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // 更新和绘制粒子
  particles.value = particles.value.filter((particle) => {
    const alive = particle.update()
    if (alive) {
      particle.draw(ctx!)

      // 边界检测
      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1
    }
    return alive
  })

  // 补充粒子
  if (particles.value.length < 30) {
    createParticles()
  }

  animationId = requestAnimationFrame(animateParticles)
}

// 初始化玻璃雨滴
const initGlassRaindrops = () => {
  const count = { low: 15, medium: 30, high: 50 }[props.intensity]
  glassRaindrops.value = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    width: Math.random() * 8 + 4,
    height: Math.random() * 20 + 10,
    delay: Math.random() * 3,
    duration: Math.random() * 2 + 1,
  }))
}

// 初始化光影波纹
const initLightRipples = () => {
  const count = { low: 8, medium: 15, high: 25 }[props.intensity]
  lightRipples.value = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 200 + 100,
    delay: Math.random() * 5,
    duration: Math.random() * 8 + 6,
  }))
}

// 初始化闪电
const initLightning = () => {
  const count = { low: 2, medium: 4, high: 6 }[props.intensity]
  lightningBolts.value = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 80 + 10,
    y: Math.random() * 30,
    width: Math.random() * 3 + 1,
    height: Math.random() * 40 + 30,
    delay: Math.random() * 10 + 5,
  }))
}

// 初始化流星
const initMeteors = () => {
  const count = { low: 3, medium: 6, high: 10 }[props.intensity]
  meteors.value = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 50,
    delay: Math.random() * 15 + 5,
    duration: Math.random() * 3 + 2,
  }))
}

// Canvas 初始化
const initCanvas = () => {
  if (!canvasRef.value) return

  const canvas = canvasRef.value
  ctx = canvas.getContext('2d')

  if (!ctx) return

  // 设置画布尺寸
  const resizeCanvas = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)

  // 启用GPU加速
  if (props.enableGPUAcceleration && !isLowPerformance.value) {
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
  }

  createParticles()
  animateParticles()
}

// 清理函数
const cleanup = () => {
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
  particles.value = []
  window.removeEventListener('resize', () => {})
}

// 监听器
watch(
  () => props.weather.condition,
  () => {
    particles.value = []
    createParticles()

    if (showGlassRaindrops.value) initGlassRaindrops()
    if (showLightRipples.value) initLightRipples()
    if (showLightning.value) initLightning()
    if (showMeteors.value) initMeteors()
  },
  { immediate: true }
)

watch(
  () => props.intensity,
  () => {
    particles.value = []
    createParticles()
  }
)

// 生命周期
onMounted(() => {
  detectPerformance()
  nextTick(() => {
    initCanvas()

    // 初始化特效
    if (showGlassRaindrops.value) initGlassRaindrops()
    if (showLightRipples.value) initLightRipples()
    if (showLightning.value) initLightning()
    if (showMeteors.value) initMeteors()
  })
})

onUnmounted(() => {
  cleanup()
})
</script>

<style scoped>
/* 玻璃雨滴效果 */
.glass-raindrop {
  background: linear-gradient(
    180deg,
    rgba(135, 206, 235, 0.8) 0%,
    rgba(135, 206, 235, 0.4) 50%,
    rgba(135, 206, 235, 0.1) 100%
  );
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  backdrop-filter: blur(2px);
  animation: glass-rain-fall linear infinite;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.6),
    0 2px 4px rgba(0, 0, 0, 0.1);
}

@keyframes glass-rain-fall {
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
    transform: translateY(100vh) rotate(10deg);
    opacity: 0;
  }
}

/* 光影波纹效果 */
.light-ripple {
  background: radial-gradient(
    circle,
    rgba(255, 215, 0, 0.3) 0%,
    rgba(255, 215, 0, 0.1) 30%,
    transparent 70%
  );
  border-radius: 50%;
  animation: light-ripple-expand ease-in-out infinite;
  filter: blur(1px);
}

@keyframes light-ripple-expand {
  0%,
  100% {
    transform: scale(0.8);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
}

/* 闪电效果 */
.lightning-bolt {
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(135, 206, 250, 0.8) 50%,
    rgba(255, 255, 255, 0.9) 100%
  );
  clip-path: polygon(
    20% 0%,
    40% 20%,
    30% 20%,
    70% 60%,
    60% 60%,
    90% 100%,
    70% 80%,
    80% 80%,
    40% 40%,
    50% 40%,
    10% 0%
  );
  animation: lightning-flash 0.1s ease-in-out;
  box-shadow:
    0 0 20px rgba(255, 255, 255, 0.8),
    0 0 40px rgba(135, 206, 250, 0.6);
}

@keyframes lightning-flash {
  0%,
  100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

/* 流星效果 */
.meteor {
  width: 2px;
  height: 2px;
  background: #ffffff;
  border-radius: 50%;
  animation: meteor-fall linear infinite;
  box-shadow:
    0 0 6px #ffffff,
    0 0 12px #ffffff,
    0 0 18px #ffffff;
}

.meteor::before {
  content: '';
  position: absolute;
  top: 50%;
  right: 0;
  width: 300px;
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.8) 60%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: translateY(-50%) rotate(45deg);
  transform-origin: 0% 50%;
}

@keyframes meteor-fall {
  0% {
    transform: translateX(-100px) translateY(-100px);
    opacity: 1;
  }
  70% {
    opacity: 1;
  }
  100% {
    transform: translateX(300px) translateY(300px);
    opacity: 0;
  }
}

/* GPU 加速优化 */
.glass-raindrop,
.light-ripple,
.lightning-bolt,
.meteor {
  will-change: transform, opacity;
  transform: translateZ(0);
}

/* 移动端优化 */
@media (max-width: 768px) {
  .glass-raindrop {
    animation-duration: 1s;
  }

  .light-ripple {
    animation-duration: 4s;
  }

  .meteor {
    animation-duration: 1.5s;
  }
}

/* 低性能设备优化 */
@media (prefers-reduced-motion: reduce) {
  .glass-raindrop,
  .light-ripple,
  .lightning-bolt,
  .meteor {
    animation: none;
  }
}
</style>
