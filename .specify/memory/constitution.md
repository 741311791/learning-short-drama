<!--
Sync Impact Report
==================
Version Change: N/A → 1.0.0 (Initial constitution creation)
Modified Principles: N/A (New creation)
Added Sections: All core principles, Design Standards, Development Workflow, Governance
Removed Sections: N/A
Templates Requiring Updates:
  ✅ plan-template.md - Updated (Constitution Check section references this file)
  ✅ spec-template.md - Compatible (User-centric approach aligns)
  ✅ tasks-template.md - Compatible (Component-based organization aligns)
Follow-up TODOs: None
-->

# 短剧展示静态网站项目原则

## 核心原则

### I. 苹果式设计美学 (NON-NEGOTIABLE)

**核心要求:**
- 界面设计MUST遵循苹果官网的极简主义风格
- 留白MUST充足,元素间距符合苹果设计规范(通常为8px的倍数)
- 动画MUST流畅自然,遵循ease-in-out曲线
- 字体MUST优雅简洁,优先使用SF Pro Display或类似系统字体
- 配色MUST克制,以黑白灰为主,品牌色为辅

**设计原则:**
- 信息层次清晰,视觉焦点明确
- 交互反馈及时且优雅
- 适配深色/浅色模式
- 保持视觉一致性

**技术约束:**
- 使用Tailwind CSS实现设计系统
- 利用shadcn/ui组件库保持一致性
- 动画使用Framer Motion或CSS Transitions
- 响应式设计MUST支持移动端、平板、桌面端

**理由:** 苹果式设计不仅是视觉要求,更是用户体验的保障。极简主义能让内容(短剧数据)成为焦点,而非被复杂界面淹没。

---

### II. 数据驱动渲染 (NON-NEGOTIABLE)

**核心要求:**
- 所有内容MUST来源于duanju.json文件
- 不得硬编码任何业务数据
- 数据结构MUST与JSON schema严格对应
- 支持动态数据更新(替换JSON文件即可更新内容)

**数据处理规范:**
- 使用TypeScript定义严格的类型接口
- 实现数据验证层(如Zod)确保数据完整性
- 错误处理MUST优雅降级(数据缺失时显示占位符)
- 支持数据的搜索、筛选、排序功能

**理由:** 数据驱动确保了内容与代码的分离,使得非技术人员也能通过更新JSON来更新网站内容,降低维护成本。

---

### III. 组件化与可复用性

**核心要求:**
- 遵循React组件化开发最佳实践
- 每个UI元素MUST设计为独立可复用组件
- 组件MUST具备明确的职责边界(单一职责原则)
- 使用shadcn/ui作为基础组件库,自定义样式在其上层实现

**组件设计规范:**
- 采用原子设计方法论(Atoms → Molecules → Organisms → Templates → Pages)
- Props接口MUST使用TypeScript严格定义
- 组件MUST包含默认值和错误状态处理
- 复杂组件MUST拆分为更小的子组件

**组件目录结构示例:**
```
src/
  components/
    ui/           # shadcn/ui基础组件
    atoms/        # 原子组件(Button, Icon, Text)
    molecules/    # 分子组件(Card, SearchBar)
    organisms/    # 有机体组件(ModuleCard, StageTimeline)
    templates/    # 模板组件(PageLayout)
  pages/          # 页面组件
  lib/            # 工具函数
  types/          # TypeScript类型定义
```

**理由:** 组件化确保代码可维护性和可扩展性,shadcn/ui提供了高质量的基础组件,减少重复造轮子。

---

### IV. 性能优先

**核心要求:**
- 首屏加载时间MUST < 2秒(4G网络)
- Lighthouse性能评分MUST > 90分
- 图片MUST优化(WebP格式,懒加载)
- 代码分割(Code Splitting)以减少初始包体积

**性能优化策略:**
- 使用React.lazy和Suspense实现路由级代码分割
- 图片使用Next.js Image组件或类似优化方案
- 实现虚拟滚动处理长列表(如大量模块数据)
- 使用缓存策略减少重复渲染

**性能监控:**
- 集成Web Vitals监控(LCP, FID, CLS)
- 使用React DevTools Profiler分析渲染性能
- 定期运行Lighthouse审计

**理由:** 性能直接影响用户体验,尤其在移动端。苹果官网的流畅体验很大程度上来自于极致的性能优化。

---

### V. 类型安全与代码质量

**核心要求:**
- 100%使用TypeScript,禁止any类型(除非充分说明)
- ESLint + Prettier强制代码规范
- Git提交前MUST通过类型检查和Lint检查
- 关键业务逻辑MUST包含注释

**类型定义规范:**
- 为duanju.json创建完整的TypeScript接口定义
- 使用Zod或Yup进行运行时类型验证
- 组件Props MUST使用interface定义
- 避免类型断言(as),优先使用类型守卫

**代码审查标准:**
- 遵循Airbnb JavaScript/React规范
- 函数MUST保持单一职责,长度不超过50行
- 复杂逻辑MUST提取为独立函数
- 魔法数字MUST定义为常量

**理由:** TypeScript提供静态类型检查,减少运行时错误。严格的代码规范确保团队协作时代码风格一致。

---

## 设计标准

### 视觉设计规范

