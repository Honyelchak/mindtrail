<template>
  <div class="min-h-screen relative overflow-hidden -mx-4 -my-8">
    <!-- 动态背景 -->
    <div class="fixed inset-0 z-0">
      <!-- 渐变背景 -->
      <div
        class="absolute inset-0 transition-all duration-500"
        :class="
          $colorMode.value === 'dark'
            ? 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900'
            : 'bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50'
        "
      />

      <!-- 动态光斑 -->
      <div class="absolute inset-0 overflow-hidden">
        <div
          v-for="(particle, index) in backgroundParticles"
          :key="`particle-${index}`"
          class="absolute rounded-full bg-gradient-radial from-white/20 to-transparent animate-float-slow"
          :style="{
            left: particle.x + '%',
            top: particle.y + '%',
            width: particle.size + 'px',
            height: particle.size + 'px',
            animationDelay: particle.delay + 's',
            animationDuration: particle.duration + 's',
          }"
        />
      </div>

      <!-- 模糊圆形装饰 -->
      <div
        class="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
      />
      <div
        class="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
        style="animation-delay: 2s"
      />
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse"
        style="animation-delay: 4s"
      />
    </div>

    <!-- 主要内容 -->
    <div class="relative z-10 pt-16">
      <!-- 顶部信息栏 -->
      <div class="container mx-auto px-4 py-8">
        <div
          class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8"
        >
          <!-- 左侧标题 -->
          <div class="mb-6 lg:mb-0">
            <h1
              class="text-4xl md:text-5xl font-bold mb-2 transition-colors duration-300"
              :class="
                $colorMode.value === 'dark' ? 'text-white' : 'text-gray-900'
              "
            >
              生活说说
            </h1>
            <p
              :class="
                $colorMode.value === 'dark' ? 'text-white/70' : 'text-gray-600'
              "
              class="text-lg"
            >
              记录生活中的点点滴滴，分享内心的感悟与思考
            </p>
          </div>

          <!-- 右侧统计信息 -->
          <div class="flex items-center space-x-6">
            <div class="text-center">
              <div
                :class="
                  $colorMode.value === 'dark' ? 'text-white' : 'text-gray-900'
                "
                class="text-2xl font-bold"
              >
                {{ statistics.total }}
              </div>
              <div
                :class="
                  $colorMode.value === 'dark'
                    ? 'text-white/60'
                    : 'text-gray-500'
                "
                class="text-sm"
              >
                总数
              </div>
            </div>
            <div class="text-center">
              <div
                :class="
                  $colorMode.value === 'dark' ? 'text-white' : 'text-gray-900'
                "
                class="text-2xl font-bold"
              >
                {{ todayCount }}
              </div>
              <div
                :class="
                  $colorMode.value === 'dark'
                    ? 'text-white/60'
                    : 'text-gray-500'
                "
                class="text-sm"
              >
                今日
              </div>
            </div>
            <div class="text-center">
              <div
                :class="
                  $colorMode.value === 'dark' ? 'text-white' : 'text-gray-900'
                "
                class="text-2xl font-bold"
              >
                {{ thisMonthCount }}
              </div>
              <div
                :class="
                  $colorMode.value === 'dark'
                    ? 'text-white/60'
                    : 'text-gray-500'
                "
                class="text-sm"
              >
                本月
              </div>
            </div>
          </div>
        </div>

        <!-- 展示模式切换按钮 -->
        <div class="flex justify-end mb-6">
          <div
            class="flex items-center bg-white/10 backdrop-blur-md rounded-xl p-1 border border-white/20"
          >
            <button
              v-for="mode in viewModes"
              :key="mode.value"
              @click="setViewMode(mode.value)"
              class="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
              :class="[
                viewMode === mode.value
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : $colorMode.value === 'dark'
                  ? 'text-white/70 hover:text-white hover:bg-white/10'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
              ]"
            >
              <Icon :name="mode.icon" class="w-4 h-4" />
              <span class="text-sm font-medium">{{ mode.label }}</span>
            </button>
          </div>
        </div>

        <!-- 发布说说悬浮卡片 -->
        <div class="max-w-2xl mx-auto mb-8">
          <MomentComposer @submit="handleNewMoment" />
        </div>

        <!-- 过滤和搜索 -->
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div class="flex flex-wrap items-center gap-4">
            <!-- 心情过滤 -->
            <select
              v-model="selectedMood"
              :class="
                $colorMode.value === 'dark'
                  ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  : 'bg-gray-100 border-gray-200 text-gray-900 hover:bg-gray-200'
              "
              class="backdrop-blur-md rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors duration-200"
            >
              <option value="">全部心情</option>
              <option value="happy">😊 开心</option>
              <option value="sad">😢 难过</option>
              <option value="excited">🤩 兴奋</option>
              <option value="calm">😌 平静</option>
              <option value="thinking">🤔 思考</option>
              <option value="tired">😴 疲惫</option>
            </select>

            <!-- 搜索 -->
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="搜索说说..."
                class="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:bg-white/20 transition-colors duration-200"
              />
              <Icon
                name="heroicons:magnifying-glass"
                class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60"
              />
            </div>
          </div>

          <!-- 排序 -->
          <div class="flex items-center gap-2">
            <select
              v-model="sortBy"
              class="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:bg-white/20 transition-colors duration-200"
            >
              <option value="createdAt">按时间</option>
              <option value="likes">按点赞</option>
              <option value="comments">按评论</option>
            </select>

            <button
              @click="toggleSortOrder"
              class="p-2 bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 rounded-lg transition-all duration-200 hover:scale-105"
            >
              <Icon
                :name="
                  sortOrder === 'desc'
                    ? 'heroicons:arrow-down'
                    : 'heroicons:arrow-up'
                "
                class="w-4 h-4 text-white"
              />
            </button>
          </div>
        </div>

        <!-- 说说列表 -->
        <div class="relative">
          <!-- 卡片布局 -->
          <div
            v-if="viewMode === 'card'"
            class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            <MomentCard
              v-for="moment in filteredMoments"
              :key="moment.id"
              :moment="moment"
              :view-mode="viewMode"
              @like="handleLike"
              @comment="handleComment"
              @tag-click="handleTagClick"
            />
          </div>

          <!-- 瀑布流布局 -->
          <div
            v-else-if="viewMode === 'waterfall'"
            class="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
          >
            <MomentCard
              v-for="moment in filteredMoments"
              :key="moment.id"
              :moment="moment"
              :view-mode="viewMode"
              @like="handleLike"
              @comment="handleComment"
              @tag-click="handleTagClick"
            />
          </div>

          <!-- 时间线布局 -->
          <div
            v-else-if="viewMode === 'timeline'"
            class="relative max-w-4xl mx-auto"
          >
            <!-- 时间线主线 -->
            <div
              class="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500"
            />

            <div class="space-y-8">
              <MomentCard
                v-for="(moment, index) in filteredMoments"
                :key="moment.id"
                :moment="moment"
                :view-mode="viewMode"
                :is-last="index === filteredMoments.length - 1"
                @like="handleLike"
                @comment="handleComment"
                @tag-click="handleTagClick"
              />
            </div>
          </div>
        </div>

        <!-- 加载更多 -->
        <div v-if="hasMore" class="text-center mt-12">
          <button
            @click="loadMore"
            :disabled="loading"
            class="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-medium rounded-lg transition-all duration-200 hover:scale-105 disabled:scale-100 shadow-lg"
          >
            <span v-if="loading" class="flex items-center space-x-2">
              <div
                class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"
              ></div>
              <span>加载中...</span>
            </span>
            <span v-else>加载更多</span>
          </button>
        </div>

        <!-- 空状态 -->
        <div
          v-if="!loading && filteredMoments.length === 0"
          class="text-center py-12"
        >
          <div class="text-6xl mb-4">📝</div>
          <h3 class="text-xl font-medium text-white mb-2">还没有说说</h3>
          <p class="text-white/60">分享你的第一条说说吧！</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 页面元数据
