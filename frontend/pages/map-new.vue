<template>
  <div class="map-page -mx-4 -my-8">
    <!-- 页面头部 -->
    <header class="relative py-20 pt-8 overflow-hidden">
      <!-- 背景装饰 -->
      <div class="absolute inset-0">
        <div
          class="absolute top-10 right-10 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse"
        />
        <div
          class="absolute bottom-10 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style="animation-delay: 2s"
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
            足迹地图
          </h1>
          <p
            class="text-body-lg max-w-2xl mx-auto mb-8 transition-colors duration-300"
            :class="
              $colorMode.value === 'dark' ? 'text-white/70' : 'text-gray-600'
            "
          >
            记录走过的每一个地方，收集旅途中的美好回忆。世界那么大，我们一起去看看。
          </p>

          <!-- 统计信息 -->
          <div class="flex justify-center space-x-8 text-center mb-8">
            <div
              class="backdrop-blur-md rounded-2xl px-6 py-4 border transition-all duration-300"
              :class="
                $colorMode.value === 'dark'
                  ? 'bg-glass-bg border-glass-border'
                  : 'bg-white/80 border-gray-200'
              "
            >
              <div
                class="text-2xl font-bold mb-1 transition-colors duration-300"
                :class="
                  $colorMode.value === 'dark' ? 'text-white' : 'text-gray-900'
                "
              >
                {{ locations.length }}
              </div>
              <div
                class="text-sm transition-colors duration-300"
                :class="
                  $colorMode.value === 'dark'
                    ? 'text-white/60'
                    : 'text-gray-600'
                "
              >
                个地点
              </div>
            </div>
            <div
              class="backdrop-blur-md rounded-2xl px-6 py-4 border transition-all duration-300"
              :class="
                $colorMode.value === 'dark'
                  ? 'bg-glass-bg border-glass-border'
                  : 'bg-white/80 border-gray-200'
              "
            >
              <div
                class="text-2xl font-bold mb-1 transition-colors duration-300"
                :class="
                  $colorMode.value === 'dark' ? 'text-white' : 'text-gray-900'
                "
              >
                {{ uniqueCountries }}
              </div>
              <div
                class="text-sm transition-colors duration-300"
                :class="
                  $colorMode.value === 'dark'
                    ? 'text-white/60'
                    : 'text-gray-600'
                "
              >
                个国家
              </div>
            </div>
            <div
              class="backdrop-blur-md rounded-2xl px-6 py-4 border transition-all duration-300"
              :class="
                $colorMode.value === 'dark'
                  ? 'bg-glass-bg border-glass-border'
                  : 'bg-white/80 border-gray-200'
              "
            >
              <div
                class="text-2xl font-bold mb-1 transition-colors duration-300"
                :class="
                  $colorMode.value === 'dark' ? 'text-white' : 'text-gray-900'
                "
              >
                {{ totalDistance }}
              </div>
              <div
                class="text-sm transition-colors duration-300"
                :class="
                  $colorMode.value === 'dark'
                    ? 'text-white/60'
                    : 'text-gray-600'
                "
              >
                公里
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- 地图内容 -->
    <main class="container mx-auto px-4 pb-20">
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

      <!-- 地图视图 -->
      <div v-if="currentView === 'map'" class="mb-12">
        <div
          class="w-full h-96 rounded-2xl backdrop-blur-md border overflow-hidden relative"
          :class="
            $colorMode.value === 'dark'
              ? 'bg-glass-bg border-glass-border'
              : 'bg-white/90 border-gray-200'
          "
        >
          <!-- 地图占位符 -->
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="text-center">
              <Icon
                name="heroicons:map"
                class="w-16 h-16 mx-auto mb-4"
                :class="
                  $colorMode.value === 'dark'
                    ? 'text-white/40'
                    : 'text-gray-400'
                "
              />
              <p
                class="text-lg font-medium"
                :class="
                  $colorMode.value === 'dark'
                    ? 'text-white/60'
                    : 'text-gray-500'
                "
              >
                地图组件将在这里显示
              </p>
              <p
                class="text-sm mt-2"
                :class="
                  $colorMode.value === 'dark'
                    ? 'text-white/40'
                    : 'text-gray-400'
                "
              >
                可以集成 Google Maps 或其他地图服务
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 地点列表 -->
      <div v-if="currentView === 'list' || currentView === 'map'">
        <h2
          class="text-2xl font-bold mb-6 transition-colors duration-300"
          :class="$colorMode.value === 'dark' ? 'text-white' : 'text-gray-900'"
        >
          访问过的地点
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="location in locations"
            :key="location.id"
            class="p-6 rounded-2xl backdrop-blur-md border transition-all duration-300 hover:scale-105 cursor-pointer"
            :class="
              $colorMode.value === 'dark'
                ? 'bg-glass-bg border-glass-border hover:bg-white/10'
                : 'bg-white/90 border-gray-200 hover:bg-gray-50'
            "
            @click="selectLocation(location)"
          >
            <!-- 地点图片 -->
            <div class="w-full h-40 rounded-xl mb-4 overflow-hidden">
              <img
                :src="location.image"
                :alt="location.name"
                class="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
            </div>

            <!-- 地点信息 -->
            <div class="flex items-start space-x-3">
              <div
                class="w-10 h-10 rounded-lg flex items-center justify-center"
                :class="
                  $colorMode.value === 'dark'
                    ? 'bg-primary-500/20'
                    : 'bg-primary-100'
                "
              >
                <Icon
                  name="heroicons:map-pin"
                  class="w-5 h-5"
                  :class="
                    $colorMode.value === 'dark'
                      ? 'text-primary-400'
                      : 'text-primary-600'
                  "
                />
              </div>
              <div class="flex-1">
                <h3
                  class="text-lg font-semibold mb-1"
                  :class="
                    $colorMode.value === 'dark' ? 'text-white' : 'text-gray-900'
                  "
                >
                  {{ location.name }}
                </h3>
                <p
                  class="text-sm mb-2"
                  :class="
                    $colorMode.value === 'dark'
                      ? 'text-white/60'
                      : 'text-gray-600'
                  "
                >
                  {{ location.country }}
                </p>
                <p
                  class="text-sm leading-relaxed mb-3"
                  :class="
                    $colorMode.value === 'dark'
                      ? 'text-white/70'
                      : 'text-gray-600'
                  "
                >
                  {{ location.description }}
                </p>
                <div class="flex items-center justify-between">
                  <span
                    class="text-xs font-medium"
                    :class="
                      $colorMode.value === 'dark'
                        ? 'text-primary-400'
                        : 'text-primary-600'
                    "
                  >
                    {{ formatDate(location.visitDate) }}
                  </span>
                  <div class="flex items-center space-x-1">
                    <Icon
                      name="heroicons:star"
                      class="w-4 h-4 text-yellow-500"
                    />
                    <span
                      class="text-sm font-medium"
                      :class="
                        $colorMode.value === 'dark'
                          ? 'text-white/70'
                          : 'text-gray-600'
                      "
                    >
                      {{ location.rating }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 统计图表视图 -->
      <div v-if="currentView === 'stats'">
        <h2
          class="text-2xl font-bold mb-6 transition-colors duration-300"
          :class="$colorMode.value === 'dark' ? 'text-white' : 'text-gray-900'"
        >
          旅行统计
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- 按年份统计 -->
          <div
            class="p-6 rounded-2xl backdrop-blur-md border"
            :class="
              $colorMode.value === 'dark'
                ? 'bg-glass-bg border-glass-border'
                : 'bg-white/90 border-gray-200'
            "
          >
            <h3
              class="text-lg font-semibold mb-4"
              :class="
                $colorMode.value === 'dark' ? 'text-white' : 'text-gray-900'
              "
            >
              按年份统计
            </h3>
            <div class="space-y-3">
              <div
                v-for="stat in yearlyStats"
                :key="stat.year"
                class="flex items-center justify-between"
              >
                <span
                  class="text-sm"
                  :class="
                    $colorMode.value === 'dark'
                      ? 'text-white/70'
                      : 'text-gray-600'
                  "
                >
                  {{ stat.year }}年
                </span>
                <div class="flex items-center space-x-2">
                  <div
                    class="w-20 h-2 rounded-full"
                    :class="
                      $colorMode.value === 'dark'
                        ? 'bg-white/10'
                        : 'bg-gray-200'
                    "
                  >
                    <div
                      class="h-full rounded-full bg-gradient-to-r from-primary-500 to-secondary-500"
                      :style="{
                        width: `${(stat.count / maxYearlyCount) * 100}%`,
                      }"
                    ></div>
                  </div>
                  <span
                    class="text-sm font-medium"
                    :class="
                      $colorMode.value === 'dark'
                        ? 'text-white'
                        : 'text-gray-900'
                    "
                  >
                    {{ stat.count }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- 按国家统计 -->
          <div
            class="p-6 rounded-2xl backdrop-blur-md border"
            :class="
              $colorMode.value === 'dark'
                ? 'bg-glass-bg border-glass-border'
                : 'bg-white/90 border-gray-200'
            "
          >
            <h3
              class="text-lg font-semibold mb-4"
              :class="
                $colorMode.value === 'dark' ? 'text-white' : 'text-gray-900'
              "
            >
              按国家统计
            </h3>
            <div class="space-y-3">
              <div
                v-for="stat in countryStats"
                :key="stat.country"
                class="flex items-center justify-between"
              >
                <span
                  class="text-sm"
                  :class="
                    $colorMode.value === 'dark'
                      ? 'text-white/70'
                      : 'text-gray-600'
                  "
                >
                  {{ stat.country }}
                </span>
                <div class="flex items-center space-x-2">
                  <div
                    class="w-20 h-2 rounded-full"
                    :class="
                      $colorMode.value === 'dark'
                        ? 'bg-white/10'
                        : 'bg-gray-200'
                    "
                  >
                    <div
                      class="h-full rounded-full bg-gradient-to-r from-green-500 to-blue-500"
                      :style="{
                        width: `${(stat.count / maxCountryCount) * 100}%`,
                      }"
                    ></div>
                  </div>
                  <span
                    class="text-sm font-medium"
                    :class="
                      $colorMode.value === 'dark'
                        ? 'text-white'
                        : 'text-gray-900'
                    "
                  >
                    {{ stat.count }}
                  </span>
                </div>
              </div>
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
  { id: 'map', label: '地图', icon: 'heroicons:map' },
  { id: 'list', label: '列表', icon: 'heroicons:list-bullet' },
  { id: 'stats', label: '统计', icon: 'heroicons:chart-bar' },
]

