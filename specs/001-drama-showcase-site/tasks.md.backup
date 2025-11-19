# Tasks: 短剧展示静态网站

**Input**: Design documents from `/specs/001-drama-showcase-site/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/data-operations.md, quickstart.md

**Tests**: No explicit test requirements in specification - tests are OPTIONAL for this project. Focus on manual testing per acceptance scenarios.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

This is a single-project web application with structure:
- Frontend source: `src/`
- Public assets: `public/`
- Configuration files at repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Initialize Vite + React + TypeScript project with package.json and tsconfig.json at repository root
- [ ] T002 [P] Install core dependencies (react, react-dom, react-router-dom, zustand, zod) per research.md
- [ ] T003 [P] Install UI dependencies (@radix-ui components, tailwindcss, class-variance-authority) per research.md
- [ ] T004 [P] Install development dependencies (typescript, vite, eslint, prettier) per research.md
- [ ] T005 Configure Tailwind CSS with tailwind.config.js and darkMode class strategy
- [ ] T006 [P] Configure ESLint and Prettier with .eslintrc.json and .prettierrc
- [ ] T007 [P] Create project directory structure per plan.md (src/components, src/pages, src/lib, src/types, src/data, public/data)
- [ ] T008 Copy duanju.json to public/data/duanju.json for static hosting
- [ ] T009 [P] Setup Vite configuration in vite.config.ts with code splitting per research.md
- [ ] T010 [P] Create base HTML template in index.html with theme script to prevent flash

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T011 Create TypeScript type definitions in src/types/roadmap.ts based on data-model.md (Roadmap, Stage, Module, Concept, Resource, UserProfile)
- [ ] T012 [P] Create Zod validation schemas in src/lib/validation.ts per data-model.md (RoadmapSchema, StageSchema, ModuleSchema, ConceptSchema)
- [ ] T013 [P] Create utility functions in src/lib/utils.ts (cn helper, generateModuleId, generateConceptId, estimateReadingTime)
- [ ] T014 Create Zustand store in src/store/useUserProgressStore.ts with localStorage persistence for favorites and completed_modules per contracts/data-operations.md
- [ ] T015 [P] Create Zustand store in src/store/useThemeStore.ts for theme management (light/dark) with View Transitions API support
- [ ] T016 Create data loading service in src/lib/dataLoader.ts with loadRoadmapData() and loadStageById() functions per contracts/data-operations.md
- [ ] T017 [P] Setup React Router in src/App.tsx with routes for home, stage details, module details, concept details, search, and favorites
- [ ] T018 [P] Create global CSS in src/index.css with Tailwind directives, CSS variables for spacing (8px grid), and typography styles
- [ ] T019 [P] Create shadcn/ui base components setup with src/components/ui/ directory structure
- [ ] T020 Install shadcn/ui components (Button, Card, Badge, Skeleton) using CLI per quickstart.md

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - 浏览学习路线图概览 (Priority: P1) 🎯 MVP

**Goal**: 用户访问网站后立即看到完整的学习路线图结构,包括标题、用户画像、所有阶段的标题/时长/目标,支持响应式和深色模式

**Independent Test**: 打开 http://localhost:5173,无需交互即可看到:
1. 页面标题"针对教师背景的短剧剧本写作变现学习路线图"
2. 用户画像信息卡片
3. 所有6个学习阶段的卡片(标题、预估时长、目标)
4. 移动端/桌面端正确显示
5. 深色模式切换按钮,切换后主题平滑过渡

### Implementation for User Story 1

**Layout & Navigation**

- [ ] T021 [P] [US1] Create AppLayout component in src/components/layout/AppLayout.tsx with header, main content area, and theme toggle button
- [ ] T022 [P] [US1] Create Header component in src/components/layout/Header.tsx with site title and navigation links
- [ ] T023 [P] [US1] Create ThemeToggle component in src/components/ui/ThemeToggle.tsx integrating with useThemeStore and View Transitions API
- [ ] T024 [P] [US1] Create Footer component in src/components/layout/Footer.tsx with copyright and links

**Home Page - Roadmap Overview**

- [ ] T025 [US1] Create HomePage component in src/pages/HomePage.tsx that loads roadmap data using dataLoader
- [ ] T026 [P] [US1] Create RoadmapHeader component in src/components/roadmap/RoadmapHeader.tsx to display title and user profile
- [ ] T027 [P] [US1] Create UserProfileCard component in src/components/roadmap/UserProfileCard.tsx showing background, skill level, learning goal
- [ ] T028 [US1] Create StageList component in src/components/roadmap/StageList.tsx to render all stages in grid layout
- [ ] T029 [P] [US1] Create StageCard component in src/components/roadmap/StageCard.tsx showing stage title, duration, goal, and module count with Apple-style card design
- [ ] T030 [P] [US1] Create LoadingSkeleton component in src/components/ui/LoadingSkeleton.tsx for initial data load state
- [ ] T031 [P] [US1] Create ErrorMessage component in src/components/ui/ErrorMessage.tsx with retry button for data load failures

**Responsive & Theme Support**

- [ ] T032 [US1] Implement responsive grid layout in StageList using Tailwind CSS breakpoints (mobile: 1 column, tablet: 2 columns, desktop: 3 columns)
- [ ] T033 [US1] Add dark mode CSS variables and color classes to all US1 components following Tailwind dark: prefix pattern
- [ ] T034 [US1] Test theme toggle with View Transitions API smooth transition effect in ThemeToggle component
- [ ] T035 [US1] Verify HomePage data validation with Zod schema and error handling for missing/invalid fields per contracts/data-operations.md

**Checkpoint**: At this point, User Story 1 should be fully functional - users can view complete roadmap overview with responsive design and theme switching

---

## Phase 4: User Story 2 - 查看模块详细内容 (Priority: P2)

**Goal**: 用户点击阶段或模块后,能够查看该模块的详细内容,包括模块目的、核心概念列表、学习路径、推荐资源,支持展开/收起交互

**Independent Test**: 在首页点击任意阶段卡片:
1. 导航到阶段详情页(URL: /stage/:stageId)
2. 显示该阶段的所有模块列表
3. 点击模块卡片展开详细内容
4. 看到模块目的、核心概念列表、推荐资源
5. 点击返回按钮返回首页

### Implementation for User Story 2

**Routing & Navigation**

- [ ] T036 [P] [US2] Create StageDetailPage component in src/pages/StageDetailPage.tsx that loads stage data by ID using loadStageById()
- [ ] T037 [P] [US2] Create Breadcrumb component in src/components/ui/Breadcrumb.tsx showing navigation path (Home > Stage)
- [ ] T038 [P] [US2] Add link functionality to StageCard in src/components/roadmap/StageCard.tsx to navigate to /stage/:stageId

**Stage Detail Page**

- [ ] T039 [US2] Create StageHeader component in src/components/stage/StageHeader.tsx showing stage title, goal, estimated duration, and progress bar
- [ ] T040 [US2] Create ModuleList component in src/components/stage/ModuleList.tsx rendering all modules for the stage
- [ ] T041 [P] [US2] Create ModuleCard component in src/components/module/ModuleCard.tsx with expandable/collapsible design showing module title and purpose
- [ ] T042 [P] [US2] Create ModuleDetail component in src/components/module/ModuleDetail.tsx showing core concepts list, demystification analogy, and recommended resources when expanded

**Core Concepts & Resources**

- [ ] T043 [P] [US2] Create ConceptList component in src/components/module/ConceptList.tsx rendering core_concepts array with clickable concept titles
- [ ] T044 [P] [US2] Create ConceptCard component in src/components/concept/ConceptCard.tsx showing concept_title with preview excerpt
- [ ] T045 [P] [US2] Create ResourceList component in src/components/module/ResourceList.tsx rendering recommended_resources array
- [ ] T046 [P] [US2] Create ResourceCard component in src/components/resource/ResourceCard.tsx showing resource name, description, and external link button

**Interaction & Animation**

- [ ] T047 [US2] Implement expand/collapse animation for ModuleCard using CSS transitions (duration: 300ms, easing: cubic-bezier(0.16, 1, 0.3, 1))
- [ ] T048 [US2] Add smooth scroll to expanded module using scrollIntoView with behavior: 'smooth'
- [ ] T049 [US2] Implement back navigation functionality in Breadcrumb and test browser back button behavior
- [ ] T050 [US2] Handle missing data gracefully (display placeholder for missing demystification_analogy or empty recommended_resources)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - users can navigate from roadmap to stage details and view module content

---

## Phase 5: User Story 3 - 搜索和筛选内容 (Priority: P3)

**Goal**: 用户通过关键词搜索或按阶段筛选内容,实时显示匹配结果,高亮匹配文本,快速找到感兴趣的主题

**Independent Test**: 在任意页面:
1. 在搜索框输入关键词"霸总剧"
2. 实时显示包含该关键词的所有模块和概念
3. 匹配文本高亮显示
4. 使用阶段筛选器,选择"阶段1",只显示阶段1的内容
5. 清空搜索,恢复完整列表

### Implementation for User Story 3

**FlexSearch Integration**

- [ ] T051 [P] [US3] Install flexsearch dependency and create search index builder script in scripts/buildSearchIndex.ts
- [ ] T052 [US3] Implement buildSearchIndex script that parses duanju.json and creates FlexSearch Document index with CJK tokenizer per contracts/data-operations.md
- [ ] T053 [US3] Add npm script "build:search-index" in package.json to run buildSearchIndex and output to src/data/searchIndex.json
- [ ] T054 [P] [US3] Create search service in src/lib/searchService.ts with searchContent() function using FlexSearch per contracts/data-operations.md

**Search UI Components**

- [ ] T055 [P] [US3] Create SearchBar component in src/components/search/SearchBar.tsx with debounced input (300ms) and clear button
- [ ] T056 [P] [US3] Create SearchPage component in src/pages/SearchPage.tsx that displays search results with routing at /search
- [ ] T057 [P] [US3] Create SearchResults component in src/components/search/SearchResults.tsx rendering search results with match count
- [ ] T058 [P] [US3] Create SearchResultCard component in src/components/search/SearchResultCard.tsx showing result type (stage/module/concept), title, and excerpt with highlighting

**Filtering UI**

- [ ] T059 [P] [US3] Create FilterBar component in src/components/search/FilterBar.tsx with stage selector dropdown
- [ ] T060 [US3] Create StageFilter component in src/components/search/StageFilter.tsx allowing single stage selection with "All Stages" option
- [ ] T061 [US3] Integrate FilterBar with SearchPage and apply filters to search results using searchContent options parameter

**Search Features**

- [ ] T062 [US3] Implement text highlighting in SearchResultCard using mark.js or custom regex replacement with <mark> tags per contracts/data-operations.md generateExcerpt function
- [ ] T063 [US3] Add empty state UI in SearchResults for "no results found" with search suggestions
- [ ] T064 [US3] Implement search result pagination (20 results per page) with "Load More" button
- [ ] T065 [US3] Add SearchBar to Header component for global search access across all pages
- [ ] T066 [US3] Test search performance with large dataset and verify <200ms response time per success criteria SC-007

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently - users can search, filter, and navigate seamlessly

---

## Phase 6: User Story 4 - 查看核心概念详解 (Priority: P3)

**Goal**: 用户点击核心概念卡片后,查看完整的概念详细说明,包括定义、比喻、工作原理、案例、优缺点、误解陷阱、学习路径等,支持Markdown渲染

**Independent Test**: 在模块详情页:
1. 点击任意核心概念卡片
2. 导航到概念详情页(URL: /concept/:stageId/:moduleIndex/:conceptIndex)
3. 显示完整的concept_detail内容
4. Markdown正确渲染(标题、段落、列表、代码块、表格)
5. 查看所有子章节(核心定义、比喻、原理、案例、优缺点、误解、学习路径、总结)

### Implementation for User Story 4

**Markdown Rendering**

- [ ] T067 [P] [US4] Install react-markdown, remark-gfm, and react-syntax-highlighter dependencies per research.md
- [ ] T068 [P] [US4] Create MarkdownRenderer component in src/components/ui/MarkdownRenderer.tsx with react-markdown and GFM plugin support
- [ ] T069 [P] [US4] Configure syntax highlighting in MarkdownRenderer using react-syntax-highlighter with theme matching light/dark mode
- [ ] T070 [P] [US4] Create custom Markdown component overrides in src/components/ui/MarkdownComponents.tsx for headings, links, code blocks, tables

**Concept Detail Page**

- [ ] T071 [US4] Create ConceptDetailPage component in src/pages/ConceptDetailPage.tsx that loads concept by stageId, moduleIndex, conceptIndex
- [ ] T072 [P] [US4] Create ConceptHeader component in src/components/concept/ConceptHeader.tsx showing concept_title and estimated reading time
- [ ] T073 [US4] Create ConceptContent component in src/components/concept/ConceptContent.tsx using MarkdownRenderer to display concept_detail
- [ ] T074 [P] [US4] Update Breadcrumb component to support 4-level navigation (Home > Stage > Module > Concept)
- [ ] T075 [US4] Add navigation links to ConceptCard in src/components/concept/ConceptCard.tsx to route to /concept/:stageId/:moduleIndex/:conceptIndex

**Content Optimization**

- [ ] T076 [US4] Implement virtual scrolling for long concept_detail content (>10,000 characters) using react-window per research.md and spec.md edge cases
- [ ] T077 [US4] Add table of contents navigation in ConceptContent for long documents with anchor links to Markdown headings
- [ ] T078 [US4] Implement useMemo caching for MarkdownRenderer to avoid re-rendering on theme toggle
- [ ] T079 [US4] Test Markdown rendering with all GFM features (tables, task lists, strikethrough) from concept_detail examples

**Navigation & UX**

- [ ] T080 [US4] Create RelatedConcepts component in src/components/concept/RelatedConcepts.tsx showing other concepts from same module
- [ ] T081 [US4] Add "Next Concept" and "Previous Concept" navigation buttons in ConceptDetailPage
- [ ] T082 [US4] Implement smooth scroll to top when navigating between concepts
- [ ] T083 [US4] Handle missing detail_file references gracefully (show only concept_detail content)

**Checkpoint**: At this point, User Stories 1-4 should all work independently - users can view full concept details with rich Markdown formatting

---

## Phase 7: User Story 5 - 收藏和进度跟踪 (Priority: P4)

**Goal**: 用户可以收藏模块/概念,标记学习进度,数据持久化到localStorage,刷新页面后状态保持,查看收藏列表和学习统计

**Independent Test**: 在任意模块或概念页面:
1. 点击收藏按钮,看到按钮状态变为"已收藏"
2. 点击"标记为已学习",看到完成图标和进度条更新
3. 刷新页面,收藏和进度状态保持不变
4. 访问"我的收藏"页面,看到所有收藏项列表
5. 查看学习统计,显示总进度百分比和各阶段进度

### Implementation for User Story 5

**Zustand Store Actions**

- [ ] T084 [P] [US5] Implement addToFavorites action in src/store/useUserProgressStore.ts per contracts/data-operations.md
- [ ] T085 [P] [US5] Implement removeFromFavorites action in src/store/useUserProgressStore.ts
- [ ] T086 [P] [US5] Implement toggleFavorite action in src/store/useUserProgressStore.ts
- [ ] T087 [P] [US5] Implement markAsCompleted action in src/store/useUserProgressStore.ts with moduleId parameter
- [ ] T088 [US5] Implement getProgressSummary selector in src/store/useUserProgressStore.ts returning total/completed modules and by-stage breakdown per contracts/data-operations.md

**Favorite & Progress UI**

- [ ] T089 [P] [US5] Create FavoriteButton component in src/components/ui/FavoriteButton.tsx with heart icon and toggleFavorite integration
- [ ] T090 [P] [US5] Create CompletionCheckbox component in src/components/ui/CompletionCheckbox.tsx with checkmark icon and markAsCompleted integration
- [ ] T091 [US5] Add FavoriteButton to ModuleCard and ConceptCard components
- [ ] T092 [US5] Add CompletionCheckbox to ModuleCard component
- [ ] T093 [P] [US5] Create ProgressBar component in src/components/ui/ProgressBar.tsx showing completion percentage with Apple-style gradient

**Favorites Page**

- [ ] T094 [US5] Create FavoritesPage component in src/pages/FavoritesPage.tsx at route /favorites
- [ ] T095 [US5] Create FavoritesList component in src/components/favorites/FavoritesList.tsx rendering all favorited items grouped by type (modules/concepts)
- [ ] T096 [P] [US5] Create FavoriteItem component in src/components/favorites/FavoriteItem.tsx showing item title, type badge, and link to detail page
- [ ] T097 [US5] Implement empty state UI in FavoritesList when no favorites exist with call-to-action message
- [ ] T098 [US5] Add "Favorites" link to Header navigation menu

**Progress Dashboard**

- [ ] T099 [US5] Create ProgressDashboard component in src/components/progress/ProgressDashboard.tsx showing overall progress summary
- [ ] T100 [US5] Create StageProgress component in src/components/progress/StageProgress.tsx displaying per-stage completion statistics
- [ ] T101 [US5] Add ProgressDashboard to HomePage sidebar or header area
- [ ] T102 [US5] Implement progress calculation logic using getProgressSummary() from contracts/data-operations.md

**Data Persistence**

- [ ] T103 [US5] Test localStorage persistence by adding favorites and completed modules, then refreshing page to verify state retention
- [ ] T104 [US5] Implement data migration handling in useUserProgressStore if localStorage schema changes
- [ ] T105 [US5] Add clear/reset progress button in settings (optional) with confirmation dialog
- [ ] T106 [US5] Test concurrent access edge case: verify different browser tabs have independent progress state per spec.md edge cases

**Checkpoint**: All user stories (1-5) should now be independently functional - complete feature set delivered

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final quality assurance

**Performance Optimization**

- [ ] T107 [P] Implement code splitting for routes in src/App.tsx using React.lazy and Suspense
- [ ] T108 [P] Configure Vite build with manual chunks per research.md (vendor, ui, data chunks)
- [ ] T109 [P] Add resource preloading for duanju.json in index.html using <link rel="preload">
- [ ] T110 [P] Optimize images and fonts with proper loading strategies (font-display: swap, image loading: lazy)
- [ ] T111 Implement Web Worker for Markdown parsing in MarkdownRenderer per research.md risk mitigation
- [ ] T112 Run Lighthouse audit and optimize to achieve Performance ≥95 score per success criteria SC-002

**Accessibility & UX**

- [ ] T113 [P] Add keyboard navigation support for all interactive components (Tab, Enter, Space, Arrow keys)
- [ ] T114 [P] Add ARIA labels and roles to all components for screen reader compatibility
- [ ] T115 [P] Verify color contrast ratios meet WCAG AA standard (≥4.5:1) in both light and dark themes per success criteria SC-010
- [ ] T116 [P] Add focus indicators to all interactive elements with visible outline
- [ ] T117 [P] Implement skip-to-content link for keyboard users in Header component
- [ ] T118 Test mobile touch interactions (tap targets ≥44x44px) per research.md risk mitigation

**Error Handling & Edge Cases**

- [ ] T119 [P] Implement global error boundary in src/App.tsx catching React errors with fallback UI
- [ ] T120 [P] Add retry logic to dataLoader.ts with exponential backoff per contracts/data-operations.md withRetry function
- [ ] T121 [P] Handle slow network scenarios with timeout and skeleton loading states per spec.md edge cases
- [ ] T122 [P] Add validation for missing required fields in duanju.json with console warnings per spec.md edge cases
- [ ] T123 Test browser compatibility in Chrome, Safari, Firefox, Edge (latest 2 versions) per success criteria SC-011

**Documentation & Deployment**

- [ ] T124 [P] Update README.md with project overview, tech stack, and quickstart instructions based on quickstart.md
- [ ] T125 [P] Create CONTRIBUTING.md with development workflow and code style guidelines
- [ ] T126 [P] Document how to update duanju.json content in docs/content-update-guide.md
- [ ] T127 Configure Vercel deployment with vercel.json for SPA routing and performance headers per research.md
- [ ] T128 [P] Setup GitHub Actions CI/CD workflow (.github/workflows/ci.yml) with type-check, lint, build steps per research.md
- [ ] T129 Add performance monitoring script using Web Vitals API in src/lib/webVitals.ts

**Final Validation**

- [ ] T130 Run quickstart.md validation: verify npm install, npm run dev, npm run build all succeed
- [ ] T131 Test all acceptance scenarios from spec.md for User Stories 1-5 manually
- [ ] T132 Verify all 12 success criteria (SC-001 through SC-012) are met per spec.md
- [ ] T133 Run final Lighthouse audit on deployed site and document results
- [ ] T134 Create deployment checklist and production readiness report

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup (T001-T010) completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational (T011-T020) - MVP first priority
- **User Story 2 (Phase 4)**: Depends on Foundational (T011-T020) - Can start after US1 or in parallel with sufficient team
- **User Story 3 (Phase 5)**: Depends on Foundational (T011-T020) - Can start after US1 or in parallel
- **User Story 4 (Phase 6)**: Depends on Foundational (T011-T020) and US2 (for navigation) - Extends module detail view
- **User Story 5 (Phase 7)**: Depends on Foundational (T011-T020) - Can develop in parallel but benefits from US1-2 UI components
- **Polish (Phase 8)**: Depends on completion of desired user stories (minimum US1 for MVP)

### User Story Dependencies

- **User Story 1 (P1)**: Independent - Only depends on Foundational phase
- **User Story 2 (P2)**: Independent - Only depends on Foundational phase (extends US1 navigation but testable separately)
- **User Story 3 (P3)**: Independent - Only depends on Foundational phase (works across all pages)
- **User Story 4 (P3)**: Soft dependency on US2 (uses ModuleDetail navigation) but independently testable
- **User Story 5 (P4)**: Independent - Only depends on Foundational phase (adds features to existing components)

### Within Each User Story

**General Pattern**:
1. Layout/infrastructure components first (marked [P] if in different files)
2. Data-loading pages next (depend on layout)
3. UI components in parallel (marked [P])
4. Integration and animation last (depend on components)

**Specific Dependencies**:
- US1: T025 (HomePage) must load data before T026-T029 can display it
- US2: T036 (StageDetailPage) before T039-T042 (stage components)
- US3: T051-T053 (search index) before T054 (search service) before T055-T058 (search UI)
- US4: T067-T070 (Markdown setup) before T073 (ConceptContent)
- US5: T084-T088 (store actions) before T089-T092 (UI buttons)

### Parallel Opportunities

**Setup Phase (Phase 1)**:
- T002, T003, T004 (dependency installations) can run in parallel
- T006, T007, T009, T010 (configuration files) can run in parallel after T001

**Foundational Phase (Phase 2)**:
- T012, T013, T015, T018, T019 (separate config/lib files) can run in parallel after T011
- T014, T015 (stores and services) can run in parallel

**Within User Stories**:
- All tasks marked [P] can run in parallel within their phase
- Example US1: T021, T022, T023, T024 (layout components) all parallel
- Example US1: T026, T027, T029, T030, T031 (roadmap components) all parallel after T025
- Example US2: T041, T042, T043, T044, T045, T046 (module/concept components) all parallel
- Example US3: T051, T055, T056, T057, T058, T059 (search components) mostly parallel
- Example US5: T084-T087 (store actions), T089-T090 (UI components) all parallel

**Cross-Story Parallelization**:
- Once Foundational (Phase 2) completes, different developers can work on:
  - Developer A: US1 (T021-T035)
  - Developer B: US2 (T036-T050)
  - Developer C: US3 (T051-T066)
- US4 and US5 can similarly be parallelized with adequate team size

---

## Parallel Example: User Story 1

```bash
# After T025 (HomePage) is complete, launch these components in parallel:
Task T026 [P]: "Create RoadmapHeader component in src/components/roadmap/RoadmapHeader.tsx"
Task T027 [P]: "Create UserProfileCard component in src/components/roadmap/UserProfileCard.tsx"
Task T029 [P]: "Create StageCard component in src/components/roadmap/StageCard.tsx"
Task T030 [P]: "Create LoadingSkeleton component in src/components/ui/LoadingSkeleton.tsx"
Task T031 [P]: "Create ErrorMessage component in src/components/ui/ErrorMessage.tsx"

