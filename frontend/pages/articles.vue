<template>
  <div class="min-h-screen">
    <div class="text-center py-12">
      <div class="neu-card p-8 max-w-md mx-auto">
        <div class="text-primary-500 mb-4">
          <DocumentTextIcon class="w-16 h-16 mx-auto" />
        </div>
        <h1 class="text-2xl font-bold mb-2">文章</h1>
        <p class="text-neutral-600 dark:text-neutral-400 mb-4">
          深度思考和技术分享，记录学习和成长的过程。
        </p>
        <div class="text-sm text-neutral-500 dark:text-neutral-400">
          功能开发中...
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { DocumentTextIcon } from '@heroicons/vue/24/outline'

useHead({
  title: '文章 - Mindtrail',
  meta: [
    { name: 'description', content: '深度思考和技术分享，记录学习和成长的过程。' }
  ]
})
</script>