// 响应式状态
const currentView = ref('map')

// 模拟数据
const locations = ref([
  {
    id: 1,
    name: '东京塔',
    country: '日本',
    description: '东京的标志性建筑，夜景非常美丽。',
    visitDate: '2024-03-15',
    rating: 4.8,
    image:
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop',
    coordinates: { lat: 35.6586, lng: 139.7454 },
  },
  {
    id: 2,
    name: '埃菲尔铁塔',
    country: '法国',
    description: '巴黎的象征，浪漫之都的经典地标。',
    visitDate: '2024-06-20',
    rating: 4.9,
    image:
      'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400&h=300&fit=crop',
    coordinates: { lat: 48.8584, lng: 2.2945 },
  },
  {
    id: 3,
    name: '自由女神像',
    country: '美国',
    description: '纽约港的自由女神像，自由与希望的象征。',
    visitDate: '2024-09-10',
    rating: 4.7,
    image:
      'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop',
    coordinates: { lat: 40.6892, lng: -74.0445 },
  },
  {
    id: 4,
    name: '悉尼歌剧院',
    country: '澳大利亚',
    description: '世界著名的建筑奇迹，独特的贝壳造型。',
    visitDate: '2024-11-05',
    rating: 4.8,
    image:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    coordinates: { lat: -33.8568, lng: 151.2153 },
  },
])

