<template>
  <div class="min-h-screen">
    <div class="text-center py-12">
      <div class="neu-card p-8 max-w-md mx-auto">
        <div class="text-accent-500 mb-4">
          <ChatBubbleLeftRightIcon class="w-16 h-16 mx-auto" />
        </div>
        <h1 class="text-2xl font-bold mb-2">说说</h1>
        <p class="text-neutral-600 dark:text-neutral-400 mb-4">
          记录生活中的点点滴滴，分享此刻的心情和想法。
        </p>
        <div class="text-sm text-neutral-500 dark:text-neutral-400">
          功能开发中...
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ChatBubbleLeftRightIcon } from '@heroicons/vue/24/outline'

useHead({
  title: '说说 - Mindtrail',
  meta: [
    { name: 'description', content: '记录生活中的点点滴滴，分享此刻的心情和想法。' }
  ]
})
</script>
