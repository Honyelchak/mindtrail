<template>
  <div class="min-h-screen">
    <!-- 页面头部 -->
    <div class="text-center mb-12 px-4">
      <h1 class="text-4xl font-bold text-gradient mb-4">关于我</h1>
      <p
        class="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto"
      >
        一个热爱记录生活、分享思考的创作者
      </p>
    </div>

    <!-- 个人介绍 -->
    <div class="max-w-4xl mx-auto space-y-8">
      <!-- 主要介绍 -->
      <div class="neu-card p-8">
        <div
          class="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8"
        >
          <div class="flex-shrink-0">
            <img
              src="/avatars/author.jpg"
              alt="作者头像"
              class="w-32 h-32 rounded-full object-cover shadow-neu-large"
              @error="handleAvatarError"
            />
          </div>

          <div class="flex-1 text-center md:text-left">
            <h2
              class="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-4"
            >
              你好，我是思维轨迹的记录者 👋
            </h2>
            <div class="prose prose-neutral dark:prose-invert max-w-none">
              <p class="text-lg leading-relaxed mb-4">
                欢迎来到我的数字花园！这里是我记录思考轨迹、分享生活点滴的地方。
                我相信每一个想法都值得被记录，每一次经历都值得被分享。
              </p>
              <p class="leading-relaxed mb-4">
                在这个快节奏的世界里，我们常常忘记停下来思考和感受。
                这个博客就是我的思维驿站，记录着我对技术、生活、艺术和世界的思考。
              </p>
              <p class="leading-relaxed mb-4">
                我是一个热爱创造的人，喜欢用代码构建有趣的产品，用文字表达内心的想法，
                用镜头捕捉生活的美好。每一次旅行、每一本书、每一段代码都是我成长路上的足迹。
              </p>
              <p class="leading-relaxed">
                希望我的文字能够给你带来一些启发，我的照片能够让你感受到美好，
                我的足迹能够激发你探索世界的热情。让我们一起在这个数字时代里，
                保持对生活的热爱和对未知的好奇。
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 兴趣爱好 -->
      <div class="neu-card p-8">
        <h3
          class="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-6 text-center"
        >
          我的兴趣爱好
        </h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div class="text-center">
            <div
              class="w-16 h-16 mx-auto mb-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center"
            >
              <span class="text-2xl">💻</span>
            </div>
            <h4 class="font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              编程开发
            </h4>
            <p class="text-sm text-neutral-500 dark:text-neutral-400">
              热爱技术，享受创造
            </p>
          </div>

          <div class="text-center">
            <div
              class="w-16 h-16 mx-auto mb-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center"
            >
              <span class="text-2xl">📸</span>
            </div>
            <h4 class="font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              摄影记录
            </h4>
            <p class="text-sm text-neutral-500 dark:text-neutral-400">
              用镜头捕捉美好
            </p>
          </div>

          <div class="text-center">
            <div
              class="w-16 h-16 mx-auto mb-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center"
            >
              <span class="text-2xl">✍️</span>
            </div>
            <h4 class="font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              写作思考
            </h4>
            <p class="text-sm text-neutral-500 dark:text-neutral-400">
              文字是思想的载体
            </p>
          </div>

          <div class="text-center">
            <div
              class="w-16 h-16 mx-auto mb-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center"
            >
              <span class="text-2xl">🌍</span>
            </div>
            <h4 class="font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              旅行探索
            </h4>
            <p class="text-sm text-neutral-500 dark:text-neutral-400">
              世界那么大，想去看看
            </p>
          </div>
        </div>
      </div>

      <!-- 技能标签 -->
      <div class="neu-card p-8">
        <h3
          class="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-6 text-center"
        >
          技能与工具
        </h3>
        <div class="flex flex-wrap justify-center gap-3">
          <span
            class="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
          >
            Vue.js
          </span>
          <span
            class="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium"
          >
            Nuxt 3
          </span>
          <span
            class="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium"
          >
            TypeScript
          </span>
          <span
            class="px-4 py-2 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-full text-sm font-medium"
          >
            Tailwind CSS
          </span>
          <span
            class="px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full text-sm font-medium"
          >
            Node.js
          </span>
          <span
            class="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium"
          >
            Python
          </span>
          <span
            class="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-sm font-medium"
          >
            设计思维
          </span>
          <span
            class="px-4 py-2 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-sm font-medium"
          >
            用户体验
          </span>
        </div>
      </div>

      <!-- 个人时间线 -->
      <div class="neu-card p-8">
        <h3
          class="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-6 text-center"
        >
          我的成长轨迹
        </h3>
        <div class="relative">
          <!-- 时间线 -->
          <div
            class="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 to-secondary-500"
          ></div>

          <div class="space-y-6">
            <div
              v-for="milestone in milestones"
              :key="milestone.year"
              class="relative flex items-start space-x-4"
            >
              <div
                class="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center shadow-md z-10"
              >
                <span class="text-white text-xs font-bold">{{
                  milestone.year
                }}</span>
              </div>
              <div class="flex-1 pb-6">
                <h4
                  class="font-semibold text-neutral-800 dark:text-neutral-200 mb-1"
                >
                  {{ milestone.title }}
                </h4>
                <p class="text-sm text-neutral-600 dark:text-neutral-400">
                  {{ milestone.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 联系方式 -->
      <div class="neu-card p-8 text-center">
        <h3
          class="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-4"
        >
          让我们保持联系
        </h3>
        <p class="text-neutral-600 dark:text-neutral-400 mb-6">
          如果你对我的内容感兴趣，或者想要交流合作，欢迎通过以下方式联系我
        </p>

        <div class="flex justify-center space-x-4">
          <a
            href="mailto:hello@mindtrail.com"
            class="neu-button px-6 py-3 flex items-center space-x-2"
          >
            <span>📧</span>
            <span>发送邮件</span>
          </a>
          <a
            href="https://github.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            class="neu-button px-6 py-3 flex items-center space-x-2"
          >
            <span>🐙</span>
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 页面元数据
useHead({
  title: '关于我 - 思维轨迹',
  meta: [
    {
      name: 'description',
      content: '了解思维轨迹博客的作者，一个热爱记录生活、分享思考的创作者。',
    },
  ],
})

// 个人成长轨迹数据
const milestones = ref([
  {
    year: '2024',
    title: '创建思维轨迹博客',
    description: '开始记录自己的思考和生活，用技术构建个人数字花园。',
  },
  {
    year: '2023',
    title: '深入全栈开发',
    description: '掌握了现代前端框架和后端技术，开始构建完整的Web应用。',
  },
  {
    year: '2022',
    title: '开始技术写作',
    description: '在各大技术平台分享开发经验，帮助更多开发者成长。',
  },
  {
    year: '2021',
    title: '转向前端开发',
    description: '从传统开发转向现代前端，拥抱React、Vue等新技术。',
  },
  {
    year: '2020',
    title: '编程之路起航',
    description: '开始学习编程，从第一行Hello World开始了技术人生。',
  },
])

// 方法
const handleAvatarError = (event) => {
  event.target.src = '/avatars/default.jpg'
}
</script>
