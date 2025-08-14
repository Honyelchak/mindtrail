<!--
  PhotoReflection.vue - 图片评价/感悟组件
  
  Features:
  - 添加感悟/评价
  - 时间线展示历史感悟
  - 情绪标记
  - 标签管理
-->

<template>
  <div class="photo-reflection">
    <!-- 当前感悟 -->
    <div class="current-reflection mb-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-white">我的感悟</h3>
        <button
          @click="showAddReflection = !showAddReflection"
          class="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 rounded-lg transition-all duration-300 text-white text-sm"
        >
          <Icon name="heroicons:plus" class="w-4 h-4" />
          <span>添加感悟</span>
        </button>
      </div>

      <!-- 添加感悟表单 -->
      <div
        v-if="showAddReflection"
        class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6"
      >
        <div class="space-y-4">
          <!-- 感悟内容 -->
          <div>
            <label class="block text-sm font-medium text-white/80 mb-2">感悟内容</label>
            <textarea
              v-model="newReflection.content"
              placeholder="写下你对这张照片的感悟..."
              rows="4"
              class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none"
            ></textarea>
          </div>

          <!-- 情绪选择 -->
          <div>
            <label class="block text-sm font-medium text-white/80 mb-2">当前情绪</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="mood in moods"
                :key="mood.id"
                @click="newReflection.mood = mood.id"
                :class="[
                  'flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300',
                  newReflection.mood === mood.id
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                ]"
              >
                <span class="text-lg">{{ mood.emoji }}</span>
                <span class="text-sm">{{ mood.label }}</span>
              </button>
            </div>
          </div>

          <!-- 标签 -->
          <div>
            <label class="block text-sm font-medium text-white/80 mb-2">标签</label>
            <div class="flex flex-wrap gap-2 mb-2">
              <button
                v-for="tag in availableTags"
                :key="tag"
                @click="toggleReflectionTag(tag)"
                :class="[
                  'px-3 py-1 rounded-full text-sm transition-all duration-300',
                  newReflection.tags.includes(tag)
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                ]"
              >
                {{ tag }}
              </button>
            </div>
            <input
              v-model="newTag"
              @keyup.enter="addNewTag"
              placeholder="添加新标签..."
              class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm"
            />
          </div>

          <!-- 操作按钮 -->
          <div class="flex items-center space-x-3">
            <button
              @click="saveReflection"
              :disabled="!newReflection.content.trim()"
              class="flex-1 px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 disabled:from-gray-500 disabled:to-gray-600 text-white rounded-lg transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
            >
              保存感悟
            </button>
            <button
              @click="cancelReflection"
              class="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors duration-200"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 历史感悟时间线 -->
    <div class="reflections-timeline">
      <h4 class="text-md font-semibold text-white mb-4">历史感悟</h4>
      
      <div v-if="reflections.length === 0" class="text-center py-8">
        <Icon name="heroicons:chat-bubble-left-ellipsis" class="w-12 h-12 text-white/30 mx-auto mb-3" />
        <p class="text-white/60">还没有感悟记录</p>
        <p class="text-white/40 text-sm">点击上方按钮添加你的第一个感悟</p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="reflection in reflections"
          :key="reflection.id"
          class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-300"
        >
          <!-- 感悟头部 -->
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center space-x-3">
              <div class="flex items-center space-x-2">
                <span class="text-2xl">{{ getMoodEmoji(reflection.mood) }}</span>
                <span class="text-white/80 text-sm">{{ getMoodLabel(reflection.mood) }}</span>
              </div>
              <span class="text-white/50 text-sm">{{ formatDate(reflection.createdAt) }}</span>
            </div>
            <button
              @click="deleteReflection(reflection.id)"
              class="w-6 h-6 bg-red-500/20 hover:bg-red-500/30 rounded flex items-center justify-center transition-colors duration-200"
            >
              <Icon name="heroicons:trash" class="w-3 h-3 text-red-400" />
            </button>
          </div>

          <!-- 感悟内容 -->
          <p class="text-white/90 mb-3 leading-relaxed">{{ reflection.content }}</p>

          <!-- 标签 -->
          <div v-if="reflection.tags.length > 0" class="flex flex-wrap gap-2">
            <span
              v-for="tag in reflection.tags"
              :key="tag"
              class="px-2 py-1 bg-white/10 text-white/70 rounded-full text-xs"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 感悟接口