useHead({
  title: '生活说说 - Mindtrail',
  meta: [
    {
      name: 'description',
      content: '记录生活中的点点滴滴，分享内心的感悟与思考',
    },
  ],
})

// 使用 composables
const {
  moments,
  loading,
  error,
  hasMore,
  statistics,
  filteredMoments,
  setFilter,
  setSorting,
  loadMore,
  likeMoment,
  unlikeMoment,
} = useMoments()

// 响应式状态
const viewMode = ref<'card' | 'waterfall' | 'timeline'>('card')
const selectedMood = ref('')
const searchQuery = ref('')
const sortBy = ref<'createdAt' | 'likes' | 'comments'>('createdAt')
const sortOrder = ref<'asc' | 'desc'>('desc')

// 背景粒子
const backgroundParticles = ref<
  Array<{
    x: number
    y: number
    size: number
    delay: number
    duration: number
  }>
>([])

// 视图模式选项
const viewModes = [
  { value: 'card', label: '卡片', icon: 'heroicons:squares-2x2' },
  { value: 'waterfall', label: '瀑布流', icon: 'heroicons:view-columns' },
  { value: 'timeline', label: '时间线', icon: 'heroicons:clock' },
]

// 计算属性
const todayCount = computed(() => {
  const today = new Date().toDateString()
  return moments.value.filter(
    (m) => new Date(m.createdAt).toDateString() === today
  ).length
})

