# Todo App - 任务管理应用

一个美观现代的任务管理应用，使用 Next.js 14 + Tailwind CSS 构建。

## 功能特性

- ✅ **任务管理**: 添加、编辑、删除任务
- 🔍 **实时搜索**: 快速搜索任务标题和分类
- 📋 **状态过滤**: 全部 / 进行中 / 已完成 任务筛选
- ⏰ **任务状态**: 标记任务为完成、进行中、重要
- 💾 **本地持久化**: 使用 LocalStorage 自动保存数据
- 📊 **周进度追踪**: 可视化展示本周完成度
- 🎨 **精美设计**: 基于 Pencil 设计稿还原的现代化 UI

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **图标**: Lucide React
- **字体**: DM Sans + Bricolage Grotesque

## 设计来源

本应用的设计原型使用 **[Pencil](https://pencil.design)** 制作 - 一个强大的 UI 设计工具。设计文件 `todo.pen` 包含了完整的界面设计，包括：

- 响应式布局
- 精心设计的色彩系统
- 圆角和阴影细节
- 状态指示视觉反馈

## 快速开始

### 安装依赖

```bash
npm install
```

### 运行开发服务器

```bash
npm run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看效果。

### 构建生产版本

```bash
npm run build
npm start
```

## 项目结构

```
try-pencil/
├── app/
│   ├── globals.css      # 全局样式和字体
│   ├── layout.tsx       # 根布局
│   └── page.tsx         # 主页面（Todo App 组件）
├── todo.pen             # Pencil 设计源文件
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 核心功能说明

### 任务操作
- **添加任务**: 点击"添加任务"按钮，填写任务信息
- **编辑任务**: 点击任务卡片即可编辑
- **完成任务**: 点击左侧复选框
- **标记进行中**: 鼠标悬停显示时钟图标按钮
- **标记重要**: 鼠标悬停显示旗帜图标按钮
- **删除任务**: 鼠标悬停显示删除按钮

### 数据持久化
所有任务数据自动保存到浏览器的 LocalStorage，刷新页面数据不会丢失。

## 设计亮点

- **渐变配色**: 使用精心挑选的色彩系统
- **圆角设计**: 统一的圆角风格，视觉柔和
- **状态反馈**: 不同状态有对应的视觉样式
  - 已完成: 灰色文字 + 绿色对勾
  - 进行中: 黄色边框背景
  - 重要: 红色标签

## License

MIT
