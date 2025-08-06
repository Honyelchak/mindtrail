<template>
  <div class="min-h-screen">
    <div class="text-center py-12">
      <div class="neu-card p-8 max-w-md mx-auto">
        <div class="text-secondary-500 mb-4">
          <PhotoIcon class="w-16 h-16 mx-auto" />
        </div>
        <h1 class="text-2xl font-bold mb-2">相册</h1>
        <p class="text-neutral-600 dark:text-neutral-400 mb-4">
          用镜头记录美好瞬间，分享生活中的精彩画面。
        </p>
        <div class="text-sm text-neutral-500 dark:text-neutral-400">
          功能开发中...
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { PhotoIcon } from '@heroicons/vue/24/outline'

useHead({
  title: '相册 - Mindtrail',
  meta: [
    { name: 'description', content: '用镜头记录美好瞬间，分享生活中的精彩画面。' }
  ]
})
</script>