const thisMonthCount = computed(() => {
  const now = new Date()
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  return moments.value.filter((m) => new Date(m.createdAt) >= thisMonth).length
})

// 初始化背景粒子
const initBackgroundParticles = () => {
  backgroundParticles.value = Array.from({ length: 15 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 150 + 50,
    delay: Math.random() * 5,
    duration: Math.random() * 20 + 15,
  }))
}

// 设置视图模式
const setViewMode = (mode: 'card' | 'waterfall' | 'timeline') => {
  viewMode.value = mode
}

// 切换排序顺序
const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc'
  setSorting(sortBy.value, sortOrder.value)
}

// 处理新说说提交
const handleNewMoment = async (data: any) => {
  try {
    // 这里应该调用 API 创建新说说
    console.log('New moment data:', data)

    // 模拟创建成功，刷新列表
    // await refresh()
  } catch (error) {
    console.error('Failed to create moment:', error)
  }
}

// 处理点赞
const handleLike = async (momentId: string) => {
  try {
    await likeMoment(momentId)
  } catch (error) {
    console.error('Failed to like moment:', error)
  }
}

// 处理评论
const handleComment = (momentId: string) => {
  // 这里可以打开评论弹窗或跳转到详情页
  console.log('Comment on moment:', momentId)
}

// 处理标签点击
const handleTagClick = (tag: string) => {
  setFilter('tag', tag)
}

// 监听过滤条件变化
watch([selectedMood, searchQuery], ([mood, query]) => {
  setFilter('mood', mood)
  setFilter('searchQuery', query)
})

watch([sortBy, sortOrder], ([by, order]) => {
  setSorting(by, order)
})

// 组件挂载时初始化
onMounted(() => {
  initBackgroundParticles()
})
</script>

<style scoped>
/* 背景渐变 */
.bg-gradient-radial {
  background: radial-gradient(circle, var(--tw-gradient-stops));
}

/* 浮动动画 */
@keyframes float-slow {
  0%,
  100% {
    transform: translateY(0px) translateX(0px);
    opacity: 0.3;
  }
  25% {
    transform: translateY(-20px) translateX(10px);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-10px) translateX(-15px);
    opacity: 0.8;
  }
  75% {
    transform: translateY(-30px) translateX(5px);
    opacity: 0.4;
  }
}

.animate-float-slow {
  animation: float-slow linear infinite;
}

/* 瀑布流布局优化 */
.columns-1 > * {
  break-inside: avoid;
  margin-bottom: 1.5rem;
}

.columns-2 > * {
  break-inside: avoid;
  margin-bottom: 1.5rem;
}

.columns-3 > * {
  break-inside: avoid;
  margin-bottom: 1.5rem;
}

.columns-4 > * {
  break-inside: avoid;
  margin-bottom: 1.5rem;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* 选择框样式 */
select option {
  background: #1f2937;
  color: white;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .columns-2 {
    columns: 1;
  }

  .columns-3 {
    columns: 1;
  }

  .columns-4 {
    columns: 1;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .columns-3 {
    columns: 2;
  }

  .columns-4 {
    columns: 2;
  }
}

@media (min-width: 1025px) and (max-width: 1280px) {
  .columns-4 {
    columns: 3;
  }
}
</style>
