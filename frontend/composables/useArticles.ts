/**
 * 文章数据管理 Composable
 * 提供文章的获取、创建、更新、删除等功能
 */

import type { Article } from '~/types'

export const useArticles = () => {
  // 响应式数据
  const articles = ref<Article[]>([])
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const hasMore = ref<boolean>(true)
  const currentPage = ref<number>(1)
  const pageSize = ref<number>(8)

  // 过滤器状态
  const filters = ref({
    status: 'published' as 'draft' | 'published' | 'archived' | 'all',
    tag: '',
    location: '',
    dateRange: null as { start: string; end: string } | null,
    searchQuery: '',
    readingTime: null as { min: number; max: number } | null
  })

  // 排序选项
  const sortBy = ref<'createdAt' | 'publishedAt' | 'likes' | 'views' | 'readingTime'>('publishedAt')
  const sortOrder = ref<'asc' | 'desc'>('desc')

  /**
   * 加载模拟数据
   */
  const loadMockData = async (reset: boolean = false) => {
    loading.value = true
    error.value = null

    try {
      // 模拟 API 调用延迟
      await new Promise((resolve) => setTimeout(resolve, 400))

      const { generateMockArticles } = useMockData()
      const mockArticles = generateMockArticles(30) // 生成30篇文章

      if (reset) {
        articles.value = mockArticles.slice(0, pageSize.value)
        currentPage.value = 1
      } else {
        const startIndex = (currentPage.value - 1) * pageSize.value
        const endIndex = startIndex + pageSize.value
        const newArticles = mockArticles.slice(startIndex, endIndex)
        
        articles.value = [...articles.value, ...newArticles]
        currentPage.value++
      }

      hasMore.value = articles.value.length < mockArticles.length
    } catch (err) {
      error.value = '加载文章失败'
      console.error('Error loading articles:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取过滤后的文章数据
   */
  const filteredArticles = computed(() => {
    let result = [...articles.value]

    // 按状态过滤
    if (filters.value.status !== 'all') {
      result = result.filter(article => article.status === filters.value.status)
    }

    // 按标签过滤
    if (filters.value.tag) {
      result = result.filter(article =>
        article.tags?.some(tag =>
          tag.toLowerCase().includes(filters.value.tag.toLowerCase())
        )
      )
    }

    // 按位置过滤
    if (filters.value.location) {
      result = result.filter(article =>
        article.location?.name.toLowerCase().includes(filters.value.location.toLowerCase())
      )
    }

    // 按搜索关键词过滤
    if (filters.value.searchQuery) {
      const query = filters.value.searchQuery.toLowerCase()
      result = result.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query) ||
        article.content.toLowerCase().includes(query) ||
        article.tags?.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // 按阅读时间过滤
    if (filters.value.readingTime) {
      const { min, max } = filters.value.readingTime
      result = result.filter(article =>
        article.readingTime >= min && article.readingTime <= max
      )
    }

    // 按日期范围过滤
    if (filters.value.dateRange) {
      const { start, end } = filters.value.dateRange
      result = result.filter(article => {
        const articleDate = new Date(article.publishedAt || article.createdAt)
        return articleDate >= new Date(start) && articleDate <= new Date(end)
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
        case 'views':
          aValue = a.views || 0
          bValue = b.views || 0
          break
        case 'readingTime':
          aValue = a.readingTime || 0
          bValue = b.readingTime || 0
          break
        case 'publishedAt':
          aValue = new Date(a.publishedAt || a.createdAt).getTime()
          bValue = new Date(b.publishedAt || b.createdAt).getTime()
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
   * 按标签分组
   */
  const articlesByTag = computed(() => {
    const groups: Record<string, Article[]> = {}
    
    filteredArticles.value.forEach(article => {
      article.tags?.forEach(tag => {
        if (!groups[tag]) {
          groups[tag] = []
        }
        groups[tag].push(article)
      })
    })

    return groups
  })

  /**
   * 按月份分组
   */
  const articlesByMonth = computed(() => {
    const groups: Record<string, Article[]> = {}
    
    filteredArticles.value.forEach(article => {
      const date = new Date(article.publishedAt || article.createdAt)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      
      if (!groups[monthKey]) {
        groups[monthKey] = []
      }
      groups[monthKey].push(article)
    })

    return groups
  })

  /**
   * 按位置分组
   */
  const articlesByLocation = computed(() => {
    const groups: Record<string, Article[]> = {}
    
    filteredArticles.value.forEach(article => {
      const location = article.location?.name || '未知位置'
      if (!groups[location]) {
        groups[location] = []
      }
      groups[location].push(article)
    })

    return groups
  })

  /**
   * 获取统计信息
   */
  const statistics = computed(() => {
    const total = articles.value.length
    const published = articles.value.filter(a => a.status === 'published').length
    const draft = articles.value.filter(a => a.status === 'draft').length
    const totalLikes = articles.value.reduce((sum, article) => sum + (article.likes || 0), 0)
    const totalViews = articles.value.reduce((sum, article) => sum + (article.views || 0), 0)
    const totalComments = articles.value.reduce((sum, article) => sum + (article.comments || 0), 0)
    const totalReadingTime = articles.value.reduce((sum, article) => sum + (article.readingTime || 0), 0)
    
    const tagCounts: Record<string, number> = {}
    const locationCounts: Record<string, number> = {}

    articles.value.forEach(article => {
      // 统计标签
      article.tags?.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })

      // 统计位置
      if (article.location?.name) {
        locationCounts[article.location.name] = (locationCounts[article.location.name] || 0) + 1
      }
    })

    return {
      total,
      published,
      draft,
      totalLikes,
      totalViews,
      totalComments,
      totalReadingTime,
      averageLikes: total > 0 ? Math.round(totalLikes / total) : 0,
      averageViews: total > 0 ? Math.round(totalViews / total) : 0,
      averageComments: total > 0 ? Math.round(totalComments / total) : 0,
      averageReadingTime: total > 0 ? Math.round(totalReadingTime / total) : 0,
      tagCounts,
      locationCounts,
      mostUsedTag: Object.keys(tagCounts).reduce((a, b) => tagCounts[a] > tagCounts[b] ? a : b, ''),
      mostWrittenLocation: Object.keys(locationCounts).reduce((a, b) => locationCounts[a] > locationCounts[b] ? a : b, '')
    }
  })

  /**
   * 获取热门文章
   */
  const popularArticles = computed(() => {
    return [...articles.value]
      .sort((a, b) => (b.likes || 0) - (a.likes || 0))
      .slice(0, 5)
  })

  /**
   * 获取最新文章
   */
  const recentArticles = computed(() => {
    return [...articles.value]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
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
      status: 'published',
      tag: '',
      location: '',
      dateRange: null,
      searchQuery: '',
      readingTime: null
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
   * 点赞文章
   */
  const likeArticle = async (articleId: string) => {
    const article = articles.value.find(a => a.id === articleId)
    if (article) {
      article.likes = (article.likes || 0) + 1
    }
  }

  /**
   * 增加阅读量
   */
  const incrementViews = async (articleId: string) => {
    const article = articles.value.find(a => a.id === articleId)
    if (article) {
      article.views = (article.views || 0) + 1
    }
  }

  // 初始化时加载数据
  onMounted(() => {
    if (articles.value.length === 0) {
      loadMockData(true)
    }
  })

  return {
    // 状态
    articles: readonly(articles),
    loading: readonly(loading),
    error: readonly(error),
    hasMore: readonly(hasMore),
    filters: readonly(filters),
    sortBy: readonly(sortBy),
    sortOrder: readonly(sortOrder),

    // 计算属性
    filteredArticles,
    articlesByTag,
    articlesByMonth,
    articlesByLocation,
    statistics,
    popularArticles,
    recentArticles,

    // 方法
    loadMockData,
    loadMore,
    refresh,
    setFilter,
    clearFilters,
    setSorting,
    likeArticle,
    incrementViews
  }
}
