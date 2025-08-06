<template>
  <div class="emotion-selector">
    <!-- 当前选择的情绪 -->
    <div
      v-if="selectedEmotion"
      class="selected-emotion neu-card p-4 mb-4 cursor-pointer"
      @click="showPicker = !showPicker"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <span class="text-2xl">{{ selectedEmotion.icon }}</span>
          <div>
            <div class="font-medium text-neutral-700 dark:text-neutral-300">
              {{ selectedEmotion.label }}
            </div>
            <div class="text-sm text-neutral-500 dark:text-neutral-400">
              强度: {{ selectedEmotion.intensity }}/10
            </div>
          </div>
        </div>
        
        <div class="flex items-center space-x-2">
          <div
            class="w-4 h-4 rounded-full"
            :style="{ backgroundColor: selectedEmotion.color }"
          ></div>
          <ChevronDownIcon 
            class="w-4 h-4 text-neutral-400 transition-transform"
            :class="{ 'rotate-180': showPicker }"
          />
        </div>
      </div>
    </div>

    <!-- 情绪选择按钮 -->
    <button
      v-else
      @click="showPicker = true"
      class="w-full neu-card p-4 text-left hover:shadow-lg transition-all duration-200"
    >
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">
          <FaceSmileIcon class="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
        </div>
        <div>
          <div class="font-medium text-neutral-700 dark:text-neutral-300">
            选择当前心情
          </div>
          <div class="text-sm text-neutral-500 dark:text-neutral-400">
            记录此刻的情绪状态
          </div>
        </div>
      </div>
    </button>

    <!-- 情绪选择器 -->
    <div
      v-if="showPicker"
      class="emotion-picker neu-card p-6 mt-4"
    >
      <div class="mb-4">
        <h3 class="text-lg font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
          选择你的心情
        </h3>
        <p class="text-sm text-neutral-500 dark:text-neutral-400">
          点击表情选择情绪，拖动滑块调整强度
        </p>
      </div>

      <!-- 情绪网格 -->
      <div class="grid grid-cols-4 gap-3 mb-6">
        <button
          v-for="emotion in emotions"
          :key="emotion.type"
          @click="selectEmotion(emotion)"
          class="emotion-item"
          :class="{ 
            'selected': tempEmotion?.type === emotion.type,
            'ring-2': tempEmotion?.type === emotion.type
          }"
          :style="tempEmotion?.type === emotion.type ? { 
            ringColor: emotion.color,
            backgroundColor: emotion.color + '20'
          } : {}"
        >
          <span class="text-2xl mb-1">{{ emotion.icon }}</span>
          <span class="text-xs font-medium">{{ emotion.label }}</span>
        </button>
      </div>

      <!-- 强度调节 -->
      <div v-if="tempEmotion" class="mb-6">
        <div class="flex items-center justify-between mb-2">
          <label class="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            情绪强度
          </label>
          <span class="text-sm text-neutral-500 dark:text-neutral-400">
            {{ tempEmotion.intensity }}/10
          </span>
        </div>
        
        <div class="relative">
          <input
            v-model.number="tempEmotion.intensity"
            type="range"
            min="1"
            max="10"
            step="1"
            class="emotion-slider"
            :style="{ 
              background: `linear-gradient(to right, ${tempEmotion.color} 0%, ${tempEmotion.color} ${tempEmotion.intensity * 10}%, #e5e7eb ${tempEmotion.intensity * 10}%, #e5e7eb 100%)`
            }"
          >
          
          <!-- 强度标签 -->
          <div class="flex justify-between text-xs text-neutral-400 mt-1">
            <span>轻微</span>
            <span>中等</span>
            <span>强烈</span>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex items-center justify-end space-x-3">
        <button
          @click="clearEmotion"
          class="px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
        >
          清除
        </button>
        <button
          @click="cancelSelection"
          class="px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
        >
          取消
        </button>
        <button
          @click="confirmSelection"
          class="neu-button px-6 py-2"
          :disabled="!tempEmotion"
        >
          确认
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  FaceSmileIcon, 
  ChevronDownIcon 
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
const selectedEmotion = ref(props.modelValue)
const tempEmotion = ref(null)

// 情绪选项
const emotions = [
  { type: 'happy', label: '开心', color: '#FCD34D', icon: '😊' },
  { type: 'excited', label: '兴奋', color: '#F87171', icon: '🤩' },
  { type: 'love', label: '喜爱', color: '#FB7185', icon: '😍' },
  { type: 'grateful', label: '感激', color: '#34D399', icon: '🙏' },
  
  { type: 'peaceful', label: '平静', color: '#60A5FA', icon: '😌' },
  { type: 'focused', label: '专注', color: '#A78BFA', icon: '🤔' },
  { type: 'productive', label: '高效', color: '#10B981', icon: '💪' },
  { type: 'satisfied', label: '满足', color: '#FBBF24', icon: '😋' },
  
  { type: 'sad', label: '难过', color: '#94A3B8', icon: '😢' },
  { type: 'worried', label: '担心', color: '#F59E0B', icon: '😰' },
  { type: 'angry', label: '愤怒', color: '#EF4444', icon: '😠' },
  { type: 'frustrated', label: '沮丧', color: '#8B5CF6', icon: '😤' },
  
  { type: 'tired', label: '疲惫', color: '#9CA3AF', icon: '😴' },
  { type: 'bored', label: '无聊', color: '#6B7280', icon: '😑' },
  { type: 'confused', label: '困惑', color: '#EC4899', icon: '😕' },
  { type: 'surprised', label: '惊讶', color: '#06B6D4', icon: '😲' }
]

// 方法
const selectEmotion = (emotion) => {
  tempEmotion.value = {
    type: emotion.type,
    label: emotion.label,
    color: emotion.color,
    icon: emotion.icon,
    intensity: tempEmotion.value?.type === emotion.type ? tempEmotion.value.intensity : 5
  }
}

const confirmSelection = () => {
  if (tempEmotion.value) {
    selectedEmotion.value = { ...tempEmotion.value }
    emit('update:modelValue', selectedEmotion.value)
  }
  showPicker.value = false
  tempEmotion.value = null
}

const cancelSelection = () => {
  showPicker.value = false
  tempEmotion.value = null
}

const clearEmotion = () => {
  selectedEmotion.value = null
  tempEmotion.value = null
  showPicker.value = false
  emit('update:modelValue', null)
}

// 监听 modelValue 变化
watch(() => props.modelValue, (newValue) => {
  selectedEmotion.value = newValue
})

// 监听选择器显示状态
watch(showPicker, (show) => {
  if (show && selectedEmotion.value) {
    tempEmotion.value = { ...selectedEmotion.value }
  }
})
</script>

<style scoped>
.emotion-item {
  @apply flex flex-col items-center justify-center p-3 rounded-xl border-2 border-transparent hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all duration-200 cursor-pointer;
}

.emotion-item.selected {
  @apply border-2;
}

.emotion-slider {
  @apply w-full h-2 rounded-lg appearance-none cursor-pointer;
}

.emotion-slider::-webkit-slider-thumb {
  @apply appearance-none w-5 h-5 rounded-full bg-white border-2 border-current cursor-pointer shadow-lg;
}

.emotion-slider::-moz-range-thumb {
  @apply w-5 h-5 rounded-full bg-white border-2 border-current cursor-pointer shadow-lg;
  border: none;
}

/* 点击外部关闭选择器 */
.emotion-picker {
  position: relative;
}
</style>
