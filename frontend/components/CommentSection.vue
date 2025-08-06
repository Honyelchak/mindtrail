<template>
  <section class="neu-card p-6">
    <h3 class="text-xl font-semibold mb-6 flex items-center space-x-2">
      <ChatBubbleLeftIcon class="w-5 h-5" />
      <span>评论 ({{ comments.length }})</span>
    </h3>

    <!-- 评论输入框 -->
    <div class="mb-8">
      <div class="neu-card-inset p-4 rounded-xl">
        <textarea
          v-model="newComment"
          placeholder="写下你的想法..."
          class="w-full bg-transparent border-none outline-none resize-none text-neutral-700 dark:text-neutral-300 placeholder-neutral-500"
          rows="3"
          @keydown.ctrl.enter="submitComment"
        ></textarea>
        
        <div class="flex items-center justify-between mt-4">
          <div class="flex items-center space-x-4 text-sm text-neutral-500 dark:text-neutral-400">
            <span>Ctrl + Enter 发送</span>
          </div>
          
          <div class="flex items-center space-x-2">
            <button
              @click="clearComment"
              class="px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
              :disabled="!newComment.trim()"
            >
              清空
            </button>
            <button
              @click="submitComment"
              class="neu-button px-6 py-2"
              :disabled="!newComment.trim() || submitting"
            >
              {{ submitting ? '发送中...' : '发送' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 评论列表 -->
    <div class="space-y-6">
      <!-- 空状态 -->
      <div v-if="comments.length === 0" class="text-center py-8">
        <div class="text-neutral-400 mb-2">
          <ChatBubbleLeftIcon class="w-8 h-8 mx-auto" />
        </div>
        <p class="text-neutral-500 dark:text-neutral-400">还没有评论，来说点什么吧</p>
      </div>

      <!-- 评论项 -->
      <div v-else>
        <CommentItem
          v-for="comment in comments"
          :key="comment.id"
          :comment="comment"
          @reply="handleReply"
          @like="handleLike"
          @delete="handleDelete"
        />
      </div>

      <!-- 加载更多 -->
      <div v-if="hasMore" class="text-center pt-4">
        <button
          @click="loadMoreComments"
          class="neu-button px-6 py-2"
          :disabled="loadingMore"
        >
          {{ loadingMore ? '加载中...' : '加载更多评论' }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ChatBubbleLeftIcon } from '@heroicons/vue/24/outline'

// Props
const props = defineProps({
  contentId: {
    type: String,
    required: true
  },
  contentType: {
    type: String,
    required: true
  }
})

// 响应式数据
const comments = ref([])
const newComment = ref('')
const submitting = ref(false)
const loadingMore = ref(false)
const hasMore = ref(false)

// 模拟评论数据
const mockComments = [
  {
    id: '1',
    content: '写得很好！很有启发性。',
    author: {
      name: '李四',
      avatar: '/avatars/user2.jpg'
    },
    createdAt: '2025-08-06T09:30:00Z',
    likes: 3,
    replies: [
      {
        id: '1-1',
        content: '同感，学到了很多。',
        author: {
          name: '王五',
          avatar: '/avatars/user3.jpg'
        },
        createdAt: '2025-08-06T10:15:00Z',
        likes: 1
      }
    ]
  },
  {
    id: '2',
    content: '这个观点很有意思，我之前没有想过这个角度。',
    author: {
      name: '赵六',
      avatar: '/avatars/user4.jpg'
    },
    createdAt: '2025-08-06T11:20:00Z',
    likes: 5,
    replies: []
  }
]

// 加载评论
const loadComments = async () => {
  try {
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // 根据内容 ID 和类型加载对应的评论
    comments.value = mockComments
    hasMore.value = false // 模拟没有更多评论
    
  } catch (error) {
    console.error('Error loading comments:', error)
  }
}

// 提交评论
const submitComment = async () => {
  if (!newComment.value.trim() || submitting.value) return

  submitting.value = true

  try {
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 500))

    // 创建新评论
    const comment = {
      id: Date.now().toString(),
      content: newComment.value.trim(),
      author: {
        name: '当前用户',
        avatar: '/avatars/current-user.jpg'
      },
      createdAt: new Date().toISOString(),
      likes: 0,
      replies: []
    }

    // 添加到评论列表顶部
    comments.value.unshift(comment)
    
    // 清空输入框
    newComment.value = ''

  } catch (error) {
    console.error('Error submitting comment:', error)
  } finally {
    submitting.value = false
  }
}

// 清空评论
const clearComment = () => {
  newComment.value = ''
}

// 处理回复
const handleReply = (commentId, replyContent) => {
  console.log('Reply to comment:', commentId, replyContent)
  // 实现回复逻辑
}

// 处理点赞
const handleLike = (commentId) => {
  console.log('Like comment:', commentId)
  // 实现点赞逻辑
}

// 处理删除
const handleDelete = (commentId) => {
  console.log('Delete comment:', commentId)
  // 实现删除逻辑
}

// 加载更多评论
const loadMoreComments = async () => {
  if (loadingMore.value) return

  loadingMore.value = true

  try {
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模拟加载更多评论
    // comments.value.push(...moreComments)
    
  } catch (error) {
    console.error('Error loading more comments:', error)
  } finally {
    loadingMore.value = false
  }
}

// 页面加载时获取评论
onMounted(() => {
  loadComments()
})
</script>

<style scoped>
/* 评论区域特定样式 */
textarea {
  min-height: 80px;
}

textarea:focus {
  outline: none;
}
</style>
