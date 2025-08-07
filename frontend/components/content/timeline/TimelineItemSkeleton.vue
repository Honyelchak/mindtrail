<template>
  <div class="neu-card p-6 animate-pulse">
    <!-- 头部信息骨架 -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center space-x-3">
        <!-- 类型图标骨架 -->
        <div class="w-10 h-10 rounded-xl bg-neutral-200 dark:bg-neutral-700"></div>
        
        <!-- 作者和时间信息骨架 -->
        <div>
          <div class="flex items-center space-x-2 mb-1">
            <div class="w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
            <div class="w-16 h-4 rounded bg-neutral-200 dark:bg-neutral-700"></div>
            <div class="w-1 h-1 rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
            <div class="w-20 h-4 rounded bg-neutral-200 dark:bg-neutral-700"></div>
          </div>
          
          <!-- 位置信息骨架 -->
          <div class="flex items-center space-x-1">
            <div class="w-4 h-4 rounded bg-neutral-200 dark:bg-neutral-700"></div>
            <div class="w-24 h-3 rounded bg-neutral-200 dark:bg-neutral-700"></div>
          </div>
        </div>
      </div>

      <!-- 情绪指示器骨架 -->
      <div class="w-16 h-6 rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
    </div>

    <!-- 内容区域骨架 -->
    <div class="mb-4">
      <!-- 标题骨架 -->
      <div class="w-3/4 h-6 rounded bg-neutral-200 dark:bg-neutral-700 mb-2"></div>

      <!-- 内容骨架 -->
      <div class="space-y-2">
        <div class="w-full h-4 rounded bg-neutral-200 dark:bg-neutral-700"></div>
        <div class="w-5/6 h-4 rounded bg-neutral-200 dark:bg-neutral-700"></div>
        <div class="w-4/5 h-4 rounded bg-neutral-200 dark:bg-neutral-700"></div>
      </div>

      <!-- 阅读时间骨架 -->
      <div class="flex items-center space-x-1 mt-2">
        <div class="w-4 h-4 rounded bg-neutral-200 dark:bg-neutral-700"></div>
        <div class="w-20 h-3 rounded bg-neutral-200 dark:bg-neutral-700"></div>
      </div>
    </div>

    <!-- 媒体内容骨架 -->
    <div class="mb-4">
      <div class="grid grid-cols-3 gap-2">
        <div class="w-full h-32 rounded-lg bg-neutral-200 dark:bg-neutral-700"></div>
        <div class="w-full h-32 rounded-lg bg-neutral-200 dark:bg-neutral-700"></div>
        <div class="w-full h-32 rounded-lg bg-neutral-200 dark:bg-neutral-700"></div>
      </div>
    </div>

    <!-- 标签骨架 -->
    <div class="mb-4">
      <div class="flex flex-wrap gap-2">
        <div class="w-12 h-5 rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
        <div class="w-16 h-5 rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
        <div class="w-14 h-5 rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
        <div class="w-18 h-5 rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
      </div>
    </div>

    <!-- 底部操作栏骨架 -->
    <div class="flex items-center justify-between pt-4 border-t border-neutral-200/50 dark:border-neutral-700/50">
      <!-- 统计信息骨架 -->
      <div class="flex items-center space-x-4">
        <div class="flex items-center space-x-1">
          <div class="w-4 h-4 rounded bg-neutral-200 dark:bg-neutral-700"></div>
          <div class="w-6 h-3 rounded bg-neutral-200 dark:bg-neutral-700"></div>
        </div>
        <div class="flex items-center space-x-1">
          <div class="w-4 h-4 rounded bg-neutral-200 dark:bg-neutral-700"></div>
          <div class="w-6 h-3 rounded bg-neutral-200 dark:bg-neutral-700"></div>
        </div>
        <div class="flex items-center space-x-1">
          <div class="w-4 h-4 rounded bg-neutral-200 dark:bg-neutral-700"></div>
          <div class="w-6 h-3 rounded bg-neutral-200 dark:bg-neutral-700"></div>
        </div>
      </div>

      <!-- 操作按钮骨架 -->
      <div class="flex items-center space-x-2">
        <div class="w-8 h-8 rounded-lg bg-neutral-200 dark:bg-neutral-700"></div>
        <div class="w-8 h-8 rounded-lg bg-neutral-200 dark:bg-neutral-700"></div>
        <div class="w-8 h-8 rounded-lg bg-neutral-200 dark:bg-neutral-700"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 骨架屏组件不需要任何逻辑
</script>

<style scoped>
/* 自定义脉冲动画 */
@keyframes skeleton-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

.animate-pulse {
  animation: skeleton-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* 骨架元素的渐变效果 */
.neu-card .bg-neutral-200,
.neu-card .bg-neutral-700 {
  background: linear-gradient(90deg, 
    var(--color-bg-secondary) 25%, 
    var(--color-bg-tertiary) 50%, 
    var(--color-bg-secondary) 75%);
  background-size: 200% 100%;
  animation: skeleton-shimmer 2s infinite;
}

@keyframes skeleton-shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>
