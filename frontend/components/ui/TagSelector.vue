<template>
  <div class="tag-selector">
    <!-- 标签输入框 -->
    <div class="relative">
      <div
        ref="inputContainerRef"
        class="tag-input-container"
        @click="focusInput"
      >
        <!-- 已选标签 -->
        <div class="flex flex-wrap gap-2 mb-2" v-if="selectedTags.length > 0">
          <span
            v-for="(tag, index) in selectedTags"
            :key="tag"
            class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
          >
            #{{ tag }}
            <button
              @click="removeTag(index)"
              class="ml-2 hover:text-primary-900 dark:hover:text-primary-100 transition-colors"
            >
              <XMarkIcon class="w-3 h-3" />
            </button>
          </span>
        </div>

        <!-- 输入框 -->
        <input
          ref="inputRef"
          v-model="inputValue"
          type="text"
          placeholder="输入标签，按回车添加..."
          class="tag-input"
          @keydown="handleKeydown"
          @input="handleInput"
          @focus="showSuggestions = true"
          @blur="handleBlur"
        >
      </div>

      <!-- 标签建议列表 -->
      <div
        v-if="showSuggestions && filteredSuggestions.length > 0"
        class="suggestions-dropdown"
      >
        <div class="py-2">
          <div
            v-for="(suggestion, index) in filteredSuggestions"
            :key="suggestion.name"
            class="suggestion-item"
            :class="{ 'bg-primary-50 dark:bg-primary-900/20': index === selectedSuggestionIndex }"
            @click="selectSuggestion(suggestion)"
            @mouseenter="selectedSuggestionIndex = index"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <span class="font-medium">#{{ suggestion.name }}</span>
                <span class="text-xs text-neutral-500 dark:text-neutral-400">
                  {{ suggestion.count }} 次使用
                </span>
              </div>
              <div
                class="w-3 h-3 rounded-full"
                :style="{ backgroundColor: suggestion.color }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 热门标签 -->
    <div v-if="popularTags.length > 0" class="mt-4">
      <div class="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
        热门标签:
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="tag in popularTags"
          :key="tag.name"
          @click="addTag(tag.name)"
          class="inline-flex items-center px-3 py-1 rounded-full text-sm border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-primary-300 dark:hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          :disabled="selectedTags.includes(tag.name)"
          :class="{ 'opacity-50 cursor-not-allowed': selectedTags.includes(tag.name) }"
        >
          #{{ tag.name }}
          <span class="ml-1 text-xs">{{ tag.count }}</span>
        </button>
      </div>
    </div>

    <!-- 标签统计 -->
    <div class="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
      已选择 {{ selectedTags.length }} 个标签
      <span v-if="maxTags > 0">（最多 {{ maxTags }} 个）</span>
    </div>
  </div>
</template>

<script setup>
import { XMarkIcon } from '@heroicons/vue/24/outline'

// Props
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  maxTags: {
    type: Number,
    default: 10
  },
  suggestions: {
    type: Array,
    default: () => []
  }
})

// Emits
const emit = defineEmits(['update:modelValue'])

// 响应式数据
const inputRef = ref(null)
const inputContainerRef = ref(null)
const inputValue = ref('')
const selectedTags = ref([...props.modelValue])
const showSuggestions = ref(false)
const selectedSuggestionIndex = ref(-1)

// 默认标签建议
const defaultSuggestions = [
  { name: '生活', count: 15, color: '#EF4444' },
  { name: '技术', count: 23, color: '#3B82F6' },
  { name: '摄影', count: 8, color: '#10B981' },
  { name: '美食', count: 12, color: '#F59E0B' },
  { name: '旅行', count: 6, color: '#8B5CF6' },
  { name: '读书', count: 9, color: '#EC4899' },
  { name: '运动', count: 7, color: '#06B6D4' },
  { name: '音乐', count: 5, color: '#84CC16' },
  { name: '电影', count: 4, color: '#F97316' },
  { name: '学习', count: 11, color: '#6366F1' }
]

// 计算属性
const allSuggestions = computed(() => {
  return props.suggestions.length > 0 ? props.suggestions : defaultSuggestions
})

const filteredSuggestions = computed(() => {
  if (!inputValue.value.trim()) return []
  
  const query = inputValue.value.toLowerCase().trim()
  return allSuggestions.value
    .filter(tag => 
      tag.name.toLowerCase().includes(query) && 
      !selectedTags.value.includes(tag.name)
    )
    .slice(0, 8) // 最多显示 8 个建议
})

const popularTags = computed(() => {
  return allSuggestions.value
    .filter(tag => !selectedTags.value.includes(tag.name))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6) // 显示前 6 个热门标签
})

// 方法
const focusInput = () => {
  inputRef.value?.focus()
}

const handleKeydown = (event) => {
  switch (event.key) {
    case 'Enter':
      event.preventDefault()
      if (selectedSuggestionIndex.value >= 0 && filteredSuggestions.value.length > 0) {
        selectSuggestion(filteredSuggestions.value[selectedSuggestionIndex.value])
      } else if (inputValue.value.trim()) {
        addTag(inputValue.value.trim())
      }
      break
      
    case 'ArrowDown':
      event.preventDefault()
      if (filteredSuggestions.value.length > 0) {
        selectedSuggestionIndex.value = Math.min(
          selectedSuggestionIndex.value + 1,
          filteredSuggestions.value.length - 1
        )
      }
      break
      
    case 'ArrowUp':
      event.preventDefault()
      selectedSuggestionIndex.value = Math.max(selectedSuggestionIndex.value - 1, -1)
      break
      
    case 'Escape':
      showSuggestions.value = false
      selectedSuggestionIndex.value = -1
      break
      
    case 'Backspace':
      if (!inputValue.value && selectedTags.value.length > 0) {
        removeTag(selectedTags.value.length - 1)
      }
      break
  }
}

const handleInput = () => {
  selectedSuggestionIndex.value = -1
  showSuggestions.value = true
}

const handleBlur = () => {
  // 延迟隐藏建议列表，以便点击建议项能够正常工作
  setTimeout(() => {
    showSuggestions.value = false
    selectedSuggestionIndex.value = -1
  }, 200)
}

const addTag = (tagName) => {
  const normalizedTag = tagName.trim().toLowerCase()
  
  // 验证标签
  if (!normalizedTag) return
  if (selectedTags.value.includes(normalizedTag)) return
  if (props.maxTags > 0 && selectedTags.value.length >= props.maxTags) return
  
  // 添加标签
  selectedTags.value.push(normalizedTag)
  inputValue.value = ''
  updateModelValue()
}

const removeTag = (index) => {
  selectedTags.value.splice(index, 1)
  updateModelValue()
}

const selectSuggestion = (suggestion) => {
  addTag(suggestion.name)
  showSuggestions.value = false
  selectedSuggestionIndex.value = -1
}

const updateModelValue = () => {
  emit('update:modelValue', [...selectedTags.value])
}

// 监听 modelValue 变化
watch(() => props.modelValue, (newValue) => {
  selectedTags.value = [...newValue]
}, { deep: true })
</script>

<style scoped>
.tag-input-container {
  @apply w-full p-3 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 cursor-text transition-all;
}

.tag-input-container:focus-within {
  @apply ring-2 ring-primary-500 border-transparent;
}

.tag-input {
  @apply w-full bg-transparent border-none outline-none text-neutral-700 dark:text-neutral-300 placeholder-neutral-500;
}

.suggestions-dropdown {
  @apply absolute top-full left-0 right-0 mt-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto;
}

.suggestion-item {
  @apply px-4 py-2 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors;
}
</style>