**颜色系统:**
- Primary: 苹果蓝(#007AFF)或品牌色
- Neutral: 黑(#000000)、深灰(#1D1D1F)、中灰(#86868B)、浅灰(#F5F5F7)
- Background: 白色(#FFFFFF)浅色模式,深灰(#000000)深色模式
- Accent: 根据内容类型定义强调色

**字体系统:**
- 标题: SF Pro Display或Inter,字重600-700
- 正文: SF Pro Text或Inter,字重400-500
- 等宽: SF Mono或Fira Code(用于代码展示)
- 字号范围: 12px-72px,遵循模块化尺度

**间距系统:**
- 基础单位: 4px
- 常用间距: 8px, 16px, 24px, 32px, 48px, 64px
- 组件内边距: 16px-24px
- 组件间距: 32px-64px

**圆角规范:**
- 小组件: 8px
- 卡片: 12px-16px
- 模态框: 20px
- 图片容器: 12px

### 交互设计规范

**动画参数:**
- 过渡时长: 150ms(快速),300ms(标准),500ms(慢速)
- 缓动函数: cubic-bezier(0.4, 0, 0.2, 1)
- Hover效果: 缩放1.02-1.05,阴影加深
- 页面切换: 淡入淡出或滑动过渡

**响应式断点:**
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px
- Large Desktop: > 1440px

---

## 开发工作流

### 技术栈

**必选技术:**
- **框架**: React 18+ (使用函数组件和Hooks)
- **构建工具**: Vite或Next.js(推荐Vite用于纯静态站点)
- **样式方案**: Tailwind CSS + shadcn/ui
- **类型系统**: TypeScript 5+
- **状态管理**: React Context或Zustand(如需复杂状态)
- **路由**: React Router(如为SPA)或Next.js路由

**可选技术:**
- **动画库**: Framer Motion
- **图标库**: Lucide React或Heroicons
- **数据验证**: Zod
- **部署**: Vercel, Netlify或GitHub Pages

### 开发规范

**Git工作流:**
- 分支策略: main(生产)、develop(开发)、feature/*(功能分支)
- 提交信息: 遵循Conventional Commits规范
  - feat: 新功能
  - fix: 修复bug
  - style: 样式调整
  - refactor: 重构
  - docs: 文档更新
- 提交前MUST通过: TypeScript检查、ESLint、Prettier

**目录结构约定:**
```
project-root/
├── src/
│   ├── components/      # 组件
│   ├── pages/           # 页面
│   ├── lib/             # 工具函数
│   ├── types/           # 类型定义
│   ├── data/            # 数据处理层
│   │   └── duanju.json  # 数据源
│   ├── styles/          # 全局样式
│   └── App.tsx          # 根组件
├── public/              # 静态资源
├── tests/               # 测试文件(如需要)
├── .eslintrc.js         # ESLint配置
├── .prettierrc          # Prettier配置
├── tsconfig.json        # TypeScript配置
├── tailwind.config.js   # Tailwind配置
└── vite.config.ts       # Vite配置
```

**命名约定:**
- 组件文件: PascalCase (e.g., ModuleCard.tsx)
- 工具函数文件: camelCase (e.g., dataParser.ts)
- 类型定义文件: PascalCase (e.g., Duanju.types.ts)
- 常量文件: UPPER_SNAKE_CASE (e.g., DESIGN_TOKENS.ts)

### 质量保证

**代码审查要点:**
- [ ] 是否符合苹果式设计美学
- [ ] 是否正确使用duanju.json数据
- [ ] TypeScript类型是否完善
- [ ] 组件是否可复用
- [ ] 性能是否达标
- [ ] 响应式设计是否完整
- [ ] 代码是否符合规范

**部署前检查清单:**
- [ ] 运行`npm run build`无错误
- [ ] Lighthouse性能评分>90
- [ ] 移动端、平板、桌面端显示正常
- [ ] 深色/浅色模式切换正常
- [ ] 数据加载错误处理正常
- [ ] 所有图片已优化

---

## 治理规则

### 宪法权威

本原则文档是项目开发的最高指导原则,所有设计决策、代码实现、功能扩展MUST符合本文档要求。

### 修订流程

**修订条件:**
- 技术栈发生重大变更(如React版本升级)
- 设计需求调整(如品牌升级)
- 性能标准提升
- 新增重大功能模块

**修订流程:**
1. 提出修订建议(包含理由和影响范围)
2. 技术团队评审
3. 更新本文档
4. 同步更新相关模板文件
5. 记录修订历史

### 版本控制

**版本号规则(语义化版本):**
- **MAJOR**: 破坏性变更(如更换技术栈、设计体系重构)
- **MINOR**: 新增原则或扩展指导(如新增性能要求、新增组件规范)
- **PATCH**: 澄清描述、修正错误、细微调整

**当前版本变更说明:**
- v1.0.0: 初始版本,建立项目五大核心原则和开发规范

### 合规性检查

**PR合并前MUST验证:**
- 代码符合Type Safety原则(通过TypeScript检查)
- 组件符合Component Reusability原则(审查组件设计)
- 性能符合Performance First原则(运行Lighthouse)
- 设计符合Apple-style Design原则(设计审查)
- 数据处理符合Data-Driven原则(检查JSON使用)

**定期审查:**
- 每月进行一次性能审计
- 每季度进行代码质量审查
- 重大功能上线前进行全面合规检查

---

**Version**: 1.0.0 | **Ratified**: 2025-11-18 | **Last Amended**: 2025-11-18