interface PhotoReflection {
  id: string
  content: string
  mood: string
  tags: string[]
  createdAt: string
}

// 情绪接口
interface Mood {
  id: string
  label: string
  emoji: string
}

// Props
interface Props {
  photoId: string
}

const props = defineProps<Props>()

// 响应式数据
const showAddReflection = ref(false)
const newTag = ref('')

// 新感悟数据
const newReflection = ref({
  content: '',
  mood: 'neutral',
  tags: [] as string[]
})

// 情绪选项
const moods = ref<Mood[]>([
  { id: 'happy', label: '开心', emoji: '😊' },
  { id: 'excited', label: '兴奋', emoji: '🤩' },
  { id: 'calm', label: '平静', emoji: '😌' },
  { id: 'nostalgic', label: '怀念', emoji: '🥺' },
  { id: 'grateful', label: '感恩', emoji: '🙏' },
  { id: 'thoughtful', label: '深思', emoji: '🤔' },
  { id: 'surprised', label: '惊喜', emoji: '😲' },
  { id: 'neutral', label: '平常', emoji: '😐' }
])

// 可用标签
const availableTags = ref([
  '美好回忆', '成长', '友情', '家人', '旅行', '美食', '自然', '城市', '夜景', '人像'
])

// Mock历史感悟数据
const reflections = ref<PhotoReflection[]>([
  {
    id: '1',
    content: '这张照片让我想起了那个美好的夏天，和朋友们一起度过的快乐时光。时间过得真快，但这些珍贵的回忆永远不会褪色。',
    mood: 'nostalgic',
    tags: ['美好回忆', '友情'],
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    content: '看到这张照片，我意识到自己在这一年里成长了很多。从当时的青涩到现在的成熟，每一步都是珍贵的经历。',
    mood: 'thoughtful',
    tags: ['成长', '回忆'],
    createdAt: '2023-12-20T15:45:00Z'
  }
])

// 获取情绪表情
const getMoodEmoji = (moodId: string) => {
  const mood = moods.value.find(m => m.id === moodId)
  return mood?.emoji || '😐'
}

// 获取情绪标签
const getMoodLabel = (moodId: string) => {
  const mood = moods.value.find(m => m.id === moodId)
  return mood?.label || '平常'
}

// 切换感悟标签
const toggleReflectionTag = (tag: string) => {
  const index = newReflection.value.tags.indexOf(tag)
  if (index > -1) {
    newReflection.value.tags.splice(index, 1)
  } else {
    newReflection.value.tags.push(tag)
  }
}

// 添加新标签
const addNewTag = () => {
  const tag = newTag.value.trim()
  if (tag && !availableTags.value.includes(tag)) {
    availableTags.value.push(tag)
    newReflection.value.tags.push(tag)
    newTag.value = ''
  }
}

// 保存感悟
const saveReflection = () => {
  if (!newReflection.value.content.trim()) return

  const reflection: PhotoReflection = {
    id: `reflection-${Date.now()}`,
    content: newReflection.value.content.trim(),
    mood: newReflection.value.mood,
    tags: [...newReflection.value.tags],
    createdAt: new Date().toISOString()
  }

  reflections.value.unshift(reflection)
  
  // 重置表单
  newReflection.value = {
    content: '',
    mood: 'neutral',
    tags: []
  }
  showAddReflection.value = false
}

// 取消添加感悟
const cancelReflection = () => {
  newReflection.value = {
    content: '',
    mood: 'neutral',
    tags: []
  }
  showAddReflection.value = false
}

// 删除感悟
const deleteReflection = (reflectionId: string) => {
  const index = reflections.value.findIndex(r => r.id === reflectionId)
  if (index > -1) {
    reflections.value.splice(index, 1)
  }
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) {
    return '昨天'
  } else if (diffDays < 7) {
    return `${diffDays} 天前`
  } else if (diffDays < 30) {
    return `${Math.floor(diffDays / 7)} 周前`
  } else if (diffDays < 365) {
    return `${Math.floor(diffDays / 30)} 个月前`
  } else {
    return `${Math.floor(diffDays / 365)} 年前`
  }
}
</script>

<style scoped>
/* 自定义滚动条 */
.space-y-4::-webkit-scrollbar {
  width: 4px;
}

.space-y-4::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.space-y-4::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.space-y-4::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>
