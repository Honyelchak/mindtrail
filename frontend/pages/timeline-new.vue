<template>
  <div class="timeline-page -mx-4 -my-8">
    <!-- 页面头部 -->
    <header class="relative py-20 pt-8 overflow-hidden">
      <!-- 背景装饰 -->
      <div class="absolute inset-0">
        <div
          class="absolute top-10 left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
        />
        <div
          class="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style="animation-delay: 1.5s"
        />
      </div>

      <div class="container mx-auto px-4 relative z-10">
        <div class="text-center">
          <h1
            class="font-display text-display-lg md:text-display-xl font-bold mb-6 transition-colors duration-300"
            :class="
              $colorMode.value === 'dark' ? 'text-white' : 'text-gray-900'
            "
          >
            时间轴
          </h1>
          <p
            class="text-body-lg max-w-2xl mx-auto mb-8 transition-colors duration-300"
            :class="
              $colorMode.value === 'dark' ? 'text-white/70' : 'text-gray-600'
            "
          >
            记录生活的每一个重要时刻，见证成长的轨迹。时间是最好的见证者。
          </p>

          <!-- 视图切换 -->
          <div class="flex justify-center space-x-4 mb-8">
            <button
              v-for="view in viewModes"
              :key="view.id"
              @click="currentView = view.id"
              class="flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 backdrop-blur-md border"
              :class="[
                currentView === view.id
                  ? $colorMode.value === 'dark'
                    ? 'bg-primary-500/20 border-primary-500/30 text-white'
                    : 'bg-primary-500/20 border-primary-500/30 text-primary-700'
                  : $colorMode.value === 'dark'
                  ? 'bg-glass-bg border-glass-border text-white/70 hover:text-white hover:bg-white/10'
                  : 'bg-white/80 border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100',
              ]"
            >
              <Icon :name="view.icon" class="w-5 h-5" />
              <span>{{ view.label }}</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- 时间轴内容 -->
    <main class="container mx-auto px-4 pb-20">
      <!-- 年份导航 -->
      <div class="flex justify-center mb-12">
        <div class="flex space-x-2 overflow-x-auto pb-2">
          <button
            v-for="year in availableYears"
            :key="year"
            @click="selectedYear = year"
            class="px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300"
            :class="[
              selectedYear === year
                ? $colorMode.value === 'dark'
                  ? 'bg-primary-500 text-white'
                  : 'bg-primary-500 text-white'
                : $colorMode.value === 'dark'
                ? 'bg-glass-bg text-white/70 hover:text-white hover:bg-white/10'
                : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-100',
            ]"
          >
            {{ year }}
          </button>
        </div>
      </div>

      <!-- 时间轴视图 -->
      <div v-if="currentView === 'timeline'" class="relative">
        <!-- 中央线 -->
        <div
          class="absolute left-1/2 transform -translate-x-1/2 w-1 h-full rounded-full"
          :class="
            $colorMode.value === 'dark'
              ? 'bg-gradient-to-b from-primary-500 to-secondary-500'
              : 'bg-gradient-to-b from-primary-400 to-secondary-400'
          "
        ></div>

        <!-- 时间轴项目 -->
        <div class="space-y-12">
          <div
            v-for="(event, index) in filteredEvents"
            :key="event.id"
            class="relative flex items-center"
            :class="index % 2 === 0 ? 'justify-start' : 'justify-end'"
          >
            <!-- 时间点 -->
            <div
              class="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full border-4 z-10"
              :class="
                $colorMode.value === 'dark'
                  ? 'bg-primary-500 border-bg-primary'
                  : 'bg-primary-500 border-white'
              "
            ></div>

            <!-- 事件卡片 -->
            <div
              class="w-5/12 p-6 rounded-2xl backdrop-blur-md border transition-all duration-300 hover:scale-105"
              :class="[
                $colorMode.value === 'dark'
                  ? 'bg-glass-bg border-glass-border'
                  : 'bg-white/90 border-gray-200',
                index % 2 === 0 ? 'mr-auto' : 'ml-auto',
              ]"
            >
              <div class="flex items-start space-x-4">
                <div
                  class="w-12 h-12 rounded-xl flex items-center justify-center"
                  :class="
                    $colorMode.value === 'dark'
                      ? 'bg-primary-500/20'
                      : 'bg-primary-100'
                  "
                >
                  <Icon
                    :name="event.icon"
                    class="w-6 h-6"
                    :class="
                      $colorMode.value === 'dark'
                        ? 'text-primary-400'
                        : 'text-primary-600'
                    "
                  />
                </div>
                <div class="flex-1">
                  <div
                    class="text-sm font-medium mb-1"
                    :class="
                      $colorMode.value === 'dark'
                        ? 'text-primary-400'
                        : 'text-primary-600'
                    "
                  >
                    {{ formatDate(event.date) }}
                  </div>
                  <h3
                    class="text-lg font-semibold mb-2"
                    :class="
                      $colorMode.value === 'dark'
                        ? 'text-white'
                        : 'text-gray-900'
                    "
                  >
                    {{ event.title }}
                  </h3>
                  <p
                    class="text-sm leading-relaxed"
                    :class="
                      $colorMode.value === 'dark'
                        ? 'text-white/70'
                        : 'text-gray-600'
                    "
                  >
                    {{ event.description }}
                  </p>
                  <div v-if="event.tags" class="flex flex-wrap gap-2 mt-3">
                    <span
                      v-for="tag in event.tags"
                      :key="tag"
                      class="px-2 py-1 text-xs rounded-lg"
                      :class="
                        $colorMode.value === 'dark'
                          ? 'bg-secondary-500/20 text-secondary-400'
                          : 'bg-secondary-100 text-secondary-700'
                      "
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 网格视图 -->
      <div
        v-else-if="currentView === 'grid'"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
          v-for="event in filteredEvents"
          :key="event.id"
          class="p-6 rounded-2xl backdrop-blur-md border transition-all duration-300 hover:scale-105"
          :class="
            $colorMode.value === 'dark'
              ? 'bg-glass-bg border-glass-border'
              : 'bg-white/90 border-gray-200'
          "
        >
          <div class="flex items-start space-x-4">
            <div
              class="w-12 h-12 rounded-xl flex items-center justify-center"
              :class="
                $colorMode.value === 'dark'
                  ? 'bg-primary-500/20'
                  : 'bg-primary-100'
              "
            >
              <Icon
                :name="event.icon"
                class="w-6 h-6"
                :class="
                  $colorMode.value === 'dark'
                    ? 'text-primary-400'
                    : 'text-primary-600'
                "
              />
            </div>
            <div class="flex-1">
              <div
                class="text-sm font-medium mb-1"
                :class="
                  $colorMode.value === 'dark'
                    ? 'text-primary-400'
                    : 'text-primary-600'
                "
              >
                {{ formatDate(event.date) }}
              </div>
              <h3
                class="text-lg font-semibold mb-2"
                :class="
                  $colorMode.value === 'dark' ? 'text-white' : 'text-gray-900'
                "
              >
                {{ event.title }}
              </h3>
              <p
                class="text-sm leading-relaxed"
                :class="
                  $colorMode.value === 'dark'
                    ? 'text-white/70'
                    : 'text-gray-600'
                "
              >
                {{ event.description }}
              </p>
              <div v-if="event.tags" class="flex flex-wrap gap-2 mt-3">
                <span
                  v-for="tag in event.tags"
                  :key="tag"
                  class="px-2 py-1 text-xs rounded-lg"
                  :class="
                    $colorMode.value === 'dark'
                      ? 'bg-secondary-500/20 text-secondary-400'
                      : 'bg-secondary-100 text-secondary-700'
                  "
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 列表视图 -->
      <div v-else class="space-y-4">
        <div
          v-for="event in filteredEvents"
          :key="event.id"
          class="flex items-center space-x-6 p-6 rounded-2xl backdrop-blur-md border transition-all duration-300 hover:scale-[1.02]"
          :class="
            $colorMode.value === 'dark'
              ? 'bg-glass-bg border-glass-border'
              : 'bg-white/90 border-gray-200'
          "
        >
          <div
            class="w-12 h-12 rounded-xl flex items-center justify-center"
            :class="
              $colorMode.value === 'dark'
                ? 'bg-primary-500/20'
                : 'bg-primary-100'
            "
          >
            <Icon
              :name="event.icon"
              class="w-6 h-6"
              :class="
                $colorMode.value === 'dark'
                  ? 'text-primary-400'
                  : 'text-primary-600'
              "
            />
          </div>
          <div class="flex-1">
            <div class="flex items-center justify-between mb-2">
              <h3
                class="text-lg font-semibold"
                :class="
                  $colorMode.value === 'dark' ? 'text-white' : 'text-gray-900'
                "
              >
                {{ event.title }}
              </h3>
              <div
                class="text-sm font-medium"
                :class="
                  $colorMode.value === 'dark'
                    ? 'text-primary-400'
                    : 'text-primary-600'
                "
              >
                {{ formatDate(event.date) }}
              </div>
            </div>
            <p
              class="text-sm leading-relaxed mb-3"
              :class="
                $colorMode.value === 'dark' ? 'text-white/70' : 'text-gray-600'
              "
            >
              {{ event.description }}
            </p>
            <div v-if="event.tags" class="flex flex-wrap gap-2">
              <span
                v-for="tag in event.tags"
                :key="tag"
                class="px-2 py-1 text-xs rounded-lg"
                :class="
                  $colorMode.value === 'dark'
                    ? 'bg-secondary-500/20 text-secondary-400'
                    : 'bg-secondary-100 text-secondary-700'
                "
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// 视图模式
const viewModes = [
  { id: 'timeline', label: '时间轴', icon: 'heroicons:clock' },
  { id: 'grid', label: '网格', icon: 'heroicons:squares-2x2' },
  { id: 'list', label: '列表', icon: 'heroicons:list-bullet' },
]

