/**
 * 说说数据管理 Composable
 * 提供说说的获取、创建、更新、删除等功能
 */

import type { Moment } from '~/types'

export const useMoments = () => {
  // 响应式数据
  const moments = ref<Moment[]>([])
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const hasMore = ref<boolean>(true)
  const currentPage = ref<number>(1)
  const pageSize = ref<number>(10)

  // 过滤器状态
  const filters = ref({
    mood: '',
    tag: '',
    location: '',
    dateRange: null as { start: string; end: string } | null,
    searchQuery: ''
  })

  // 排序选项
  const sortBy = ref<'createdAt' | 'likes' | 'comments'>('createdAt')
  const sortOrder = ref<'asc' | 'desc'>('desc')

  /**
   * 加载模拟数据
   */
  const loadMockData = async (reset: boolean = false) => {
    loading.value = true
    error.value = null

    try {
      // 模拟 API 调用延迟
      await new Promise((resolve) => setTimeout(resolve, 300))

      const { generateMockMoments } = useMockData()
      const mockMoments = generateMockMoments(50) // 生成50条说说

      if (reset) {
        moments.value = mockMoments.slice(0, pageSize.value)
        currentPage.value = 1
      } else {
        const startIndex = (currentPage.value - 1) * pageSize.value
        const endIndex = startIndex + pageSize.value
        const newMoments = mockMoments.slice(startIndex, endIndex)
        
        moments.value = [...moments.value, ...newMoments]
        currentPage.value++
      }

      hasMore.value = moments.value.length < mockMoments.length
    } catch (err) {
      error.value = '加载说说失败'
      console.error('Error loading moments:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取过滤后的说说数据
   */
  const filteredMoments = computed(() => {
    let result = [...moments.value]

    // 按心情过滤
    if (filters.value.mood) {
      result = result.filter(moment => moment.mood === filters.value.mood)
    }

    // 按标签过滤
    if (filters.value.tag) {
      result = result.filter(moment =>
        moment.tags?.some(tag =>
          tag.toLowerCase().includes(filters.value.tag.toLowerCase())
        )
      )
    }

    // 按位置过滤
    if (filters.value.location) {
      result = result.filter(moment =>
        moment.location?.name.toLowerCase().includes(filters.value.location.toLowerCase())
      )
    }

    // 按搜索关键词过滤
    if (filters.value.searchQuery) {
      const query = filters.value.searchQuery.toLowerCase()
      result = result.filter(moment =>
        moment.content.toLowerCase().includes(query) ||
        moment.tags?.some(tag => tag.toLowerCase().includes(query)) ||
        moment.location?.name.toLowerCase().includes(query)
      )
    }

    // 按日期范围过滤
    if (filters.value.dateRange) {
      const { start, end } = filters.value.dateRange
      result = result.filter(moment => {
        const momentDate = new Date(moment.createdAt)
        return momentDate >= new Date(start) && momentDate <= new Date(end)
      })
    }

    // 排序
    result.sort((a, b) => {
      let aValue: any, bValue: any

      switch (sortBy.value) {
        case 'likes':
          aValue = a.likes || 0
          bValue = b.likes || 0
          break
        case 'comments':
          aValue = a.comments || 0
          bValue = b.comments || 0
          break
        case 'createdAt':
        default:
          aValue = new Date(a.createdAt).getTime()
          bValue = new Date(b.createdAt).getTime()
          break
      }

      if (sortOrder.value === 'desc') {
        return bValue - aValue
      } else {
        return aValue - bValue
      }
    })

    return result
  })

  /**
   * 按心情分组
   */
  const momentsByMood = computed(() => {
    const groups: Record<string, Moment[]> = {}
    
    filteredMoments.value.forEach(moment => {
      const mood = moment.mood || 'unknown'
      if (!groups[mood]) {
        groups[mood] = []
      }
      groups[mood].push(moment)
    })

    return groups
  })

  /**
   * 按日期分组
   */
  const momentsByDate = computed(() => {
    const groups: Record<string, Moment[]> = {}
    
    filteredMoments.value.forEach(moment => {
      const date = new Date(moment.createdAt).toDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(moment)
    })

    return groups
  })

  /**
   * 按位置分组
   */
  const momentsByLocation = computed(() => {
    const groups: Record<string, Moment[]> = {}
    
    filteredMoments.value.forEach(moment => {
      const location = moment.location?.name || '未知位置'
      if (!groups[location]) {
        groups[location] = []
      }
      groups[location].push(moment)
    })

    return groups
  })

  /**
   * 获取统计信息
   */
  const statistics = computed(() => {
    const total = moments.value.length
    const totalLikes = moments.value.reduce((sum, moment) => sum + (moment.likes || 0), 0)
    const totalComments = moments.value.reduce((sum, moment) => sum + (moment.comments || 0), 0)
    const totalImages = moments.value.reduce((sum, moment) => sum + (moment.images?.length || 0), 0)
    
    const moodCounts: Record<string, number> = {}
    const locationCounts: Record<string, number> = {}
    const tagCounts: Record<string, number> = {}

    moments.value.forEach(moment => {
      // 统计心情
      if (moment.mood) {
        moodCounts[moment.mood] = (moodCounts[moment.mood] || 0) + 1
      }

      // 统计位置
      if (moment.location?.name) {
        locationCounts[moment.location.name] = (locationCounts[moment.location.name] || 0) + 1
      }

      // 统计标签
      moment.tags?.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    })

    return {
      total,
      totalLikes,
      totalComments,
      totalImages,
      averageLikes: total > 0 ? Math.round(totalLikes / total) : 0,
      averageComments: total > 0 ? Math.round(totalComments / total) : 0,
      moodCounts,
      locationCounts,
      tagCounts,
      mostPopularMood: Object.keys(moodCounts).reduce((a, b) => moodCounts[a] > moodCounts[b] ? a : b, ''),
      mostVisitedLocation: Object.keys(locationCounts).reduce((a, b) => locationCounts[a] > locationCounts[b] ? a : b, ''),
      mostUsedTag: Object.keys(tagCounts).reduce((a, b) => tagCounts[a] > tagCounts[b] ? a : b, '')
    }
  })

  /**
   * 设置过滤器
   */
  const setFilter = (key: keyof typeof filters.value, value: any) => {
    filters.value[key] = value
  }

  /**
   * 清除过滤器
   */
  const clearFilters = () => {
    filters.value = {
      mood: '',
      tag: '',
      location: '',
      dateRange: null,
      searchQuery: ''
    }
  }

  /**
   * 设置排序
   */
  const setSorting = (by: typeof sortBy.value, order: typeof sortOrder.value) => {
    sortBy.value = by
    sortOrder.value = order
  }

  /**
   * 加载更多数据
   */
  const loadMore = async () => {
    if (!hasMore.value || loading.value) return
    await loadMockData(false)
  }

  /**
   * 刷新数据
   */
  const refresh = async () => {
    await loadMockData(true)
  }

  /**
   * 点赞说说
   */
  const likeMoment = async (momentId: string) => {
    const moment = moments.value.find(m => m.id === momentId)
    if (moment) {
      moment.likes = (moment.likes || 0) + 1
    }
  }

  /**
   * 取消点赞
   */
  const unlikeMoment = async (momentId: string) => {
    const moment = moments.value.find(m => m.id === momentId)
    if (moment && moment.likes && moment.likes > 0) {
      moment.likes = moment.likes - 1
    }
  }

  // 初始化时加载数据
  onMounted(() => {
    if (moments.value.length === 0) {
      loadMockData(true)
    }
  })

  return {
    // 状态
    moments: readonly(moments),
    loading: readonly(loading),
    error: readonly(error),
    hasMore: readonly(hasMore),
    filters: readonly(filters),
    sortBy: readonly(sortBy),
    sortOrder: readonly(sortOrder),

    // 计算属性
    filteredMoments,
    momentsByMood,
    momentsByDate,
    momentsByLocation,
    statistics,

    // 方法
    loadMockData,
    loadMore,
    refresh,
    setFilter,
    clearFilters,
    setSorting,
    likeMoment,
    unlikeMoment
  }
}
