<!--
  ActivityHeatmap.vue - 活动热力图组件
  
  Features:
  - 类似GitHub的提交记录热力图
  - 显示每日记录活动频率
  - 支持年份切换
  - 悬停显示详细信息
-->

<template>
  <div class="activity-heatmap">
    <!-- 标题和年份选择 -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h3 class="text-xl font-semibold text-white mb-2">记录活动</h3>
        <p class="text-white/60 text-sm">{{ selectedYear }} 年的记录频率</p>
      </div>
      
      <!-- 年份选择器 -->
      <div class="flex items-center space-x-2">
        <button
          @click="previousYear"
          class="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors duration-200"
        >
          <Icon name="heroicons:chevron-left" class="w-4 h-4 text-white" />
        </button>
        
        <select
          v-model="selectedYear"
          @change="generateHeatmapData"
          class="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
        >
          <option v-for="year in availableYears" :key="year" :value="year" class="bg-neutral-800">
            {{ year }}
          </option>
        </select>
        
        <button
          @click="nextYear"
          :disabled="selectedYear >= currentYear"
          class="w-8 h-8 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-colors duration-200"
        >
          <Icon name="heroicons:chevron-right" class="w-4 h-4 text-white" />
        </button>
      </div>
    </div>

    <!-- 热力图 -->
    <div class="heatmap-container bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <!-- 月份标签 -->
      <div class="flex justify-between text-xs text-white/60 mb-2">
        <span v-for="month in months" :key="month" class="w-12 text-center">
          {{ month }}
        </span>
      </div>
      
      <!-- 热力图网格 -->
      <div class="heatmap-grid">
        <!-- 星期标签 -->
        <div class="weekday-labels">
          <div v-for="day in weekdays" :key="day" class="weekday-label">
            {{ day }}
          </div>
        </div>
        
        <!-- 日期网格 -->
        <div class="days-grid">
          <div
            v-for="(day, index) in heatmapData"
            :key="index"
            :class="getDayClass(day.count)"
            class="day-cell"
            :title="getDayTooltip(day)"
            @mouseenter="showTooltip($event, day)"
            @mouseleave="hideTooltip"
          >
          </div>
        </div>
      </div>
      
      <!-- 图例 -->
      <div class="flex items-center justify-between mt-4">
        <div class="text-xs text-white/60">
          {{ totalRecords }} 条记录 · {{ activeDays }} 个活跃天数
        </div>
        
        <div class="flex items-center space-x-2">
          <span class="text-xs text-white/60">少</span>
          <div class="flex space-x-1">
            <div class="w-3 h-3 rounded-sm bg-white/10"></div>
            <div class="w-3 h-3 rounded-sm bg-green-900/50"></div>
            <div class="w-3 h-3 rounded-sm bg-green-700/70"></div>
            <div class="w-3 h-3 rounded-sm bg-green-500/80"></div>
            <div class="w-3 h-3 rounded-sm bg-green-400"></div>
          </div>
          <span class="text-xs text-white/60">多</span>
        </div>
      </div>
    </div>

    <!-- 悬停提示 -->
    <div
      v-if="tooltip.show"
      ref="tooltipRef"
      class="fixed z-50 bg-neutral-900 border border-white/20 rounded-lg px-3 py-2 text-sm text-white shadow-lg pointer-events-none"
      :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
    >
      <div class="font-semibold">{{ tooltip.date }}</div>
      <div class="text-white/70">{{ tooltip.count }} 条记录</div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 接口定义
interface HeatmapDay {
  date: Date
  count: number
  records: string[]
}

// 响应式数据
const currentYear = new Date().getFullYear()
const selectedYear = ref(currentYear)
const heatmapData = ref<HeatmapDay[]>([])
const tooltip = ref({
  show: false,
  x: 0,
  y: 0,
  date: '',
  count: 0
})

// 可选年份
const availableYears = computed(() => {
  const years = []
  for (let year = 2020; year <= currentYear; year++) {
    years.push(year)
  }
  return years.reverse()
})

// 月份和星期标签
const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
const weekdays = ['', '一', '', '三', '', '五', '']

// 计算属性
const totalRecords = computed(() => {
  return heatmapData.value.reduce((total, day) => total + day.count, 0)
})

const activeDays = computed(() => {
  return heatmapData.value.filter(day => day.count > 0).length
})

