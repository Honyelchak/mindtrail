# 🎯 Mindtrail 功能指南

## 🚀 快速开始

### 启动开发服务器

```bash
# 方法1: 使用启动脚本
./start-dev.sh

# 方法2: 手动启动
npm install  # 或 yarn install / pnpm install
npm run dev  # 或 yarn dev / pnpm dev
```

### 访问地址

- **主页**: http://localhost:3000
- **统计主页**: http://localhost:3000/home-stats ⭐ 新增
- **新主页**: http://localhost:3000/home-new
- **组件测试页**: http://localhost:3000/test-components
- **文章页面**: http://localhost:3000/articles-enhanced
- **相册页面**: http://localhost:3000/gallery-enhanced

## 🌟 新增功能

### 1. 🏠 全屏 Banner (HeroBanner)

**位置**: `/components/home/HeroBanner.vue`

**功能特性**:

- ✅ 全屏背景图片展示
- ✅ 支持后台更换图片（Mock 数据）
- ✅ 响应式设计
- ✅ 优雅的文字叠加和动画
- ✅ 行动按钮导航

**使用方式**:

```vue
<HeroBanner />
```

### 2. 📅 历史记录 (HistoryRecords)

**位置**: `/components/home/HistoryRecords.vue`

**功能特性**:

- ✅ 历年今日记录展示
- ✅ 上个月今天记录
- ✅ 去年今天记录
- ✅ 时间轴样式展示
- ✅ 分类标签和链接

**使用方式**:

```vue
<HistoryRecords />
```

### 3. 📝 文章分类系统 (ArticleCategories)

**位置**: `/components/articles/ArticleCategories.vue`

**功能特性**:

- ✅ 多种分类（生活感悟、读书笔记、技术学习、旅行日记、工作反思）
- ✅ 分类统计和筛选
- ✅ 分类管理（添加/删除）
- ✅ 响应式设计

**使用方式**:

```vue
<ArticleCategories
  :selected-category="selectedCategory"
  @category-change="handleCategoryChange"
/>
```

### 4. 🖼️ 相册分类系统 (GalleryCategories)

**位置**: `/components/gallery/GalleryCategories.vue`

**功能特性**:

- ✅ 多维度分类（日常生活、旅游、好友、美食、自然风光、宠物）
- ✅ 热门标签筛选
- ✅ 时间范围筛选
- ✅ 分类管理功能

**使用方式**:

```vue
<GalleryCategories
  :selected-category="selectedCategory"
  :selected-tags="selectedTags"
  :selected-time-range="selectedTimeRange"
  @category-change="handleCategoryChange"
  @tags-change="handleTagsChange"
  @time-range-change="handleTimeRangeChange"
/>
```

### 5. 💭 图片评价/感悟 (PhotoReflection)

**位置**: `/components/gallery/PhotoReflection.vue`

**功能特性**:

- ✅ 添加感悟内容
- ✅ 情绪标记（8 种情绪：开心、兴奋、平静、怀念等）
- ✅ 标签管理
- ✅ 历史感悟时间线展示
- ✅ 删除和编辑功能

**使用方式**:

```vue
<PhotoReflection :photo-id="photoId" />
```

### 6. 📄 Markdown 渲染器 (MarkdownRenderer)

**位置**: `/components/articles/MarkdownRenderer.vue`

**功能特性**:

- ✅ 使用 `markdown-it` 解析器
- ✅ 自定义渲染规则（代码高亮、表格、引用等）
- ✅ 支持从 URL 加载 Markdown 文件
- ✅ 深色主题优化的样式
- ✅ 响应式设计

**使用方式**:

```vue
<!-- 从文件加载 -->
<MarkdownRenderer content="/articles/sample-article.md" source="url" />

<!-- 直接内容 -->
<MarkdownRenderer :content="markdownString" source="string" />
```

### 7. 📊 统计概览和鼓励话语 ⭐ 新增

**位置**: 主页统计部分

**功能特性**:

