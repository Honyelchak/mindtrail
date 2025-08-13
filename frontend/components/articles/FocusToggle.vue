<!--
  FocusToggle.vue - 专注模式切换组件
  
  Props:
  - focusMode: boolean - 是否为专注模式
  - position: 'fixed' | 'inline' - 定位方式
  
  Features:
  - 专注模式切换
  - 字体大小调节
  - 主题切换
  - 键盘快捷键支持
-->

<template>
  <div 
    class="focus-toggle"
    :class="{
      'fixed left-6 top-1/2 -translate-y-1/2 z-40': position === 'fixed',
      'inline-block': position === 'inline'
    }"
  >
    <!-- 主控制面板 -->
    <div 
      class="control-panel bg-glass-bg backdrop-blur-md border border-glass-border rounded-2xl p-4 shadow-glass-lg"
      :class="{
        'w-16 hover:w-64 transition-all duration-350': position === 'fixed' && !expanded,
        'w-64': position === 'fixed' && expanded,
        'w-full max-w-sm': position === 'inline'
      }"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <!-- 专注模式切换 -->
      <div class="flex items-center justify-between mb-4">
        <div 
          class="flex items-center space-x-3"
          :class="{ 'opacity-0': position === 'fixed' && !expanded && !isHovered }"
        >
          <Icon 
            name="heroicons:eye" 
            class="w-5 h-5 text-primary-400 flex-shrink-0"
          />
          <span class="text-white font-medium text-sm whitespace-nowrap">专注模式</span>
        </div>
        
        <button
          @click="toggleFocusMode"
          class="focus-toggle-btn relative w-12 h-6 bg-white/20 rounded-full transition-all duration-200 hover:bg-white/30"
          :class="{ 'bg-primary-500 hover:bg-primary-600': focusMode }"
          :title="focusMode ? '退出专注模式' : '进入专注模式'"
        >
          <div 
            class="toggle-thumb absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200"
            :class="{ 'translate-x-6': focusMode }"
          />
        </button>
      </div>

      <!-- 字体大小控制 -->
      <div 
        class="font-size-control mb-4"
        :class="{ 'opacity-0 pointer-events-none': position === 'fixed' && !expanded && !isHovered }"
      >
        <div class="flex items-center justify-between mb-2">
          <span class="text-white/70 text-xs">字体大小</span>
          <span class="text-white/50 text-xs">{{ fontSizeLabels[fontSize] }}</span>
        </div>
        
        <div class="flex items-center space-x-2">
          <button
            @click="decreaseFontSize"
            :disabled="fontSize <= 0"
            class="w-8 h-8 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center justify-center text-white/70 hover:text-white transition-all duration-200"
          >
            <Icon name="heroicons:minus" class="w-4 h-4" />
          </button>
          
          <div class="flex-1 px-2">
            <input
              type="range"
              :value="fontSize"
              min="0"
              max="4"
              step="1"
              @input="setFontSize($event.target.value)"
              class="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer slider"
            />
          </div>
          
          <button
            @click="increaseFontSize"
            :disabled="fontSize >= 4"
            class="w-8 h-8 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center justify-center text-white/70 hover:text-white transition-all duration-200"
          >
            <Icon name="heroicons:plus" class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- 阅读偏好 -->
      <div 
        class="reading-preferences"
        :class="{ 'opacity-0 pointer-events-none': position === 'fixed' && !expanded && !isHovered }"
      >
        <div class="space-y-3">
          <!-- 行间距 -->
          <div class="flex items-center justify-between">
            <span class="text-white/70 text-xs">行间距</span>
            <div class="flex items-center space-x-1">
              <button
                v-for="spacing in lineSpacings"
                :key="spacing.value"
                @click="setLineSpacing(spacing.value)"
                class="w-6 h-6 rounded text-xs transition-all duration-200"
                :class="{
                  'bg-primary-500 text-white': lineSpacing === spacing.value,
                  'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white': lineSpacing !== spacing.value
                }"
                :title="`行间距: ${spacing.label}`"
              >
                {{ spacing.label }}
              </button>
            </div>
          </div>

          <!-- 页面宽度 -->
          <div class="flex items-center justify-between">
            <span class="text-white/70 text-xs">页面宽度</span>
            <div class="flex items-center space-x-1">
              <button
                v-for="width in pageWidths"
                :key="width.value"
                @click="setPageWidth(width.value)"
                class="px-2 py-1 rounded text-xs transition-all duration-200"
                :class="{
                  'bg-primary-500 text-white': pageWidth === width.value,
                  'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white': pageWidth !== width.value
                }"
                :title="`页面宽度: ${width.label}`"
              >
                {{ width.label }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 快捷键提示 -->
      <div 
        class="shortcuts-hint mt-4 pt-4 border-t border-white/10"
        :class="{ 'opacity-0 pointer-events-none': position === 'fixed' && !expanded && !isHovered }"
      >
        <div class="text-white/50 text-xs space-y-1">
          <div class="flex items-center justify-between">
            <span>专注模式</span>
            <kbd class="px-1 py-0.5 bg-white/10 rounded text-xs">F</kbd>
          </div>
          <div class="flex items-center justify-between">
            <span>字体大小</span>
            <div class="space-x-1">
              <kbd class="px-1 py-0.5 bg-white/10 rounded text-xs">+</kbd>
              <kbd class="px-1 py-0.5 bg-white/10 rounded text-xs">-</kbd>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  focusMode?: boolean
  position?: 'fixed' | 'inline'
}

