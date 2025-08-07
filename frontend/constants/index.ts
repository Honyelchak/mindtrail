/**
 * 应用常量定义
 */

// 应用信息
export const APP_INFO = {
  name: 'Mindtrail',
  description: '记录型博客系统',
  version: '1.0.0',
  author: 'Mindtrail Team',
  website: 'https://mindtrail.com'
} as const

// 本地存储键名
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  LANGUAGE: 'language',
  DRAFTS: 'drafts',
  PREFERENCES: 'preferences'
} as const

// API 端点
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    PROFILE: '/api/auth/profile'
  },
  TIMELINE: {
    LIST: '/api/timeline',
    CREATE: '/api/timeline',
    UPDATE: '/api/timeline',
    DELETE: '/api/timeline'
  },
  MEDIA: {
    UPLOAD: '/api/media/upload',
    DELETE: '/api/media'
  },
  COMMENTS: {
    LIST: '/api/comments',
    CREATE: '/api/comments',
    UPDATE: '/api/comments',
    DELETE: '/api/comments'
  }
} as const

// 内容类型
export const CONTENT_TYPES = {
  MOMENT: 'moment',
  ARTICLE: 'article',
  GALLERY: 'gallery'
} as const

// 情绪列表
export const EMOTIONS = [
  { id: 'happy', name: '开心', emoji: '😊', color: '#FFD93D' },
  { id: 'excited', name: '兴奋', emoji: '🤩', color: '#FF6B6B' },
  { id: 'calm', name: '平静', emoji: '😌', color: '#4ECDC4' },
  { id: 'thoughtful', name: '思考', emoji: '🤔', color: '#45B7D1' },
  { id: 'grateful', name: '感恩', emoji: '🙏', color: '#96CEB4' },
  { id: 'nostalgic', name: '怀念', emoji: '😌', color: '#FFEAA7' },
  { id: 'inspired', name: '灵感', emoji: '💡', color: '#DDA0DD' },
  { id: 'peaceful', name: '宁静', emoji: '🕊️', color: '#98D8C8' },
  { id: 'adventurous', name: '冒险', emoji: '🗺️', color: '#F7DC6F' },
  { id: 'creative', name: '创造', emoji: '🎨', color: '#BB8FCE' }
] as const

// 标签颜色
export const TAG_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8C471', '#82E0AA', '#AED6F1', '#E8DAEF', '#FADBD8'
] as const

// 分页配置
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
  PAGE_SIZE_OPTIONS: [10, 20, 30, 50]
} as const

// 文件上传配置
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/ogg'],
  MAX_FILES_PER_UPLOAD: 9
} as const

// 表单验证规则
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  USERNAME_MIN_LENGTH: 2,
  USERNAME_MAX_LENGTH: 20,
  TITLE_MAX_LENGTH: 100,
  CONTENT_MAX_LENGTH: 10000,
  BIO_MAX_LENGTH: 500
} as const

// 动画持续时间
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500
} as const

// 响应式断点
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
} as const

// 主题配置
export const THEME_CONFIG = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto'
} as const

// 语言配置
export const LANGUAGES = {
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  'en-US': 'English',
  'ja-JP': '日本語',
  'ko-KR': '한국어'
} as const

// 视图模式
export const VIEW_MODES = {
  LIST: 'list',
  GRID: 'grid',
  MASONRY: 'masonry',
  TIMELINE: 'timeline'
} as const

// 排序选项
export const SORT_OPTIONS = [
  { value: 'createdAt', label: '创建时间', order: 'desc' },
  { value: 'updatedAt', label: '更新时间', order: 'desc' },
  { value: 'views', label: '浏览量', order: 'desc' },
  { value: 'likes', label: '点赞数', order: 'desc' },
  { value: 'title', label: '标题', order: 'asc' }
] as const

// 错误消息
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  SERVER_ERROR: '服务器错误，请稍后重试',
  UNAUTHORIZED: '未授权访问，请先登录',
  FORBIDDEN: '权限不足，无法访问',
  NOT_FOUND: '请求的资源不存在',
  VALIDATION_ERROR: '输入数据格式错误',
  FILE_TOO_LARGE: '文件大小超出限制',
  UNSUPPORTED_FILE_TYPE: '不支持的文件类型'
} as const

// 成功消息
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: '登录成功',
  REGISTER_SUCCESS: '注册成功',
  LOGOUT_SUCCESS: '退出成功',
  SAVE_SUCCESS: '保存成功',
  DELETE_SUCCESS: '删除成功',
  UPDATE_SUCCESS: '更新成功',
  UPLOAD_SUCCESS: '上传成功'
} as const

// 默认配置
export const DEFAULT_CONFIG = {
  THEME: THEME_CONFIG.AUTO,
  LANGUAGE: 'zh-CN',
  VIEW_MODE: VIEW_MODES.LIST,
  PAGE_SIZE: PAGINATION.DEFAULT_PAGE_SIZE,
  AUTO_SAVE_INTERVAL: 30000, // 30秒
  NOTIFICATION_DURATION: 3000 // 3秒
} as const
