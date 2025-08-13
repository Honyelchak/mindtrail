/**
 * useTheme.ts - 主题管理 Composable
 * 
 * Features:
 * - 主题切换 (亮色/暗色)
 * - 系统主题检测
 * - 主题持久化存储
 * - 主题变化监听
 * - 自定义主题配置
 */

export type ThemeMode = 'light' | 'dark' | 'system'

export interface ThemeConfig {
  mode: ThemeMode
  colors: {
    primary: string
    secondary: string
    accent: string
    background: {
      primary: string
      secondary: string
      tertiary: string
    }
    glass: {
      bg: string
      border: string
    }
    text: {
      primary: string
      secondary: string
      muted: string
    }
  }
}

// 预定义主题配置
const themes: Record<'light' | 'dark', Omit<ThemeConfig, 'mode'>> = {
  light: {
    colors: {
      primary: '#3b82f6',
      secondary: '#10b981',
      accent: '#f59e0b',
      background: {
        primary: '#f8fafc',
        secondary: '#f1f5f9',
        tertiary: '#e2e8f0'
      },
      glass: {
        bg: 'rgba(255, 255, 255, 0.8)',
        border: 'rgba(0, 0, 0, 0.1)'
      },
      text: {
        primary: '#1e293b',
        secondary: '#475569',
        muted: '#64748b'
      }
    }
  },
  dark: {
    colors: {
      primary: '#3b82f6',
      secondary: '#10b981',
      accent: '#f59e0b',
      background: {
        primary: '#0f172a',
        secondary: '#1e293b',
        tertiary: '#334155'
      },
      glass: {
        bg: 'rgba(15, 23, 42, 0.8)',
        border: 'rgba(255, 255, 255, 0.1)'
      },
      text: {
        primary: '#f8fafc',
        secondary: '#cbd5e1',
        muted: '#94a3b8'
      }
    }
  }
}

