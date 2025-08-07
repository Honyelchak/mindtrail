<template>
  <div class="space-y-4">
    <!-- 位置选择头部 -->
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
        添加位置信息
      </h3>
      <button
        @click="toggleLocationPicker"
        class="text-sm text-primary-600 hover:text-primary-700 transition-colors"
      >
        {{ showLocationPicker ? '收起' : '展开' }}
      </button>
    </div>

    <!-- 位置选择器 -->
    <div v-if="showLocationPicker" class="space-y-4">
      <!-- 当前位置 -->
      <div class="glass-card p-4">
        <div class="flex items-center justify-between mb-3">
          <h4 class="font-medium text-gray-700 dark:text-gray-300">当前位置</h4>
          <button
            @click="getCurrentLocation"
            :disabled="loading"
            class="text-sm text-primary-600 hover:text-primary-700 transition-colors disabled:opacity-50"
          >
            {{ loading ? '定位中...' : '重新定位' }}
          </button>
        </div>

        <div v-if="currentLocation" class="space-y-2">
          <div class="flex items-center space-x-2">
            <MapPinIcon class="w-4 h-4 text-green-500" />
            <span class="text-sm text-gray-600 dark:text-gray-400">
              {{ currentLocation.address || '获取地址中...' }}
            </span>
          </div>
          <div class="text-xs text-gray-500">
            精度: {{ currentLocation.accuracy ? Math.round(currentLocation.accuracy) + 'm' : '未知' }}
          </div>
          <button
            @click="selectCurrentLocation"
            class="w-full neu-button py-2 text-sm"
            :class="{ 'bg-primary-100 dark:bg-primary-900/30': selectedLocation?.timestamp === currentLocation.timestamp }"
          >
            {{ selectedLocation?.timestamp === currentLocation.timestamp ? '已选择当前位置' : '使用当前位置' }}
          </button>
        </div>

        <div v-else-if="error" class="text-center py-4">
          <div class="text-red-500 mb-2">⚠️</div>
          <p class="text-sm text-red-600 dark:text-red-400 mb-2">{{ error }}</p>
          <button
            @click="getCurrentLocation"
            class="text-sm text-primary-600 hover:text-primary-700 transition-colors"
          >
            重试
          </button>
        </div>

        <div v-else class="text-center py-4">
          <div class="text-4xl mb-2">📍</div>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">获取你的当前位置</p>
          <button
            @click="getCurrentLocation"
            class="neu-button px-4 py-2 text-sm"
          >
            获取位置
          </button>
        </div>
      </div>

      <!-- 历史位置 -->
      <div v-if="recentLocations.length > 0" class="glass-card p-4">
        <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-3">最近位置</h4>
        <div class="space-y-2 max-h-48 overflow-y-auto">
          <button
            v-for="location in recentLocations"
            :key="location.id"
            @click="selectHistoryLocation(location)"
            class="w-full p-3 rounded-lg border transition-all text-left"
            :class="selectedLocation?.id === location.id
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-2 mb-1">
                  <div 
                    class="w-4 h-4 rounded flex items-center justify-center"
                    :class="getContentTypeConfig(location.contentType).bgClass"
                  >
                    <component 
                      :is="getContentTypeConfig(location.contentType).icon" 
                      class="w-2 h-2 text-white" 
                    />
                  </div>
                  <span class="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {{ location.title }}
                  </span>
                </div>
                <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  {{ location.address }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ formatDate(location.createdAt, 'relative') }}
                </p>
              </div>
              <div v-if="selectedLocation?.id === location.id" class="text-primary-500">
                <CheckIcon class="w-4 h-4" />
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- 手动输入位置 -->
      <div class="glass-card p-4">
        <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-3">手动输入</h4>
        <div class="space-y-3">
          <input
            v-model="manualLocation.address"
            type="text"
            placeholder="输入地址或地点名称..."
            class="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white/50 dark:bg-gray-800/50 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <div class="grid grid-cols-2 gap-3">
            <input
              v-model.number="manualLocation.latitude"
              type="number"
              step="any"
              placeholder="纬度"
              class="p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white/50 dark:bg-gray-800/50 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
            <input
              v-model.number="manualLocation.longitude"
              type="number"
              step="any"
              placeholder="经度"
              class="p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white/50 dark:bg-gray-800/50 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
          </div>
          <button
            @click="selectManualLocation"
            :disabled="!manualLocation.address.trim()"
            class="w-full neu-button py-2 text-sm disabled:opacity-50"
          >
            使用手动位置
          </button>
        </div>
      </div>

      <!-- 选中的位置信息 -->
      <div v-if="selectedLocation" class="glass-card p-4 bg-primary-50/50 dark:bg-primary-900/20">
        <div class="flex items-center space-x-2 mb-2">
          <CheckCircleIcon class="w-5 h-5 text-primary-500" />
          <span class="font-medium text-primary-700 dark:text-primary-300">已选择位置</span>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{ selectedLocation.address }}
        </p>
        <div class="flex justify-between items-center mt-2">
          <span class="text-xs text-gray-500">
            {{ selectedLocation.latitude?.toFixed(6) }}, {{ selectedLocation.longitude?.toFixed(6) }}
          </span>
          <button
            @click="clearSelection"
            class="text-xs text-red-600 hover:text-red-700 transition-colors"
          >
            清除选择
          </button>
        </div>
      </div>
    </div>

    <!-- 简化显示（收起状态） -->
    <div v-else-if="selectedLocation" class="glass-card p-3">
      <div class="flex items-center space-x-2">
        <MapPinIcon class="w-4 h-4 text-primary-500" />
        <span class="text-sm text-gray-600 dark:text-gray-400 flex-1">
          {{ selectedLocation.address }}
        </span>
        <button
          @click="clearSelection"
          class="text-xs text-red-600 hover:text-red-700 transition-colors"
        >
          移除
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  MapPinIcon,
  CheckIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  PhotoIcon,
  VideoCameraIcon
} from '@heroicons/vue/24/outline'
import { formatDate } from '~/utils'
import type { LocationData, ContentLocation } from '~/types'

