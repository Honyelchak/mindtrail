<template>
  <div class="sticky top-8">
    <div class="neu-card p-4">
      <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-4 flex items-center space-x-2">
        <ListBulletIcon class="w-5 h-5" />
        <span>目录</span>
      </h3>
      
      <nav class="space-y-1">
        <a
          v-for="heading in headings"
          :key="heading.id"
          :href="`#${heading.id}`"
          class="block py-2 px-3 text-sm rounded-lg transition-all duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          :class="[
            `ml-${(heading.level - 1) * 4}`,
            {
              'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20': activeHeading === heading.id,
              'text-neutral-600 dark:text-neutral-400': activeHeading !== heading.id
            }
          ]"
          @click="scrollToHeading(heading.id)"
        >
          {{ heading.text }}
        </a>
      </nav>

      <!-- 阅读进度 -->
      <div class="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-700">
        <div class="flex items-center justify-between text-sm text-neutral-500 dark:text-neutral-400 mb-2">
          <span>阅读进度</span>
          <span>{{ Math.round(readingProgress) }}%</span>
        </div>
        <div class="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
          <div 
            class="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${readingProgress}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ListBulletIcon } from '@heroicons/vue/24/outline'

// Props
const props = defineProps({
  content: {
    type: String,
    required: true
  }
})

// 响应式数据
const headings = ref([])
const activeHeading = ref('')
const readingProgress = ref(0)

// 提取标题
const extractHeadings = () => {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm
  const matches = []
  let match

  while ((match = headingRegex.exec(props.content)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    const id = text.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    
    matches.push({
      level,
      text,
      id
    })
  }

  headings.value = matches
}

// 滚动到指定标题
const scrollToHeading = (id) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }
}

// 监听滚动，更新当前激活的标题和阅读进度
const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const documentHeight = document.documentElement.scrollHeight - window.innerHeight
  
  // 更新阅读进度
  readingProgress.value = Math.min((scrollTop / documentHeight) * 100, 100)

  // 更新激活的标题
  const headingElements = headings.value.map(h => document.getElementById(h.id)).filter(Boolean)
  
  for (let i = headingElements.length - 1; i >= 0; i--) {
    const element = headingElements[i]
    if (element && element.offsetTop <= scrollTop + 100) {
      activeHeading.value = element.id
      break
    }
  }
}

// 监听内容变化
watch(() => props.content, () => {
  extractHeadings()
}, { immediate: true })

// 生命周期
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* 动态缩进样式 */
.ml-0 { margin-left: 0; }
.ml-4 { margin-left: 1rem; }
.ml-8 { margin-left: 2rem; }
.ml-12 { margin-left: 3rem; }
.ml-16 { margin-left: 4rem; }
.ml-20 { margin-left: 5rem; }
</style>
