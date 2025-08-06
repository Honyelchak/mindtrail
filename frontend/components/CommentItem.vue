<template>
  <div class="comment-item">
    <!-- 主评论 -->
    <div class="flex space-x-3">
      <!-- 头像 -->
      <img
        :src="comment.author.avatar"
        :alt="comment.author.name"
        class="w-10 h-10 rounded-full flex-shrink-0"
        @error="handleImageError"
      >

      <!-- 评论内容 -->
      <div class="flex-1 min-w-0">
        <!-- 作者和时间 -->
        <div class="flex items-center space-x-2 mb-1">
          <span class="font-medium text-neutral-700 dark:text-neutral-300">
            {{ comment.author.name }}
          </span>
          <time class="text-sm text-neutral-500 dark:text-neutral-400">
            {{ formatDate(comment.createdAt) }}
          </time>
        </div>

        <!-- 评论文本 -->
        <div class="text-neutral-600 dark:text-neutral-400 mb-3 leading-relaxed">
          {{ comment.content }}
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
            class="text-sm text-neutral-500 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            删除
          </button>
        </div>

        <!-- 回复输入框 -->
        <div v-if="showReplyInput" class="mt-4">
          <div class="neu-card-inset p-3 rounded-lg">
            <textarea
              v-model="replyContent"
              :placeholder="`回复 ${comment.author.name}...`"
              class="w-full bg-transparent border-none outline-none resize-none text-neutral-700 dark:text-neutral-300 placeholder-neutral-500"
              rows="2"
              @keydown.ctrl.enter="submitReply"
            ></textarea>
            
            <div class="flex items-center justify-end space-x-2 mt-2">
              <button
                @click="cancelReply"
                class="px-3 py-1 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
              >
                取消
              </button>
              <button
                @click="submitReply"
                class="neu-button px-4 py-1 text-sm"
                :disabled="!replyContent.trim() || submittingReply"
              >
                {{ submittingReply ? '发送中...' : '回复' }}
              </button>
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
            <!-- 回复头像 -->
            <img
              :src="reply.author.avatar"
              :alt="reply.author.name"
              class="w-8 h-8 rounded-full flex-shrink-0"
              @error="handleImageError"
            >

            <!-- 回复内容 -->
            <div class="flex-1 min-w-0">
              <!-- 回复作者和时间 -->
              <div class="flex items-center space-x-2 mb-1">
                <span class="font-medium text-neutral-700 dark:text-neutral-300 text-sm">
                  {{ reply.author.name }}
                </span>
                <time class="text-xs text-neutral-500 dark:text-neutral-400">
                  {{ formatDate(reply.createdAt) }}
                </time>
              </div>

              <!-- 回复文本 -->
              <div class="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed mb-2">
                {{ reply.content }}
              </div>

              <!-- 回复操作 -->
              <div class="flex items-center space-x-3">
                <button
                  @click="toggleReplyLike(reply.id)"
                  class="flex items-center space-x-1 text-xs text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  <HeartIcon class="w-3 h-3" />
                  <span>{{ reply.likes || 0 }}</span>
                </button>

                <button
                  v-if="canDeleteReply(reply)"
                  @click="deleteReply(reply.id)"
                  class="text-xs text-neutral-500 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { HeartIcon } from '@heroicons/vue/24/outline'

// Props
const props = defineProps({
  comment: {
    type: Object,
    required: true
  }
})

// Emits
const emit = defineEmits(['reply', 'like', 'delete'])

// 响应式数据
const isLiked = ref(false)
const showReplyInput = ref(false)
const replyContent = ref('')
const submittingReply = ref(false)

// 计算属性
const canDelete = computed(() => {
  // 这里可以根据用户权限判断是否可以删除
  // 例如：只有评论作者或管理员可以删除
  return props.comment.author.name === '当前用户'
})

// 格式化时间
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date

  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  
  return date.toLocaleDateString('zh-CN', {
    month: 'long',
    day: 'numeric'
  })
}

// 切换点赞
const toggleLike = () => {
  isLiked.value = !isLiked.value
  emit('like', props.comment.id)
}

// 切换回复输入框
const toggleReply = () => {
  showReplyInput.value = !showReplyInput.value
  if (!showReplyInput.value) {
    replyContent.value = ''
  }
}

// 取消回复
const cancelReply = () => {
  showReplyInput.value = false
  replyContent.value = ''
}

// 提交回复
const submitReply = async () => {
  if (!replyContent.value.trim() || submittingReply.value) return

  submittingReply.value = true

  try {
    emit('reply', props.comment.id, replyContent.value.trim())
    
    // 清空输入框并隐藏
    replyContent.value = ''
    showReplyInput.value = false

  } catch (error) {
    console.error('Error submitting reply:', error)
  } finally {
    submittingReply.value = false
  }
}

// 删除评论
const deleteComment = () => {
  if (confirm('确定要删除这条评论吗？')) {
    emit('delete', props.comment.id)
  }
}

// 切换回复点赞
const toggleReplyLike = (replyId) => {
  console.log('Toggle reply like:', replyId)
  // 实现回复点赞逻辑
}

// 判断是否可以删除回复
const canDeleteReply = (reply) => {
  return reply.author.name === '当前用户'
}

// 删除回复
const deleteReply = (replyId) => {
  if (confirm('确定要删除这条回复吗？')) {
    console.log('Delete reply:', replyId)
    // 实现删除回复逻辑
  }
}

// 处理图片加载错误
const handleImageError = (event) => {
  event.target.src = '/avatars/default.jpg'
}
</script>

<style scoped>
.comment-item {
  @apply py-4;
}

.comment-item:not(:last-child) {
  @apply border-b border-neutral-200/50 dark:border-neutral-700/50;
}

textarea {
  min-height: 60px;
}

textarea:focus {
  outline: none;
}
</style>
