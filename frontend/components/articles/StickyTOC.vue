<!--
  StickyTOC.vue - 粘性目录组件
  
  Props:
  - headings: TOCHeading[] - 标题数组
  - activeHeading: string - 当前激活的标题ID
  - collapsed: boolean - 是否折叠
  
  Features:
  - 折叠/展开动画
  - 滚动高亮
  - 平滑跳转
  - 阅读进度指示
-->

<template>
  <aside 
    class="sticky-toc fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:block"
    :class="{ 'collapsed': collapsed }"
  >
    <!-- 折叠/展开按钮 -->
    <button
      @click="toggleCollapsed"
      class="toc-toggle absolute -left-12 top-4 w-10 h-10 bg-glass-bg backdrop-blur-md border border-glass-border rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-primary-500/20 hover:border-primary-400/50 transition-all duration-200 hover:scale-110"
      :title="collapsed ? '展开目录' : '折叠目录'"
    >
      <Icon 
        :name="collapsed ? 'heroicons:chevron-left' : 'heroicons:chevron-right'" 
        class="w-5 h-5 transition-transform duration-200"
      />
    </button>

    <!-- 目录内容 -->
    <div 
      class="toc-content bg-glass-bg backdrop-blur-md border border-glass-border rounded-2xl p-4 w-64 max-h-96 overflow-y-auto transition-all duration-350"
      :class="{ 'opacity-0 pointer-events-none translate-x-full': collapsed }"
    >
      <!-- 标题 -->
      <div class="flex items-center justify-between mb-4">
        <h4 class="text-white font-medium text-sm">目录</h4>
        <div class="text-white/50 text-xs">
          {{ Math.round(readingProgress * 100) }}%
        </div>
      </div>

      <!-- 阅读进度条 -->
      <div class="w-full h-1 bg-white/10 rounded-full mb-4 overflow-hidden">
        <div 
          class="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-200 ease-out rounded-full"
          :style="{ width: `${readingProgress * 100}%` }"
        />
      </div>

      <!-- 目录列表 -->
      <nav class="toc-nav">
        <ul class="space-y-1">
          <li
            v-for="heading in headings"
            :key="heading.id"
            class="toc-item"
            :class="`level-${heading.level}`"
          >
            <a
              :href="`#${heading.id}`"
              class="toc-link block py-2 px-3 text-sm rounded-lg transition-all duration-200 hover:bg-white/10"
              :class="{
                'text-primary-400 bg-primary-500/20 border-l-2 border-primary-400': activeHeading === heading.id,
                'text-white/70 hover:text-white': activeHeading !== heading.id
              }"
              @click.prevent="scrollToHeading(heading.id)"
            >
              <span class="block truncate">{{ heading.text }}</span>
            </a>
          </li>
        </ul>
      </nav>

      <!-- 快捷操作 -->
      <div class="mt-4 pt-4 border-t border-white/10">
        <div class="flex items-center justify-between">
          <button
            @click="scrollToTop"
            class="flex items-center space-x-2 text-white/60 hover:text-white text-xs transition-colors duration-200"
          >
            <Icon name="heroicons:arrow-up" class="w-3 h-3" />
            <span>回到顶部</span>
          </button>
          
          <button
            @click="scrollToBottom"
            class="flex items-center space-x-2 text-white/60 hover:text-white text-xs transition-colors duration-200"
          >
            <Icon name="heroicons:arrow-down" class="w-3 h-3" />
            <span>文章底部</span>
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
interface TOCHeading {
  id: string
  text: string
  level: number
  element?: HTMLElement
}

interface Props {
  headings: TOCHeading[]
  activeHeading?: string
  readingProgress?: number
  collapsed?: boolean
}

interface Emits {
  toggleCollapsed: []
  headingClick: [id: string]
  scrollToTop: []
  scrollToBottom: []
}

const props = withDefaults(defineProps<Props>(), {
  activeHeading: '',
  readingProgress: 0,
  collapsed: false
})

const emit = defineEmits<Emits>()

// 内部状态
const internalCollapsed = ref(props.collapsed)

// 监听 collapsed prop 变化
watch(() => props.collapsed, (newValue) => {
  internalCollapsed.value = newValue
})

// 计算属性
const collapsed = computed({
  get: () => internalCollapsed.value,
  set: (value) => {
    internalCollapsed.value = value
    emit('toggleCollapsed')
  }
})

// 切换折叠状态
const toggleCollapsed = () => {
  collapsed.value = !collapsed.value
}

// 滚动到指定标题
const scrollToHeading = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    const offsetTop = element.offsetTop - 100 // 留出一些顶部空间
    
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    })
    
    emit('headingClick', id)
  }
}

// 滚动到顶部
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
  emit('scrollToTop')
}

// 滚动到底部
const scrollToBottom = () => {
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: 'smooth'
  })
  emit('scrollToBottom')
}

// 键盘快捷键支持
onMounted(() => {
  const handleKeydown = (event: KeyboardEvent) => {
    // Ctrl/Cmd + Shift + T 切换目录
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'T') {
      event.preventDefault()
      toggleCollapsed()
    }
    
    // Ctrl/Cmd + Home 回到顶部
    if ((event.ctrlKey || event.metaKey) && event.key === 'Home') {
      event.preventDefault()
      scrollToTop()
    }
    
    // Ctrl/Cmd + End 到底部
    if ((event.ctrlKey || event.metaKey) && event.key === 'End') {
      event.preventDefault()
      scrollToBottom()
    }
  }
  
  document.addEventListener('keydown', handleKeydown)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })
})
</script>

<style scoped>
.sticky-toc {
  transition: all 0.35s ease;
}

.toc-content {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
}

.toc-content::-webkit-scrollbar {
  width: 4px;
}

.toc-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.toc-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.toc-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* 不同级别标题的缩进 */
.toc-item.level-1 .toc-link {
  padding-left: 0.75rem;
  font-weight: 600;
}

.toc-item.level-2 .toc-link {
  padding-left: 1.5rem;
  font-weight: 500;
}

.toc-item.level-3 .toc-link {
  padding-left: 2.25rem;
  font-weight: 400;
}

.toc-item.level-4 .toc-link {
  padding-left: 3rem;
  font-weight: 400;
  font-size: 0.8125rem;
}

.toc-item.level-5 .toc-link,
.toc-item.level-6 .toc-link {
  padding-left: 3.75rem;
  font-weight: 400;
  font-size: 0.75rem;
}

/* 激活状态的特殊样式 */
.toc-link.text-primary-400 {
  position: relative;
}

.toc-link.text-primary-400::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 2px;
  height: 60%;
  background: linear-gradient(to bottom, theme('colors.primary.400'), theme('colors.secondary.400'));
  border-radius: 1px;
}

/* 悬浮动画 */
.toc-toggle:hover {
  transform: scale(1.1);
}

/* 响应式隐藏 */
@media (max-width: 1279px) {
  .sticky-toc {
    display: none;
  }
}

/* 减少动画的用户偏好 */
@media (prefers-reduced-motion: reduce) {
  .sticky-toc,
  .toc-content,
  .toc-link,
  .toc-toggle {
    transition: none;
  }
}
</style>
