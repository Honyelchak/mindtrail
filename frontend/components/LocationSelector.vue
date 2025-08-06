<template>
  <div class="location-selector">
    <!-- 当前选择的位置 -->
    <div
      v-if="selectedLocation"
      class="selected-location neu-card p-4 cursor-pointer"
      @click="showPicker = !showPicker"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <MapPinIcon class="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <div>
            <div class="font-medium text-neutral-700 dark:text-neutral-300">
              {{ selectedLocation.name }}
            </div>
            <div class="text-sm text-neutral-500 dark:text-neutral-400">
              {{ selectedLocation.address }}
            </div>
          </div>
        </div>
        
        <div class="flex items-center space-x-2">
          <button
            @click.stop="clearLocation"
            class="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded transition-colors"
            title="清除位置"
          >
            <XMarkIcon class="w-4 h-4 text-neutral-400" />
          </button>
          <ChevronDownIcon 
            class="w-4 h-4 text-neutral-400 transition-transform"
            :class="{ 'rotate-180': showPicker }"
          />
        </div>
      </div>
    </div>

    <!-- 位置选择按钮 -->
    <button
      v-else
      @click="showPicker = true"
      class="w-full neu-card p-4 text-left hover:shadow-lg transition-all duration-200"
    >
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">
          <MapPinIcon class="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
        </div>
        <div>
          <div class="font-medium text-neutral-700 dark:text-neutral-300">
            添加位置
          </div>
          <div class="text-sm text-neutral-500 dark:text-neutral-400">
            记录此刻的地理位置
          </div>
        </div>
      </div>
    </button>

    <!-- 位置选择器 -->
    <div
      v-if="showPicker"
      class="location-picker neu-card p-6 mt-4"
    >
      <div class="mb-4">
        <h3 class="text-lg font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
          选择位置
        </h3>
        <p class="text-sm text-neutral-500 dark:text-neutral-400">
          搜索地点或使用当前位置
        </p>
      </div>

      <!-- 搜索框 -->
      <div class="relative mb-4">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon class="w-5 h-5 text-neutral-400" />
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索地点..."
          class="w-full pl-10 pr-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          @input="handleSearch"
        >
        
        <!-- 搜索加载状态 -->
        <div v-if="searching" class="absolute inset-y-0 right-0 pr-3 flex items-center">
          <div class="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>

      <!-- 当前位置按钮 -->
      <div class="mb-4">
        <button
          @click="getCurrentLocation"
          class="w-full flex items-center justify-center space-x-2 p-3 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
          :disabled="gettingLocation"
        >
          <GlobeAltIcon class="w-5 h-5" />
          <span>{{ gettingLocation ? '获取位置中...' : '使用当前位置' }}</span>
        </button>
      </div>

      <!-- 搜索结果 -->
      <div v-if="searchResults.length > 0" class="mb-4">
        <div class="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          搜索结果:
        </div>
        <div class="space-y-2 max-h-48 overflow-y-auto">
          <button
            v-for="location in searchResults"
            :key="location.id"
            @click="selectLocation(location)"
            class="w-full text-left p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
          >
            <div class="flex items-start space-x-3">
              <MapPinIcon class="w-4 h-4 text-neutral-400 mt-0.5 flex-shrink-0" />
              <div class="flex-1 min-w-0">
                <div class="font-medium text-neutral-700 dark:text-neutral-300">
                  {{ location.name }}
                </div>
                <div class="text-sm text-neutral-500 dark:text-neutral-400 truncate">
                  {{ location.address }}
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- 常用位置 -->
      <div v-if="frequentLocations.length > 0" class="mb-4">
        <div class="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          常用位置:
        </div>
        <div class="grid grid-cols-1 gap-2">
          <button
            v-for="location in frequentLocations"
            :key="location.id"
            @click="selectLocation(location)"
            class="text-left p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
          >
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                <component :is="location.icon" class="w-4 h-4 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <div class="font-medium text-neutral-700 dark:text-neutral-300">
                  {{ location.name }}
                </div>
                <div class="text-sm text-neutral-500 dark:text-neutral-400">
                  {{ location.address }}
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex items-center justify-end space-x-3">
        <button
          @click="cancelSelection"
          class="px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
        >
          取消
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  MapPinIcon, 
  XMarkIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  GlobeAltIcon,
  HomeIcon,
  BuildingOfficeIcon,
  AcademicCapIcon
} from '@heroicons/vue/24/outline'