// 响应式状态
const currentView = ref('timeline')
const selectedYear = ref(new Date().getFullYear())

// 模拟数据
const events = ref([
  {
    id: 1,
    title: '项目启动',
    description: '开始了一个新的重要项目，这将是一个充满挑战和机遇的旅程。',
    date: '2024-01-15',
    icon: 'heroicons:rocket-launch',
    tags: ['工作', '项目'],
  },
  {
    id: 2,
    title: '技术突破',
    description: '在关键技术上取得了重大突破，为项目的成功奠定了基础。',
    date: '2024-03-22',
    icon: 'heroicons:light-bulb',
    tags: ['技术', '创新'],
  },
  {
    id: 3,
    title: '团队扩张',
    description: '团队规模扩大了一倍，迎来了更多优秀的伙伴。',
    date: '2024-06-10',
    icon: 'heroicons:user-group',
    tags: ['团队', '成长'],
  },
  {
    id: 4,
    title: '产品发布',
    description: '经过几个月的努力，产品终于正式发布，获得了用户的积极反馈。',
    date: '2024-09-05',
    icon: 'heroicons:gift',
    tags: ['产品', '发布'],
  },
  {
    id: 5,
    title: '获得认可',
    description: '项目获得了行业内的重要奖项，团队的努力得到了认可。',
    date: '2024-11-20',
    icon: 'heroicons:trophy',
    tags: ['奖项', '认可'],
  },
])

// 计算属性
const availableYears = computed(() => {
  const years = events.value.map((event) => new Date(event.date).getFullYear())
  return [...new Set(years)].sort((a, b) => b - a)
})

const filteredEvents = computed(() => {
  return events.value
    .filter(
      (event) => new Date(event.date).getFullYear() === selectedYear.value
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

// 方法
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// 页面元数据
useHead({
  title: '时间轴 - Mindtrail',
  meta: [
    {
      name: 'description',
      content: '记录生活的每一个重要时刻，见证成长的轨迹',
    },
  ],
})
</script>

<style scoped>
.timeline-page {
  background: linear-gradient(
    135deg,
    var(--color-bg-primary) 0%,
    var(--color-bg-secondary) 50%,
    var(--color-bg-tertiary) 100%
  );
}
</style>
