# 技术调研报告:短剧展示静态网站

**Date**: 2025-11-18
**Feature**: 001-drama-showcase-site
**Purpose**: 为苹果官网风格的短剧展示静态网站选择最佳技术栈

---

## 1. 前端框架选择

**决策**: Vite + React

**理由**:
- 性能优势:Vite使用原生ES模块,开发服务器启动速度比Next.js快10倍以上,HMR响应<50ms
- 构建优化:Rollup构建产物体积比Next.js小15-20%,对于纯静态站点更轻量
- 简单直接:无需学习Next.js的复杂路由概念,配置更简洁
- 374KB JSON优化:Vite支持动态导入和代码分割,可将JSON按路由懒加载
- 静态部署友好:一次构建生成纯静态文件,无需Node.js运行时

**替代方案考虑**:
- Next.js:功能强大但对纯静态站点过度设计,SSR/SSG特性带来约200KB额外运行时代码
- Astro:适合内容站点但React集成需额外配置,生态不如Vite成熟

**实施建议**:
```typescript
// vite.config.ts
{
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'ui': ['@radix-ui/react-*'],
          'data': ['./src/data/duanju.json']
        }
      }
    },
    chunkSizeWarningLimit: 500
  }
}
```

---

## 2. 状态管理方案

**决策**: Zustand + localStorage中间件

**理由**:
- 性能卓越:基于Proxy的订阅机制,组件只在使用的state变化时重渲染,比Context快3-5倍
- 代码简洁:相比Context减少70%样板代码,不需要Provider嵌套
- 持久化内置:`persist`中间件开箱即用,自动同步localStorage
- TypeScript友好:类型推断完美,无需手动定义Context类型
- 包体积小:仅1.2KB(gzipped),对Lighthouse分数影响可忽略

**替代方案考虑**:
- React Context:每次更新导致所有消费组件重渲染,性能差,代码冗余
- Jotai:原子化状态管理学习曲线陡峭,对于中小型项目过度设计

**实施建议**:
- 使用persist中间件实现用户收藏和进度的本地持久化
- 分离临时状态(搜索查询)和持久化状态(收藏列表)
- 使用partialize仅持久化必要数据,减少localStorage占用

---

## 3. Markdown渲染方案

**决策**: react-markdown + remark-gfm + react-window虚拟化

**理由**:
- 生态成熟:unified生态(remark/rehype)插件丰富,支持GFM表格、任务列表、删除线
- 性能优化:惰性渲染,仅渲染可视区域的Markdown内容
- 安全性:内置XSS防护,自动过滤危险HTML
- 包体积:核心库35KB gzipped,按需加载插件

**替代方案考虑**:
- marked:速度快但功能弱,不支持React组件化,需要手动处理XSS
- MDX:功能强大但过度,需要编译步骤,不适合运行时渲染JSON中的Markdown

**实施建议**:
- 使用react-syntax-highlighter处理代码块高亮
- 长文档使用react-window虚拟化,避免一次性渲染大量内容
- 使用useMemo缓存渲染结果,避免重复渲染

---

## 4. 搜索实现方案

**决策**: FlexSearch + 构建时索引生成

**理由**:
- 性能极致:比Fuse.js快100-200倍,200ms内搜索10万条记录
- 中文友好:内置CJK分词器,支持拼音搜索
- 索引压缩:预构建索引可压缩至原始数据的10-20%
- 内存高效:使用位向量和倒排索引,374KB数据仅需约50KB索引

**替代方案考虑**:
- Fuse.js:模糊搜索强但速度慢,不适合大数据量
- Lunr.js:索引体积大(原始数据的50%),中文支持差

**实施建议**:
- 构建时生成搜索索引并导出为JSON
- 运行时直接导入预构建索引,无需重新构建
- 使用debounce(300ms)避免频繁搜索请求
- 搜索结果使用mark.js高亮匹配文本

---

## 5. 动画和过渡方案

**决策**: CSS Transitions + View Transitions API + Framer Motion(仅复杂交互)