# All above can be worked on simultaneously since they are in different files
```

---

## Parallel Example: User Story 3

```bash
# After T052-T053 (search index build) completes, launch these in parallel:
Task T055 [P]: "Create SearchBar component in src/components/search/SearchBar.tsx"
Task T056 [P]: "Create SearchPage component in src/pages/SearchPage.tsx"
Task T057 [P]: "Create SearchResults component in src/components/search/SearchResults.tsx"
Task T058 [P]: "Create SearchResultCard component in src/components/search/SearchResultCard.tsx"
Task T059 [P]: "Create FilterBar component in src/components/search/FilterBar.tsx"

# All search UI components can be developed simultaneously
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

**Goal**: Deliver working roadmap viewer in ~1 week

1. ✅ Complete Phase 1: Setup (T001-T010) - Day 1
2. ✅ Complete Phase 2: Foundational (T011-T020) - Day 2-3
3. ✅ Complete Phase 3: User Story 1 (T021-T035) - Day 4-6
4. ✅ Polish: Run T107-T112 (performance), T119-T123 (error handling), T130 (validation) - Day 7
5. **STOP and VALIDATE**: Test all US1 acceptance scenarios
6. Deploy to Vercel and demo

**MVP Deliverables**:
- ✅ Users can view complete learning roadmap
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Light/dark theme toggle
- ✅ Lighthouse Performance ≥95
- ✅ First load <2 seconds