// Props
const props = defineProps({
  modelValue: {
    type: Object,
    default: null
  }
})

// Emits
const emit = defineEmits(['update:modelValue'])

// 响应式数据
const showPicker = ref(false)
const selectedLocation = ref(props.modelValue)
const searchQuery = ref('')
const searchResults = ref([])
const searching = ref(false)
const gettingLocation = ref(false)

// 常用位置
const frequentLocations = [
  {
    id: 'home',
    name: '家',
    address: '北京市朝阳区',
    icon: HomeIcon,
    coordinates: { lat: 39.9388, lng: 116.4074 }
  },
  {
    id: 'office',
    name: '公司',
    address: '北京市海淀区中关村',
    icon: BuildingOfficeIcon,
    coordinates: { lat: 39.9042, lng: 116.4074 }
  },
  {
    id: 'school',
    name: '学校',
    address: '北京市海淀区',
    icon: AcademicCapIcon,
    coordinates: { lat: 39.9526, lng: 116.3017 }
  }
]

// 模拟搜索结果
const mockSearchResults = [
  {
    id: '1',
    name: '星巴克咖啡（中关村店）',
    address: '北京市海淀区中关村大街1号',
    coordinates: { lat: 39.9042, lng: 116.4074 }
  },
  {
    id: '2',
    name: '奥林匹克森林公园',
    address: '北京市朝阳区安立路',
    coordinates: { lat: 40.0031, lng: 116.3975 }
  },
  {
    id: '3',
    name: '三里屯太古里',
    address: '北京市朝阳区三里屯路',
    coordinates: { lat: 39.9368, lng: 116.4472 }
  }
]

// 方法
const handleSearch = debounce(async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }

  searching.value = true

  try {
    // 模拟 API 搜索延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模拟搜索结果
    const query = searchQuery.value.toLowerCase()
    searchResults.value = mockSearchResults.filter(location =>
      location.name.toLowerCase().includes(query) ||
      location.address.toLowerCase().includes(query)
    )

  } catch (error) {
    console.error('Search error:', error)
  } finally {
    searching.value = false
  }
}, 300)

const getCurrentLocation = async () => {
  if (!navigator.geolocation) {
    alert('您的浏览器不支持地理定位')
    return
  }

  gettingLocation.value = true

  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      })
    })

    const { latitude, longitude } = position.coords

    // 模拟反向地理编码
    const location = {
      id: 'current',
      name: '当前位置',
      address: `纬度: ${latitude.toFixed(4)}, 经度: ${longitude.toFixed(4)}`,
      coordinates: { lat: latitude, lng: longitude }
    }

    selectLocation(location)

  } catch (error) {
    console.error('Geolocation error:', error)
    alert('获取位置失败，请检查位置权限设置')
  } finally {
    gettingLocation.value = false
  }
}

const selectLocation = (location) => {
  selectedLocation.value = location
  emit('update:modelValue', location)
  showPicker.value = false
  searchQuery.value = ''
  searchResults.value = []
}

const clearLocation = () => {
  selectedLocation.value = null
  emit('update:modelValue', null)
}

const cancelSelection = () => {
  showPicker.value = false
  searchQuery.value = ''
  searchResults.value = []
}

// 防抖函数
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// 监听 modelValue 变化
watch(() => props.modelValue, (newValue) => {
  selectedLocation.value = newValue
})
</script>

<style scoped>
/* 位置选择器特定样式 */
.location-picker {
  max-height: 500px;
  overflow-y: auto;
}
</style>