**理由**:
- 性能最优:CSS动画在GPU上运行,60fps稳定,0JS成本
- 原生支持:View Transitions API提供苹果式页面切换(Chrome 111+)
- 渐进增强:不支持的浏览器降级为instant切换
- 按需加载:Framer Motion仅用于复杂手势(拖拽、滑动),减少42KB包体积

**替代方案考虑**:
- Framer Motion全局:功能强大但包体积大,简单过渡用CSS即可
- React Spring:基于物理引擎的动画过度,学习曲线陡峭
- GSAP:商业项目需付费,且不适合React生态

**实施建议**:
```css
:root {
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-normal: 300ms;
}

* {
  transition: all var(--duration-normal) var(--ease-out-expo);
}
```

---

## 6. 性能优化策略

**决策**: 多层级优化策略

### 6.1 代码分割
- 框架核心(react, react-dom):~130KB
- UI组件(@radix-ui):~80KB
- 数据和搜索(flexsearch):~50KB
- Markdown渲染(懒加载):~40KB
- 动画库(按需加载):可选

### 6.2 资源优化
- 字体预加载(preload)
- 预连接CDN(preconnect)
- 图片懒加载(loading="lazy")

### 6.3 Web Vitals目标
- LCP < 1.8s:预加载关键JSON,使用骨架屏
- FID < 100ms:避免长任务,使用Web Worker
- CLS < 0.05:固定容器尺寸,font-display: swap

### 6.4 374KB JSON优化
- 方案1:分片加载(按阶段拆分)
- 方案2:lz-string压缩存储
- 方案3:IndexedDB缓存

**预期性能指标**:
- Lighthouse Performance: 95+
- FCP: < 1.2s
- LCP: < 1.8s
- TBT: < 150ms
- CLS: < 0.05

---

## 7. 部署和CI/CD

**决策**: Vercel + GitHub Actions

**理由**:
- 性能最优:全球边缘网络(CDN),TTFB < 100ms
- 零配置:自动检测Vite,一键部署
- 预览环境:每个PR自动生成预览链接
- 免费额度:个人项目100GB带宽/月,足够使用
- Web Analytics:内置性能监控,无需额外配置

**替代方案考虑**:
- Netlify:功能相似但构建速度慢30%,免费额度更少
- GitHub Pages:免费但无CDN,国内访问慢,不支持SPA路由

**实施建议**:
- 配置vercel.json启用SPA路由重写
- GitHub Actions自动化:类型检查→Lint→构建→部署
- 数据更新工作流:duanju.json变更→验证→重建索引→部署

---

## 技术栈总结

### 核心技术栈

| 类别 | 技术选择 | 版本 | 包体积 |
|------|----------|------|--------|
| 构建工具 | Vite | 5.x | - |
| 运行时 | React | 18.3+ | 130KB |
| 类型系统 | TypeScript | 5.3+ | - |
| 路由 | React Router | 6.x | 12KB |
| 状态管理 | Zustand | 4.x | 1.2KB |
| 样式方案 | Tailwind CSS + shadcn/ui | 3.x | ~50KB |
| Markdown | react-markdown + remark-gfm | - | 35KB |
| 搜索引擎 | FlexSearch | - | 8KB |
| 动画库 | CSS + View Transitions + Framer Motion | - | 0-42KB |
| 虚拟化 | react-window | - | 6KB |
| 部署平台 | Vercel | - | - |
| CI/CD | GitHub Actions | - | - |

**总包体积预估**: 初始加载 < 150KB, 总体 < 500KB

### 性能目标验证矩阵

| 指标 | 目标 | 实现策略 |
|------|------|---------|
| Performance | 95+ | 代码分割、懒加载、CDN |
| FCP | <1.2s | 内联关键CSS、预加载字体 |
| LCP | <1.8s | 预加载JSON、骨架屏 |
| TBT | <150ms | 避免长任务、Web Worker |
| CLS | <0.05 | 固定容器尺寸、font-display |
| 包体积 | <300KB | Tree-shaking、压缩 |
| 搜索速度 | <200ms | FlexSearch、索引预构建 |

