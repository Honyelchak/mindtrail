<template>
  <div class="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 hover:border-white/30 transition-all duration-300">
    <form @submit.prevent="handleSubmit">
      <!-- 输入区域 -->
      <div class="relative mb-4">
        <textarea
          v-model="content"
          placeholder="分享你的想法..."
          class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/60 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
          rows="3"
          maxlength="500"
          @input="adjustTextareaHeight"
          ref="textareaRef"
        />
        
        <!-- 字数统计 -->
        <div class="absolute bottom-2 right-2 text-xs text-white/50">
          {{ content.length }}/500
        </div>
      </div>

      <!-- 图片上传区域 -->
      <div v-if="images.length > 0" class="mb-4">
        <div class="grid grid-cols-3 gap-2">
          <div
            v-for="(image, index) in images"
            :key="index"
            class="relative group aspect-square rounded-lg overflow-hidden bg-white/10"
          >
            <img
              :src="image.preview"
              :alt="`上传图片${index + 1}`"
              class="w-full h-full object-cover"
            />
            <button
              type="button"
              @click="removeImage(index)"
              class="absolute top-1 right-1 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <Icon name="heroicons:x-mark" class="w-3 h-3" />
            </button>
          </div>
          
          <!-- 添加图片按钮 -->
          <label
            v-if="images.length < 9"
            class="aspect-square rounded-lg border-2 border-dashed border-white/30 hover:border-white/50 flex items-center justify-center cursor-pointer transition-colors duration-200 group"
          >
            <input
              type="file"
              multiple
              accept="image/*"
              class="hidden"
              @change="handleImageUpload"
            />
            <Icon name="heroicons:plus" class="w-6 h-6 text-white/60 group-hover:text-white/80" />
          </label>
        </div>
      </div>

      <!-- 工具栏 -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <!-- 图片上传 -->
          <label class="cursor-pointer p-2 rounded-lg hover:bg-white/10 transition-colors duration-200 group">
            <input
              type="file"
              multiple
              accept="image/*"
              class="hidden"
              @change="handleImageUpload"
            />
            <Icon name="heroicons:photo" class="w-5 h-5 text-white/70 group-hover:text-white" />
          </label>

          <!-- 情绪选择 -->
          <div class="relative">
            <button
              type="button"
              @click="showMoodPicker = !showMoodPicker"
              class="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200 group"
            >
              <span class="text-lg">{{ selectedMoodIcon }}</span>
            </button>
            
            <!-- 情绪选择器 -->
            <div
              v-if="showMoodPicker"
              class="absolute bottom-full left-0 mb-2 bg-white/20 backdrop-blur-md rounded-lg p-3 shadow-lg border border-white/20 z-10"
            >
              <div class="grid grid-cols-4 gap-2">
                <button
                  v-for="(mood, key) in moods"
                  :key="key"
                  type="button"
                  @click="selectMood(key)"
                  class="p-2 rounded-lg hover:bg-white/20 transition-colors duration-200"
                  :class="{ 'bg-white/20': selectedMood === key }"
                >
                  <span class="text-lg">{{ mood.icon }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- 位置 -->
          <button
            type="button"
            @click="toggleLocation"
            class="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200 group"
            :class="{ 'text-blue-400': includeLocation }"
          >
            <Icon name="heroicons:map-pin" class="w-5 h-5" :class="includeLocation ? 'text-blue-400' : 'text-white/70 group-hover:text-white'" />
          </button>
        </div>

        <!-- 发布按钮 -->
        <button
          type="submit"
          :disabled="!canSubmit || loading"
          class="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-medium rounded-lg transition-all duration-200 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
        >
          <span v-if="loading" class="flex items-center space-x-2">
            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>发布中...</span>
          </span>
          <span v-else>发布</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
interface ImageFile {
  file: File
  preview: string
}

interface Emits {
  submit: [data: {
    content: string
    images: File[]
    mood?: string
    location?: string
  }]
}

const emit = defineEmits<Emits>()

// 响应式状态
const content = ref('')
const images = ref<ImageFile[]>([])
const selectedMood = ref<string>('')
const showMoodPicker = ref(false)
const includeLocation = ref(false)
const loading = ref(false)
const textareaRef = ref<HTMLTextAreaElement>()

// 情绪选项
const moods = {
  happy: { icon: '😊', name: '开心' },
  excited: { icon: '🤩', name: '兴奋' },
  love: { icon: '😍', name: '喜爱' },
  calm: { icon: '😌', name: '平静' },
  thinking: { icon: '🤔', name: '思考' },
  tired: { icon: '😴', name: '疲惫' },
  sad: { icon: '😢', name: '难过' },
  angry: { icon: '😠', name: '生气' }
}

// 计算属性
const canSubmit = computed(() => {
  return content.value.trim().length > 0 || images.value.length > 0
})

const selectedMoodIcon = computed(() => {
  return selectedMood.value ? moods[selectedMood.value as keyof typeof moods]?.icon : '😐'
})

// 自动调整文本框高度
const adjustTextareaHeight = () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
    textareaRef.value.style.height = textareaRef.value.scrollHeight + 'px'
  }
}

// 处理图片上传
const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  
  if (files) {
    Array.from(files).forEach(file => {
      if (images.value.length >= 9) return
      
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          images.value.push({
            file,
            preview: e.target?.result as string
          })
        }
        reader.readAsDataURL(file)
      }
    })
  }
  
  // 清空input值，允许重复选择同一文件
  target.value = ''
}

// 移除图片
const removeImage = (index: number) => {
  images.value.splice(index, 1)
}

// 选择情绪
const selectMood = (mood: string) => {
  selectedMood.value = selectedMood.value === mood ? '' : mood
  showMoodPicker.value = false
}

// 切换位置
const toggleLocation = () => {
  includeLocation.value = !includeLocation.value
}

// 提交表单
const handleSubmit = async () => {
  if (!canSubmit.value || loading.value) return
  
  loading.value = true
  
  try {
    const submitData = {
      content: content.value.trim(),
      images: images.value.map(img => img.file),
      mood: selectedMood.value || undefined,
      location: includeLocation.value ? '当前位置' : undefined
    }
    
    emit('submit', submitData)
    
    // 重置表单
    content.value = ''
    images.value = []
    selectedMood.value = ''
    includeLocation.value = false
    showMoodPicker.value = false
    
    // 重置文本框高度
    if (textareaRef.value) {
      textareaRef.value.style.height = 'auto'
    }
  } catch (error) {
    console.error('Failed to submit moment:', error)
  } finally {
    loading.value = false
  }
}

// 点击外部关闭情绪选择器
onMounted(() => {
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Element
    if (!target.closest('.relative')) {
      showMoodPicker.value = false
    }
  }
  
  document.addEventListener('click', handleClickOutside)
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>

<style scoped>
/* 自定义滚动条 */
textarea::-webkit-scrollbar {
  width: 4px;
}

textarea::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

textarea::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

textarea::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>
