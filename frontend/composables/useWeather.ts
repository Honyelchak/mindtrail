/**
 * 天气数据管理 Composable
 * 获取天气信息并提供天气特效控制
 */

import type { Ref } from 'vue'

export interface WeatherData {
  temperature: number
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy' | 'foggy'
  description: string
  humidity: number
  windSpeed: number
  location: string
  icon: string
  timestamp: string
}

export interface WeatherEffects {
  showRaindrops: boolean
  showSnowflakes: boolean
  showSunbeams: boolean
  showStars: boolean
  showClouds: boolean
  showFog: boolean
}

export const useWeather = () => {
  // 响应式数据
  const weather = ref<WeatherData | null>(null)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const effects = ref<WeatherEffects>({
    showRaindrops: false,
    showSnowflakes: false,
    showSunbeams: false,
    showStars: false,
    showClouds: false,
    showFog: false,
  })

  // 获取用户位置
  const getCurrentLocation = (): Promise<{ lat: number; lon: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('浏览器不支持地理位置'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          })
        },
        (error) => {
          // 如果获取位置失败，使用默认位置（北京）
          console.warn('获取位置失败，使用默认位置', error)
          resolve({ lat: 39.9042, lon: 116.4074 })
        },
        { timeout: 10000, enableHighAccuracy: true }
      )
    })
  }

  // 获取天气数据
  const fetchWeather = async (apiKey?: string) => {
    loading.value = true
    error.value = null

    try {
      // const location = await getCurrentLocation()

      // 如果没有 API Key，使用模拟数据
      if (!apiKey) {
        await new Promise((resolve) => setTimeout(resolve, 1000)) // 模拟网络延迟

        const mockWeatherConditions = [
          'sunny',
          'cloudy',
          'rainy',
          'snowy',
          'stormy',
        ]
        const randomCondition = mockWeatherConditions[
          Math.floor(Math.random() * mockWeatherConditions.length)
        ] as WeatherData['condition']

        weather.value = {
          temperature: Math.floor(Math.random() * 30) + 5, // 5-35度
          condition: randomCondition,
          description: getWeatherDescription(randomCondition),
          humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
          windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
          location: '北京市',
          icon: getWeatherIcon(randomCondition),
          timestamp: new Date().toISOString(),
        }
      } else {
        // 使用真实的 OpenWeatherMap API
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${apiKey}&units=metric&lang=zh_cn`
        )

        if (!response.ok) {
          throw new Error('获取天气数据失败')
        }

        const data = await response.json()

        weather.value = {
          temperature: Math.round(data.main.temp),
          condition: mapWeatherCondition(data.weather[0].main),
          description: data.weather[0].description,
          humidity: data.main.humidity,
          windSpeed: Math.round(data.wind.speed * 3.6), // m/s 转 km/h
          location: data.name,
          icon: data.weather[0].icon,
          timestamp: new Date().toISOString(),
        }
      }

      // 根据天气条件设置特效
      updateWeatherEffects(weather.value.condition)
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取天气数据失败'
      console.error('Weather fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  // 映射天气条件
  const mapWeatherCondition = (condition: string): WeatherData['condition'] => {
    const conditionMap: Record<string, WeatherData['condition']> = {
      Clear: 'sunny',
      Clouds: 'cloudy',
      Rain: 'rainy',
      Drizzle: 'rainy',
      Snow: 'snowy',
      Thunderstorm: 'stormy',
      Mist: 'foggy',
      Fog: 'foggy',
      Haze: 'foggy',
    }
    return conditionMap[condition] || 'cloudy'
  }

  // 获取天气描述
  const getWeatherDescription = (
    condition: WeatherData['condition']
  ): string => {
    const descriptions = {
      sunny: '晴朗',
      cloudy: '多云',
      rainy: '下雨',
      snowy: '下雪',
      stormy: '雷暴',
      foggy: '雾霾',
    }
    return descriptions[condition]
  }

  // 获取天气图标
  const getWeatherIcon = (condition: WeatherData['condition']): string => {
    const icons = {
      sunny: '☀️',
      cloudy: '☁️',
      rainy: '🌧️',
      snowy: '❄️',
      stormy: '⛈️',
      foggy: '🌫️',
    }
    return icons[condition]
  }

  // 更新天气特效
  const updateWeatherEffects = (condition: WeatherData['condition']) => {
    // 重置所有特效
    Object.keys(effects.value).forEach((key) => {
      effects.value[key as keyof WeatherEffects] = false
    })

    // 根据天气条件启用对应特效
    switch (condition) {
      case 'rainy':
        effects.value.showRaindrops = true
        effects.value.showClouds = true
        break
      case 'snowy':
        effects.value.showSnowflakes = true
        effects.value.showClouds = true
        break
      case 'sunny':
        effects.value.showSunbeams = true
        break
      case 'cloudy':
        effects.value.showClouds = true
        break
      case 'stormy':
        effects.value.showRaindrops = true
        effects.value.showClouds = true
        break
      case 'foggy':
        effects.value.showFog = true
        break
    }
  }

  // 获取天气对应的背景渐变
  const getWeatherGradient = computed(() => {
    if (!weather.value) return 'from-blue-400 to-blue-600'

    const gradients = {
      sunny: 'from-yellow-400 via-orange-400 to-red-400',
      cloudy: 'from-gray-400 to-gray-600',
      rainy: 'from-blue-600 to-gray-700',
      snowy: 'from-blue-200 to-gray-300',
      stormy: 'from-gray-700 to-gray-900',
      foggy: 'from-gray-300 to-gray-500',
    }

    return gradients[weather.value.condition]
  })

  // 获取时间对应的特效（夜晚显示星空）
  const updateTimeBasedEffects = () => {
    const hour = new Date().getHours()
    const isNight = hour < 6 || hour > 20

    if (isNight && weather.value?.condition === 'sunny') {
      effects.value.showStars = true
      effects.value.showSunbeams = false
    }
  }

  // 定期更新天气数据
  const startWeatherUpdates = (apiKey?: string, interval = 30 * 60 * 1000) => {
    fetchWeather(apiKey)

    const timer = setInterval(() => {
      fetchWeather(apiKey)
      updateTimeBasedEffects()
    }, interval)

    // 清理定时器
    onUnmounted(() => {
      clearInterval(timer)
    })
  }

  return {
    // 状态
    weather: readonly(weather),
    loading: readonly(loading),
    error: readonly(error),
    effects: readonly(effects),

    // 计算属性
    weatherGradient: getWeatherGradient,

    // 方法
    fetchWeather,
    startWeatherUpdates,
    updateTimeBasedEffects,
  }
}
