<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <!-- 页面头部 -->
      <div class="mb-8">
        <div class="flex items-center space-x-4 mb-4">
          <button
            @click="$router.back()"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeftIcon class="w-5 h-5" />
          </button>
          <div>
            <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-200">
              写说说
            </h1>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              记录此刻的心情和想法
            </p>
          </div>
        </div>
      </div>

      <div class="max-w-2xl mx-auto">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- 内容输入 -->
          <div class="glass-card p-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              说说内容 *
            </label>
            <textarea
              v-model="form.content"
              rows="6"
              class="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white/50 dark:bg-gray-800/50 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              placeholder="分享你此刻的想法..."
              required
            />
            <div class="flex justify-between items-center mt-2">
              <span class="text-xs text-gray-500">
                {{ form.content.length }}/500
              </span>
              <div class="flex items-center space-x-2 text-xs text-gray-500">
                <span>支持 Markdown 语法</span>
                <button
                  type="button"
                  @click="showMarkdownHelp = !showMarkdownHelp"
                  class="text-primary-600 hover:text-primary-700"
                >
                  ?
                </button>
              </div>
            </div>
            
            <!-- Markdown 帮助 -->
            <div v-if="showMarkdownHelp" class="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-xs">
              <div class="grid grid-cols-2 gap-2">
                <div><code>**粗体**</code> → <strong>粗体</strong></div>
                <div><code>*斜体*</code> → <em>斜体</em></div>
                <div><code>`代码`</code> → <code>代码</code></div>
                <div><code>[链接](url)</code> → 链接</div>
              </div>
            </div>
          </div>

          <!-- 图片上传 -->
          <div class="glass-card p-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              添加图片（可选）
            </label>
            <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
              <input
                ref="fileInput"
                type="file"
                multiple
                accept="image/*"
                class="hidden"
                @change="handleFileSelect"
              />
              <button
                type="button"
                @click="$refs.fileInput.click()"
                class="text-primary-600 hover:text-primary-700 transition-colors"
              >
                <PhotoIcon class="w-12 h-12 mx-auto mb-2" />
                <span class="text-sm">点击选择图片或拖拽到此处</span>
              </button>
            </div>
            
            <!-- 图片预览 -->
            <div v-if="form.images.length > 0" class="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
              <div
                v-for="(image, index) in form.images"
                :key="index"
                class="relative group"
              >
                <img
                  :src="image.preview"
                  :alt="`图片 ${index + 1}`"
                  class="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  @click="removeImage(index)"
                  class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <XMarkIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- 位置选择器 -->
          <div class="glass-card p-6">
            <LocationPicker v-model="form.location" :show-by-default="false" />
          </div>

          <!-- 标签 -->
          <div class="glass-card p-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              标签（可选）
            </label>
            <div class="flex flex-wrap gap-2 mb-3">
              <span
                v-for="tag in form.tags"
                :key="tag"
                class="inline-flex items-center px-3 py-1 rounded-full text-xs bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300"
              >
                {{ tag }}
                <button
                  type="button"
                  @click="removeTag(tag)"
                  class="ml-1 text-primary-600 hover:text-primary-800"
                >
                  <XMarkIcon class="w-3 h-3" />
                </button>
              </span>
            </div>
            <div class="flex space-x-2">
              <input
                v-model="newTag"
                type="text"
                placeholder="输入标签..."
                class="flex-1 p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white/50 dark:bg-gray-800/50 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                @keyup.enter="addTag"
              />
              <button
                type="button"
                @click="addTag"
                :disabled="!newTag.trim()"
                class="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                添加
              </button>
            </div>
          </div>

          <!-- 心情选择 -->
          <div class="glass-card p-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              当前心情（可选）
            </label>
            <div class="grid grid-cols-5 gap-3">
              <button
                v-for="mood in moods"
                :key="mood.key"
                type="button"
                @click="form.mood = form.mood === mood.key ? '' : mood.key"
                class="p-3 rounded-lg border-2 transition-all text-center"
                :class="form.mood === mood.key 
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'"
              >
                <div class="text-2xl mb-1">{{ mood.emoji }}</div>
                <div class="text-xs text-gray-600 dark:text-gray-400">{{ mood.label }}</div>
              </button>
            </div>
          </div>

          <!-- 提交按钮 -->
          <div class="flex space-x-4">
            <button
              type="button"
              @click="saveDraft"
              :disabled="!form.content.trim() || submitting"
              class="flex-1 py-3 px-6 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              保存草稿
            </button>
            <button
              type="submit"
              :disabled="!form.content.trim() || submitting"
              class="flex-1 py-3 px-6 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ submitting ? '发布中...' : '发布说说' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ArrowLeftIcon,
  PhotoIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

