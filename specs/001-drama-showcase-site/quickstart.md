# Quickstart Guide: 短剧展示静态网站

**Feature**: 001-drama-showcase-site
**Date**: 2025-11-18
**Estimated Setup Time**: 30-45 minutes

---

## Prerequisites

### Required

- **Node.js**: >= 20.0.0 (推荐使用LTS版本)
- **npm**: >= 10.0.0 (或yarn/pnpm)
- **Git**: >= 2.0.0
- **Modern Browser**: Chrome >= 111, Safari >= 16, Firefox >= 110, Edge >= 111

### Recommended

- **VS Code**: 推荐使用的IDE,配合以下扩展:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript Vue Plugin (Volar)
- **Chrome DevTools**: 用于性能调试和Lighthouse审计

---

## Quick Start (5 minutes)

```bash
# 1. 克隆项目
git clone <repository-url>
cd learning-short-drama

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 打开浏览器访问
# http://localhost:5173
```

就这么简单!应用现在应该已经在运行了。

---

## Project Setup (Detailed)

### Step 1: Clone and Install

```bash
# 克隆仓库
git clone <repository-url>
cd learning-short-drama

# 安装依赖
npm install

# 验证安装
npm list --depth=0
```

**预期依赖**:
```json
{
  "react": "^18.3.0",
  "react-dom": "^18.3.0",
  "react-router-dom": "^6.22.0",
  "zustand": "^4.5.0",
  "flexsearch": "^0.7.43",
  "react-markdown": "^9.0.0",
  "remark-gfm": "^4.0.0",
  "framer-motion": "^11.0.0",
  "zod": "^3.22.0",
  "@radix-ui/react-*": "latest",
  "tailwindcss": "^3.4.0",
  "typescript": "^5.3.0",
  "vite": "^5.1.0"
}
```

---

### Step 2: Environment Setup

```bash
# 创建环境配置文件(如需要)
cp .env.example .env

# 编辑.env文件
# (可选,纯静态站点通常不需要环境变量)
```

---

### Step 3: Verify Data Files

确保duanju.json文件存在并格式正确:

```bash
# 验证JSON格式
node -e "require('./duanju.json')"

# 运行数据验证脚本
npm run validate:data
```

**Expected Output**:
```
✅ duanju.json validation passed
✅ Found 6 stages
✅ Found 48 modules
✅ Found 312 concepts
✅ Total file size: 374.5KB
```

---

### Step 4: Start Development Server

```bash
# 启动Vite开发服务器
npm run dev

# 或使用turbo(如果配置)
npm run dev:turbo
```

**Expected Output**:
```
VITE v5.1.0  ready in 234 ms

➜  Local:   http://localhost:5173/
➜  Network: http://192.168.1.100:5173/
➜  press h + enter to show help
```

---

## Development Workflow

### Running Development Server

```bash
# 标准开发模式
npm run dev

# 开发模式 + 类型检查
npm run dev:check

# 构建并预览生产版本
npm run build && npm run preview
```

### Code Quality Checks

```bash
# TypeScript类型检查
npm run type-check

# ESLint代码检查
npm run lint

# Prettier格式化
npm run format

# 运行所有检查
npm run check:all
```

### Testing (Optional)

```bash
# 运行单元测试
npm run test

# 运行测试并生成覆盖率报告
npm run test:coverage

# 监听模式
npm run test:watch
```

---

## Building for Production

### Step 1: Build

```bash
# 构建生产版本
npm run build

# 构建并分析包体积
npm run build:analyze
```

**Expected Output**:
```
vite v5.1.0 building for production...
✓ 245 modules transformed.
dist/index.html                   0.45 kB │ gzip:  0.30 kB
dist/assets/index-a3b4c5d6.css   12.34 kB │ gzip:  3.45 kB
dist/assets/index-a3b4c5d6.js   145.67 kB │ gzip: 48.23 kB

✓ built in 3.45s
```

---

### Step 2: Preview

```bash
# 本地预览生产构建
npm run preview
```

访问 `http://localhost:4173` 查看生产版本。

---

### Step 3: Performance Audit

```bash
# 运行Lighthouse审计
npm run lighthouse

# 或手动在Chrome DevTools中运行
# 1. 打开Chrome DevTools (F12)
# 2. 切换到"Lighthouse"标签
# 3. 选择"Performance"、"Accessibility"、"Best Practices"、"SEO"
# 4. 点击"Generate report"
```

**目标指标**:
- Performance: >= 95
- Accessibility: >= 90
- Best Practices: >= 95
- SEO: >= 90

---

## Deployment

### Option 1: Vercel (Recommended)

```bash
# 安装Vercel CLI
npm install -g vercel

# 登录Vercel
vercel login

# 部署到Vercel
vercel

# 部署到生产环境
vercel --prod
```

---

### Option 2: Netlify

```bash
# 安装Netlify CLI
npm install -g netlify-cli

# 登录Netlify
netlify login

# 初始化Netlify项目
netlify init

# 部署
netlify deploy --prod
```

---

### Option 3: GitHub Pages

