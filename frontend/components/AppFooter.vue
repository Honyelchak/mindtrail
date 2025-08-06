<template>
  <footer class="glass-nav border-t border-neutral-200/50 dark:border-neutral-700/50">
    <div class="container mx-auto px-4 py-6">
      <div class="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        <!-- 左侧：版权信息 -->
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                © {{ currentYear }} Mindtrail
              </p>
              <p class="text-xs text-neutral-500 dark:text-neutral-400">
                记录生活，追踪回忆
              </p>
            </div>
          </div>
        </div>

        <!-- 中间：快速链接 -->
        <div class="hidden md:flex items-center space-x-6">
          <NuxtLink 
            v-for="link in quickLinks" 
            :key="link.name"
            :to="link.href" 
            class="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
          >
            {{ link.name }}
          </NuxtLink>
        </div>

        <!-- 右侧：社交链接和状态 -->
        <div class="flex items-center space-x-4">
          <!-- 在线状态指示器 -->
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span class="text-xs text-neutral-500 dark:text-neutral-400">在线</span>
          </div>

          <!-- 社交链接 -->
          <div class="flex items-center space-x-2">
            <a 
              v-for="social in socialLinks" 
              :key="social.name"
              :href="social.href" 
              :title="social.name"
              target="_blank"
              rel="noopener noreferrer"
              class="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center hover:bg-primary-100 dark:hover:bg-primary-900/20 transition-colors duration-200"
            >
              <component :is="social.icon" class="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
            </a>
          </div>
        </div>
      </div>

      <!-- 移动端快速链接 -->
      <div class="md:hidden mt-4 pt-4 border-t border-neutral-200/50 dark:border-neutral-700/50">
        <div class="flex flex-wrap justify-center gap-4">
          <NuxtLink 
            v-for="link in quickLinks" 
            :key="link.name"
            :to="link.href" 
            class="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
          >
            {{ link.name }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { 
  HeartIcon,
  CodeBracketIcon,
  RssIcon
} from '@heroicons/vue/24/outline'

// 当前年份
const currentYear = new Date().getFullYear()

// 快速链接
const quickLinks = [
  { name: '关于', href: '/about' },
  { name: '隐私政策', href: '/privacy' },
  { name: '使用条款', href: '/terms' },
  { name: 'RSS', href: '/rss.xml' },
]

// 社交链接
const socialLinks = [
  { name: 'GitHub', href: 'https://github.com', icon: CodeBracketIcon },
  { name: 'RSS', href: '/rss.xml', icon: RssIcon },
  { name: '赞助', href: '/sponsor', icon: HeartIcon },
]
</script>

<style scoped>
/* 页脚特定样式 */
.container {
  max-width: 1200px;
}
</style>