// 页面元数据
useHead({
  title: '写说说 - 思维轨迹',
  meta: [
    {
      name: 'description',
      content: '记录此刻的心情和想法，分享生活的点点滴滴。'
    }
  ]
})

// 使用位置数据
const { saveContentLocation } = useLocation()

// 表单数据
const form = reactive({
  content: '',
  images: [],
  location: null,
  tags: [],
  mood: ''
})

const newTag = ref('')
const showMarkdownHelp = ref(false)
const submitting = ref(false)

// 心情选项
const moods = [
  { key: 'happy', emoji: '😊', label: '开心' },
  { key: 'excited', emoji: '🤩', label: '兴奋' },
  { key: 'peaceful', emoji: '😌', label: '平静' },
  { key: 'thoughtful', emoji: '🤔', label: '思考' },
  { key: 'grateful', emoji: '🙏', label: '感恩' },
  { key: 'nostalgic', emoji: '😌', label: '怀念' },
  { key: 'inspired', emoji: '💡', label: '灵感' },
  { key: 'relaxed', emoji: '😎', label: '放松' },
  { key: 'curious', emoji: '🧐', label: '好奇' },
  { key: 'content', emoji: '😇', label: '满足' }
]

// 处理文件选择
const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  
  files.forEach(file => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        form.images.push({
          file,
          preview: e.target.result,
          name: file.name
        })
      }
      reader.readAsDataURL(file)
    }
  })
  
  // 清空input
  event.target.value = ''
}

// 移除图片
const removeImage = (index) => {
  form.images.splice(index, 1)
}

// 添加标签
const addTag = () => {
  const tag = newTag.value.trim()
  if (tag && !form.tags.includes(tag)) {
    form.tags.push(tag)
    newTag.value = ''
  }
}

// 移除标签
const removeTag = (tag) => {
  const index = form.tags.indexOf(tag)
  if (index > -1) {
    form.tags.splice(index, 1)
  }
}

// 保存草稿
const saveDraft = async () => {
  // 这里实现草稿保存逻辑
  console.log('保存草稿:', form)
}

// 提交表单
const handleSubmit = async () => {
  if (!form.content.trim()) return

  submitting.value = true

  try {
    // 创建说说内容
    const momentData = {
      id: Date.now().toString(),
      type: 'moment',
      content: form.content.trim(),
      images: form.images.map(img => img.preview), // 实际项目中应该上传到服务器
      tags: form.tags,
      mood: form.mood,
      createdAt: new Date().toISOString()
    }

    // 如果有位置信息，保存位置关联
    if (form.location) {
      await saveContentLocation(
        momentData.id,
        'moment',
        form.content.substring(0, 50) + (form.content.length > 50 ? '...' : ''),
        {
          preview: form.content.substring(0, 100),
          thumbnail: form.images.length > 0 ? form.images[0].preview : undefined,
          customLocation: form.location
        }
      )
    }

    // 这里应该调用API保存到服务器
    console.log('发布说说:', momentData)

    // 成功后跳转
    await navigateTo('/')
    
  } catch (error) {
    console.error('发布失败:', error)
    // 这里可以显示错误提示
  } finally {
    submitting.value = false
  }
}
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
</style>
