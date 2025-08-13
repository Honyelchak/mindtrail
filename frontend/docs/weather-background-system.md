# 动态天气背景系统

## 概述

Mindtrail 的动态天气背景系统是一个基于 Nuxt 3 + Tailwind CSS + Canvas/Three.js 的高级背景特效系统，能够根据实时天气和时间自动切换背景特效，与博客的玻璃拟态设计完美融合。

## 功能特性

### 🌤️ 实时天气获取
- 自动获取用户位置的天气信息
- 支持多种天气类型：晴天、多云、雨天、雪天、雾天、雷雨、夜晚等
- 智能天气条件映射

### 🎨 动态背景特效
- **晴天**：柔和的光影波纹动画（类似水波或玻璃折射效果）
- **多云**：淡淡的云雾漂浮特效（半透明）
- **雨天**：玻璃模糊雨滴效果 + 雨滴滑落动画
- **雪天**：飘落雪花动画（粒子效果）
- **雾天**：低透明度雾气漂浮层
- **雷雨**：不规则闪电光效（偶尔闪一下）
- **夜晚**：星空粒子动画 + 流星特效

### ⏰ 时间因素
- 早晨/傍晚使用暖色调光影滤镜
- 夜晚使用冷色调 + 星光效果
- 自动时间段检测

### 🚀 性能优化
- GPU 加速动画
- 移动端自动降级
- 低性能设备优化
- 可配置特效强度

## 组件架构

### 核心组件

#### `WeatherBackground.vue`
主要的背景组件，负责渲染所有视觉效果。

```vue
<template>
  <WeatherBackground
    :weather="weatherData"
    :time-of-day="timeOfDay"
    :intensity="intensity"
    :enable-g-p-u-acceleration="true"
  />
</template>
```

**Props:**
- `weather`: 天气数据对象
- `timeOfDay`: 时间段 ('dawn' | 'morning' | 'noon' | 'afternoon' | 'dusk' | 'night')
- `intensity`: 特效强度 ('low' | 'medium' | 'high')
- `enableGPUAcceleration`: 是否启用GPU加速

#### `useWeatherBackground.ts`
天气背景管理的 Composable，提供完整的状态管理和自动更新功能。

```typescript
const {
  currentWeather,
  currentTime,
  intensity,
  enableGPUAcceleration,
  updateWeatherByLocation,
  setWeatherCondition,
  setTimeOfDay
} = useWeatherBackground()
```

## 使用方法

### 基础使用

1. **在页面中引入组件**

```vue
<template>
  <div class="relative min-h-screen">
    <!-- 动态天气背景 -->
    <WeatherBackground
      :weather="backgroundWeather"
      :time-of-day="backgroundTimeOfDay"
      :intensity="backgroundIntensity"
      :enable-g-p-u-acceleration="enableGPUAcceleration"
    />
    
    <!-- 你的内容 -->
    <div class="relative z-10">
      <!-- 页面内容 -->
    </div>
  </div>
</template>

<script setup>
const {
  currentWeather,
  currentTime,
  intensity,
  enableGPUAcceleration
} = useWeatherBackground()

const backgroundWeather = computed(() => ({
  condition: currentWeather.value.condition,
  temperature: currentWeather.value.temperature,
  humidity: currentWeather.value.humidity
}))

const backgroundTimeOfDay = computed(() => currentTime.value.period)
const backgroundIntensity = computed(() => intensity.value)
</script>
```

### 高级配置

#### 手动设置天气条件

```typescript
const { setWeatherCondition, setTimeOfDay } = useWeatherBackground()

// 设置为雨天
setWeatherCondition('rainy', 15, 85)

// 设置为夜晚
setTimeOfDay('night')
```

#### 性能优化配置

```typescript
// 检测并自动调整性能设置
const { autoAdjustIntensity } = useWeatherBackground()
autoAdjustIntensity()

// 手动设置低性能模式
const intensity = ref('low')
const enableGPUAcceleration = ref(false)
```

## 特效详解

### Canvas 粒子系统

系统使用 Canvas 2D API 创建高性能的粒子效果：

- **粒子生命周期管理**：自动创建、更新和销毁粒子
- **边界检测**：粒子碰撞边界时反弹
- **透明度动画**：基于生命周期的渐变效果
- **颜色适配**：根据天气条件自动调整粒子颜色

### CSS 动画特效

#### 玻璃雨滴效果
```css
.glass-raindrop {
  background: linear-gradient(180deg, 
    rgba(135, 206, 235, 0.8) 0%, 
    rgba(135, 206, 235, 0.4) 50%, 
    rgba(135, 206, 235, 0.1) 100%);
  backdrop-filter: blur(2px);
  animation: glass-rain-fall linear infinite;
}
```

#### 光影波纹效果
```css
.light-ripple {
  background: radial-gradient(circle, 
    rgba(255, 215, 0, 0.3) 0%, 
    rgba(255, 215, 0, 0.1) 30%, 
    transparent 70%);
  animation: light-ripple-expand ease-in-out infinite;
}
```

#### 闪电效果
```css
.lightning-bolt {
  clip-path: polygon(/* 闪电形状 */);
  animation: lightning-flash 0.1s ease-in-out;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
}
```

## 性能优化

### 自动性能检测

系统会自动检测设备性能并调整特效强度：

```typescript
const detectPerformance = () => {
  // WebGL 支持检测
  const gl = canvas.getContext('webgl')
  if (!gl) {
    isLowPerformance.value = true
    return
  }
  
  // GPU 性能检测
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
  // 根据 GPU 型号调整性能设置
}
```

### 移动端优化

- 自动检测移动设备
- 降低粒子数量
- 简化动画效果
- 禁用复杂特效

### 内存管理

- 粒子对象池
- 定时清理无效粒子
- Canvas 缓存优化

## 浏览器兼容性

- **现代浏览器**：完整功能支持
- **Safari**：部分 CSS 特效可能有差异
- **移动浏览器**：自动降级为简化版本
- **IE/旧版浏览器**：回退到静态背景

## 演示页面

访问 `/weather-demo` 查看完整的功能演示，包括：

- 实时天气条件切换
- 时间段模拟
- 特效强度调节
- 自动循环演示

## 故障排除

### 常见问题

1. **特效不显示**
   - 检查浏览器是否支持 Canvas
   - 确认 GPU 加速是否启用
   - 查看控制台错误信息

2. **性能问题**
   - 降低特效强度
   - 禁用 GPU 加速
   - 检查设备性能

3. **天气数据获取失败**
   - 检查网络连接
   - 确认地理位置权限
   - 查看 API 配置

### 调试模式

```typescript
// 启用调试模式
const { setWeatherCondition } = useWeatherBackground()

// 手动测试不同天气条件
setWeatherCondition('stormy', 20, 90)
```

## 扩展开发

### 添加新的天气效果

1. 在 `WeatherBackground.vue` 中添加新的特效组件
2. 在 `useWeatherBackground.ts` 中添加天气条件映射
3. 创建对应的 CSS 动画
4. 更新类型定义

### 自定义粒子效果

```typescript
class CustomParticle extends Particle {
  constructor(x: number, y: number, config: any) {
    super(x, y, config)
    // 自定义初始化
  }
  
  update() {
    // 自定义更新逻辑
    return super.update()
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    // 自定义绘制逻辑
  }
}
```

## 总结

动态天气背景系统为 Mindtrail 博客提供了沉浸式的视觉体验，通过智能的天气检测和高性能的特效渲染，创造出与内容完美融合的动态背景。系统具有良好的扩展性和性能优化，能够在各种设备上提供流畅的用户体验。
