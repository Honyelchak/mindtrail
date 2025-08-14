<!--
  MarkdownRenderer.vue - Markdown渲染组件
  
  Features:
  - Markdown解析和渲染
  - 代码高亮
  - 自定义样式
  - 响应式设计
-->

<template>
  <div 
    class="markdown-content prose prose-invert prose-lg max-w-none"
    v-html="renderedContent"
  ></div>
</template>

<script setup lang="ts">
import MarkdownIt from 'markdown-it'

// Props
interface Props {
  content: string
  source?: 'string' | 'url'
}

const props = withDefaults(defineProps<Props>(), {
  content: '',
  source: 'string'
})

// Markdown解析器配置
const md = new MarkdownIt({
  html: true,        // 允许HTML标签
  breaks: true,      // 换行符转换为<br>
  linkify: true,     // 自动识别链接
  typographer: true, // 启用一些语言中性的替换和引号美化
})

// 自定义渲染规则
md.renderer.rules.heading_open = (tokens, idx, options, env, renderer) => {
  const token = tokens[idx]
  const level = token.tag
  const id = tokens[idx + 1]?.content?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, '') || ''
  
  return `<${level} id="${id}" class="group relative">`
}

md.renderer.rules.heading_close = (tokens, idx, options, env, renderer) => {
  const token = tokens[idx]
  const level = token.tag
  
  return `</${level}>`
}

// 代码块渲染
md.renderer.rules.code_block = (tokens, idx, options, env, renderer) => {
  const token = tokens[idx]
  const content = token.content
  
  return `<pre class="bg-black/30 border border-white/10 rounded-xl p-4 overflow-x-auto"><code class="text-yellow-300">${md.utils.escapeHtml(content)}</code></pre>`
}

md.renderer.rules.fence = (tokens, idx, options, env, renderer) => {
  const token = tokens[idx]
  const info = token.info ? md.utils.unescapeAll(token.info).trim() : ''
  const langName = info ? info.split(/\s+/g)[0] : ''
  const content = token.content
  
  return `<div class="code-block-wrapper mb-6">
    ${langName ? `<div class="code-block-header bg-black/50 border border-white/10 border-b-0 rounded-t-xl px-4 py-2 text-sm text-white/70">${langName}</div>` : ''}
    <pre class="bg-black/30 border border-white/10 ${langName ? 'rounded-b-xl' : 'rounded-xl'} p-4 overflow-x-auto"><code class="text-yellow-300 language-${langName}">${md.utils.escapeHtml(content)}</code></pre>
  </div>`
}

// 表格渲染
md.renderer.rules.table_open = () => {
  return '<div class="table-wrapper overflow-x-auto mb-6"><table class="min-w-full border border-white/20 rounded-xl overflow-hidden">'
}

md.renderer.rules.table_close = () => {
  return '</table></div>'
}

md.renderer.rules.thead_open = () => {
  return '<thead class="bg-white/10">'
}

md.renderer.rules.th_open = () => {
  return '<th class="px-4 py-3 text-left text-white font-semibold border-b border-white/20">'
}

md.renderer.rules.td_open = () => {
  return '<td class="px-4 py-3 text-white/90 border-b border-white/10">'
}

// 引用块渲染
md.renderer.rules.blockquote_open = () => {
  return '<blockquote class="border-l-4 border-blue-500 bg-blue-500/10 pl-6 py-4 my-6 rounded-r-xl">'
}

// 链接渲染
md.renderer.rules.link_open = (tokens, idx, options, env, renderer) => {
  const token = tokens[idx]
  const href = token.attrGet('href')
  const isExternal = href && (href.startsWith('http') || href.startsWith('//'))
  
  if (isExternal) {
    token.attrSet('target', '_blank')
    token.attrSet('rel', 'noopener noreferrer')
  }
  
  token.attrSet('class', 'text-blue-400 hover:text-blue-300 underline transition-colors duration-200')
  
  return renderer.renderToken(tokens, idx, options)
}