// 计算属性
const uniqueCountries = computed(() => {
  return new Set(locations.value.map((loc) => loc.country)).size
})

const totalDistance = computed(() => {
  // 模拟计算总距离
  return '12,580'
})

const yearlyStats = computed(() => {
  const stats = locations.value.reduce((acc, loc) => {
    const year = new Date(loc.visitDate).getFullYear()
    acc[year] = (acc[year] || 0) + 1
    return acc
  }, {} as Record<number, number>)

  return Object.entries(stats)
    .map(([year, count]) => ({ year: parseInt(year), count }))
    .sort((a, b) => b.year - a.year)
})

const countryStats = computed(() => {
  const stats = locations.value.reduce((acc, loc) => {
    acc[loc.country] = (acc[loc.country] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return Object.entries(stats)
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)
})

const maxYearlyCount = computed(() => {
  return Math.max(...yearlyStats.value.map((s) => s.count))
})

const maxCountryCount = computed(() => {
  return Math.max(...countryStats.value.map((s) => s.count))
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

const selectLocation = (location: any) => {
  console.log('选择地点:', location)
  // 这里可以添加地点详情显示逻辑
}

// 页面元数据
useHead({
  title: '足迹地图 - Mindtrail',
  meta: [
    {
      name: 'description',
      content: '记录走过的每一个地方，收集旅途中的美好回忆',
    },
  ],
})
</script>

<style scoped>
.map-page {
  background: linear-gradient(
    135deg,
    var(--color-bg-primary) 0%,
    var(--color-bg-secondary) 50%,
    var(--color-bg-tertiary) 100%
  );
}
</style>
