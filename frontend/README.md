# Mindtrail - 记录型博客系统

Mindtrail 是一个基于 Nuxt 3 的记录型博客系统，强调「说说（短内容）+ 正文（文章）+ 相册打点」，支持地图打点、情绪记录、标签过滤、Markdown 渲染和移动端离线草稿等功能。

## ✨ 特性

- 🎨 **现代化设计**: Neumorphism + Glassmorphism 风格
- 🌓 **主题切换**: 支持明暗主题自动切换
- 📱 **响应式设计**: 完美适配桌面端和移动端
- 🏷️ **标签系统**: 支持标签过滤和分类
- 😊 **情绪记录**: 为每条内容添加情绪标记
- 📍 **地理位置**: 支持地理位置标记
- 🔍 **搜索过滤**: 多维度内容搜索和过滤
- ⚡ **性能优化**: 基于 Nuxt 3 的 SSR/SSG 支持

## 🛠️ 技术栈

- **框架**: Nuxt 3
- **样式**: Tailwind CSS
- **图标**: Heroicons
- **主题**: @nuxtjs/color-mode
- **UI 组件**: Headless UI

## 📁 项目结构

```
frontend/
├── assets/css/          # 全局样式文件
├── components/          # Vue 组件
│   ├── AppHeader.vue    # 头部导航组件
│   ├── AppFooter.vue    # 页脚组件
│   ├── TimelineItem.vue # 时间流项目组件
│   ├── TimelineFilters.vue # 过滤器组件
│   ├── MediaGallery.vue # 媒体画廊组件
│   └── TimelineItemSkeleton.vue # 骨架屏组件
├── composables/         # 组合式函数
│   └── useTimeline.js   # 时间流数据管理
├── data/               # Mock 数据
│   └── mock-data.json  # 示例数据
├── layouts/            # 布局文件
│   └── default.vue     # 默认布局
├── pages/              # 页面文件
│   ├── index.vue       # 首页
│   ├── moments.vue     # 说说页面
│   ├── articles.vue    # 文章页面
│   ├── gallery.vue     # 相册页面
│   ├── map.vue         # 地图页面
│   └── login.vue       # 登录页面
└── public/             # 静态资源
    ├── avatars/        # 用户头像
    └── images/         # 图片资源
```

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:3000` 查看应用。

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 🎯 已完成功能

### ✅ 阶段一：基础架构搭建

1. **Nuxt 3 基础结构** - 完成页面、布局、中间件等基础架构
2. **Tailwind CSS 配置** - 完成样式框架配置和主题系统
3. **主题切换支持** - 实现明暗主题切换功能
4. **响应式布局** - 完成 Header + Main + Footer 布局框架
5. **首页时间流 UI** - 实现混合内容流展示
6. **导航系统** - 完成顶部导航和移动端菜单

### 🎨 设计系统

- **颜色系统**: 支持明暗主题的完整色彩方案
- **组件库**: 基于 Neumorphism 风格的组件系统
- **动画效果**: 流畅的过渡动画和交互反馈
- **响应式**: 完美适配各种屏幕尺寸

### 📊 数据管理

- **Mock 数据**: 完整的示例数据结构
- **Composable**: 响应式数据管理和状态管理
- **过滤系统**: 多维度内容过滤和搜索
- **类型系统**: 支持说说、文章、相册等多种内容类型

## 🔮 下一步计划

- [ ] 实现底部 footer 关于、隐私政策、使用条款等内容
- [ ] 实现内容详情页面
- [ ] 添加内容创建和编辑功能
- [ ] 集成地图功能（Leaflet）
- [ ] 实现用户认证系统
- [ ] 添加评论和互动功能
- [ ] 支持 Markdown 编辑器
- [ ] 实现 PWA 离线功能
- [ ] 添加图片上传和处理

## 📄 许可证

MIT License