export const useTheme = () => {
  // 响应式状态
  const currentMode = ref<ThemeMode>('system')
  const isDark = ref(false)
  const isSystemDark = ref(false)
  
  // 当前主题配置
  const currentTheme = computed<ThemeConfig>(() => {
    const actualMode = currentMode.value === 'system' ? (isSystemDark.value ? 'dark' : 'light') : currentMode.value
    const baseTheme = themes[actualMode as 'light' | 'dark']
    
    return {
      mode: currentMode.value,
      ...baseTheme
    }
  })
  
  // 检测系统主题
  const detectSystemTheme = () => {
    if (process.client) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      isSystemDark.value = mediaQuery.matches
      
      // 监听系统主题变化
      mediaQuery.addEventListener('change', (e) => {
        isSystemDark.value = e.matches
        updateTheme()
      })
    }
  }
  
  // 更新主题
  const updateTheme = () => {
    const actualIsDark = currentMode.value === 'system' ? isSystemDark.value : currentMode.value === 'dark'
    isDark.value = actualIsDark
    
    if (process.client) {
      const root = document.documentElement
      const theme = currentTheme.value
      
      // 更新 CSS 变量
      root.style.setProperty('--color-primary', theme.colors.primary)
      root.style.setProperty('--color-secondary', theme.colors.secondary)
      root.style.setProperty('--color-accent', theme.colors.accent)
      
      root.style.setProperty('--bg-primary', theme.colors.background.primary)
      root.style.setProperty('--bg-secondary', theme.colors.background.secondary)
      root.style.setProperty('--bg-tertiary', theme.colors.background.tertiary)
      
      root.style.setProperty('--glass-bg', theme.colors.glass.bg)
      root.style.setProperty('--glass-border', theme.colors.glass.border)
      
      root.style.setProperty('--text-primary', theme.colors.text.primary)
      root.style.setProperty('--text-secondary', theme.colors.text.secondary)
      root.style.setProperty('--text-muted', theme.colors.text.muted)
      
      // 更新 HTML 类名
      if (actualIsDark) {
        root.classList.add('dark')
        root.classList.remove('light')
      } else {
        root.classList.add('light')
        root.classList.remove('dark')
      }
      
      // 更新 meta theme-color
      const metaThemeColor = document.querySelector('meta[name="theme-color"]')
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', theme.colors.background.primary)
      }
    }
  }
  
  // 设置主题模式
  const setThemeMode = (mode: ThemeMode) => {
    currentMode.value = mode
    updateTheme()
    
    // 持久化存储
    if (process.client) {
      localStorage.setItem('theme-mode', mode)
    }
  }
  
  // 切换主题
  const toggleTheme = () => {
    if (currentMode.value === 'system') {
      setThemeMode(isSystemDark.value ? 'light' : 'dark')
    } else {
      setThemeMode(currentMode.value === 'dark' ? 'light' : 'dark')
    }
  }
  
  // 获取主题图标
  const getThemeIcon = () => {
    if (currentMode.value === 'system') {
      return 'heroicons:computer-desktop'
    }
    return isDark.value ? 'heroicons:moon' : 'heroicons:sun'
  }
  
  // 获取主题标签
  const getThemeLabel = () => {
    switch (currentMode.value) {
      case 'light':
        return '亮色主题'
      case 'dark':
        return '暗色主题'
      case 'system':
        return '跟随系统'
      default:
        return '未知主题'
    }
  }
  
  // 初始化主题
  const initTheme = () => {
    if (process.client) {
      // 从本地存储读取主题设置
      const savedMode = localStorage.getItem('theme-mode') as ThemeMode
      if (savedMode && ['light', 'dark', 'system'].includes(savedMode)) {
        currentMode.value = savedMode
      }
      
      // 检测系统主题
      detectSystemTheme()
      
      // 应用主题
      updateTheme()
    }
  }
  
  // 生成主题相关的 CSS 类
  const getThemeClasses = () => {
    return {
      'theme-light': !isDark.value,
      'theme-dark': isDark.value,
      'theme-system': currentMode.value === 'system'
    }
  }
  
  // 获取主题相关的样式变量
  const getThemeStyles = () => {
    const theme = currentTheme.value
    return {
      '--theme-primary': theme.colors.primary,
      '--theme-secondary': theme.colors.secondary,
      '--theme-accent': theme.colors.accent,
      '--theme-bg-primary': theme.colors.background.primary,
      '--theme-bg-secondary': theme.colors.background.secondary,
      '--theme-bg-tertiary': theme.colors.background.tertiary,
      '--theme-glass-bg': theme.colors.glass.bg,
      '--theme-glass-border': theme.colors.glass.border,
      '--theme-text-primary': theme.colors.text.primary,
      '--theme-text-secondary': theme.colors.text.secondary,
      '--theme-text-muted': theme.colors.text.muted
    }
  }
  
  // 主题动画效果
  const animateThemeChange = () => {
    if (process.client) {
      const root = document.documentElement
      
      // 添加过渡动画类
      root.classList.add('theme-transitioning')
      
      // 移除动画类
      setTimeout(() => {
        root.classList.remove('theme-transitioning')
      }, 300)
    }
  }
  
  // 监听主题变化
  watch([currentMode, isSystemDark], () => {
    updateTheme()
    animateThemeChange()
  })
  
  // 组件挂载时初始化
  onMounted(() => {
    initTheme()
  })
  
  return {
    // 状态
    currentMode: readonly(currentMode),
    isDark: readonly(isDark),
    isSystemDark: readonly(isSystemDark),
    currentTheme: readonly(currentTheme),
    
    // 方法
    setThemeMode,
    toggleTheme,
    getThemeIcon,
    getThemeLabel,
    getThemeClasses,
    getThemeStyles,
    initTheme,
    
    // 工具方法
    animateThemeChange
  }
}

// 全局主题状态
let globalTheme: ReturnType<typeof useTheme> | null = null

export const useGlobalTheme = () => {
  if (!globalTheme) {
    globalTheme = useTheme()
  }
  return globalTheme
}

// 主题相关的工具函数
export const themeUtils = {
  // 根据主题获取颜色
  getColorByTheme: (lightColor: string, darkColor: string, isDark: boolean) => {
    return isDark ? darkColor : lightColor
  },
  
  // 生成主题相关的渐变
  getGradientByTheme: (isDark: boolean) => {
    if (isDark) {
      return 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
    } else {
      return 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)'
    }
  },
  
  // 获取玻璃态效果样式
  getGlassStyles: (isDark: boolean) => {
    if (isDark) {
      return {
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }
    } else {
      return {
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }
    }
  }
}