### Incremental Delivery (Recommended)

**Week 1**: MVP (US1)
- Days 1-3: Setup + Foundational
- Days 4-6: User Story 1
- Day 7: Polish + Deploy
- **Deliverable**: Roadmap overview viewer

**Week 2**: Add Module Details (US2)
- Days 8-12: User Story 2 (T036-T050)
- Day 13-14: Integration testing + Deploy
- **Deliverable**: Full navigation with module details

**Week 3**: Add Search & Concepts (US3, US4)
- Days 15-17: User Story 3 (T051-T066)
- Days 18-20: User Story 4 (T067-T083)
- Day 21: Integration testing + Deploy
- **Deliverable**: Search functionality and concept details

**Week 4**: Add User Features & Polish (US5, Phase 8)
- Days 22-25: User Story 5 (T084-T106)
- Days 26-28: Phase 8 Polish (T107-T134)
- **Deliverable**: Complete feature set with favorites and progress tracking

### Parallel Team Strategy

With 3 developers after Foundational phase completes:

**Developer A**: UI/Layout Specialist
- Week 1: US1 (T021-T035)
- Week 2: US5 UI components (T089-T098)
- Week 3: Polish UI (T113-T118)

**Developer B**: Content/Routing Specialist
- Week 1: US2 (T036-T050)
- Week 2: US4 (T067-T083)
- Week 3: Documentation (T124-T126)

