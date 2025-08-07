<template>
  <div class="min-h-screen">
    <div class="max-w-4xl mx-auto">
      <!-- 页面头部 -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gradient mb-2">创建内容</h1>
            <p class="text-neutral-600 dark:text-neutral-400">
              分享你的想法、经历和创作
            </p>
          </div>

          <!-- 返回按钮 -->
          <button
            @click="goBack"
            class="neu-button flex items-center space-x-2"
          >
            <ArrowLeftIcon class="w-4 h-4" />
            <span>返回</span>
          </button>
        </div>
      </div>

      <!-- 内容类型选择 -->
      <div class="neu-card p-6 mb-8">
        <h2 class="text-lg font-semibold mb-4">选择内容类型</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            v-for="type in contentTypes"
            :key="type.value"
            @click="selectContentType(type.value)"
            class="p-4 rounded-xl border-2 transition-all duration-200"
            :class="
              selectedType === type.value
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-neutral-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-600'
            "
          >
            <div class="flex flex-col items-center space-y-3">
              <div
                class="w-12 h-12 rounded-xl flex items-center justify-center"
                :class="type.bgClass"
              >
                <component :is="type.icon" class="w-6 h-6 text-white" />
              </div>
              <div class="text-center">
                <h3 class="font-medium text-neutral-800 dark:text-neutral-200">
                  {{ type.label }}
                </h3>
                <p class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  {{ type.description }}
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- 内容创建表单 -->
      <div v-if="selectedType" class="neu-card p-6">
        <form @submit.prevent="submitContent">
          <!-- 标题 -->
          <div class="mb-6">
            <label
              class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
            >
              标题 *
            </label>
            <input
              v-model="form.title"
              type="text"
              :placeholder="getPlaceholder('title')"
              class="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <!-- 内容 -->
          <div class="mb-6">
            <label
              class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
            >
              内容 *
            </label>
            <div class="neu-card-inset rounded-xl">
              <RichTextEditor
                v-if="selectedType === 'article'"
                v-model="form.content"
                :placeholder="getPlaceholder('content')"
              />
              <textarea
                v-else
                v-model="form.content"
                :placeholder="getPlaceholder('content')"
                class="w-full p-4 bg-transparent border-none outline-none resize-none text-neutral-700 dark:text-neutral-300 placeholder-neutral-500"
                :rows="selectedType === 'moment' ? 4 : 8"
                required
              ></textarea>
            </div>
          </div>

          <!-- 媒体上传 -->
          <div class="mb-6">
            <label
              class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
            >
              {{ selectedType === 'gallery' ? '图片 *' : '图片（可选）' }}
            </label>
            <MediaUploader
              v-model="form.media"
              :multiple="true"
              :required="selectedType === 'gallery'"
              :max-files="selectedType === 'gallery' ? 20 : 5"
            />
          </div>

          <!-- 标签 -->
          <div class="mb-6">
            <label
              class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
            >
              标签
            </label>
            <TagSelector v-model="form.tags" />
          </div>

          <!-- 情绪和位置 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <!-- 情绪选择 -->
            <div>
              <label
                class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
              >
                当前心情
              </label>
              <EmotionSelector v-model="form.emotion" />
            </div>

            <!-- 位置选择 -->
            <div>
              <label
                class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
              >
                位置
              </label>
              <LocationSelector v-model="form.location" />
            </div>
          </div>

          <!-- 文章特有字段 -->
          <div
            v-if="selectedType === 'article'"
            class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
          >
            <!-- 分类 -->
            <div>
              <label
                class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
              >
                分类
              </label>
              <select
                v-model="form.category"
                class="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              >
                <option value="">选择分类</option>
                <option value="技术">技术</option>
                <option value="生活">生活</option>
                <option value="思考">思考</option>
                <option value="教程">教程</option>
                <option value="随笔">随笔</option>
              </select>
            </div>

            <!-- 摘要 -->
            <div>
              <label
                class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
              >
                摘要
              </label>
              <input
                v-model="form.excerpt"
                type="text"
                placeholder="简短描述文章内容..."
                class="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <!-- 发布选项 -->
          <div class="mb-8">
            <div class="flex items-center space-x-4">
              <label class="flex items-center space-x-2">
                <input
                  v-model="form.isDraft"
                  type="checkbox"
                  class="w-4 h-4 text-primary-600 bg-neutral-100 border-neutral-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-neutral-800 focus:ring-2 dark:bg-neutral-700 dark:border-neutral-600"
                />
                <span class="text-sm text-neutral-700 dark:text-neutral-300"
                  >保存为草稿</span
                >
              </label>
            </div>
          </div>

          <!-- 提交按钮 -->
          <div class="flex items-center justify-end space-x-4">
            <button
              type="button"
              @click="saveDraft"
              class="px-6 py-3 text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
              :disabled="submitting"
            >
              保存草稿
            </button>
            <button
              type="submit"
              class="neu-button px-8 py-3"
              :disabled="submitting || !isFormValid"
            >
              {{
                submitting
                  ? '发布中...'
                  : form.isDraft
                    ? '保存草稿'
                    : '立即发布'
              }}
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
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  PhotoIcon,
} from '@heroicons/vue/24/outline'

