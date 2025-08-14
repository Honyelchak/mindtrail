// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // 模块配置
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/color-mode', '@vueuse/nuxt'],

  // 颜色模式配置 - 默认深色主题，但保留切换功能
  colorMode: {
    preference: 'dark', // 默认深色主题
    fallback: 'dark', // 回退到深色模式
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '',
    storageKey: 'nuxt-color-mode',
  },

  // 运行时配置
  runtimeConfig: {
    // 私有配置（仅服务端可用）
    apiSecret: '123',
    // 公共配置（客户端也可用）
    public: {
      apiBase: '/api',
    },
  },

  // 应用配置
  app: {
    head: {
      title: 'Mindtrail - 记录型博客系统',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Mindtrail 是一个记录型博客系统，强调说说、正文、相册打点，支持地图打点、情绪记录、标签过滤等功能。',
        },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
      script: [
        {
          src: 'https://webapi.amap.com/maps?v=2.0&key=c2ffbca173cb1ab3a741b568d014e956&plugin=AMap.Scale,AMap.ToolBar,AMap.ControlBar',
          defer: true,
        },
      ],
    },
  },

  // 组件自动导入配置
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  // 目录配置
  dir: {
    assets: 'assets',
    layouts: 'layouts',
    middleware: 'middleware',
    pages: 'pages',
    plugins: 'plugins',
    public: 'public',
  },
})
