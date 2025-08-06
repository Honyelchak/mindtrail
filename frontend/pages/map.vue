<template>
  <div class="min-h-screen">
    <!-- 页面头部 -->
    <div class="mb-8">
      <div class="text-center mb-6">
        <h1 class="text-3xl font-bold text-gradient mb-2">足迹地图</h1>
        <p class="text-lg text-neutral-600 dark:text-neutral-400">
          在地图上回顾你的记录足迹
        </p>
      </div>

      <!-- 统计信息 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="neu-card p-4 text-center">
          <div
            class="text-2xl font-bold text-primary-600 dark:text-primary-400"
          >
            {{ stats.totalLocations }}
          </div>
          <div class="text-sm text-neutral-500 dark:text-neutral-400">地点</div>
        </div>
        <div class="neu-card p-4 text-center">
          <div
            class="text-2xl font-bold text-secondary-600 dark:text-secondary-400"
          >
            {{ stats.cities }}
          </div>
          <div class="text-sm text-neutral-500 dark:text-neutral-400">城市</div>
        </div>
        <div class="neu-card p-4 text-center">
          <div class="text-2xl font-bold text-accent-600 dark:text-accent-400">
            {{ stats.countries }}
          </div>
          <div class="text-sm text-neutral-500 dark:text-neutral-400">国家</div>
        </div>
        <div class="neu-card p-4 text-center">
          <div class="text-2xl font-bold text-green-600 dark:text-green-400">
            {{ stats.totalDistance }}
          </div>
          <div class="text-sm text-neutral-500 dark:text-neutral-400">公里</div>
        </div>
      </div>
    </div>

    <!-- 地图组件 -->
    <MapView
      :markers="mapMarkers"
      :center="mapCenter"
      :zoom="mapZoom"
      height="600px"
    />

    <!-- 位置列表 -->
    <div class="mt-8">
      <div class="neu-card p-6">
        <h2 class="text-xl font-semibold mb-4 flex items-center space-x-2">
          <MapPinIcon class="w-5 h-5" />
          <span>最近访问的地点</span>
        </h2>

        <div class="space-y-4">
          <div
            v-for="location in recentLocations"
            :key="location.id"
            class="flex items-center justify-between p-4 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            @click="centerMapToLocation(location)"
          >
            <div class="flex items-center space-x-4">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center"
                :style="{
                  backgroundColor: getLocationColor(location.type) + '20',
                }"
              >
                <MapPinIcon
                  class="w-5 h-5"
                  :style="{ color: getLocationColor(location.type) }"
                />
              </div>

              <div>
                <h3 class="font-medium text-neutral-800 dark:text-neutral-200">
                  {{ location.name }}
                </h3>
                <p class="text-sm text-neutral-500 dark:text-neutral-400">
                  {{ location.address }}
                </p>
              </div>
            </div>

            <div class="text-right">
              <div
                class="text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                {{ location.count }} 次记录
              </div>
              <div class="text-xs text-neutral-500 dark:text-neutral-400">
                最近: {{ formatDate(location.lastVisit) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { MapPinIcon } from '@heroicons/vue/24/outline'

// 页面元数据
useHead({
  title: '足迹地图 - Mindtrail',
  meta: [
    {
      name: 'description',
      content: '在地图上标记足迹，回顾走过的每一个地方。',
    },
  ],
})

// 响应式数据
const mapCenter = ref({ lat: 39.9042, lng: 116.4074 }) // 北京
const mapZoom = ref(10)

// 使用 Timeline Composable 获取数据
const { timeline, loadMockData } = useTimeline()

// 计算属性
const mapMarkers = computed(() => {
  return timeline.value.filter((item) => item.location?.coordinates)
})

const stats = computed(() => {
  const locations = mapMarkers.value
  const uniqueLocations = new Set(locations.map((item) => item.location.name))
  const uniqueCities = new Set(
    locations.map((item) => {
      const address = item.location.address || ''
      return address.split('市')[0] + '市'
    })
  )

  return {
    totalLocations: uniqueLocations.size,
    cities: uniqueCities.size,
    countries: 1, // 模拟数据，实际应该从地址中提取
    totalDistance: Math.round(Math.random() * 1000), // 模拟总距离
  }
})

const recentLocations = computed(() => {
  const locationMap = new Map()

  // 统计每个位置的访问次数
  mapMarkers.value.forEach((item) => {
    const locationKey = item.location.name
    if (locationMap.has(locationKey)) {
      const existing = locationMap.get(locationKey)
      existing.count++
      if (new Date(item.createdAt) > new Date(existing.lastVisit)) {
        existing.lastVisit = item.createdAt
      }
    } else {
      locationMap.set(locationKey, {
        id: item.location.name,
        name: item.location.name,
        address: item.location.address,
        coordinates: item.location.coordinates,
        type: item.type,
        count: 1,
        lastVisit: item.createdAt,
      })
    }
  })

  // 转换为数组并按最近访问时间排序
  return Array.from(locationMap.values())
    .sort((a, b) => new Date(b.lastVisit) - new Date(a.lastVisit))
    .slice(0, 5) // 只显示最近的5个位置
})

// 方法
const getLocationColor = (type) => {
  const colors = {
    moment: '#f093fb',
    article: '#667eea',
    gallery: '#764ba2',
  }
  return colors[type] || '#667eea'
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    month: 'long',
    day: 'numeric',
  })
}

const centerMapToLocation = (location) => {
  if (location.coordinates) {
    mapCenter.value = location.coordinates
    mapZoom.value = 15
  }
}

// 页面加载时获取数据
onMounted(() => {
  loadMockData()
})
</script>
