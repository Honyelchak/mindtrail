<template>
  <div class="rich-text-editor">
    <!-- 工具栏 -->
    <div
      class="toolbar border-b border-neutral-200 dark:border-neutral-700 p-3 flex items-center space-x-2 flex-wrap"
    >
      <!-- 文本格式 -->
      <div class="flex items-center space-x-1">
        <button
          type="button"
          @click="execCommand('bold')"
          class="toolbar-btn"
          :class="{ active: isActive('bold') }"
          title="粗体"
        >
          <BoldIcon class="w-4 h-4" />
        </button>
        <button
          type="button"
          @click="execCommand('italic')"
          class="toolbar-btn"
          :class="{ active: isActive('italic') }"
          title="斜体"
        >
          <ItalicIcon class="w-4 h-4" />
        </button>
        <button
          type="button"
          @click="execCommand('underline')"
          class="toolbar-btn"
          :class="{ active: isActive('underline') }"
          title="下划线"
        >
          <UnderlineIcon class="w-4 h-4" />
        </button>
      </div>

      <div class="w-px h-6 bg-neutral-300 dark:bg-neutral-600"></div>

      <!-- 标题 -->
      <div class="flex items-center space-x-1">
        <button
          type="button"
          @click="execCommand('formatBlock', '<h1>')"
          class="toolbar-btn"
          title="标题 1"
        >
          H1
        </button>
        <button
          type="button"
          @click="execCommand('formatBlock', '<h2>')"
          class="toolbar-btn"
          title="标题 2"
        >
          H2
        </button>
        <button
          type="button"
          @click="execCommand('formatBlock', '<h3>')"
          class="toolbar-btn"
          title="标题 3"
        >
          H3
        </button>
      </div>

      <div class="w-px h-6 bg-neutral-300 dark:bg-neutral-600"></div>

      <!-- 列表 -->
      <div class="flex items-center space-x-1">
        <button
          type="button"
          @click="execCommand('insertUnorderedList')"
          class="toolbar-btn"
          :class="{ active: isActive('insertUnorderedList') }"
          title="无序列表"
        >
          <ListBulletIcon class="w-4 h-4" />
        </button>
        <button
          type="button"
          @click="execCommand('insertOrderedList')"
          class="toolbar-btn"
          :class="{ active: isActive('insertOrderedList') }"
          title="有序列表"
        >
          <ListNumberIcon class="w-4 h-4" />
        </button>
      </div>

      <div class="w-px h-6 bg-neutral-300 dark:bg-neutral-600"></div>

      <!-- 链接和引用 -->
      <div class="flex items-center space-x-1">
        <button
          type="button"
          @click="insertLink"
          class="toolbar-btn"
          title="插入链接"
        >
          <LinkIcon class="w-4 h-4" />
        </button>
        <button
          type="button"
          @click="execCommand('formatBlock', '<blockquote>')"
          class="toolbar-btn"
          title="引用"
        >
          <ChatBubbleBottomCenterTextIcon class="w-4 h-4" />
        </button>
      </div>

      <div class="w-px h-6 bg-neutral-300 dark:bg-neutral-600"></div>

      <!-- 其他 -->
      <div class="flex items-center space-x-1">
        <button
          type="button"
          @click="execCommand('insertHorizontalRule')"
          class="toolbar-btn"
          title="分割线"
        >
          <MinusIcon class="w-4 h-4" />
        </button>
        <button
          type="button"
          @click="execCommand('removeFormat')"
          class="toolbar-btn"
          title="清除格式"
        >
          <XMarkIcon class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- 编辑器内容区域 -->
    <div
      ref="editorRef"
      class="editor-content p-4 min-h-[300px] focus:outline-none"
      contenteditable="true"
      :placeholder="placeholder"
      @input="handleInput"
      @keydown="handleKeydown"
      @paste="handlePaste"
    ></div>

    <!-- 字数统计 -->
    <div
      class="border-t border-neutral-200 dark:border-neutral-700 p-3 flex items-center justify-between text-sm text-neutral-500 dark:text-neutral-400"
    >
      <div>字数: {{ wordCount }}</div>
      <div class="flex items-center space-x-4">
        <span>支持 Markdown 语法</span>
        <button
          type="button"
          @click="togglePreview"
          class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
        >
          {{ showPreview ? '编辑' : '预览' }}
        </button>
      </div>
    </div>

    <!-- 预览模式 -->
    <div
      v-if="showPreview"
      class="preview-content p-4 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50"
      v-html="previewContent"
    ></div>
  </div>
