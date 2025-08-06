<template>
  <div class="media-uploader">
    <!-- 上传区域 -->
    <div
      ref="dropZoneRef"
      class="upload-zone"
      :class="{
        'border-primary-500 bg-primary-50 dark:bg-primary-900/20': isDragOver,
        'border-red-500': hasError
      }"
      @click="triggerFileInput"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
    >
      <input
        ref="fileInputRef"
        type="file"
        :multiple="multiple"
        :accept="acceptedTypes"
        class="hidden"
        @change="handleFileSelect"
      >

      <div class="text-center py-8">
        <div class="mb-4">
          <PhotoIcon class="w-12 h-12 mx-auto text-neutral-400" />
        </div>
        
        <div class="mb-2">
          <p class="text-lg font-medium text-neutral-700 dark:text-neutral-300">
            {{ isDragOver ? '释放文件以上传' : '点击或拖拽上传图片' }}
          </p>
          <p class="text-sm text-neutral-500 dark:text-neutral-400">
            支持 JPG、PNG、GIF 格式，单个文件最大 {{ maxSizeMB }}MB
          </p>
        </div>

        <div v-if="multiple" class="text-xs text-neutral-400">
          最多可上传 {{ maxFiles }} 个文件
        </div>
      </div>
    </div>

    <!-- 错误信息 -->
    <div v-if="errorMessage" class="mt-2 text-sm text-red-600 dark:text-red-400">
      {{ errorMessage }}
    </div>

    <!-- 已上传文件列表 -->
    <div v-if="uploadedFiles.length > 0" class="mt-4">
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div
          v-for="(file, index) in uploadedFiles"
          :key="file.id"
          class="relative group"
        >
          <!-- 图片预览 -->
          <div class="neu-card p-2 aspect-square">
            <img
              :src="file.url"
              :alt="file.alt || `图片 ${index + 1}`"
              class="w-full h-full object-cover rounded-lg"
            >
            
            <!-- 上传进度 -->
            <div
              v-if="file.uploading"
              class="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center"
            >
              <div class="text-white text-center">
                <div class="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <div class="text-sm">{{ file.progress }}%</div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div class="flex space-x-1">
                <button
                  @click="editFile(index)"
                  class="w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                  title="编辑"
                >
                  <PencilIcon class="w-3 h-3" />
                </button>
                <button
                  @click="removeFile(index)"
                  class="w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                  title="删除"
                >
                  <XMarkIcon class="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          <!-- 文件信息 -->
          <div class="mt-2">
            <input
              v-model="file.alt"
              type="text"
              placeholder="图片描述..."
              class="w-full text-xs px-2 py-1 border border-neutral-200 dark:border-neutral-700 rounded bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              @input="updateFile(index, 'alt', $event.target.value)"
            >
          </div>
        </div>
      </div>
    </div>

    <!-- 文件编辑模态框 -->
    <MediaEditModal
      v-if="editingFile"
      :file="editingFile"
      @save="saveFileEdit"
      @cancel="cancelFileEdit"
    />
  </div>
</template>

<script setup>
import { PhotoIcon, PencilIcon, XMarkIcon } from '@heroicons/vue/24/outline'

// Props
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  multiple: {
    type: Boolean,
    default: false
  },
  maxFiles: {
    type: Number,
    default: 10
  },
  maxSizeMB: {
    type: Number,
    default: 5
  },
  required: {
    type: Boolean,
    default: false
  },
  acceptedTypes: {
    type: String,
    default: 'image/*'
  }
})

// Emits
const emit = defineEmits(['update:modelValue'])

// 响应式数据
const fileInputRef = ref(null)
const dropZoneRef = ref(null)
const isDragOver = ref(false)
const hasError = ref(false)
const errorMessage = ref('')
const uploadedFiles = ref([...props.modelValue])
const editingFile = ref(null)

// 方法
const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const handleDragOver = (event) => {
  isDragOver.value = true
}

const handleDragLeave = (event) => {
  // 只有当离开整个拖拽区域时才设置为 false
  if (!dropZoneRef.value?.contains(event.relatedTarget)) {
    isDragOver.value = false
  }
}