- ✅ 累计记录统计（文章、照片、心情、天数）
- ✅ 彩色渐变统计卡片
- ✅ 动态鼓励话语（每 30 秒自动切换）
- ✅ 未来回忆提醒文字
- ✅ 响应式设计

**鼓励话语示例**:

- "累计记录了 156 篇文章，2847 张照片，423 条心情，坚持了 365 天"
- "等你老了，翻看这些记录，会发现原来自己的人生如此精彩"

### 8. 🔥 活动热力图 (ActivityHeatmap) ⭐ 新增

**位置**: `/components/home/ActivityHeatmap.vue`

**功能特性**:

- ✅ 类似 GitHub 的提交记录热力图
- ✅ 显示每日记录活动频率
- ✅ 支持年份切换（2020 年至今）
- ✅ 悬停显示详细信息
- ✅ 响应式设计
- ✅ 智能数据生成（周末、节假日权重不同）

**使用方式**:

```vue
<ActivityHeatmap />
```

**特色功能**:

- 🎨 5 级颜色深度表示活动频率
- 📅 支持历史年份查询
- 💡 悬停提示显示具体日期和记录数
- 📱 移动端自适应缩放

## 🎨 主题系统

### 配置

- **默认主题**: 深色主题
- **切换功能**: 保留，用户可自由切换
- **响应式**: 所有组件支持主题切换

### 切换方式

1. **导航栏按钮**: 右上角主题切换图标
2. **用户菜单**: 用户头像菜单中的"主题切换"选项

## 🗺️ 地图配置

### 高德地图

- **API Key**: `c2ffbca173cb1ab3a741b568d014e956`
- **配置位置**: `nuxt.config.ts`

## 📁 文件结构

```
frontend/
├── components/
│   ├── home/
│   │   ├── HeroBanner.vue          # 全屏Banner
│   │   └── HistoryRecords.vue      # 历史记录
│   ├── articles/
│   │   ├── ArticleCategories.vue   # 文章分类
│   │   └── MarkdownRenderer.vue    # Markdown渲染
│   └── gallery/
│       ├── GalleryCategories.vue   # 相册分类
│       └── PhotoReflection.vue     # 图片评价
├── pages/
│   ├── home-new.vue               # 新主页
│   ├── test-components.vue        # 组件测试页
│   ├── articles/[id].vue          # 文章详情页
│   └── gallery/[id].vue           # 图片详情页
└── public/
    └── articles/
        └── sample-article.md       # 示例Markdown文件
```

## 🧪 测试指南

### 组件测试页面

访问 `/test-components` 可以测试所有组件的功能：

1. **Banner 组件**: 查看全屏展示效果
2. **历史记录**: 查看时间轴展示
3. **文章分类**: 测试分类筛选功能
4. **相册分类**: 测试多维度筛选
5. **图片评价**: 测试感悟添加功能
6. **Markdown 渲染**: 测试文件加载和直接渲染

### 功能测试流程

1. 启动开发服务器
2. 访问各个页面测试功能
3. 测试主题切换
4. 测试响应式设计（调整浏览器窗口大小）

## 🔧 开发说明

### 数据结构

- 所有组件使用 Mock 数据
- 数据结构完整，便于后续 API 集成
- 支持 TypeScript 类型检查

### 样式系统

- 使用 Tailwind CSS
- 自定义组件样式
- 响应式设计
- 深色主题优化

### 下一步开发

1. **API 集成**: 将 Mock 数据替换为真实 API
2. **数据持久化**: 实现后端存储
3. **图片上传**: 实现文件上传功能
4. **搜索优化**: 增强搜索功能
5. **性能优化**: 代码分割和懒加载

## 🎉 总结

所有核心功能已经实现并可以正常工作：

- ✅ 全屏 Banner 和历史记录
- ✅ 文章和相册分类系统
- ✅ 图片评价功能
- ✅ Markdown 渲染支持
- ✅ 主题切换系统
- ✅ 响应式设计

现在可以启动开发服务器来体验这些功能！🚀