</template>

<script setup>
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  ListBulletIcon,
  LinkIcon,
  ChatBubbleBottomCenterTextIcon,
  MinusIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'

// 自定义图标组件（简单实现）
const ListNumberIcon = {
  template: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7M5 5v14l4-7-4-7z"/>
  </svg>`,
}

// Props
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '开始写作...',
  },
})

// Emits
const emit = defineEmits(['update:modelValue'])

// 响应式数据
const editorRef = ref(null)
const showPreview = ref(false)

// 计算属性
const wordCount = computed(() => {
  const text = editorRef.value?.textContent || ''
  return text.trim().length
})

const previewContent = computed(() => {
  // 简单的 Markdown 转换（实际项目中应该使用专业的 Markdown 解析器）
  let content = props.modelValue

  // 基本的 Markdown 转换
  content = content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>')

  return content
})

// 方法
const execCommand = (command, value = null) => {
  document.execCommand(command, false, value)
  editorRef.value?.focus()
  handleInput()
}

const isActive = (command) => {
  return document.queryCommandState(command)
}

const insertLink = () => {
  const url = prompt('请输入链接地址:')
  if (url) {
    execCommand('createLink', url)
  }
}

const handleInput = () => {
  const content = editorRef.value?.innerHTML || ''
  emit('update:modelValue', content)
}

const handleKeydown = (event) => {
  // 处理快捷键
  if (event.ctrlKey || event.metaKey) {
    switch (event.key) {
      case 'b':
        event.preventDefault()
        execCommand('bold')
        break
      case 'i':
        event.preventDefault()
        execCommand('italic')
        break
      case 'u':
        event.preventDefault()
        execCommand('underline')
        break
    }
  }
}

const handlePaste = (event) => {
  // 处理粘贴，清理格式
  event.preventDefault()
  const text = event.clipboardData.getData('text/plain')
  document.execCommand('insertText', false, text)
}

const togglePreview = () => {
  showPreview.value = !showPreview.value
}

// 监听 modelValue 变化
watch(
  () => props.modelValue,
  (newValue) => {
    if (editorRef.value && editorRef.value.innerHTML !== newValue) {
      editorRef.value.innerHTML = newValue
    }
  }
)

// 组件挂载后设置初始内容
onMounted(() => {
  if (editorRef.value && props.modelValue) {
    editorRef.value.innerHTML = props.modelValue
  }
})
</script>

<style scoped>
.rich-text-editor {
  @apply border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden bg-white dark:bg-neutral-800;
}

.toolbar-btn {
  @apply p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors;
}

.toolbar-btn.active {
  @apply text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/20;
}

.editor-content {
  @apply text-neutral-700 dark:text-neutral-300 leading-relaxed;
}

.editor-content:empty:before {
  content: attr(placeholder);
  @apply text-neutral-500 dark:text-neutral-400;
}

.editor-content h1 {
  @apply text-2xl font-bold mb-4;
}

.editor-content h2 {
  @apply text-xl font-bold mb-3;
}

.editor-content h3 {
  @apply text-lg font-bold mb-2;
}

.editor-content p {
  @apply mb-3;
}

.editor-content ul,
.editor-content ol {
  @apply mb-3 pl-6;
}

.editor-content li {
  @apply mb-1;
}

.editor-content blockquote {
  @apply border-l-4 border-primary-500 pl-4 italic text-neutral-600 dark:text-neutral-400 mb-3;
}

.editor-content a {
  @apply text-primary-600 dark:text-primary-400 underline;
}

.editor-content code {
  @apply bg-neutral-100 dark:bg-neutral-700 px-1 py-0.5 rounded text-sm;
}

.editor-content hr {
  @apply border-neutral-300 dark:border-neutral-600 my-4;
}

.preview-content {
  @apply prose prose-neutral dark:prose-invert max-w-none;
}
</style>
