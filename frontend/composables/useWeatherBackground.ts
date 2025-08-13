/**
 * 天气背景管理 Composable
 * 根据实时天气和时间自动切换背景特效
 */

export interface WeatherCondition {
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy' | 'foggy'
  temperature: number
  humidity: number
  windSpeed?: number
  visibility?: number
}

export interface TimeOfDay {
  period: 'dawn' | 'morning' | 'noon' | 'afternoon' | 'dusk' | 'night'
  hour: number
  minute: number
}

export const useWeatherBackground = () => {
  // 当前天气状态
  const currentWeather = ref<WeatherCondition>({
    condition: 'sunny',
    temperature: 20,
    humidity: 50
  })

  // 当前时间状态
  const currentTime = ref<TimeOfDay>({
    period: 'noon',
    hour: 12,
    minute: 0
  })

  // 背景强度设置
  const intensity = ref<'low' | 'medium' | 'high'>('medium')

  // 是否启用GPU加速
  const enableGPUAcceleration = ref(true)

  /**
   * 根据小时数判断时间段
   */
  const getTimeOfDay = (hour: number): TimeOfDay['period'] => {
    if (hour >= 5 && hour < 7) return 'dawn'
    if (hour >= 7 && hour < 11) return 'morning'
    if (hour >= 11 && hour < 14) return 'noon'
    if (hour >= 14 && hour < 17) return 'afternoon'
    if (hour >= 17 && hour < 20) return 'dusk'
    return 'night'
  }

  /**
   * 更新当前时间
   */
  const updateCurrentTime = () => {
    const now = new Date()
    const hour = now.getHours()
    const minute = now.getMinutes()
    
    currentTime.value = {
      period: getTimeOfDay(hour),
      hour,
      minute
    }
  }

  /**
   * 根据天气API数据映射天气条件
   */
  const mapWeatherCondition = (weatherCode: number, description: string): WeatherCondition['condition'] => {
    // OpenWeatherMap API 天气代码映射
    if (weatherCode >= 200 && weatherCode < 300) return 'stormy' // 雷雨
    if (weatherCode >= 300 && weatherCode < 600) return 'rainy'  // 雨
    if (weatherCode >= 600 && weatherCode < 700) return 'snowy'  // 雪
    if (weatherCode >= 700 && weatherCode < 800) return 'foggy'  // 雾霾
    if (weatherCode === 800) return 'sunny'                      // 晴天
    if (weatherCode > 800) return 'cloudy'                       // 多云
    
    // 备用：根据描述判断
    const desc = description.toLowerCase()
    if (desc.includes('storm') || desc.includes('thunder')) return 'stormy'
    if (desc.includes('rain') || desc.includes('drizzle')) return 'rainy'
    if (desc.includes('snow') || desc.includes('sleet')) return 'snowy'
    if (desc.includes('fog') || desc.includes('mist') || desc.includes('haze')) return 'foggy'
    if (desc.includes('clear') || desc.includes('sun')) return 'sunny'
    
    return 'cloudy'
  }

  /**
   * 从天气API获取数据并更新状态
   */
  const fetchWeatherData = async (lat?: number, lon?: number) => {
    try {
      // 使用现有的 useWeather composable
      const { weather, fetchWeather } = useWeather()
      
      if (lat && lon) {
        await fetchWeather(lat, lon)
      } else {
        await fetchWeather()
      }
      
      if (weather.value) {
        currentWeather.value = {
          condition: mapWeatherCondition(weather.value.id || 800, weather.value.description || 'clear'),
          temperature: weather.value.temperature || 20,
          humidity: weather.value.humidity || 50,
          windSpeed: weather.value.windSpeed,
          visibility: weather.value.visibility
        }
      }
    } catch (error) {
      console.warn('Failed to fetch weather data, using default values:', error)
      // 使用默认值
      currentWeather.value = {
        condition: 'sunny',
        temperature: 20,
        humidity: 50
      }
    }
  }

  /**
   * 获取用户位置并更新天气
   */
  const updateWeatherByLocation = async () => {
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported')
      await fetchWeatherData()
      return
    }

    return new Promise<void>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          await fetchWeatherData(latitude, longitude)
          resolve()
        },
        async (error) => {
          console.warn('Geolocation error:', error)
          await fetchWeatherData()
          resolve()
        },
        {
          timeout: 10000,
          maximumAge: 300000, // 5分钟缓存
          enableHighAccuracy: false
        }
      )
    })
  }

  /**
   * 根据设备性能自动调整强度
   */
  const autoAdjustIntensity = () => {
    // 检测设备性能
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    
    if (!gl) {
      intensity.value = 'low'
      enableGPUAcceleration.value = false
      return
    }

    // 检测GPU信息
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
    if (debugInfo) {
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      
      // 根据GPU性能调整
      if (renderer.includes('Intel') && !renderer.includes('Iris')) {
        intensity.value = 'low'
      } else if (renderer.includes('NVIDIA') || renderer.includes('AMD') || renderer.includes('Iris')) {
        intensity.value = 'high'
      } else {
        intensity.value = 'medium'
      }
    }

    // 检测内存
    if ('memory' in performance) {
      const memory = (performance as any).memory
      if (memory.usedJSHeapSize > 50 * 1024 * 1024) { // 50MB
        intensity.value = 'low'
      }
    }

    // 检测移动设备
    if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      intensity.value = intensity.value === 'high' ? 'medium' : 'low'
    }
  }

  /**
   * 手动设置天气条件（用于测试）
   */
  const setWeatherCondition = (condition: WeatherCondition['condition'], temperature = 20, humidity = 50) => {
    currentWeather.value = {
      condition,
      temperature,
      humidity
    }
  }

  /**
   * 手动设置时间段（用于测试）
   */
  const setTimeOfDay = (period: TimeOfDay['period']) => {
    const now = new Date()
    currentTime.value = {
      period,
      hour: now.getHours(),
      minute: now.getMinutes()
    }
  }

  // 定时器
  let timeUpdateInterval: NodeJS.Timeout | null = null
  let weatherUpdateInterval: NodeJS.Timeout | null = null

  /**
   * 启动自动更新
   */
  const startAutoUpdate = () => {
    // 立即更新一次
    updateCurrentTime()
    updateWeatherByLocation()
    autoAdjustIntensity()

    // 每分钟更新时间
    timeUpdateInterval = setInterval(updateCurrentTime, 60000)

    // 每30分钟更新天气
    weatherUpdateInterval = setInterval(updateWeatherByLocation, 30 * 60 * 1000)
  }

  /**
   * 停止自动更新
   */
  const stopAutoUpdate = () => {
    if (timeUpdateInterval) {
      clearInterval(timeUpdateInterval)
      timeUpdateInterval = null
    }
    if (weatherUpdateInterval) {
      clearInterval(weatherUpdateInterval)
      weatherUpdateInterval = null
    }
  }

  // 生命周期管理
  onMounted(() => {
    startAutoUpdate()
  })

  onUnmounted(() => {
    stopAutoUpdate()
  })

  return {
    // 状态
    currentWeather: readonly(currentWeather),
    currentTime: readonly(currentTime),
    intensity: readonly(intensity),
    enableGPUAcceleration: readonly(enableGPUAcceleration),

    // 方法
    updateCurrentTime,
    fetchWeatherData,
    updateWeatherByLocation,
    autoAdjustIntensity,
    setWeatherCondition,
    setTimeOfDay,
    startAutoUpdate,
    stopAutoUpdate,

    // 工具方法
    getTimeOfDay,
    mapWeatherCondition
  }
}