// 生成热力图数据
const generateHeatmapData = () => {
  const year = selectedYear.value
  const startDate = new Date(year, 0, 1)
  const endDate = new Date(year, 11, 31)
  
  // 找到第一周的开始日期（周日）
  const firstSunday = new Date(startDate)
  firstSunday.setDate(startDate.getDate() - startDate.getDay())
  
  // 找到最后一周的结束日期（周六）
  const lastSaturday = new Date(endDate)
  lastSaturday.setDate(endDate.getDate() + (6 - endDate.getDay()))
  
  const data: HeatmapDay[] = []
  const currentDate = new Date(firstSunday)
  
  while (currentDate <= lastSaturday) {
    // 生成模拟数据
    const count = generateMockActivityCount(currentDate)
    const records = generateMockRecords(count)
    
    data.push({
      date: new Date(currentDate),
      count,
      records
    })
    
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  heatmapData.value = data
}

// 生成模拟活动数据
const generateMockActivityCount = (date: Date): number => {
  // 基于日期生成伪随机数
  const seed = date.getTime()
  const random = Math.sin(seed) * 10000
  const normalized = (random - Math.floor(random)) * 100
  
  // 周末活动较少
  const isWeekend = date.getDay() === 0 || date.getDay() === 6
  const weekendFactor = isWeekend ? 0.6 : 1
  
  // 节假日活动较多
  const isHoliday = isSpecialDate(date)
  const holidayFactor = isHoliday ? 1.5 : 1
  
  const baseCount = Math.floor(normalized * weekendFactor * holidayFactor / 20)
  return Math.max(0, Math.min(baseCount, 15)) // 限制在0-15之间
}

// 判断是否为特殊日期
const isSpecialDate = (date: Date): boolean => {
  const month = date.getMonth() + 1
  const day = date.getDate()
  
  // 一些特殊日期
  const specialDates = [
    [1, 1],   // 元旦
    [2, 14],  // 情人节
    [5, 1],   // 劳动节
    [10, 1],  // 国庆节
    [12, 25], // 圣诞节
  ]
  
  return specialDates.some(([m, d]) => month === m && day === d)
}

// 生成模拟记录
const generateMockRecords = (count: number): string[] => {
  const recordTypes = ['文章', '照片', '心情', '想法']
  const records = []
  
  for (let i = 0; i < count; i++) {
    const type = recordTypes[Math.floor(Math.random() * recordTypes.length)]
    records.push(type)
  }
  
  return records
}

// 获取日期格子的样式类
const getDayClass = (count: number): string => {
  const baseClass = 'day-cell'
  
  if (count === 0) return `${baseClass} bg-white/10`
  if (count <= 2) return `${baseClass} bg-green-900/50`
  if (count <= 5) return `${baseClass} bg-green-700/70`
  if (count <= 8) return `${baseClass} bg-green-500/80`
  return `${baseClass} bg-green-400`
}

// 获取提示文本
const getDayTooltip = (day: HeatmapDay): string => {
  const dateStr = day.date.toLocaleDateString('zh-CN')
  return `${dateStr}: ${day.count} 条记录`
}

// 显示悬停提示
const showTooltip = (event: MouseEvent, day: HeatmapDay) => {
  tooltip.value = {
    show: true,
    x: event.clientX + 10,
    y: event.clientY - 10,
    date: day.date.toLocaleDateString('zh-CN', { 
      month: 'long', 
      day: 'numeric' 
    }),
    count: day.count
  }
}

// 隐藏提示
const hideTooltip = () => {
  tooltip.value.show = false
}

// 年份切换
const previousYear = () => {
  if (selectedYear.value > availableYears.value[availableYears.value.length - 1]) {
    selectedYear.value--
    generateHeatmapData()
  }
}

const nextYear = () => {
  if (selectedYear.value < currentYear) {
    selectedYear.value++
    generateHeatmapData()
  }
}

// 组件挂载时生成数据
onMounted(() => {
  generateHeatmapData()
})
</script>

<style scoped>
.heatmap-grid {
  display: flex;
  gap: 3px;
}

.weekday-labels {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-right: 8px;
}

.weekday-label {
  width: 12px;
  height: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.6);
}

.days-grid {
  display: grid;
  grid-template-rows: repeat(7, 12px);
  grid-auto-flow: column;
  gap: 3px;
}

.day-cell {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.day-cell:hover {
  transform: scale(1.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .heatmap-grid {
    transform: scale(0.8);
    transform-origin: left top;
  }
  
  .days-grid {
    grid-template-rows: repeat(7, 10px);
  }
  
  .day-cell {
    width: 10px;
    height: 10px;
  }
  
  .weekday-label {
    width: 10px;
    height: 10px;
    font-size: 8px;
  }
}
</style>
