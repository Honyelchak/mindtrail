<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    <button
      v-for="action in actions"
      :key="action.key"
      @click="handleAction(action)"
      class="group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-neu-large"
      :class="action.bgClass"
    >
      <!-- 背景装饰 -->
      <div class="absolute inset-0 bg-gradient-to-br opacity-10 group-hover:opacity-20 transition-opacity">
        <div class="absolute top-0 right-0 w-16 h-16 rounded-full blur-xl" :class="action.accentClass" />
      </div>
      
      <!-- 图标 -->
      <div class="relative z-10 mb-4">
        <div 
          class="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
          :class="action.iconBgClass"
        >
          <component 
            :is="action.icon" 
            class="w-6 h-6 text-white"
          />
        </div>
      </div>
      
      <!-- 文字内容 -->
      <div class="relative z-10 text-left">
        <h3 class="font-semibold text-gray-800 dark:text-gray-200 mb-1 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
          {{ action.title }}
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
          {{ action.description }}
        </p>
      </div>
      
      <!-- 快捷键提示 -->
      <div v-if="action.shortcut" class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <span class="text-xs px-2 py-1 bg-black/20 dark:bg-white/20 rounded-full text-gray-600 dark:text-gray-400">
          {{ action.shortcut }}
        </span>
      </div>
      
      <!-- 悬浮效果 -->
      <div class="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity" :class="action.hoverGradient" />
    </button>
  </div>
</template>

<script setup lang="ts">
import {
  PencilSquareIcon,
  DocumentTextIcon,
  PhotoIcon,
  MapIcon
} from '@heroicons/vue/24/outline'

interface QuickAction {
  key: string
  title: string
  description: string
  icon: any
  bgClass: string
  iconBgClass: string
  accentClass: string
  hoverGradient: string
  shortcut?: string
  route?: string
  action?: () => void
}

interface Emits {
  (e: 'action-click', action: QuickAction): void
}

const emit = defineEmits<Emits>()

// 快速操作配置
const actions = computed((): QuickAction[] => [
  {
    key: 'moment',
    title: '写说说',
    description: '记录此刻想法',
    icon: PencilSquareIcon,
    bgClass: 'glass-card bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
    iconBgClass: 'bg-gradient-to-r from-green-500 to-emerald-600',
    accentClass: 'bg-green-400',
    hoverGradient: 'from-green-500 to-emerald-500',
    shortcut: 'Ctrl+M',
    route: '/create/moment'
  },
  {
    key: 'article',
    title: '写文章',
    description: '深度思考记录',
    icon: DocumentTextIcon,
    bgClass: 'glass-card bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
    iconBgClass: 'bg-gradient-to-r from-blue-500 to-indigo-600',
    accentClass: 'bg-blue-400',
    hoverGradient: 'from-blue-500 to-indigo-500',
    shortcut: 'Ctrl+N',
    route: '/create/article'
  },
  {
    key: 'gallery',
    title: '上传相册',
    description: '分享精彩瞬间',
    icon: PhotoIcon,
    bgClass: 'glass-card bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
    iconBgClass: 'bg-gradient-to-r from-purple-500 to-pink-600',
    accentClass: 'bg-purple-400',
    hoverGradient: 'from-purple-500 to-pink-500',
    shortcut: 'Ctrl+U',
    route: '/create/gallery'
  },
  {
    key: 'map',
    title: '查看地图',
    description: '探索足迹轨迹',
    icon: MapIcon,
    bgClass: 'glass-card bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20',
    iconBgClass: 'bg-gradient-to-r from-orange-500 to-red-600',
    accentClass: 'bg-orange-400',
    hoverGradient: 'from-orange-500 to-red-500',
    shortcut: 'Ctrl+L',
    route: '/map'
  }
])

// 处理操作点击
const handleAction = (action: QuickAction): void => {
  emit('action-click', action)
  
  if (action.route) {
    navigateTo(action.route)
  } else if (action.action) {
    action.action()
  }
}

// 键盘快捷键处理
const handleKeydown = (event: KeyboardEvent): void => {
  if (!event.ctrlKey && !event.metaKey) return
  
  const shortcuts: Record<string, string> = {
    'm': 'moment',
    'n': 'article', 
    'u': 'gallery',
    'l': 'map'
  }
  
  const actionKey = shortcuts[event.key.toLowerCase()]
  if (actionKey) {
    event.preventDefault()
    const action = actions.value.find(a => a.key === actionKey)
    if (action) {
      handleAction(action)
    }
  }
}

// 生命周期
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
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
}

.dark .glass-card {
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

/* 悬浮阴影效果 */
.shadow-neu-large {
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.15),
    0 8px 16px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.dark .shadow-neu-large {
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.4),
    0 8px 16px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}
</style>
