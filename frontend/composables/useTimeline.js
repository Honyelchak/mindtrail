/**
 * Timeline 数据管理 Composable
 * 提供时间流数据的获取、过滤、排序等功能
 */

export const useTimeline = () => {
  // 响应式数据
  const timeline = ref([])
  const emotions = ref([])
  const tags = ref([])
  const loading = ref(false)
  const error = ref(null)

  // 过滤器状态
  const filters = ref({
    type: 'all', // all, moment, article, gallery
    tag: '',
    emotion: '',
    dateRange: null,
    searchQuery: '',
  })

  // 排序选项
  const sortBy = ref('createdAt') // createdAt, updatedAt, views, likes
  const sortOrder = ref('desc') // asc, desc

  /**
   * 加载 Mock 数据
   */
  const loadMockData = async () => {
    loading.value = true
    error.value = null

    try {
      // 模拟 API 调用延迟
      await new Promise((resolve) => setTimeout(resolve, 500))

      // 导入 Mock 数据
      const mockData = await import('../data/mock-data.json')

      timeline.value = mockData.timeline || []
      emotions.value = mockData.emotions || []
      tags.value = mockData.tags || []
    } catch (err) {
      error.value = '加载数据失败'
      console.error('Error loading mock data:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取过滤后的时间流数据
   */
  const filteredTimeline = computed(() => {
    let result = [...timeline.value]

    // 按类型过滤
    if (filters.value.type !== 'all') {
      result = result.filter((item) => item.type === filters.value.type)
    }

    // 按标签过滤
    if (filters.value.tag) {
      result = result.filter((item) =>
        item.tags.some((tag) =>
          tag.toLowerCase().includes(filters.value.tag.toLowerCase())
        )
      )
    }

    // 按情绪过滤
    if (filters.value.emotion) {
      result = result.filter(
        (item) => item.emotion?.type === filters.value.emotion
      )
    }

    // 按搜索关键词过滤
    if (filters.value.searchQuery) {
      const query = filters.value.searchQuery.toLowerCase()
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.content.toLowerCase().includes(query) ||
          item.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    // 按日期范围过滤
    if (filters.value.dateRange) {
      const { start, end } = filters.value.dateRange
      result = result.filter((item) => {
        const itemDate = new Date(item.createdAt)
        return itemDate >= start && itemDate <= end
      })
    }

    // 排序
    result.sort((a, b) => {
      let aValue = a[sortBy.value]
      let bValue = b[sortBy.value]

      // 处理嵌套属性（如 stats.views）
      if (sortBy.value.includes('.')) {
        const keys = sortBy.value.split('.')
        aValue = keys.reduce((obj, key) => obj?.[key], a)
        bValue = keys.reduce((obj, key) => obj?.[key], b)
      }

      // 处理日期
      if (sortBy.value.includes('At')) {
        aValue = new Date(aValue)
        bValue = new Date(bValue)
      }

      // 排序逻辑
      if (sortOrder.value === 'desc') {
        return bValue > aValue ? 1 : -1
      } else {
        return aValue > bValue ? 1 : -1
      }
    })

    return result
  })

  /**
   * 获取统计信息
   */
  const stats = computed(() => {
    const total = timeline.value.length
    const moments = timeline.value.filter(
      (item) => item.type === 'moment'
    ).length
    const articles = timeline.value.filter(
      (item) => item.type === 'article'
    ).length
    const galleries = timeline.value.filter(
      (item) => item.type === 'gallery'
    ).length

    const totalViews = timeline.value.reduce(
      (sum, item) => sum + (item.stats?.views || 0),
      0
    )
    const totalLikes = timeline.value.reduce(
      (sum, item) => sum + (item.stats?.likes || 0),
      0
    )
    const totalComments = timeline.value.reduce(
      (sum, item) => sum + (item.stats?.comments || 0),
      0
    )

    return {
      total,
      moments,
      articles,
      galleries,
      totalViews,
      totalLikes,
      totalComments,
    }
  })

  /**
   * 设置过滤器
   */
  const setFilter = (key, value) => {
    filters.value[key] = value
  }

  /**
   * 清除所有过滤器
   */
  const clearFilters = () => {
    filters.value = {
      type: 'all',
      tag: '',
      emotion: '',
      dateRange: null,
      searchQuery: '',
    }
  }

  /**
   * 设置排序
   */
  const setSorting = (field, order = 'desc') => {
    sortBy.value = field
    sortOrder.value = order
  }

  /**
   * 根据 ID 获取单个项目
   */
  const getItemById = (id) => {
    return timeline.value.find((item) => item.id === id)
  }

  /**
   * 获取相关项目（基于标签相似度）
   */
  const getRelatedItems = (currentItem, limit = 3) => {
    if (!currentItem) return []

    return timeline.value
      .filter((item) => item.id !== currentItem.id)
      .map((item) => ({
        ...item,
        similarity: calculateTagSimilarity(currentItem.tags, item.tags),
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
  }

  /**
   * 计算标签相似度
   */
  const calculateTagSimilarity = (tags1, tags2) => {
    const set1 = new Set(tags1.map((tag) => tag.toLowerCase()))
    const set2 = new Set(tags2.map((tag) => tag.toLowerCase()))
    const intersection = new Set([...set1].filter((x) => set2.has(x)))
    const union = new Set([...set1, ...set2])

    return intersection.size / union.size
  }

  /**
   * 格式化日期
   */
  const formatDate = (dateString, format = 'relative') => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date

    if (format === 'relative') {
      const minutes = Math.floor(diff / (1000 * 60))
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))

      if (minutes < 1) return '刚刚'
      if (minutes < 60) return `${minutes}分钟前`
      if (hours < 24) return `${hours}小时前`
      if (days < 7) return `${days}天前`

      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    }

    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return {
    // 数据
    timeline,
    emotions,
    tags,
    loading,
    error,

    // 计算属性
    filteredTimeline,
    stats,

    // 过滤器
    filters,
    sortBy,
    sortOrder,

    // 方法
    loadMockData,
    setFilter,
    clearFilters,
    setSorting,
    getItemById,
    getRelatedItems,
    formatDate,
  }
}
