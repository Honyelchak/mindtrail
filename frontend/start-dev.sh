#!/bin/bash

# Mindtrail 开发服务器启动脚本

echo "🚀 启动 Mindtrail 开发服务器..."

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    echo "📥 下载地址: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"

# 检查包管理器
if command -v pnpm &> /dev/null; then
    echo "📦 使用 pnpm 作为包管理器"
    PACKAGE_MANAGER="pnpm"
elif command -v yarn &> /dev/null; then
    echo "📦 使用 yarn 作为包管理器"
    PACKAGE_MANAGER="yarn"
elif command -v npm &> /dev/null; then
    echo "📦 使用 npm 作为包管理器"
    PACKAGE_MANAGER="npm"
else
    echo "❌ 未找到包管理器，请安装 npm、yarn 或 pnpm"
    exit 1
fi

# 检查依赖是否已安装
if [ ! -d "node_modules" ]; then
    echo "📥 安装依赖..."
    $PACKAGE_MANAGER install
fi

# 启动开发服务器
echo "🌟 启动开发服务器..."
echo "📱 访问地址:"
echo "   - 主页: http://localhost:3000"
echo "   - 统计主页: http://localhost:3000/home-stats"
echo "   - 新主页: http://localhost:3000/home-new"
echo "   - 组件测试: http://localhost:3000/test-components"
echo "   - 文章页面: http://localhost:3000/articles-enhanced"
echo "   - 相册页面: http://localhost:3000/gallery-enhanced"
echo ""

$PACKAGE_MANAGER dev
