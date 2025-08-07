/**
 * 草稿管理 Composable
 * 使用 IndexedDB 存储草稿数据，支持离线编辑
 */

import Dexie from 'dexie'
import type { Draft } from '~/types'

// 定义数据库
class DraftsDatabase extends Dexie {
  drafts!: Dexie.Table<Draft, number>

  constructor() {
    super('MindtrailDrafts')

    this.version(1).stores({
      drafts: '++id, type, title, content, createdAt, updatedAt',
    })
  }
}

export const useDrafts = () => {
  const db = ref<DraftsDatabase | null>(null)
  const drafts = ref<Draft[]>([])
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // 初始化数据库
  const initDB = async () => {
    if (process.client && !db.value) {
      try {
        db.value = new DraftsDatabase()
        await db.value.open()
      } catch (err) {
        console.error('Failed to initialize drafts database:', err)
        error.value = err.message
      }
    }
  }

  /**
   * 保存草稿
   */
  const saveDraft = async (draftData) => {
    if (!db.value) await initDB()

    loading.value = true
    error.value = null

    try {
      const now = new Date().toISOString()

      const draft = {
        type: draftData.type || 'moment',
        title: draftData.title || '',
        content: draftData.content || '',
        media: draftData.media || [],
        tags: draftData.tags || [],
        emotion: draftData.emotion || null,
        location: draftData.location || null,
        category: draftData.category || '',
        excerpt: draftData.excerpt || '',
        createdAt: draftData.createdAt || now,
        updatedAt: now,
      }

      let result
      if (draftData.id) {
        // 更新现有草稿
        result = await db.value.drafts.update(draftData.id, draft)
        if (result === 0) {
          throw new Error('草稿不存在')
        }
        result = draftData.id
      } else {
        // 创建新草稿
        result = await db.value.drafts.add(draft)
      }

      await loadDrafts()
      return result
    } catch (err) {
      console.error('Error saving draft:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 加载所有草稿
   */
  const loadDrafts = async () => {
    if (!db.value) await initDB()

    loading.value = true
    error.value = null

    try {
      const allDrafts = await db.value.drafts
        .orderBy('updatedAt')
        .reverse()
        .toArray()

      drafts.value = allDrafts
      return allDrafts
    } catch (err) {
      console.error('Error loading drafts:', err)
      error.value = err.message
      return []
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取单个草稿
   */
  const getDraft = async (id) => {
    if (!db.value) await initDB()

    try {
      const draft = await db.value.drafts.get(id)
      return draft || null
    } catch (err) {
      console.error('Error getting draft:', err)
      error.value = err.message
      return null
    }
  }

  /**
   * 删除草稿
   */
  const deleteDraft = async (id) => {
    if (!db.value) await initDB()

    loading.value = true
    error.value = null

    try {
      await db.value.drafts.delete(id)
      await loadDrafts()
      return true
    } catch (err) {
      console.error('Error deleting draft:', err)
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * 清空所有草稿
   */
  const clearAllDrafts = async () => {
    if (!db.value) await initDB()

    loading.value = true
    error.value = null

    try {
      await db.value.drafts.clear()
      drafts.value = []
      return true
    } catch (err) {
      console.error('Error clearing drafts:', err)
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * 按类型获取草稿
   */
  const getDraftsByType = async (type) => {
    if (!db.value) await initDB()

    try {
      const typeDrafts = await db.value.drafts
        .where('type')
        .equals(type)
        .orderBy('updatedAt')
        .reverse()
        .toArray()

      return typeDrafts
    } catch (err) {
      console.error('Error getting drafts by type:', err)
      error.value = err.message
      return []
    }
  }

  /**
   * 搜索草稿
   */
  const searchDrafts = async (query) => {
    if (!db.value) await initDB()

    try {
      const searchResults = await db.value.drafts
        .filter(
          (draft) =>
            draft.title.toLowerCase().includes(query.toLowerCase()) ||
            draft.content.toLowerCase().includes(query.toLowerCase())
        )
        .toArray()

      return searchResults
    } catch (err) {
      console.error('Error searching drafts:', err)
      error.value = err.message
      return []
    }
  }

  /**
   * 自动保存草稿（防抖）
   */
  const autoSaveDraft = useDebounceFn(async (draftData) => {
    try {
      await saveDraft(draftData)
    } catch (err) {
      console.warn('Auto-save failed:', err)
    }
  }, 2000)

  /**
   * 获取草稿统计
   */
  const getDraftStats = computed(() => {
    const stats = {
      total: drafts.value.length,
      byType: {},
    }

    drafts.value.forEach((draft) => {
      stats.byType[draft.type] = (stats.byType[draft.type] || 0) + 1
    })

    return stats
  })

  // 清除错误
  const clearError = () => {
    error.value = null
  }

  return {
    // 状态
    drafts: readonly(drafts),
    loading: readonly(loading),
    error: readonly(error),

    // 计算属性
    getDraftStats,

    // 方法
    initDB,
    saveDraft,
    loadDrafts,
    getDraft,
    deleteDraft,
    clearAllDrafts,
    getDraftsByType,
    searchDrafts,
    autoSaveDraft,
    clearError,
  }
}