// 响应式数据
const renderedContent = ref('')

// 渲染Markdown内容
const renderMarkdown = async () => {
  try {
    let content = props.content
    
    // 如果是URL，则获取内容
    if (props.source === 'url' && props.content) {
      const response = await fetch(props.content)
      if (response.ok) {
        content = await response.text()
      } else {
        throw new Error(`Failed to fetch markdown: ${response.statusText}`)
      }
    }
    
    // 渲染Markdown
    renderedContent.value = md.render(content)
  } catch (error) {
    console.error('Error rendering markdown:', error)
    renderedContent.value = `<div class="text-red-400 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
      <h3 class="font-semibold mb-2">Markdown渲染错误</h3>
      <p>无法渲染Markdown内容: ${error.message}</p>
    </div>`
  }
}

// 监听props变化
watch(() => props.content, renderMarkdown, { immediate: true })
watch(() => props.source, renderMarkdown)

// 组件挂载时渲染
onMounted(() => {
  renderMarkdown()
})
</script>

<style scoped>
/* Markdown内容样式 */
:deep(.markdown-content) {
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.7;
}

/* 标题样式 */
:deep(.markdown-content h1) {
  @apply text-3xl font-bold text-white mb-6 mt-8 first:mt-0;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 0.5rem;
}

:deep(.markdown-content h2) {
  @apply text-2xl font-bold text-white mb-4 mt-6;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 0.25rem;
}

:deep(.markdown-content h3) {
  @apply text-xl font-semibold text-white mb-3 mt-5;
}

:deep(.markdown-content h4) {
  @apply text-lg font-semibold text-white mb-2 mt-4;
}

/* 段落样式 */
:deep(.markdown-content p) {
  @apply mb-4 text-white/90;
}

/* 列表样式 */
:deep(.markdown-content ul) {
  @apply mb-4 pl-6;
}

:deep(.markdown-content ol) {
  @apply mb-4 pl-6;
}

:deep(.markdown-content li) {
  @apply mb-2 text-white/90;
}

:deep(.markdown-content ul li) {
  @apply relative;
}

:deep(.markdown-content ul li::before) {
  content: '•';
  @apply absolute -left-4 text-blue-400 font-bold;
}

/* 强调样式 */
:deep(.markdown-content strong) {
  @apply font-bold text-white;
}

:deep(.markdown-content em) {
  @apply italic text-white/95;
}

/* 行内代码样式 */
:deep(.markdown-content code:not(pre code)) {
  @apply bg-white/10 text-yellow-300 px-2 py-1 rounded text-sm;
}

/* 分隔线样式 */
:deep(.markdown-content hr) {
  @apply border-white/20 my-8;
}

/* 图片样式 */
:deep(.markdown-content img) {
  @apply rounded-xl shadow-lg max-w-full h-auto my-6;
}

/* 引用块样式 */
:deep(.markdown-content blockquote) {
  @apply text-white/95 italic;
}

:deep(.markdown-content blockquote p) {
  @apply mb-2 last:mb-0;
}

/* 表格样式 */
:deep(.table-wrapper) {
  @apply shadow-lg rounded-xl;
}

:deep(.markdown-content table) {
  @apply w-full;
}

:deep(.markdown-content th:last-child),
:deep(.markdown-content td:last-child) {
  border-right: none;
}

:deep(.markdown-content tr:last-child td) {
  border-bottom: none;
}

/* 代码块样式 */
:deep(.code-block-wrapper) {
  @apply shadow-lg;
}

:deep(.code-block-header) {
  @apply font-mono;
}

/* 响应式调整 */
@media (max-width: 768px) {
  :deep(.markdown-content) {
    @apply text-base;
  }
  
  :deep(.markdown-content h1) {
    @apply text-2xl;
  }
  
  :deep(.markdown-content h2) {
    @apply text-xl;
  }
  
  :deep(.table-wrapper) {
    @apply text-sm;
  }
}
</style>
