# 短剧编剧学习路线图

一个基于 React + TypeScript 的静态网站，展示短剧编剧的系统化学习内容。

## 功能特性

- 📚 **分阶段学习路线** - 4个学习阶段，13个模块，52个核心概念
- 🔍 **全文搜索** - 基于 FlexSearch 的中文搜索，支持阶段过滤
- 📖 **Markdown 渲染** - 支持 GFM 语法和代码高亮
- 🌙 **深色模式** - 自动检测系统主题，支持手动切换
- 📱 **响应式设计** - 完美适配桌面端和移动端
- ⚡ **性能优化** - 代码分割、懒加载、资源缓存

## 技术栈

- **框架**: React 18 + TypeScript 5
- **构建工具**: Vite 5
- **样式**: Tailwind CSS + shadcn/ui
- **状态管理**: Zustand
- **路由**: React Router 6
- **搜索**: FlexSearch
- **Markdown**: react-markdown + remark-gfm
- **部署**: Vercel

## 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:5173

### 构建生产版本

```bash
# 构建搜索索引
npm run build:search-index

# 构建应用
npm run build

# 预览构建结果
npm run preview
```

## 项目结构

```
src/
├── components/          # React 组件
│   ├── concept/        # 概念相关组件
│   ├── module/         # 模块相关组件
│   ├── resource/       # 资源展示组件
│   ├── search/         # 搜索功能组件
│   ├── stage/          # 阶段相关组件
│   └── ui/             # 通用 UI 组件
├── data/               # 静态数据
│   ├── duanju.json     # 学习内容数据
│   └── searchIndex.json # 搜索索引
├── lib/                # 工具函数
├── pages/              # 页面组件
├── store/              # Zustand 状态管理
└── types/              # TypeScript 类型定义

public/
└── data/               # 公开数据文件

scripts/
└── buildSearchIndex.ts # 搜索索引生成脚本
```

## 路由结构

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | HomePage | 首页，展示所有学习阶段 |
| `/stage/:stageId` | StageDetailPage | 阶段详情，展示模块和概念 |
| `/concept/:stageId/:moduleIndex/:conceptIndex` | ConceptDetailPage | 概念详情，Markdown 内容 |
| `/search` | SearchPage | 搜索页面 |

## 数据格式

学习内容数据结构 (`duanju.json`):

```typescript
interface RoadmapData {
  title: string
  description: string
  stages: Stage[]
}

interface Stage {
  stage_id: string
  stage_title: string
  stage_description: string
  modules: Module[]
}

interface Module {
  module_title: string
  concepts: Concept[]
}

interface Concept {
  concept_title: string
  concept_detail: string  // Markdown 格式
  detail_file?: string
}
```

## 更新内容

1. 编辑 `public/data/duanju.json` 文件
2. 重新生成搜索索引：`npm run build:search-index`
3. 重新构建应用：`npm run build`

## 部署

项目配置了 Vercel 自动部署。推送到 main 分支会自动触发部署。

### 手动部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

## 开发指南

### 代码规范

- 使用 ESLint + Prettier 进行代码检查和格式化
- 组件使用函数式组件 + Hooks
- 状态管理使用 Zustand
- 样式使用 Tailwind CSS 工具类

### 添加新组件

1. 在对应目录创建组件文件
2. 使用 shadcn/ui 的设计系统
3. 导出组件供其他模块使用

### 性能优化建议

- 使用 `React.lazy` 进行路由级代码分割
- 使用 `React.memo` 避免不必要的重渲染
- 图片使用 WebP 格式并设置合适尺寸
- 使用 `useMemo` 和 `useCallback` 优化计算

## License

MIT