```bash
# 添加GitHub Pages部署配置
# 在vite.config.ts中设置base

# 构建
npm run build

# 部署到gh-pages分支
npm run deploy:gh-pages
```

---

## Updating Content

### Update duanju.json

```bash
# 1. 编辑duanju.json文件
nano duanju.json  # 或使用你喜欢的编辑器

# 2. 验证JSON格式
npm run validate:data

# 3. 重新生成搜索索引
npm run build:search-index

# 4. 重新生成TypeScript类型
npm run generate:types

# 5. 提交更改
git add duanju.json src/data/searchIndex.json src/types/
git commit -m "chore: update content data"
git push

# 6. Vercel会自动重新部署
```

---

## Troubleshooting

### Issue 1: 开发服务器启动失败

**症状**: `npm run dev`报错

**解决方案**:
```bash
# 清除node_modules和缓存
rm -rf node_modules package-lock.json
rm -rf .vite

# 重新安装
npm install

# 重新启动
npm run dev
```

---

### Issue 2: 类型错误

**症状**: TypeScript报类型错误

**解决方案**:
```bash
# 重新生成类型定义
npm run generate:types

# 运行类型检查并查看详细错误
npm run type-check -- --noEmit
```

---

### Issue 3: 性能问题

**症状**: Lighthouse分数低于90

**解决方案**:
```bash
# 1. 分析包体积
npm run build:analyze

# 2. 检查未使用的依赖
npm run analyze:deps

# 3. 优化图片和字体
npm run optimize:assets

# 4. 启用Brotli压缩(在Vercel中自动启用)
```

---

### Issue 4: 搜索不工作

**症状**: 搜索框输入无结果

**解决方案**:
```bash
# 重新构建搜索索引
npm run build:search-index

# 验证索引文件
ls -lh src/data/searchIndex.json

# 如果文件很小(<10KB),索引可能未正确生成
# 检查scripts/buildSearchIndex.ts脚本
```

---

### Issue 5: 深色模式不工作

**症状**: 切换主题无效果

**解决方案**:
1. 检查localStorage中的theme设置
```javascript
localStorage.getItem('learning-short-drama-storage')
```

2. 检查Tailwind配置
```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class', // 确保设置为'class'
  // ...
}
```

3. 检查HTML元素class
```javascript
document.documentElement.classList.contains('dark')
```

---

## Common Tasks

### Add a New Feature

```bash
# 1. 创建新分支
git checkout -b feature/new-feature

# 2. 开发新功能
# ...

# 3. 运行检查
npm run check:all

# 4. 提交更改
git add .
git commit -m "feat: add new feature"

# 5. 推送并创建PR
git push origin feature/new-feature
```

---

### Update Dependencies

```bash
# 检查过时的依赖
npm outdated

# 更新所有依赖到最新版本
npm update

# 或使用npm-check-updates
npx npm-check-updates -u
npm install

# 运行测试确保一切正常
npm run test
npm run build
```

---

### Debug Performance Issues

```bash
# 1. 运行React DevTools Profiler
# 在浏览器中打开React DevTools → Profiler标签

# 2. 分析包体积
npm run build:analyze
# 在浏览器中打开 stats.html

# 3. 检查长任务
# 在Chrome DevTools中 → Performance标签 → 记录页面加载

# 4. 分析Web Vitals
npm run analyze:vitals
```

---

### Generate Documentation

```bash
# 生成TypeScript API文档
npm run docs:generate

# 生成组件文档(Storybook)
npm run storybook

# 生成README文档
npm run docs:readme
```

---

## VS Code Setup

### Recommended Settings

创建 `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

### Recommended Extensions

创建 `.vscode/extensions.json`:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "Vue.volar",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

---

## Scripts Reference

| Script | Description |
|--------|-------------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run preview` | 预览生产构建 |
| `npm run type-check` | TypeScript类型检查 |
| `npm run lint` | ESLint代码检查 |
| `npm run format` | Prettier格式化 |
| `npm run test` | 运行测试 |
| `npm run validate:data` | 验证duanju.json |
| `npm run build:search-index` | 构建搜索索引 |
| `npm run generate:types` | 生成TypeScript类型 |
| `npm run build:analyze` | 分析包体积 |
| `npm run lighthouse` | 运行Lighthouse审计 |

---

## Next Steps

1. ✅ 开发环境设置完成
2. 📖 阅读[数据模型文档](./data-model.md)了解数据结构
3. 🔍 查看[合约文档](./contracts/data-operations.md)了解API
4. 🎨 参考[设计系统](../design-system.md)了解UI组件
5. 🚀 开始开发!

---

## Support

- **文档**: `/specs/001-drama-showcase-site/`
- **Issues**: GitHub Issues
- **讨论**: GitHub Discussions
- **更新日志**: CHANGELOG.md

---

## Performance Benchmarks

**开发服务器启动时间**: < 500ms
**热更新响应时间**: < 50ms
**生产构建时间**: < 3分钟
**Lighthouse性能分数**: >= 95
**首屏加载时间**: < 2秒 (4G网络)
**搜索响应时间**: < 200ms

---

**Last Updated**: 2025-11-18
**Version**: 1.0.0
