<template>
  <div class="min-h-screen">
    <!-- 页面头部 -->
    <div class="mb-8">
      <div class="text-center mb-6">
        <h1 class="text-4xl font-bold text-gradient mb-2">Mindtrail</h1>
        <p class="text-lg text-neutral-600 dark:text-neutral-400">
          记录生活的每一个瞬间
        </p>
      </div>

      <!-- 统计信息 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="neu-card p-4 text-center">
          <div
            class="text-2xl font-bold text-primary-600 dark:text-primary-400"
          >
            6
          </div>
          <div class="text-sm text-neutral-500 dark:text-neutral-400">
            总记录
          </div>
        </div>
        <div class="neu-card p-4 text-center">
          <div
            class="text-2xl font-bold text-secondary-600 dark:text-secondary-400"
          >
            2
          </div>
          <div class="text-sm text-neutral-500 dark:text-neutral-400">文章</div>
        </div>
        <div class="neu-card p-4 text-center">
          <div class="text-2xl font-bold text-accent-600 dark:text-accent-400">
            2
          </div>
          <div class="text-sm text-neutral-500 dark:text-neutral-400">说说</div>
        </div>
        <div class="neu-card p-4 text-center">
          <div class="text-2xl font-bold text-green-600 dark:text-green-400">
            2
          </div>
          <div class="text-sm text-neutral-500 dark:text-neutral-400">相册</div>
        </div>
      </div>
    </div>

    <!-- 过滤器 -->
    <TimelineFilters
      v-model:selectedType="selectedType"
      v-model:selectedTags="selectedTags"
      v-model:selectedEmotion="selectedEmotion"
      :available-tags="availableTags"
      :available-emotions="availableEmotions"
    />

    <!-- 时间流内容 -->
    <div class="space-y-6">
      <TimelineItem
        v-for="item in filteredTimeline"
        :key="item.id"
        :item="item"
      />

      <!-- 加载更多 -->
      <div v-if="hasMore" class="text-center py-8">
        <button
          @click="loadMore"
          class="neu-button px-6 py-3"
          :disabled="loading"
        >
          {{ loading ? '加载中...' : '加载更多' }}
        </button>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredTimeline.length === 0" class="text-center py-12">
        <div class="neu-card p-8 max-w-md mx-auto">
          <div class="text-6xl mb-4">📝</div>
          <h3 class="text-lg font-semibold mb-2">暂无内容</h3>
          <p class="text-neutral-600 dark:text-neutral-400 mb-4">
            开始创建你的第一条记录吧！
          </p>
          <NuxtLink to="/create" class="neu-button px-6 py-3">
            创建内容
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 页面元数据
useHead({
  title: 'Mindtrail - 记录型博客系统',
  meta: [
    {
      name: 'description',
      content:
        'Mindtrail 是一个记录型博客系统，强调说说、正文、相册打点，支持地图打点、情绪记录、标签过滤等功能。',
    },
  ],
})

// 使用 Timeline Composable
const { timeline, loadMockData, loading } = useTimeline()

// 过滤器状态
const selectedType = ref('')
const selectedTags = ref([])
const selectedEmotion = ref('')

// 分页状态
const hasMore = ref(true)

// 计算属性
const filteredTimeline = computed(() => {
  let filtered = timeline.value

  // 按类型过滤
  if (selectedType.value) {
    filtered = filtered.filter((item) => item.type === selectedType.value)
  }

  // 按标签过滤
  if (selectedTags.value.length > 0) {
    filtered = filtered.filter((item) =>
      selectedTags.value.some((tag) => item.tags?.includes(tag))
    )
  }

  // 按情绪过滤
  if (selectedEmotion.value) {
    filtered = filtered.filter(
      (item) => item.emotion?.type === selectedEmotion.value
    )
  }

  return filtered
})

const availableTags = computed(() => {
  const tags = new Set()
  timeline.value.forEach((item) => {
    item.tags?.forEach((tag) => tags.add(tag))
  })
  return Array.from(tags)
})

const availableEmotions = computed(() => {
  const emotions = new Set()
  timeline.value.forEach((item) => {
    if (item.emotion?.type) {
      emotions.add(item.emotion.type)
    }
  })
  return Array.from(emotions)
})

// 方法
const loadMore = () => {
  // 模拟加载更多
  console.log('Loading more content...')
  hasMore.value = false
}

// 页面加载时获取数据
onMounted(() => {
  loadMockData()
})
</script>