**Developer C**: Search/Data Specialist
- Week 1: US3 (T051-T066)
- Week 2: US5 state management (T084-T088, T099-T106)
- Week 3: Performance optimization (T107-T112)

**Integration Points**:
- End of Week 1: Merge US1+US2+US3
- End of Week 2: Merge US4+US5
- Week 3: Joint testing and polish

---

## Notes

### Task Format Compliance
- ✅ All tasks follow `- [ ] [ID] [P?] [Story?] Description with file path` format
- ✅ Task IDs are sequential (T001-T134) in logical execution order
- ✅ [P] marker indicates parallelizable tasks (different files, no dependencies)
- ✅ [Story] label (US1-US5) maps tasks to user stories from spec.md
- ✅ File paths are absolute from repository root (src/, public/, etc.)

### Development Guidelines
- Commit after each completed task or logical task group
- Run `npm run type-check` before committing
- Run `npm run lint` and fix issues before committing
- Test in both light and dark themes
- Test on mobile viewport (375px) and desktop (1440px)
- Stop at checkpoints to validate user story independently

### Validation Checkpoints
- After US1: Can users view roadmap? Does theme toggle work?
- After US2: Can users navigate to stage/module details?
- After US3: Does search return results in <200ms?
- After US4: Does Markdown render correctly?
- After US5: Do favorites persist after refresh?

### Performance Targets (from spec.md)
- SC-001: First load <2s (4G network)
- SC-002: Lighthouse ≥95
- SC-004: Interaction <300ms
- SC-006: Theme toggle <200ms
- SC-007: Search <200ms
- SC-012: Max 3 clicks to any content

### Common Pitfalls to Avoid
- ❌ Don't create tasks for the same file in parallel (causes merge conflicts)
- ❌ Don't skip Foundational phase (blocks all user stories)
- ❌ Don't mix user story components (keep US1 separate from US2)
- ❌ Don't hardcode data (always use duanju.json)
- ❌ Don't use `any` type in TypeScript (violates Constitution principle V)
- ❌ Don't skip responsive testing (violates Constitution principle I)

### Resources
- Technical decisions: `research.md`
- Data structure: `data-model.md`
- API contracts: `contracts/data-operations.md`
- Setup guide: `quickstart.md`
- Design principles: `.specify/memory/constitution.md`
- Project plan: `plan.md`
