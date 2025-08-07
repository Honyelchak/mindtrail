/**
 * 地理位置管理 Composable
 * 处理位置获取、地图标记、内容关联等功能
 */

import type { Ref } from 'vue'

export interface LocationData {
  latitude: number
  longitude: number
  accuracy?: number
  address?: string
  city?: string
  country?: string
  timestamp: string
}

export interface ContentLocation extends LocationData {
  id: string
  contentId: string
  contentType: 'moment' | 'article' | 'gallery' | 'video'
  title: string
  preview?: string
  thumbnail?: string
  createdAt: string
  // 回访记录
  revisits: LocationRevisit[]
}

export interface LocationRevisit {
  id: string
  visitDate: string
  reflection: string
  mood?: string
  photos?: string[]
  rating?: number // 1-5 星评价
}

export interface LocationCluster {
  center: LocationData
  radius: number // 米
  contents: ContentLocation[]
  name?: string
  description?: string
}

export const useLocation = () => {
  // 响应式数据
  const currentLocation = ref<LocationData | null>(null)
  const locationHistory = ref<ContentLocation[]>([])
  const locationClusters = ref<LocationCluster[]>([])
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const permissionGranted = ref<boolean>(false)

  // 获取当前位置
  const getCurrentLocation = (): Promise<LocationData> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('浏览器不支持地理位置'))
        return
      }

      loading.value = true
      error.value = null

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const locationData: LocationData = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: new Date().toISOString(),
            }

            // 反向地理编码获取地址信息
            const address = await reverseGeocode(
              locationData.latitude,
              locationData.longitude
            )
            if (address) {
              locationData.address = address.formatted
              locationData.city = address.city
              locationData.country = address.country
            }

            currentLocation.value = locationData
            permissionGranted.value = true
            resolve(locationData)
          } catch (err) {
            error.value = '获取位置信息失败'
            reject(err)
          } finally {
            loading.value = false
          }
        },
        (err) => {
          loading.value = false
          let errorMessage = '获取位置失败'

          switch (err.code) {
            case err.PERMISSION_DENIED:
              errorMessage = '用户拒绝了位置权限请求'
              permissionGranted.value = false
              break
            case err.POSITION_UNAVAILABLE:
              errorMessage = '位置信息不可用'
              break
            case err.TIMEOUT:
              errorMessage = '获取位置超时'
              break
          }

          error.value = errorMessage
          reject(new Error(errorMessage))
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5分钟缓存
        }
      )
    })
  }

  // 反向地理编码（这里使用模拟数据，实际可接入高德、百度等API）
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 500))

      // 模拟返回数据
      return {
        formatted: '北京市朝阳区三里屯街道',
        city: '北京市',
        country: '中国',
      }
    } catch (err) {
      console.warn('反向地理编码失败:', err)
      return null
    }
  }

  // 保存内容位置关联
  const saveContentLocation = async (
    contentId: string,
    contentType: string,
    title: string,
    options?: {
      preview?: string
      thumbnail?: string
      customLocation?: LocationData
    }
  ) => {
    try {
      let location = options?.customLocation || currentLocation.value

      if (!location) {
        location = await getCurrentLocation()
      }

      const contentLocation: ContentLocation = {
        id: generateId(),
        contentId,
        contentType: contentType as any,
        title,
        preview: options?.preview,
        thumbnail: options?.thumbnail,
        ...location,
        createdAt: new Date().toISOString(),
        revisits: [],
      }

      locationHistory.value.push(contentLocation)

      // 更新位置聚类
      updateLocationClusters()

      // 保存到本地存储
      saveToStorage()

      return contentLocation
    } catch (err) {
      error.value = '保存位置信息失败'
      throw err
    }
  }

  // 添加回访记录
  const addLocationRevisit = (
    contentLocationId: string,
    reflection: string,
    options?: {
      mood?: string
      photos?: string[]
      rating?: number
    }
  ) => {
    const contentLocation = locationHistory.value.find(
      (loc) => loc.id === contentLocationId
    )
    if (!contentLocation) {
      throw new Error('未找到对应的位置记录')
    }

    const revisit: LocationRevisit = {
      id: generateId(),
      visitDate: new Date().toISOString(),
      reflection,
      mood: options?.mood,
      photos: options?.photos || [],
      rating: options?.rating,
    }

    contentLocation.revisits.push(revisit)
    saveToStorage()

    return revisit
  }

  // 更新位置聚类
  const updateLocationClusters = () => {
    const clusters: LocationCluster[] = []
    const processed = new Set<string>()
    const CLUSTER_RADIUS = 500 // 500米聚类半径

    locationHistory.value.forEach((location) => {
      if (processed.has(location.id)) return

      const cluster: LocationCluster = {
        center: {
          latitude: location.latitude,
          longitude: location.longitude,
          timestamp: location.timestamp,
        },
        radius: CLUSTER_RADIUS,
        contents: [location],
      }

      // 查找附近的其他位置
      locationHistory.value.forEach((otherLocation) => {
        if (otherLocation.id === location.id || processed.has(otherLocation.id))
          return

        const distance = calculateDistance(
          location.latitude,
          location.longitude,
          otherLocation.latitude,
          otherLocation.longitude
        )

        if (distance <= CLUSTER_RADIUS) {
          cluster.contents.push(otherLocation)
          processed.add(otherLocation.id)
        }
      })

      processed.add(location.id)
      clusters.push(cluster)
    })

    locationClusters.value = clusters
  }

  // 计算两点间距离（米）
  const calculateDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number => {
    const R = 6371e3 // 地球半径（米）
    const φ1 = (lat1 * Math.PI) / 180
    const φ2 = (lat2 * Math.PI) / 180
    const Δφ = ((lat2 - lat1) * Math.PI) / 180
    const Δλ = ((lng2 - lng1) * Math.PI) / 180

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
  }

  // 获取指定位置附近的内容
  const getNearbyContent = (
    lat: number,
    lng: number,
    radius: number = 1000
  ) => {
    return locationHistory.value.filter((location) => {
      const distance = calculateDistance(
        lat,
        lng,
        location.latitude,
        location.longitude
      )
      return distance <= radius
    })
  }

  // 按时间范围筛选位置
  const getLocationsByDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate).getTime()
    const end = new Date(endDate).getTime()

    return locationHistory.value.filter((location) => {
      const locationTime = new Date(location.createdAt).getTime()
      return locationTime >= start && locationTime <= end
    })
  }

  // 生成唯一ID
  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  // 保存到本地存储
  const saveToStorage = () => {
    if (process.client) {
      try {
        localStorage.setItem(
          'mindtrail_locations',
          JSON.stringify(locationHistory.value)
        )
        localStorage.setItem(
          'mindtrail_location_clusters',
          JSON.stringify(locationClusters.value)
        )
      } catch (err) {
        console.error('保存位置数据失败:', err)
      }
    }
  }

  // 从本地存储加载
  const loadFromStorage = () => {
    if (process.client) {
      try {
        const locations = localStorage.getItem('mindtrail_locations')
        const clusters = localStorage.getItem('mindtrail_location_clusters')

        if (locations) {
          locationHistory.value = JSON.parse(locations)
        }
        if (clusters) {
          locationClusters.value = JSON.parse(clusters)
        }
      } catch (err) {
        console.error('加载位置数据失败:', err)
      }
    }
  }

  // 清除位置数据
  const clearLocationData = () => {
    locationHistory.value = []
    locationClusters.value = []
    currentLocation.value = null
    saveToStorage()
  }

  // 加载模拟数据
  const loadMockData = () => {
    const { generateMockLocations } = useMockData()
    locationHistory.value = generateMockLocations(30)
    updateLocationClusters()
    saveToStorage()
  }

  // 组件挂载时加载数据
  onMounted(() => {
    loadFromStorage()
    // 如果没有数据，加载模拟数据
    if (locationHistory.value.length === 0) {
      loadMockData()
    }
  })

  return {
    // 状态
    currentLocation: readonly(currentLocation),
    locationHistory: readonly(locationHistory),
    locationClusters: readonly(locationClusters),
    loading: readonly(loading),
    error: readonly(error),
    permissionGranted: readonly(permissionGranted),

    // 方法
    getCurrentLocation,
    saveContentLocation,
    addLocationRevisit,
    getNearbyContent,
    getLocationsByDateRange,
    updateLocationClusters,
    calculateDistance,
    clearLocationData,
    loadMockData,
  }
}
