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
            <span>支持 Markdown</span>
          </div>
          
          <div class="flex items-center space-x-2">
            <button
              type="button"
              @click="toggleAnonymous"
              class="neu-button-sm px-3 py-1 text-xs"
              :class="{ 'active': isAnonymous }"
            >
              {{ isAnonymous ? '匿名' : '实名' }}
            </button>
            
            <button
              type="button"
              @click="submitComment"
              :disabled="!newComment.trim() || submitting"
              class="neu-button-primary px-4 py-2 text-sm disabled:opacity-50"
            >
              {{ submitting ? '发送中...' : '发送' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 评论列表 -->
    <div class="space-y-6">
      <CommentItem
        v-for="comment in sortedComments"
        :key="comment.id"
        :comment="comment"
        @reply="handleReply"
        @like="handleLike"
        @report="handleReport"
      />
      
      <!-- 加载更多 -->
      <div v-if="hasMore" class="text-center">
        <button
          @click="loadMore"
          :disabled="loading"
          class="neu-button px-6 py-2"
        >
          {{ loading ? '加载中...' : '加载更多评论' }}
        </button>
      </div>
      
      <!-- 空状态 -->
      <div v-if="comments.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4">💬</div>
        <h4 class="text-lg font-medium text-neutral-600 dark:text-neutral-400 mb-2">
          还没有评论
        </h4>
        <p class="text-neutral-500 dark:text-neutral-500">
          成为第一个评论的人吧！
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ChatBubbleLeftIcon } from '@heroicons/vue/24/outline'
import type { Comment } from '~/types'

interface Props {
  contentId: string
  contentType: 'moment' | 'article' | 'gallery'
  allowAnonymous?: boolean
}

interface Emits {
  (e: 'comment-added', comment: Comment): void
  (e: 'comment-updated', comment: Comment): void
}

const props = withDefaults(defineProps<Props>(), {
  allowAnonymous: true
})

const emit = defineEmits<Emits>()

// 响应式数据
const comments = ref<Comment[]>([])
const newComment = ref<string>('')
const isAnonymous = ref<boolean>(false)
const submitting = ref<boolean>(false)
const loading = ref<boolean>(false)
const hasMore = ref<boolean>(true)
const sortBy = ref<'newest' | 'oldest' | 'popular'>('newest')

// 计算属性
const sortedComments = computed(() => {
  const sorted = [...comments.value]
  
  switch (sortBy.value) {
    case 'newest':
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    case 'popular':
      return sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0))
    default:
      return sorted
  }
})

// 方法
const toggleAnonymous = (): void => {
  isAnonymous.value = !isAnonymous.value
}

const submitComment = async (): Promise<void> => {
  if (!newComment.value.trim() || submitting.value) return

  submitting.value = true

  try {
    const comment: Comment = {
      id: Date.now().toString(),
      contentId: props.contentId,
      content: newComment.value.trim(),
      author: isAnonymous.value ? null : {
        id: 'current-user',
        name: '当前用户',
        avatar: '/avatars/current-user.jpg'
      },
      isAnonymous: isAnonymous.value,
      createdAt: new Date().toISOString(),
      likes: 0,
      replies: []
    }

    // 这里应该调用API保存评论
    comments.value.unshift(comment)
    emit('comment-added', comment)
    
    // 清空输入
    newComment.value = ''
    
  } catch (error) {
    console.error('提交评论失败:', error)
  } finally {
    submitting.value = false
  }
}

const handleReply = (parentComment: Comment, replyContent: string): void => {
  // 处理回复逻辑
  console.log('回复评论:', parentComment.id, replyContent)
}

const handleLike = (comment: Comment): void => {
  // 处理点赞逻辑
  const index = comments.value.findIndex(c => c.id === comment.id)
  if (index > -1) {
    comments.value[index].likes = (comments.value[index].likes || 0) + 1
    emit('comment-updated', comments.value[index])
  }
}

const handleReport = (comment: Comment): void => {
  // 处理举报逻辑
  console.log('举报评论:', comment.id)
}

const loadMore = async (): Promise<void> => {
  if (loading.value) return
  
  loading.value = true
  
  try {
    // 这里应该调用API加载更多评论
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟没有更多数据
    hasMore.value = false
    
  } catch (error) {
    console.error('加载评论失败:', error)
  } finally {
    loading.value = false
  }
}

const loadComments = async (): Promise<void> => {
  loading.value = true
  
  try {
    // 这里应该调用API加载评论
    // const response = await api.getComments(props.contentId)
    // comments.value = response.data
    
    // 模拟数据
    comments.value = []
    
  } catch (error) {
    console.error('加载评论失败:', error)
  } finally {
    loading.value = false
  }
}

// 生命周期
onMounted(() => {
  loadComments()
})
</script>

<style scoped>
.neu-button-sm.active {
  @apply bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300;
}
</style>
