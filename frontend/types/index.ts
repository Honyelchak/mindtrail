/**
 * 全局类型定义
 */

// 用户相关类型
export interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: 'admin' | 'user' | 'guest'
  permissions: string[]
  profile: UserProfile
  preferences: UserPreferences
}

export interface UserProfile {
  bio: string
  location: string
  website: string
  joinedAt: string
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto'
  language: string
  notifications: NotificationSettings
  privacy: PrivacySettings
}

export interface NotificationSettings {
  email: boolean
  push: boolean
  comments: boolean
  likes: boolean
}

export interface PrivacySettings {
  showEmail: boolean
  showLocation: boolean
  allowComments: boolean
}

// 认证相关类型
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  user?: User
  error?: string
}

// 时间线相关类型
export interface TimelineItem {
  id: string
  type: 'moment' | 'article' | 'gallery'
  title?: string
  content: string
  author: {
    name: string
    avatar: string
  }
  createdAt: string
  updatedAt: string
  tags: string[]
  emotion?: string
  location?: Location
  media?: MediaItem[]
  stats: ItemStats
  isPublic: boolean
  isPinned?: boolean
}

export interface Location {
  name: string
  coordinates: [number, number]
}

export interface MediaItem {
  type: 'image' | 'video'
  url: string
  thumbnail?: string
  alt?: string
  width?: number
  height?: number
}

export interface ItemStats {
  views: number
  likes: number
  comments: number
}

export interface Emotion {
  id: string
  name: string
  emoji: string
  color: string
}

export interface Tag {
  id: string
  name: string
  count: number
  color?: string
}

export interface TimelineFilters {
  type: 'all' | 'moment' | 'article' | 'gallery'
  tag: string
  emotion: string
  dateRange: [string, string] | null
  searchQuery: string
}

// 草稿相关类型
export interface Draft {
  id?: number
  type: 'moment' | 'article' | 'gallery'
  title: string
  content: string
  tags?: string[]
  emotion?: string
  location?: Location
  media?: MediaItem[]
  createdAt: string
  updatedAt: string
  isAutoSave?: boolean
}

// 评论相关类型
export interface Comment {
  id: string
  content: string
  author: {
    name: string
    avatar: string
  }
  createdAt: string
  updatedAt: string
  likes: number
  replies?: Comment[]
  isLiked?: boolean
}

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// 分页类型
export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: Pagination
}

// 排序类型
export type SortBy = 'createdAt' | 'updatedAt' | 'views' | 'likes' | 'title'
export type SortOrder = 'asc' | 'desc'

// 主题类型
export type Theme = 'light' | 'dark' | 'auto'

// 视图模式类型
export type ViewMode = 'list' | 'grid' | 'masonry' | 'timeline'
