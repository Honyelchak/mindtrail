<!--
  HistoryRecords.vue - 历史记录组件
  
  Features:
  - 历年今日
  - 上个月今天
  - 去年今天
  - 时间轴展示
-->

<template>
  <section class="history-records py-16 bg-gradient-to-b from-neutral-900 to-neutral-800">
    <div class="container mx-auto px-6">
      <!-- 标题区域 -->
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-white mb-4">时光回溯</h2>
        <p class="text-white/70 max-w-2xl mx-auto">
          回顾过去的足迹，发现时间的力量。看看历史上的今天，你都做了什么。
        </p>
      </div>

      <!-- 历史记录卡片 -->
      <div class="grid md:grid-cols-3 gap-8 mb-12">
        <!-- 历年今日 -->
        <div class="history-card group">
          <div class="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <div class="flex items-center space-x-3 mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Icon name="heroicons:calendar-days" class="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 class="text-white font-semibold">历年今日</h3>
                <p class="text-white/60 text-sm">{{ formatDate(today) }}</p>
              </div>
            </div>
            
            <div class="space-y-3">
              <div 
                v-for="record in todayInHistory" 
                :key="record.id"
                class="p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors duration-200"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <p class="text-white text-sm line-clamp-2">{{ record.content }}</p>
                    <div class="flex items-center space-x-2 mt-2">
                      <span class="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full">
                        {{ record.type }}
                      </span>
                      <span class="text-white/50 text-xs">{{ record.year }}年</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <NuxtLink 
              to="/timeline-optimized"
              class="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 text-sm mt-4 transition-colors duration-200"
            >
              <span>查看更多</span>
              <Icon name="heroicons:arrow-right" class="w-4 h-4" />
            </NuxtLink>
          </div>
        </div>

        <!-- 上个月今天 -->
        <div class="history-card group">
          <div class="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <div class="flex items-center space-x-3 mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Icon name="heroicons:clock" class="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 class="text-white font-semibold">上个月今天</h3>
                <p class="text-white/60 text-sm">{{ formatDate(lastMonth) }}</p>
              </div>
            </div>
            
            <div class="space-y-3">
              <div 
                v-for="record in lastMonthRecords" 
                :key="record.id"
                class="p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors duration-200"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <p class="text-white text-sm line-clamp-2">{{ record.content }}</p>
                    <div class="flex items-center space-x-2 mt-2">
                      <span class="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full">
                        {{ record.type }}
                      </span>
                      <span class="text-white/50 text-xs">{{ record.time }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <NuxtLink 
              to="/moments-new"
              class="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300 text-sm mt-4 transition-colors duration-200"
            >
              <span>查看更多</span>
              <Icon name="heroicons:arrow-right" class="w-4 h-4" />
            </NuxtLink>
          </div>
        </div>

        <!-- 去年今天 -->
        <div class="history-card group">
          <div class="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <div class="flex items-center space-x-3 mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Icon name="heroicons:photo" class="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 class="text-white font-semibold">去年今天</h3>
                <p class="text-white/60 text-sm">{{ formatDate(lastYear) }}</p>
              </div>
            </div>
            
            <div class="space-y-3">
              <div 
                v-for="record in lastYearRecords" 
                :key="record.id"
                class="p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors duration-200"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <p class="text-white text-sm line-clamp-2">{{ record.content }}</p>
                    <div class="flex items-center space-x-2 mt-2">
                      <span class="text-xs px-2 py-1 bg-green-500/20 text-green-300 rounded-full">
                        {{ record.type }}
                      </span>
                      <span class="text-white/50 text-xs">{{ record.time }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <NuxtLink 
              to="/gallery-enhanced"
              class="inline-flex items-center space-x-2 text-green-400 hover:text-green-300 text-sm mt-4 transition-colors duration-200"
            >
              <span>查看更多</span>
              <Icon name="heroicons:arrow-right" class="w-4 h-4" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// 历史记录接口
interface HistoryRecord {
  id: string
  content: string
  type: string
  year?: number
  time?: string
  date: Date
}

// 当前日期
const today = new Date()
const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
const lastYear = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate())

// 格式化日期
const formatDate = (date: Date) => {
  return date.toLocaleDateString('zh-CN', {
    month: 'long',
    day: 'numeric'
  })
}

// Mock数据 - 历年今日
const todayInHistory = ref<HistoryRecord[]>([
  {
    id: '1',
    content: '完成了第一篇技术博客的写作，记录了学习Vue3的心得体会',
    type: '文章',
    year: 2023,
    date: new Date(2023, today.getMonth(), today.getDate())
  },
  {
    id: '2',
    content: '和朋友们一起去爬山，拍了很多美丽的风景照片',
    type: '相册',
    year: 2022,
    date: new Date(2022, today.getMonth(), today.getDate())
  },
  {
    id: '3',
    content: '今天心情特别好，因为收到了心仪公司的offer',
    type: '说说',
    year: 2021,
    date: new Date(2021, today.getMonth(), today.getDate())
  }
])

// Mock数据 - 上个月今天
const lastMonthRecords = ref<HistoryRecord[]>([
  {
    id: '4',
    content: '开始学习新的编程语言Rust，感觉很有挑战性',
    type: '学习',
    time: '14:30',
    date: lastMonth
  },
  {
    id: '5',
    content: '和家人一起吃晚饭，聊了很多有趣的话题',
    type: '生活',
    time: '19:00',
    date: lastMonth
  }
])

// Mock数据 - 去年今天
const lastYearRecords = ref<HistoryRecord[]>([
  {
    id: '6',
    content: '参加了一个技术分享会，学到了很多新知识',
    type: '活动',
    time: '上午',
    date: lastYear
  },
  {
    id: '7',
    content: '拍摄了一组城市夜景照片，效果很满意',
    type: '摄影',
    time: '晚上',
    date: lastYear
  }
])
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