interface Emits {
  toggleFocusMode: []
  fontSizeChange: [size: number]
  lineSpacingChange: [spacing: number]
  pageWidthChange: [width: string]
}

const props = withDefaults(defineProps<Props>(), {
  focusMode: false,
  position: 'fixed'
})

const emit = defineEmits<Emits>()

// 响应式状态
const expanded = ref(false)
const isHovered = ref(false)
const fontSize = ref(2) // 0-4 对应不同字体大小
const lineSpacing = ref(1.6)
const pageWidth = ref('normal')

// 配置选项
const fontSizeLabels = ['很小', '小', '正常', '大', '很大']
const lineSpacings = [
  { value: 1.4, label: '紧' },
  { value: 1.6, label: '中' },
  { value: 1.8, label: '松' }
]
const pageWidths = [
  { value: 'narrow', label: '窄' },
  { value: 'normal', label: '中' },
  { value: 'wide', label: '宽' }
]

// 鼠标事件处理
const handleMouseEnter = () => {
  if (props.position === 'fixed') {
    isHovered.value = true
  }
}

const handleMouseLeave = () => {
  if (props.position === 'fixed') {
    isHovered.value = false
  }
}

// 专注模式切换
const toggleFocusMode = () => {
  emit('toggleFocusMode')
}

// 字体大小控制
const increaseFontSize = () => {
  if (fontSize.value < 4) {
    fontSize.value++
    emit('fontSizeChange', fontSize.value)
  }
}

const decreaseFontSize = () => {
  if (fontSize.value > 0) {
    fontSize.value--
    emit('fontSizeChange', fontSize.value)
  }
}

const setFontSize = (size: string) => {
  fontSize.value = parseInt(size)
  emit('fontSizeChange', fontSize.value)
}

// 行间距设置
const setLineSpacing = (spacing: number) => {
  lineSpacing.value = spacing
  emit('lineSpacingChange', spacing)
}

// 页面宽度设置
const setPageWidth = (width: string) => {
  pageWidth.value = width
  emit('pageWidthChange', width)
}

// 键盘快捷键
onMounted(() => {
  const handleKeydown = (event: KeyboardEvent) => {
    // F 键切换专注模式
    if (event.key === 'f' || event.key === 'F') {
      if (!event.ctrlKey && !event.metaKey && !event.altKey) {
        const target = event.target as HTMLElement
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          event.preventDefault()
          toggleFocusMode()
        }
      }
    }
    
    // + 键增大字体
    if (event.key === '+' || event.key === '=') {
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault()
        increaseFontSize()
      }
    }
    
    // - 键减小字体
    if (event.key === '-') {
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault()
        decreaseFontSize()
      }
    }
  }
  
  document.addEventListener('keydown', handleKeydown)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })
})
</script>

<style scoped>
/* 滑块样式 */
.slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  background: theme('colors.primary.500');
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
}

.slider::-webkit-slider-thumb:hover {
  background: theme('colors.primary.400');
  transform: scale(1.1);
}

.slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: theme('colors.primary.500');
  border-radius: 50%;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
}

.slider::-moz-range-thumb:hover {
  background: theme('colors.primary.400');
  transform: scale(1.1);
}

/* 控制面板动画 */
.control-panel {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 切换按钮动画 */
.focus-toggle-btn {
  position: relative;
  overflow: hidden;
}

.focus-toggle-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.focus-toggle-btn:hover::before {
  transform: translateX(100%);
}

.toggle-thumb {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* 键盘快捷键样式 */
kbd {
  font-family: theme('fontFamily.mono');
  font-size: 0.75rem;
  font-weight: 500;
}

/* 响应式调整 */
@media (max-width: 1279px) {
  .focus-toggle[class*="fixed"] {
    display: none;
  }
}

/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  .control-panel,
  .toggle-thumb,
  .slider::-webkit-slider-thumb,
  .slider::-moz-range-thumb {
    transition: none;
  }
  
  .focus-toggle-btn::before {
    display: none;
  }
}
</style>
