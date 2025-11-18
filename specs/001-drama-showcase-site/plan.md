# Implementation Plan: 短剧展示静态网站

**Branch**: `001-drama-showcase-site` | **Date**: 2025-11-18 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-drama-showcase-site/spec.md`

---

## Summary

构建一个苹果官网风格的静态网站,展示短剧剧本写作学习路线图。网站采用React + TypeScript + Vite技术栈,所有内容数据来自duanju.json文件(374KB),支持浏览路线图、查看模块详情、全文搜索、收藏和进度跟踪等功能。

**技术方案核心**:
- **前端框架**: Vite + React 18 + TypeScript 5
- **UI库**: Tailwind CSS + shadcn/ui (苹果式设计)
- **状态管理**: Zustand (localStorage持久化)
- **搜索**: FlexSearch (预构建索引)
- **Markdown**: react-markdown + remark-gfm
- **动画**: CSS Transitions + View Transitions API + Framer Motion(按需)
- **部署**: Vercel (全球CDN)

**性能目标**: Lighthouse >= 95分, FCP < 1.2s, LCP < 1.8s, 首屏 < 2秒

---

## Technical Context

**Language/Version**: TypeScript 5.3+, JavaScript ES2022
**Primary Dependencies**:
- React 18.3+ (并发特性)
- Vite 5.x (构建工具)
- Tailwind CSS 3.x + shadcn/ui (UI框架)
- Zustand 4.x (状态管理)
- FlexSearch 0.7+ (搜索引擎)
- react-markdown + remark-gfm (Markdown渲染)
- react-window (虚拟化)
- zod 3.22+ (数据验证)

**Storage**:
- 数据源: duanju.json (静态文件, 374KB)
- 用户数据: localStorage (收藏和进度)
- 可选: IndexedDB (数据缓存)

**Testing**:
- Vitest (单元测试,可选)
- React Testing Library (组件测试,可选)
- Lighthouse CI (性能测试)

**Target Platform**:
- Web browsers (Chrome >= 111, Safari >= 16, Firefox >= 110, Edge >= 111)
- Mobile responsive (iOS Safari, Android Chrome)
- 静态部署: Vercel/Netlify/GitHub Pages

**Project Type**: Web application (单页应用SPA)

**Performance Goals**:
- Lighthouse Performance >= 95
- FCP < 1.2s
- LCP < 1.8s
- TBT < 150ms
- CLS < 0.05
- 搜索响应 < 200ms
- 主题切换 < 200ms

**Constraints**:
- 首屏加载 < 2秒 (4G网络)
- 初始包体积 < 150KB (gzipped)
- 总包体积 < 500KB
- 支持3G网络(降级体验)
- 无后端依赖,纯静态部署

**Scale/Scope**:
- 6个学习阶段
- ~48个学习模块
- ~312个核心概念
- ~20个推荐资源
- duanju.json文件 374KB (可能增长到1MB)
- 预期用户: 100-1000人/天
- 带宽需求: < 100GB/月

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

验证以下原则合规性(参考 `.specify/memory/constitution.md`):

- [x] **苹果式设计美学**: 设计方案遵循极简主义、充足留白、流畅动画
  - ✅ 使用Tailwind CSS + shadcn/ui实现设计系统
  - ✅ 采用8px间距系统和模块化尺度
  - ✅ 使用CSS Transitions + View Transitions API实现流畅动画(300ms, cubic-bezier)
  - ✅ 支持深色/浅色模式,保持高对比度(WCAG AA标准)

- [x] **数据驱动渲染**: 所有内容来自duanju.json,无硬编码数据
  - ✅ 使用TypeScript接口严格定义数据结构
  - ✅ Zod schema验证运行时数据
  - ✅ ID生成函数(generateModuleId, generateConceptId)
  - ✅ 支持动态数据更新(替换JSON文件即可)

- [x] **组件化与可复用性**: 组件遵循原子设计,具备单一职责
  - ✅ 原子设计方法论(Atoms → Molecules → Organisms → Templates → Pages)
  - ✅ shadcn/ui提供基础组件(Button, Card, Dialog等)
  - ✅ 自定义组件在shadcn基础上扩展
  - ✅ Props使用TypeScript interface严格定义

- [x] **性能优先**: 规划代码分割、图片优化、性能监控
  - ✅ 路由级代码分割(React.lazy + Suspense)
  - ✅ 包级代码分割(vendor, ui, data, markdown)
  - ✅ 虚拟化长列表(react-window)
  - ✅ Web Vitals监控
  - ✅ Lighthouse CI集成

- [x] **类型安全**: 使用TypeScript定义严格类型,配置ESLint/Prettier
  - ✅ 100% TypeScript,禁止`any`类型
  - ✅ Zod runtime validation
  - ✅ ESLint + Prettier配置
  - ✅ Husky pre-commit hooks

**复杂度合理性**: 无违反原则,无需特殊说明。

---

## Project Structure

### Documentation (this feature)

```text
specs/001-drama-showcase-site/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── data-operations.md
├── checklists/          # Quality validation
│   └── requirements.md
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
learning-short-drama/
├── src/
│   ├── components/          # React组件
│   │   ├── ui/              # shadcn/ui基础组件
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   ├── atoms/           # 原子组件
│   │   │   ├── Logo.tsx
│   │   │   ├── Icon.tsx
│   │   │   └── Badge.tsx
│   │   ├── molecules/       # 分子组件
│   │   │   ├── SearchBar.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   │   └── ProgressBar.tsx
│   │   ├── organisms/       # 有机体组件
│   │   │   ├── StageCard.tsx
│   │   │   ├── ModuleCard.tsx
│   │   │   ├── ConceptDetail.tsx
│   │   │   └── RoadmapTimeline.tsx
│   │   └── templates/       # 模板组件
│   │       ├── PageLayout.tsx
│   │       └── DetailLayout.tsx
│   ├── pages/               # 页面组件
│   │   ├── HomePage.tsx
│   │   ├── StageDetailPage.tsx
│   │   ├── ModuleDetailPage.tsx
│   │   ├── ConceptDetailPage.tsx
│   │   └── SearchPage.tsx
│   ├── hooks/               # 自定义Hooks
│   │   ├── useRoadmapData.ts
│   │   ├── useSearch.ts
│   │   ├── useProgress.ts
│   │   └── useDarkMode.ts
│   ├── stores/              # Zustand状态管理
│   │   ├── appStore.ts
│   │   └── userProgressStore.ts
│   ├── lib/                 # 工具函数
│   │   ├── utils.ts         # 通用工具
│   │   ├── cn.ts            # className合并
│   │   └── searchUtils.ts   # 搜索工具
│   ├── types/               # TypeScript类型定义
│   │   ├── roadmap.ts
│   │   └── search.ts
│   ├── data/                # 数据文件
│   │   ├── duanju.json      # 主数据源(374KB)
│   │   └── searchIndex.json # 预构建搜索索引
│   ├── styles/              # 全局样式
│   │   └── globals.css      # Tailwind + 自定义CSS
│   ├── App.tsx              # 根组件
│   └── main.tsx             # 应用入口
├── public/                  # 静态资源
│   ├── fonts/               # Web字体
│   │   ├── SF-Pro-Display.woff2
│   │   └── SF-Pro-Text.woff2
│   └── favicon.ico
├── scripts/                 # 构建脚本
│   ├── buildSearchIndex.ts  # 生成搜索索引
│   ├── generateTypes.ts     # 生成TypeScript类型
│   └── validateData.ts      # 验证JSON数据
├── .github/                 # GitHub配置
│   └── workflows/
│       ├── deploy.yml       # 自动部署
│       └── update-data.yml  # 数据更新流程
├── index.html               # HTML入口
├── vite.config.ts           # Vite配置
├── tailwind.config.js       # Tailwind配置
├── tsconfig.json            # TypeScript配置
├── .eslintrc.js             # ESLint配置
├── .prettierrc              # Prettier配置
├── package.json
└── README.md
```

**Structure Decision**:

选择单页Web应用结构,原因:
1. 项目是纯前端静态网站,无后端API
2. 所有数据来自duanju.json,无需数据库
3. 采用SPA架构,使用React Router实现客户端路由
4. 遵循原子设计方法论组织组件结构
5. 使用Vite构建,输出纯静态文件到dist/目录

---

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*无违反原则,此表格留空。*

---

## Phase 0: Research Summary

详见 [research.md](./research.md)

**关键决策**:
1. **Vite** over Next.js: 纯静态站点不需要SSR,Vite更轻量快速
2. **Zustand** over Context: 性能更优,代码更简洁,persist中间件开箱即用
3. **FlexSearch** over Fuse.js: 速度快100倍,中文友好,索引压缩
4. **CSS + View Transitions** over Framer Motion全局: 性能最优,包体积小
5. **Vercel** over Netlify: 构建速度快,免费额度更好,Web Analytics内置

---

## Phase 1: Design Artifacts

### Data Model

详见 [data-model.md](./data-model.md)

**核心实体**:
- Roadmap → Stage → Module → Concept → Resource (5层树状结构)
- UserProgress (localStorage,客户端)

**TypeScript类型定义**:
```typescript
Roadmap, UserProfile, Stage, Module, Concept, Resource,
StageWithProgress, ModuleWithMetadata, ConceptWithMetadata, UserProgress
```

**Zod验证Schema**:
```typescript
RoadmapSchema, StageSchema, ModuleSchema, ConceptSchema, ResourceSchema
```

---

### Contracts

详见 [contracts/data-operations.md](./contracts/data-operations.md)

**操作类型**:
1. Data Loading (2): loadRoadmapData, loadStageById
2. Search (1): searchContent
3. Favorites (3): addToFavorites, removeFromFavorites, toggleFavorite
4. Progress (2): markAsCompleted, getProgressSummary
5. Theme (2): setTheme, toggleTheme
6. Utilities (3): generateModuleId, generateConceptId, estimateReadingTime

---

### Quickstart Guide

详见 [quickstart.md](./quickstart.md)

**快速启动**:
```bash
npm install
npm run dev
# → http://localhost:5173
```

**脚本参考**:
- `npm run dev` - 开发服务器
- `npm run build` - 生产构建
- `npm run preview` - 预览构建
- `npm run type-check` - TypeScript检查
- `npm run lint` - ESLint检查
- `npm run validate:data` - 验证JSON
- `npm run build:search-index` - 构建搜索索引

---

## Phase 2: Tasks Breakdown

**NOT INCLUDED IN THIS PLAN** - Use `/speckit.tasks` command to generate task list.

---

## Implementation Roadmap

### Week 1-2: Foundation
- 初始化Vite + React + TypeScript项目
- 配置Tailwind CSS + shadcn/ui
- 搭建路由结构
- 实现Zustand状态管理
- JSON数据类型生成

### Week 3-4: Core Features
- 路线图可视化组件
- Markdown渲染和代码高亮
- FlexSearch搜索引擎
- 收藏和进度追踪
- 筛选和排序

### Week 5: Performance Optimization
- 代码分割和懒加载
- 虚拟化长列表
- 字体和资源优化
- Lighthouse审计

### Week 6: Animations & Interactions
- 页面切换动画
- 模块展开/收起
- 深色模式切换
- 加载状态和骨架屏

### Week 7: Deployment & Monitoring
- Vercel部署配置
- GitHub Actions CI/CD
- 性能监控
- 文档和用户指南

**总预估时间**: 7周

---

## Risk Mitigation

### Risk 1: 374KB JSON阻塞首屏
**缓解**: 分片加载 + IndexedDB缓存 + Brotli压缩

### Risk 2: Markdown渲染性能
**缓解**: react-window虚拟化 + useMemo缓存 + Web Worker

### Risk 3: 搜索性能下降
**缓解**: 预构建FlexSearch索引 + debounce(300ms) + 结果分页

### Risk 4: 深色模式闪烁
**缓解**: localStorage初始化 + 内联脚本 + View Transitions API

### Risk 5: 移动端性能
**缓解**: 响应式图片 + 触摸优化 + 减少动画 + Service Worker

---

## Performance Validation

### Target Metrics

| Metric | Target | Validation Method |
|--------|--------|-------------------|
| Lighthouse Performance | >= 95 | Lighthouse CI |
| FCP | < 1.2s | Web Vitals |
| LCP | < 1.8s | Chrome DevTools |
| TBT | < 150ms | Performance API |
| CLS | < 0.05 | Layout Shift |
| Initial Bundle | < 150KB | Rollup Visualizer |
| Total Bundle | < 500KB | Build Analysis |
| Search Speed | < 200ms | Performance.now() |

### Monitoring Tools

- Vercel Web Analytics (内置)
- @vercel/speed-insights
- web-vitals library
- Lighthouse CI (GitHub Actions)
- Chrome DevTools Performance

---

## Deployment Strategy

### Vercel (Primary)

1. 连接GitHub仓库
2. 自动检测Vite配置
3. 每次push自动构建部署
4. PR预览环境
5. 生产环境自动分发到全球CDN

### GitHub Actions Workflow

```yaml
- Type check → Lint → Build → Deploy
- On push to main: Production deployment
- On PR: Preview deployment
- On duanju.json change: Validate → Rebuild index → Deploy
```

### Rollback Strategy

```bash
# Vercel控制台一键回滚到任意历史部署
# 或使用CLI
vercel rollback <deployment-url>
```

---

## Success Criteria Validation

所有成功标准(SC-001 到 SC-012)均通过技术方案验证:

- ✅ SC-001: 首屏 < 2秒 (代码分割 + CDN + 预加载)
- ✅ SC-002: Lighthouse >= 90 (多层级优化策略)
- ✅ SC-003: 95%用户能直观使用 (苹果式设计 + 响应式)
- ✅ SC-004: 交互响应 < 300ms (CSS动画 + 虚拟化)
- ✅ SC-005: 多端功能可用 (Tailwind响应式)
- ✅ SC-006: 主题切换 < 200ms (View Transitions API)
- ✅ SC-007: 搜索 < 200ms (FlexSearch预构建索引)
- ✅ SC-008: 3G网络 < 5秒 (Brotli压缩 + 骨架屏)
- ✅ SC-009: 进度数据100%准确 (Zustand + localStorage)
- ✅ SC-010: 对比度 >= 4.5:1 (WCAG AA颜色系统)
- ✅ SC-011: 100%浏览器兼容 (现代浏览器标准API)
- ✅ SC-012: 导航 <= 3次点击 (扁平化路由结构)

---

## Next Steps

1. ✅ Phase 0 Research完成 → [research.md](./research.md)
2. ✅ Phase 1 Design完成 → [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)
3. ⏭️ **Phase 2**: 运行 `/speckit.tasks` 生成任务列表
4. ⏭️ **Phase 3**: 开始实施任务

---

**Last Updated**: 2025-11-18
**Version**: 1.0.0
**Status**: ✅ Planning Complete, Ready for Tasks Generation
