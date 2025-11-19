#!/usr/bin/env tsx

/**
 * Build Search Index Script
 *
 * 此脚本解析 duanju.json 并创建 FlexSearch 索引
 * 用于支持高性能的中文搜索功能
 */

import * as fs from 'fs'
import * as path from 'path'
import FlexSearch from 'flexsearch'

// 类型定义
interface Roadmap {
  title: string
  user_profile: any
  roadmap: Stage[]
}

interface Stage {
  stage: string
  stage_title: string
  stage_goal: string
  estimated_duration: string
  modules: Module[]
}

interface Module {
  module_title: string
  module_purpose: string
  core_concepts: Concept[]
  demystification_analogy?: string
  recommended_resources?: Resource[]
}

interface Concept {
  concept_title: string
  concept_detail: string
  detail_file?: string
}

interface Resource {
  name: string
  description: string
  url?: string
  search_keyword?: string
}

interface SearchDocument {
  id: string
  type: 'stage' | 'module' | 'concept'
  title: string
  content: string
  keywords: string
  stage_id: string
  module_id?: string
  concept_id?: string
}

/**
 * 创建 FlexSearch 索引
 */
function createSearchIndex() {
  return new FlexSearch.Document({
    document: {
      id: 'id',
      index: ['title', 'content', 'keywords'],
      store: ['type', 'title', 'stage_id', 'module_id', 'concept_id']
    },
    tokenize: 'full',
    charset: 'cjk',
    encode: false,
    stemmer: false,
    context: {
      resolution: 9,
      depth: 3,
      bidirectional: true
    }
  })
}

/**
 * 从 Markdown 中提取纯文本
 */
function extractTextFromMarkdown(markdown: string): string {
  return markdown
    .replace(/#{1,6}\s/g, '') // 移除标题标记
    .replace(/\*\*(.+?)\*\*/g, '$1') // 移除粗体
    .replace(/\*(.+?)\*/g, '$1') // 移除斜体
    .replace(/`(.+?)`/g, '$1') // 移除代码标记
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // 移除链接
    .replace(/\n{2,}/g, ' ') // 多个换行符替换为空格
    .trim()
}

/**
 * 生成搜索关键词
 */
function generateKeywords(texts: string[]): string {
  return texts
    .join(' ')
    .toLowerCase()
    .replace(/[^\u4e00-\u9fa5a-z0-9\s]/g, '') // 只保留中文、英文和数字
    .split(/\s+/)
    .filter((word, index, arr) => word.length > 1 && arr.indexOf(word) === index) // 去重且长度>1
    .join(' ')
}

/**
 * 解析 roadmap 数据并构建搜索文档
 */
function buildSearchDocuments(roadmapData: Roadmap): SearchDocument[] {
  const documents: SearchDocument[] = []

  roadmapData.roadmap.forEach((stage) => {
    const stageId = stage.stage

    // 索引阶段
    documents.push({
      id: `stage-${stageId}`,
      type: 'stage',
      title: stage.stage_title,
      content: `${stage.stage_goal} ${stage.estimated_duration}`,
      keywords: generateKeywords([stage.stage_title, stage.stage_goal]),
      stage_id: stageId
    })

    // 索引模块
    stage.modules.forEach((module, moduleIndex) => {
      const moduleId = `${stageId}-${moduleIndex}`

      documents.push({
        id: `module-${moduleId}`,
        type: 'module',
        title: module.module_title,
        content: `${module.module_purpose} ${module.demystification_analogy || ''}`,
        keywords: generateKeywords([
          module.module_title,
          module.module_purpose,
          module.demystification_analogy || ''
        ]),
        stage_id: stageId,
        module_id: moduleId
      })

      // 索引概念
      module.core_concepts.forEach((concept, conceptIndex) => {
        const conceptId = `${stageId}-${moduleIndex}-${conceptIndex}`
        const conceptText = extractTextFromMarkdown(concept.concept_detail)

        documents.push({
          id: `concept-${conceptId}`,
          type: 'concept',
          title: concept.concept_title,
          content: conceptText.substring(0, 500), // 限制内容长度以优化索引大小
          keywords: generateKeywords([concept.concept_title, conceptText]),
          stage_id: stageId,
          module_id: moduleId,
          concept_id: conceptId
        })
      })
    })
  })

  return documents
}

/**
 * 主函数
 */
async function main() {
  console.log('🔍 开始构建搜索索引...\n')

  try {
    // 读取 duanju.json
    const dataPath = path.join(process.cwd(), 'public', 'data', 'duanju.json')
    console.log(`📖 读取数据文件: ${dataPath}`)

    if (!fs.existsSync(dataPath)) {
      throw new Error(`数据文件不存在: ${dataPath}`)
    }

    const rawData = fs.readFileSync(dataPath, 'utf-8')
    const roadmapData: Roadmap = JSON.parse(rawData)
    console.log(`✅ 成功加载数据 (${roadmapData.roadmap.length} 个阶段)\n`)

    // 构建搜索文档
    console.log('🔨 构建搜索文档...')
    const documents = buildSearchDocuments(roadmapData)
    console.log(`✅ 创建了 ${documents.length} 个搜索文档\n`)

    // 创建 FlexSearch 索引
    console.log('⚡ 创建 FlexSearch 索引...')
    const searchIndex = createSearchIndex()

    documents.forEach((doc) => {
      searchIndex.add(doc)
    })
    console.log('✅ 索引创建完成\n')

    // 导出索引
    const exportData = {
      documents,
      indexMeta: {
        totalDocuments: documents.length,
        types: {
          stage: documents.filter(d => d.type === 'stage').length,
          module: documents.filter(d => d.type === 'module').length,
          concept: documents.filter(d => d.type === 'concept').length
        },
        buildDate: new Date().toISOString()
      }
    }

    const outputPath = path.join(process.cwd(), 'src', 'data', 'searchIndex.json')
    const outputDir = path.dirname(outputPath)

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2), 'utf-8')

    const stats = fs.statSync(outputPath)
    const sizeKB = (stats.size / 1024).toFixed(2)

    console.log(`💾 索引已保存到: ${outputPath}`)
    console.log(`📊 索引文件大小: ${sizeKB} KB\n`)

    console.log('📈 索引统计:')
    console.log(`  - 阶段: ${exportData.indexMeta.types.stage}`)
    console.log(`  - 模块: ${exportData.indexMeta.types.module}`)
    console.log(`  - 概念: ${exportData.indexMeta.types.concept}`)
    console.log(`  - 总计: ${exportData.indexMeta.totalDocuments}\n`)

    console.log('✨ 搜索索引构建成功!')
  } catch (error) {
    console.error('❌ 构建失败:', error)
    process.exit(1)
  }
}

// 执行
main()