const handleDrop = (event) => {
  isDragOver.value = false
  const files = Array.from(event.dataTransfer.files)
  processFiles(files)
}

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  processFiles(files)
  // 清空 input 以允许重复选择同一文件
  event.target.value = ''
}

const processFiles = (files) => {
  clearError()

  // 检查文件数量限制
  if (!props.multiple && files.length > 1) {
    showError('只能上传一个文件')
    return
  }

  const totalFiles = uploadedFiles.value.length + files.length
  if (totalFiles > props.maxFiles) {
    showError(`最多只能上传 ${props.maxFiles} 个文件`)
    return
  }

  // 处理每个文件
  files.forEach(file => {
    if (validateFile(file)) {
      uploadFile(file)
    }
  })
}

const validateFile = (file) => {
  // 检查文件类型
  if (!file.type.startsWith('image/')) {
    showError('只支持图片文件')
    return false
  }

  // 检查文件大小
  const maxSizeBytes = props.maxSizeMB * 1024 * 1024
  if (file.size > maxSizeBytes) {
    showError(`文件大小不能超过 ${props.maxSizeMB}MB`)
    return false
  }

  return true
}

const uploadFile = async (file) => {
  const fileId = Date.now() + Math.random()
  
  // 创建文件对象
  const fileObj = {
    id: fileId,
    file: file,
    url: '',
    alt: '',
    uploading: true,
    progress: 0
  }

  // 添加到列表
  uploadedFiles.value.push(fileObj)

  try {
    // 创建预览 URL
    fileObj.url = URL.createObjectURL(file)

    // 模拟上传进度
    for (let progress = 0; progress <= 100; progress += 10) {
      fileObj.progress = progress
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    // 模拟上传完成
    fileObj.uploading = false
    fileObj.url = `/uploads/${fileId}_${file.name}` // 实际项目中这里应该是服务器返回的 URL

    // 更新父组件
    updateModelValue()

  } catch (error) {
    console.error('Upload error:', error)
    showError('上传失败，请重试')
    removeFile(uploadedFiles.value.findIndex(f => f.id === fileId))
  }
}

const removeFile = (index) => {
  const file = uploadedFiles.value[index]
  
  // 释放 blob URL
  if (file.url.startsWith('blob:')) {
    URL.revokeObjectURL(file.url)
  }
  
  uploadedFiles.value.splice(index, 1)
  updateModelValue()
}

const editFile = (index) => {
  editingFile.value = { ...uploadedFiles.value[index], index }
}

const saveFileEdit = (editedFile) => {
  const index = editedFile.index
  uploadedFiles.value[index] = { ...uploadedFiles.value[index], ...editedFile }
  editingFile.value = null
  updateModelValue()
}

const cancelFileEdit = () => {
  editingFile.value = null
}

const updateFile = (index, field, value) => {
  uploadedFiles.value[index][field] = value
  updateModelValue()
}

const updateModelValue = () => {
  const files = uploadedFiles.value
    .filter(file => !file.uploading)
    .map(file => ({
      type: 'image',
      url: file.url,
      alt: file.alt || '',
      caption: file.caption || ''
    }))
  
  emit('update:modelValue', files)
}

const showError = (message) => {
  errorMessage.value = message
  hasError.value = true
  setTimeout(clearError, 5000)
}

const clearError = () => {
  errorMessage.value = ''
  hasError.value = false
}

// 监听 modelValue 变化
watch(() => props.modelValue, (newValue) => {
  uploadedFiles.value = [...newValue]
}, { deep: true })

// 组件卸载时清理 blob URLs
onUnmounted(() => {
  uploadedFiles.value.forEach(file => {
    if (file.url.startsWith('blob:')) {
      URL.revokeObjectURL(file.url)
    }
  })
})
</script>

<style scoped>
.upload-zone {
  @apply border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-xl cursor-pointer transition-all duration-200 hover:border-primary-400 dark:hover:border-primary-500;
}

.upload-zone:hover {
  @apply bg-neutral-50 dark:bg-neutral-800/50;
}
</style>
