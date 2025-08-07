/**
 * 相册数据管理 Composable
 * 提供相册的获取、创建、更新、删除等功能
 */

import type { GalleryItem } from '~/types'

export const useGalleries = () => {
  // 响应式数据
  const galleries = ref<GalleryItem[]>([])
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const hasMore = ref<boolean>(true)
  const currentPage = ref<number>(1)
  const pageSize = ref<number>(12)

  // 过滤器状态
  const filters = ref({
    tag: '',
    location: '',
    dateRange: null as { start: string; end: string } | null,
    searchQuery: '',
    imageCount: null as { min: number; max: number } | null
  })

  // 排序选项
  const sortBy = ref<'createdAt' | 'likes' | 'views' | 'imageCount'>('createdAt')
  const sortOrder = ref<'asc' | 'desc'>('desc')

  // 视图模式
  const viewMode = ref<'grid' | 'masonry' | 'list'>('grid')

  /**
   * 加载模拟数据
   */
  const loadMockData = async (reset: boolean = false) => {
    loading.value = true
    error.value = null

    try {
      // 模拟 API 调用延迟
      await new Promise((resolve) => setTimeout(resolve, 500))

      const { generateMockGalleries } = useMockData()
      const mockGalleries = generateMockGalleries(25) // 生成25个相册

      if (reset) {
        galleries.value = mockGalleries.slice(0, pageSize.value)
        currentPage.value = 1
      } else {
        const startIndex = (currentPage.value - 1) * pageSize.value
        const endIndex = startIndex + pageSize.value
        const newGalleries = mockGalleries.slice(startIndex, endIndex)
        
        galleries.value = [...galleries.value, ...newGalleries]
        currentPage.value++
      }

      hasMore.value = galleries.value.length < mockGalleries.length
    } catch (err) {
      error.value = '加载相册失败'
      console.error('Error loading galleries:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取过滤后的相册数据
   */
  const filteredGalleries = computed(() => {
    let result = [...galleries.value]

    // 按标签过滤
    if (filters.value.tag) {
      result = result.filter(gallery =>
        gallery.tags?.some(tag =>
          tag.toLowerCase().includes(filters.value.tag.toLowerCase())
        )
      )
    }

    // 按位置过滤
    if (filters.value.location) {
      result = result.filter(gallery =>
        gallery.location?.name.toLowerCase().includes(filters.value.location.toLowerCase())
      )
    }

    // 按搜索关键词过滤
    if (filters.value.searchQuery) {
      const query = filters.value.searchQuery.toLowerCase()
      result = result.filter(gallery =>
        gallery.title.toLowerCase().includes(query) ||
        gallery.description.toLowerCase().includes(query) ||
        gallery.tags?.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // 按图片数量过滤
    if (filters.value.imageCount) {
      const { min, max } = filters.value.imageCount
      result = result.filter(gallery =>
        gallery.images.length >= min && gallery.images.length <= max
      )
    }

    // 按日期范围过滤
    if (filters.value.dateRange) {
      const { start, end } = filters.value.dateRange
      result = result.filter(gallery => {
        const galleryDate = new Date(gallery.createdAt)
        return galleryDate >= new Date(start) && galleryDate <= new Date(end)
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
        case 'imageCount':
          aValue = a.images.length
          bValue = b.images.length
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
  const galleriesByTag = computed(() => {
    const groups: Record<string, GalleryItem[]> = {}
    
    filteredGalleries.value.forEach(gallery => {
      gallery.tags?.forEach(tag => {
        if (!groups[tag]) {
          groups[tag] = []
        }
        groups[tag].push(gallery)
      })
    })

    return groups
  })

  /**
   * 按位置分组
   */
  const galleriesByLocation = computed(() => {
    const groups: Record<string, GalleryItem[]> = {}
    
    filteredGalleries.value.forEach(gallery => {
      const location = gallery.location?.name || '未知位置'
      if (!groups[location]) {
        groups[location] = []
      }
      groups[location].push(gallery)
    })

    return groups
  })

  /**
   * 按月份分组
   */
  const galleriesByMonth = computed(() => {
    const groups: Record<string, GalleryItem[]> = {}
    
    filteredGalleries.value.forEach(gallery => {
      const date = new Date(gallery.createdAt)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      
      if (!groups[monthKey]) {
        groups[monthKey] = []
      }
      groups[monthKey].push(gallery)
    })

    return groups
  })

  /**
   * 获取统计信息
   */
  const statistics = computed(() => {
    const total = galleries.value.length
    const totalImages = galleries.value.reduce((sum, gallery) => sum + gallery.images.length, 0)
    const totalLikes = galleries.value.reduce((sum, gallery) => sum + (gallery.likes || 0), 0)
    const totalViews = galleries.value.reduce((sum, gallery) => sum + (gallery.views || 0), 0)
    const totalComments = galleries.value.reduce((sum, gallery) => sum + (gallery.comments || 0), 0)
    
    const tagCounts: Record<string, number> = {}
    const locationCounts: Record<string, number> = {}

    galleries.value.forEach(gallery => {
      // 统计标签
      gallery.tags?.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })

      // 统计位置
      if (gallery.location?.name) {
        locationCounts[gallery.location.name] = (locationCounts[gallery.location.name] || 0) + 1
      }
    })

    return {
      total,
      totalImages,
      totalLikes,
      totalViews,
      totalComments,
      averageImagesPerGallery: total > 0 ? Math.round(totalImages / total) : 0,
      averageLikes: total > 0 ? Math.round(totalLikes / total) : 0,
      averageViews: total > 0 ? Math.round(totalViews / total) : 0,
      averageComments: total > 0 ? Math.round(totalComments / total) : 0,
      tagCounts,
      locationCounts,
      mostUsedTag: Object.keys(tagCounts).reduce((a, b) => tagCounts[a] > tagCounts[b] ? a : b, ''),
      mostPhotographedLocation: Object.keys(locationCounts).reduce((a, b) => locationCounts[a] > locationCounts[b] ? a : b, '')
    }
  })

  /**
   * 获取热门相册
   */
  const popularGalleries = computed(() => {
    return [...galleries.value]
      .sort((a, b) => (b.likes || 0) - (a.likes || 0))
      .slice(0, 6)
  })

  /**
   * 获取最新相册
   */
  const recentGalleries = computed(() => {
    return [...galleries.value]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6)
  })

  /**
   * 获取所有图片（用于图片墙展示）
   */
  const allImages = computed(() => {
    const images: Array<{
      id: string
      url: string
      thumbnail: string
      title: string
      description?: string
      galleryId: string
      galleryTitle: string
      takenAt: string
    }> = []

    galleries.value.forEach(gallery => {
      gallery.images.forEach(image => {
        images.push({
          ...image,
          galleryId: gallery.id,
          galleryTitle: gallery.title
        })
      })
    })

    return images.sort((a, b) => new Date(b.takenAt).getTime() - new Date(a.takenAt).getTime())
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
      tag: '',
      location: '',
      dateRange: null,
      searchQuery: '',
      imageCount: null
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
   * 设置视图模式
   */
  const setViewMode = (mode: typeof viewMode.value) => {
    viewMode.value = mode
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
   * 点赞相册
   */
  const likeGallery = async (galleryId: string) => {
    const gallery = galleries.value.find(g => g.id === galleryId)
    if (gallery) {
      gallery.likes = (gallery.likes || 0) + 1
    }
  }

  /**
   * 增加浏览量
   */
  const incrementViews = async (galleryId: string) => {
    const gallery = galleries.value.find(g => g.id === galleryId)
    if (gallery) {
      gallery.views = (gallery.views || 0) + 1
    }
  }

  // 初始化时加载数据
  onMounted(() => {
    if (galleries.value.length === 0) {
      loadMockData(true)
    }
  })

  return {
    // 状态
    galleries: readonly(galleries),
    loading: readonly(loading),
    error: readonly(error),
    hasMore: readonly(hasMore),
    filters: readonly(filters),
    sortBy: readonly(sortBy),
    sortOrder: readonly(sortOrder),
    viewMode: readonly(viewMode),

    // 计算属性
    filteredGalleries,
    galleriesByTag,
    galleriesByLocation,
    galleriesByMonth,
    statistics,
    popularGalleries,
    recentGalleries,
    allImages,

    // 方法
    loadMockData,
    loadMore,
    refresh,
    setFilter,
    clearFilters,
    setSorting,
    setViewMode,
    likeGallery,
    incrementViews
  }
}
