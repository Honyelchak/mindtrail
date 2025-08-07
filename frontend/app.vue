<script setup>
// 全局样式和配置
useHead({
  htmlAttrs: {
    lang: 'zh-CN',
  },
})
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
/* 导入主样式文件 */
@import '~/assets/css/main.css';
</style>