---

## 风险和缓解措施

### 风险1: 374KB JSON文件阻塞首屏
**影响**: LCP超过2.5秒,Lighthouse性能分数<80

**缓解措施**:
1. 分片加载:将JSON按阶段拆分为多个文件
2. 渐进式渲染:使用React.lazy和Suspense显示加载状态
3. 压缩传输:启用Brotli压缩,减少50%传输体积
4. IndexedDB缓存:首次加载后存储到本地,再次访问0网络请求

### 风险2: Markdown渲染性能问题
**影响**: 长文档渲染卡顿,TBT超过300ms

**缓解措施**:
1. 虚拟化:使用react-window仅渲染可视区域
2. Web Worker:在后台线程解析Markdown
3. 缓存渲染结果:使用useMemo避免重复渲染
4. 按需加载:详情页打开时才渲染Markdown

### 风险3: 搜索性能随数据增长下降
**影响**: 搜索时间超过500ms,用户体验差

**缓解措施**:
1. 预构建索引:构建时生成FlexSearch索引
2. 分词优化:使用tokenize: 'forward'减少索引大小
3. 节流搜索:300ms防抖,避免频繁搜索
4. 结果分页:每页显示20条,减少DOM节点

### 风险4: 深色模式切换闪烁
**影响**: 用户体验差,CLS增加

**缓解措施**:
1. localStorage初始化:页面加载前读取主题设置
2. 内联脚本:在<head>中注入主题类名
3. View Transitions:使用原生API平滑过渡
4. CSS变量:统一管理颜色,避免样式闪烁

### 风险5: 移动端性能不达标
**影响**: 移动设备Lighthouse分数<80

**缓解措施**:
1. 响应式图片:使用srcset提供多尺寸版本
2. 触摸优化:增大点击区域(44x44px)
3. 减少动画:移动端禁用复杂动画,使用prefers-reduced-motion
4. Service Worker:离线缓存关键资源

---

## 实施路线图

### Phase 1: 基础架构 (Week 1-2)
- 初始化Vite + React + TypeScript项目
- 配置Tailwind CSS + shadcn/ui
- 搭建路由结构(首页、详情页、搜索页)
- 实现Zustand状态管理
- JSON数据分片和类型生成

### Phase 2: 核心功能 (Week 3-4)
- 路线图可视化组件
- Markdown渲染和代码高亮
- FlexSearch搜索引擎集成
- 收藏和进度追踪功能
- 筛选和排序功能

### Phase 3: 性能优化 (Week 5)
- 代码分割和懒加载
- 虚拟化长列表
- 图片和字体优化
- Service Worker缓存
- Lighthouse审计和优化

### Phase 4: 动画和交互 (Week 6)
- 页面切换动画
- 模块展开/收起动画
- 深色模式切换
- 加载状态和骨架屏
- 响应式设计优化

### Phase 5: 部署和监控 (Week 7)
- Vercel部署配置
- GitHub Actions CI/CD
- 性能监控和错误追踪
- 文档和用户指南

---

## 参考资源

### 官方文档
- [Vite官方文档](https://vitejs.dev)
- [React 18文档](https://react.dev)
- [Zustand文档](https://docs.pmnd.rs/zustand)
- [FlexSearch文档](https://github.com/nextapps-de/flexsearch)
- [View Transitions API](https://developer.chrome.com/docs/web-platform/view-transitions)

### 性能优化
- [Web Vitals](https://web.dev/vitals)
- [Lighthouse性能优化指南](https://developer.chrome.com/docs/lighthouse)
- [React性能优化](https://react.dev/learn/render-and-commit)

### 设计参考
- [苹果设计资源](https://developer.apple.com/design/resources/)
- [Tailwind UI组件](https://tailwindui.com)
- [shadcn/ui组件库](https://ui.shadcn.com)