// 页面元数据
useHead({
  title: '创建内容 - Mindtrail',
  meta: [
    {
      name: 'description',
      content: '创建新的内容，分享你的想法、经历和创作。',
    },
  ],
})

// 路由
const router = useRouter()

// 使用 Composables
const {
  saveDraft: saveDraftToDB,
  autoSaveDraft,
  loadDrafts,
  getDraft,
} = useDrafts()

// 响应式数据
const selectedType = ref('')
const submitting = ref(false)
const currentDraftId = ref(null)

// 表单数据
const form = ref({
  title: '',
  content: '',
  media: [],
  tags: [],
  emotion: null,
  location: null,
  category: '',
  excerpt: '',
  isDraft: false,
})

// 内容类型配置
const contentTypes = [
  {
    value: 'moment',
    label: '说说',
    description: '分享此刻的想法和心情',
    icon: ChatBubbleLeftRightIcon,
    bgClass: 'bg-gradient-to-r from-accent-500 to-accent-600',
  },
  {
    value: 'article',
    label: '文章',
    description: '深度思考和技术分享',
    icon: DocumentTextIcon,
    bgClass: 'bg-gradient-to-r from-primary-500 to-primary-600',
  },
  {
    value: 'gallery',
    label: '相册',
    description: '记录美好的视觉瞬间',
    icon: PhotoIcon,
    bgClass: 'bg-gradient-to-r from-secondary-500 to-secondary-600',
  },
]

// 计算属性
const isFormValid = computed(() => {
  const hasTitle = form.value.title.trim().length > 0
  const hasContent = form.value.content.trim().length > 0
  const hasRequiredMedia =
    selectedType.value !== 'gallery' || form.value.media.length > 0

  return hasTitle && hasContent && hasRequiredMedia
})

// 方法
const selectContentType = (type) => {
  selectedType.value = type
  // 重置表单
  form.value = {
    title: '',
    content: '',
    media: [],
    tags: [],
    emotion: null,
    location: null,
    category: '',
    excerpt: '',
    isDraft: false,
  }
}

const getPlaceholder = (field) => {
  const placeholders = {
    moment: {
      title: '此刻在想什么...',
      content: '分享你的想法、感受或正在做的事情...',
    },
    article: {
      title: '文章标题',
      content: '开始写作你的文章内容...',
    },
    gallery: {
      title: '相册标题',
      content: '描述这些照片的故事...',
    },
  }

  return placeholders[selectedType.value]?.[field] || ''
}

const submitContent = async () => {
  if (!isFormValid.value || submitting.value) return

  submitting.value = true

  try {
    // 模拟 API 调用
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // 构建内容数据
    const contentData = {
      id: Date.now().toString(),
      type: selectedType.value,
      title: form.value.title.trim(),
      content: form.value.content.trim(),
      media: form.value.media,
      tags: form.value.tags,
      emotion: form.value.emotion,
      location: form.value.location,
      category: form.value.category,
      excerpt: form.value.excerpt,
      isDraft: form.value.isDraft,
      author: {
        name: '当前用户',
        avatar: '/avatars/current-user.jpg',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stats: {
        views: 0,
        likes: 0,
        comments: 0,
      },
    }

    console.log('Content created:', contentData)

    // 显示成功消息
    // 这里可以集成通知系统
    alert(form.value.isDraft ? '草稿保存成功！' : '内容发布成功！')

    // 跳转到内容详情页或首页
    if (!form.value.isDraft) {
      const typeRoute = {
        moment: 'moments',
        article: 'articles',
        gallery: 'galleries',
      }[selectedType.value]

      router.push(`/${typeRoute}/${contentData.id}`)
    } else {
      router.push('/')
    }
  } catch (error) {
    console.error('Error creating content:', error)
    alert('发布失败，请重试')
  } finally {
    submitting.value = false
  }
}

const saveDraft = async () => {
  try {
    const draftData = {
      id: currentDraftId.value,
      type: selectedType.value,
      ...form.value,
    }

    const draftId = await saveDraftToDB(draftData)
    currentDraftId.value = draftId

    // 显示保存成功提示
    console.log('草稿保存成功')
  } catch (error) {
    console.error('保存草稿失败:', error)
  }
}

// 监听表单变化，自动保存草稿
watch(
  [form, selectedType],
  () => {
    if (selectedType.value && (form.value.title || form.value.content)) {
      const draftData = {
        id: currentDraftId.value,
        type: selectedType.value,
        ...form.value,
      }
      autoSaveDraft(draftData)
    }
  },
  { deep: true }
)

const goBack = () => {
  router.back()
}
</script>
