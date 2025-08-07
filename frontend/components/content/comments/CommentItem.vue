<template>
  <div class="comment-item">
    <!-- 主评论 -->
    <div class="flex space-x-3">
      <!-- 头像 -->
      <img
        :src="comment.author?.avatar || '/avatars/anonymous.jpg'"
        :alt="comment.author?.name || '匿名用户'"
        class="w-10 h-10 rounded-full flex-shrink-0"
        @error="handleImageError"
      >

      <!-- 评论内容 -->
      <div class="flex-1 min-w-0">
        <!-- 作者和时间 -->
        <div class="flex items-center space-x-2 mb-1">
          <span class="font-medium text-neutral-700 dark:text-neutral-300">
            {{ comment.author?.name || '匿名用户' }}
          </span>
          <span v-if="comment.isAnonymous" class="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500">
            匿名
          </span>
          <time class="text-sm text-neutral-500 dark:text-neutral-400">
            {{ formatDate(comment.createdAt) }}
          </time>
        </div>

        <!-- 评论文本 -->
        <div class="text-neutral-600 dark:text-neutral-400 mb-3 leading-relaxed">
          <MarkdownRenderer :content="comment.content" />
        </div>

        <!-- 操作按钮 -->
        <div class="flex items-center space-x-4">
          <button
            @click="toggleLike"
            class="flex items-center space-x-1 text-sm text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            :class="{ 'text-red-500': isLiked }"
          >
            <HeartIcon class="w-4 h-4" :class="{ 'fill-current': isLiked }" />
            <span>{{ comment.likes || 0 }}</span>
          </button>

          <button
            @click="toggleReply"
            class="text-sm text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            回复
          </button>

          <button
            v-if="canDelete"
            @click="deleteComment"
            class="text-sm text-red-500 hover:text-red-600 transition-colors"
          >
            删除
          </button>

          <button
            v-if="canReport"
            @click="reportComment"
            class="text-sm text-neutral-500 dark:text-neutral-400 hover:text-orange-500 transition-colors"
          >
            举报
          </button>
        </div>

        <!-- 回复输入框 -->
        <div v-if="showReplyInput" class="mt-4">
          <div class="neu-card-inset p-3 rounded-lg">
            <textarea
              v-model="replyContent"
              placeholder="写下你的回复..."
              class="w-full bg-transparent border-none outline-none resize-none text-neutral-700 dark:text-neutral-300 placeholder-neutral-500 text-sm"
              rows="2"
              @keydown.ctrl.enter="submitReply"
            ></textarea>
            
            <div class="flex items-center justify-between mt-2">
              <span class="text-xs text-neutral-500">Ctrl + Enter 发送</span>
              <div class="flex items-center space-x-2">
                <button
                  @click="cancelReply"
                  class="text-xs text-neutral-500 hover:text-neutral-700 transition-colors"
                >
                  取消
                </button>
                <button
                  @click="submitReply"
                  :disabled="!replyContent.trim() || submittingReply"
                  class="neu-button-primary px-3 py-1 text-xs disabled:opacity-50"
                >
                  {{ submittingReply ? '发送中...' : '回复' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 回复列表 -->
        <div v-if="comment.replies && comment.replies.length > 0" class="mt-4 space-y-3">
          <div
            v-for="reply in comment.replies"
            :key="reply.id"
            class="flex space-x-3 pl-4 border-l-2 border-neutral-200 dark:border-neutral-700"
          >
            <img
              :src="reply.author?.avatar || '/avatars/anonymous.jpg'"
              :alt="reply.author?.name || '匿名用户'"
              class="w-8 h-8 rounded-full flex-shrink-0"
              @error="handleImageError"
            >
            
            <div class="flex-1 min-w-0">
              <div class="flex items-center space-x-2 mb-1">
                <span class="font-medium text-neutral-700 dark:text-neutral-300 text-sm">
                  {{ reply.author?.name || '匿名用户' }}
                </span>
                <span v-if="reply.isAnonymous" class="text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-gray-500">
                  匿名
                </span>
                <time class="text-xs text-neutral-500 dark:text-neutral-400">
                  {{ formatDate(reply.createdAt) }}
                </time>
              </div>
              
              <div class="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                <MarkdownRenderer :content="reply.content" />
              </div>
              
              <div class="flex items-center space-x-3 mt-2">
                <button
                  @click="() => toggleReplyLike(reply)"
                  class="flex items-center space-x-1 text-xs text-neutral-500 dark:text-neutral-400 hover:text-primary-600 transition-colors"
                >
                  <HeartIcon class="w-3 h-3" />
                  <span>{{ reply.likes || 0 }}</span>
                </button>
                
                <button
                  @click="() => replyToReply(reply)"
                  class="text-xs text-neutral-500 dark:text-neutral-400 hover:text-primary-600 transition-colors"
                >
                  回复
                </button>
              </div>
            </div>
          </div>
          
          <!-- 展开/收起更多回复 -->
          <button
            v-if="comment.replies.length > 3"
            @click="toggleShowAllReplies"
            class="text-sm text-primary-600 hover:text-primary-700 transition-colors ml-11"
          >
            {{ showAllReplies ? '收起回复' : `查看全部 ${comment.replies.length} 条回复` }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { HeartIcon } from '@heroicons/vue/24/outline'
import { formatDate } from '~/utils'
import type { Comment } from '~/types'

interface Props {
  comment: Comment
  currentUserId?: string
}

interface Emits {
  (e: 'reply', comment: Comment, content: string): void
  (e: 'like', comment: Comment): void
  (e: 'report', comment: Comment): void
  (e: 'delete', comment: Comment): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 响应式数据
const showReplyInput = ref<boolean>(false)
const replyContent = ref<string>('')
const submittingReply = ref<boolean>(false)
const isLiked = ref<boolean>(false)
const showAllReplies = ref<boolean>(false)

// 计算属性
const canDelete = computed(() => {
  return props.comment.author?.id === props.currentUserId
})

const canReport = computed(() => {
  return props.comment.author?.id !== props.currentUserId
})

// 方法
const handleImageError = (event: Event): void => {
  const target = event.target as HTMLImageElement
  target.src = '/avatars/default.jpg'
}

const toggleLike = (): void => {
  isLiked.value = !isLiked.value
  emit('like', props.comment)
}

const toggleReply = (): void => {
  showReplyInput.value = !showReplyInput.value
  if (showReplyInput.value) {
    nextTick(() => {
      // 聚焦到回复输入框
      const textarea = document.querySelector(`[data-comment-id="${props.comment.id}"] textarea`)
      if (textarea) {
        (textarea as HTMLTextAreaElement).focus()
      }
    })
  }
}

const cancelReply = (): void => {
  showReplyInput.value = false
  replyContent.value = ''
}

const submitReply = async (): Promise<void> => {
  if (!replyContent.value.trim() || submittingReply.value) return

  submittingReply.value = true

  try {
    emit('reply', props.comment, replyContent.value.trim())
    replyContent.value = ''
    showReplyInput.value = false
  } catch (error) {
    console.error('回复失败:', error)
  } finally {
    submittingReply.value = false
  }
}

const deleteComment = (): void => {
  if (confirm('确定要删除这条评论吗？')) {
    emit('delete', props.comment)
  }
}

const reportComment = (): void => {
  emit('report', props.comment)
}

const toggleReplyLike = (reply: Comment): void => {
  // 处理回复点赞
  console.log('点赞回复:', reply.id)
}

const replyToReply = (reply: Comment): void => {
  // 回复特定的回复
  replyContent.value = `@${reply.author?.name || '匿名用户'} `
  showReplyInput.value = true
}

const toggleShowAllReplies = (): void => {
  showAllReplies.value = !showAllReplies.value
}
</script>

<style scoped>
.comment-item {
  @apply py-4 border-b border-neutral-200 dark:border-neutral-700 last:border-b-0;
}

.comment-item:hover {
  @apply bg-neutral-50/50 dark:bg-neutral-800/50 rounded-lg px-2 -mx-2;
}
</style>