interface Props {
  modelValue?: LocationData | null
  showByDefault?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: LocationData | null): void
}

const props = withDefaults(defineProps<Props>(), {
  showByDefault: false
})

const emit = defineEmits<Emits>()

// 使用位置数据
const { 
  currentLocation, 
  locationHistory,
  loading, 
  error,
  getCurrentLocation 
} = useLocation()

// 组件状态
const showLocationPicker = ref<boolean>(props.showByDefault)
const selectedLocation = ref<LocationData | null>(props.modelValue || null)
const manualLocation = reactive({
  address: '',
  latitude: null as number | null,
  longitude: null as number | null
})

// 最近位置（去重并限制数量）
const recentLocations = computed(() => {
  const uniqueLocations = new Map()
  
  locationHistory.value.forEach(location => {
    const key = `${location.latitude.toFixed(4)},${location.longitude.toFixed(4)}`
    if (!uniqueLocations.has(key) || 
        new Date(location.createdAt) > new Date(uniqueLocations.get(key).createdAt)) {
      uniqueLocations.set(key, location)
    }
  })
  
  return Array.from(uniqueLocations.values())
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
})

// 获取内容类型配置
const getContentTypeConfig = (type: string) => {
  const configs: Record<string, any> = {
    moment: { icon: ChatBubbleLeftRightIcon, bgClass: 'bg-green-500' },
    article: { icon: DocumentTextIcon, bgClass: 'bg-blue-500' },
    gallery: { icon: PhotoIcon, bgClass: 'bg-purple-500' },
    video: { icon: VideoCameraIcon, bgClass: 'bg-red-500' }
  }
  return configs[type] || configs.moment
}

// 切换位置选择器显示
const toggleLocationPicker = (): void => {
  showLocationPicker.value = !showLocationPicker.value
}

// 选择当前位置
const selectCurrentLocation = (): void => {
  if (currentLocation.value) {
    selectedLocation.value = { ...currentLocation.value }
    emit('update:modelValue', selectedLocation.value)
  }
}

// 选择历史位置
const selectHistoryLocation = (location: ContentLocation): void => {
  selectedLocation.value = {
    latitude: location.latitude,
    longitude: location.longitude,
    address: location.address,
    city: location.city,
    country: location.country,
    timestamp: new Date().toISOString()
  }
  emit('update:modelValue', selectedLocation.value)
}

// 选择手动输入的位置
const selectManualLocation = (): void => {
  if (manualLocation.address.trim()) {
    selectedLocation.value = {
      latitude: manualLocation.latitude || 0,
      longitude: manualLocation.longitude || 0,
      address: manualLocation.address.trim(),
      timestamp: new Date().toISOString()
    }
    emit('update:modelValue', selectedLocation.value)
    
    // 清空手动输入
    Object.assign(manualLocation, {
      address: '',
      latitude: null,
      longitude: null
    })
  }
}

// 清除选择
const clearSelection = (): void => {
  selectedLocation.value = null
  emit('update:modelValue', null)
}

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  selectedLocation.value = newValue
}, { immediate: true })
</script>

<style scoped>
.glass-card {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.dark .glass-card {
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}
</style>
