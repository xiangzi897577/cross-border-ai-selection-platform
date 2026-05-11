# PROJECT_PLAN.md

## 项目名称

跨境电商手机支架选品分析平台

## 项目定位

这是一个面向跨境电商卖家的选品分析平台，聚焦手机支架轻小件品类。系统通过模拟 Amazon 候选商品数据与 1688 货源数据，计算商品利润率、竞争强度、物流成本、风险等级和推荐评分，并通过可视化看板辅助选品决策。

## 项目目标

在 2026 年 6 月 15 日前完成一个 React + Node.js 的前后端分离项目，用于深圳中厂暑期前端实习简历。

最终项目需要做到：

- 可以本地完整运行
- 有清晰的前后端目录
- 前端页面完整
- 后端接口可用
- 商品数据来自 Node 接口
- JSON 文件实现轻量数据存储
- 有 Dashboard 数据看板
- 有商品列表、详情、分析、候选池
- 有筛选、搜索、排序
- 有图表可视化
- 有 README、截图、项目介绍
- 能写进简历并用于面试讲解

## 技术栈

### 前端

- React
- Vite
- JavaScript
- React Router
- Recharts
- CSS

### 后端

- Node.js
- Express
- JSON 文件存储

## 不做内容

当前版本不做：

- TypeScript
- 数据库
- 登录注册
- 真实爬虫
- 真实 Amazon API
- 真实 1688 API
- 复杂权限系统
- 支付功能
- 后台管理系统

## 每日时间安排

每天投入 4 小时：

1. 30-60 分钟：学习当天需要用到的知识
2. 2 小时：完成当天核心功能
3. 30-60 分钟：测试、修 bug、提交 Git、更新 DAILY_LOG.md

---

# 第一阶段：项目初始化与后端基础接口

## Day 1 - 5月11日：创建项目文档与项目骨架

### 今日目标

创建项目根目录、项目文档、前端 client、后端 server，并实现最小健康检查接口。

### 任务

- 创建项目根目录 cross-border-phone-holder-analyzer
- 创建 AGENTS.md
- 创建 docs/PROJECT_PLAN.md
- 创建 docs/DAILY_LOG.md
- 创建 client 前端项目
- 创建 server 后端项目
- server 安装 express 和 cors
- 创建 GET /api/health 接口
- 前后端都能正常启动

### 验收标准

- client 可以 npm run dev
- server 可以 node app.js 或 npm run dev
- 访问 http://localhost:3000/api/health 可以返回 JSON
- DAILY_LOG.md 记录 Day 1 完成情况

---

## Day 2 - 5月12日：设计手机支架商品数据模型

### 今日目标

设计 products.json 数据结构，并录入第一批手机支架商品数据。

### 任务

- 创建 server/data/products.json
- 设计手机支架商品字段
- 写入 12 条手机支架商品数据
- 数据覆盖不同类型：
  - 桌面支架
  - 车载支架
  - 折叠支架
  - 磁吸支架
  - 懒人支架
  - 直播支架
- 每条数据包含价格、成本、物流、评分、销量、竞争指数等字段

### 验收标准

- products.json 格式正确
- 至少有 12 条数据
- 数据字段统一
- 可以被 Node 正常读取

---

## Day 3 - 5月13日：实现 GET /api/products 接口

### 今日目标

后端可以返回商品列表。

### 任务

- 创建 server/routes/products.js
- 在 app.js 中注册 products 路由
- 实现 GET /api/products
- 返回 products.json 中的所有商品
- 处理读取文件失败的错误

### 验收标准

- 访问 /api/products 返回商品数组
- 返回数据为 JSON
- 不实现筛选、排序、详情
- DAILY_LOG.md 更新

---

## Day 4 - 5月14日：实现 GET /api/products/:id 接口

### 今日目标

后端可以根据 id 返回单个商品详情。

### 任务

- 实现 GET /api/products/:id
- 根据 id 查找商品
- 商品不存在时返回 404
- 测试多个商品 id

### 验收标准

- /api/products/1 可以返回单个商品
- 不存在的 id 返回错误提示
- 商品详情数据完整

---

## Day 5 - 5月15日：实现商品利润计算工具函数

### 今日目标

把利润率、单件利润、平台手续费等逻辑封装成工具函数。

### 任务

- 创建 server/utils/productMetrics.js
- 实现 calculatePlatformFee
- 实现 calculateProfit
- 实现 calculateProfitRate
- 实现 getCompetitionLevel
- 实现 getRiskLevel
- 在 /api/products 返回数据中附加计算结果

### 验收标准

- 商品接口返回 profit、profitRate、riskLevel 等字段
- 计算逻辑清晰
- 能解释利润公式

---

## Day 6 - 5月16日：实现 GET /api/dashboard 接口

### 今日目标

后端可以返回首页 Dashboard 统计数据。

### 任务

- 创建 server/routes/dashboard.js
- 实现 GET /api/dashboard
- 返回：
  - totalProducts
  - averageProfitRate
  - highPotentialCount
  - riskProductCount
  - topProfitProducts
  - categoryDistribution
  - averageCompetitionScore

### 验收标准

- /api/dashboard 返回统计数据
- 数据来自 products.json
- 使用 map/filter/reduce/sort 完成统计

---

## Day 7 - 5月17日：第一周复盘与后端整理

### 今日目标

整理后端目录结构，保证接口稳定。

### 任务

- 检查 /api/health
- 检查 /api/products
- 检查 /api/products/:id
- 检查 /api/dashboard
- 补充 products.json 到 20 条商品数据
- 更新 README 初版中的项目介绍
- 更新 DAILY_LOG.md

### 验收标准

- 后端接口稳定
- 商品数据达到 20 条
- 项目第一阶段完成

---

# 第二阶段：前端基础页面与接口联调

## Day 8 - 5月18日：前端路由与页面结构

### 今日目标

创建前端基础页面和路由。

### 任务

- 安装 react-router-dom
- 创建 pages 目录
- 创建 DashboardPage
- 创建 ProductsPage
- 创建 ProductDetailPage
- 创建 AnalysisPage
- 创建 FavoritesPage
- 配置路由

### 验收标准

- 页面可以通过路由切换
- 暂时不要求样式精美
- 不写复杂业务逻辑

---

## Day 9 - 5月19日：创建整体 Layout

### 今日目标

实现后台系统风格布局。

### 任务

- 创建 Layout 组件
- 创建 Sidebar 组件
- 创建 Header 组件
- 左侧导航栏包含：
  - 数据看板
  - 商品列表
  - 选品分析
  - 候选池
- 主内容区显示对应页面

### 验收标准

- 页面有清晰布局
- 路由切换正常
- 样式初步完成

---

## Day 10 - 5月20日：前端请求商品列表接口

### 今日目标

ProductsPage 能从 Node 后端获取商品数据。

### 任务

- 创建 client/src/services/api.js
- 封装 getProducts
- 在 ProductsPage 中请求 /api/products
- 实现 loading 和 error 状态
- 临时渲染商品名称和价格

### 验收标准

- 前端数据来自 Node 接口
- 不使用前端 mock 数据
- 请求失败有错误提示

---

## Day 11 - 5月21日：商品卡片组件 ProductCard

### 今日目标

完成商品列表的基础展示。

### 任务

- 创建 ProductCard 组件
- 创建 ProductGrid 组件
- 展示商品图片、名称、类型、Amazon 售价、1688 成本、利润率、竞争指数、评分
- 点击卡片进入详情页

### 验收标准

- 商品列表以卡片形式展示
- 点击可以跳转到详情页
- 商品卡片样式清晰

---

## Day 12 - 5月22日：商品详情页接口联调

### 今日目标

ProductDetailPage 能请求单个商品详情。

### 任务

- 封装 getProductById
- 使用 useParams 获取 id
- 请求 /api/products/:id
- 展示商品基础信息、价格、成本、利润、风险、推荐理由

### 验收标准

- 详情页数据来自后端
- 不存在商品时显示错误状态
- 详情页能讲清楚数据来源

---

## Day 13 - 5月23日：Dashboard 指标卡

### 今日目标

DashboardPage 能展示核心指标。

### 任务

- 封装 getDashboard
- 创建 StatCard 组件
- 展示：
  - 总商品数
  - 平均利润率
  - 高潜力商品数
  - 风险商品数
- 页面初步美化

### 验收标准

- Dashboard 数据来自后端
- 指标卡清晰
- 页面有数据看板感觉

---

## Day 14 - 5月24日：第二周复盘

### 今日目标

整理前端基础页面，修复接口联调问题。

### 任务

- 检查路由
- 检查商品列表
- 检查商品详情
- 检查 Dashboard
- 修复样式和请求问题
- 更新 DAILY_LOG.md

### 验收标准

- 前端主流程初步跑通
- 前后端联调稳定

---

# 第三阶段：搜索、筛选、排序

## Day 15 - 5月25日：搜索功能

### 今日目标

支持按关键词搜索手机支架商品。

### 任务

- 前端创建 SearchInput
- 支持按商品名、类型、标签搜索
- 后端 /api/products 支持 keyword 查询参数
- 前端请求携带 keyword

### 验收标准

- 可以搜索“车载”“磁吸”“折叠”“直播”等关键词
- 无结果时显示空状态

---

## Day 16 - 5月26日：类目筛选

### 今日目标

支持按手机支架类型筛选。

### 任务

- 创建 CategoryFilter
- 后端支持 category 查询参数
- 类目包括：
  - 桌面支架
  - 车载支架
  - 折叠支架
  - 磁吸支架
  - 懒人支架
  - 直播支架

### 验收标准

- 类目筛选可用
- 可以与关键词搜索组合使用

---

## Day 17 - 5月27日：利润率筛选

### 今日目标

支持按利润率区间筛选商品。

### 任务

- 创建 ProfitFilter
- 支持：
  - 全部
  - 利润率大于 20%
  - 利润率大于 30%
  - 利润率大于 40%
- 后端支持 minProfitRate 查询参数

### 验收标准

- 可以筛出高利润商品
- 利润率筛选和类目筛选能组合

---

## Day 18 - 5月28日：排序功能

### 今日目标

支持商品排序。

### 任务

- 创建 SortSelect
- 后端支持 sort 查询参数
- 排序方式：
  - 利润率从高到低
  - 月销量从高到低
  - 评分从高到低
  - 竞争指数从低到高
  - 推荐评分从高到低

### 验收标准

- 排序结果正确
- 不直接修改原数组
- 前端切换排序后重新请求接口

---

## Day 19 - 5月29日：整合 ProductFilters

### 今日目标

把搜索、筛选、排序封装为统一筛选器。

### 任务

- 创建 ProductFilters 组件
- 统一管理 keyword、category、minProfitRate、sort
- 添加“清空筛选”按钮
- ProductsPage 代码保持清晰

### 验收标准

- 筛选器结构清晰
- ProductsPage 不混乱
- 体验顺畅

---

## Day 20 - 5月30日：筛选功能复盘

### 今日目标

测试搜索、筛选、排序组合逻辑。

### 任务

- 测试 keyword + category
- 测试 category + profit
- 测试 sort + keyword
- 修复 bug
- 更新 DAILY_LOG.md

### 验收标准

- 商品列表筛选稳定
- 空状态正常
- 错误状态正常

---

# 第四阶段：候选池与 JSON 持久化

## Day 21 - 5月31日：初始化收藏数据

### 今日目标

创建 favorites.json 和文件读写工具。

### 任务

- 创建 server/data/favorites.json
- 创建 server/utils/fileStore.js
- 实现 readJsonFile
- 实现 writeJsonFile

### 验收标准

- 可以读取 JSON 文件
- 可以写入 JSON 文件
- 文件读写逻辑封装清晰

---

## Day 22 - 6月1日：获取候选池接口

### 今日目标

实现 GET /api/favorites。

### 任务

- 创建 server/routes/favorites.js
- 实现 GET /api/favorites
- 根据收藏 id 关联商品详情
- 返回收藏商品列表

### 验收标准

- 接口能返回候选池商品
- 即使 favorites.json 为空也正常返回空数组

---

## Day 23 - 6月2日：添加候选商品接口

### 今日目标

实现 POST /api/favorites。

### 任务

- 支持传入 productId
- 判断商品是否存在
- 判断是否重复收藏
- 写入 favorites.json

### 验收标准

- 可以添加收藏
- 重复收藏有提示
- 商品不存在返回错误

---

## Day 24 - 6月3日：删除候选商品接口

### 今日目标

实现 DELETE /api/favorites/:id。

### 任务

- 根据 productId 删除收藏
- 更新 favorites.json
- 返回删除结果

### 验收标准

- 可以删除收藏
- 删除后刷新接口仍然生效

---

## Day 25 - 6月4日：前端收藏按钮

### 今日目标

商品列表和详情页可以加入候选池。

### 任务

- ProductCard 添加“加入候选池”按钮
- ProductDetailPage 添加收藏按钮
- 请求 POST /api/favorites
- 收藏成功后提示用户

### 验收标准

- 可以从商品列表收藏
- 可以从详情页收藏
- 重复收藏不崩溃

---

## Day 26 - 6月5日：FavoritesPage 候选池页面

### 今日目标

完成候选池页面。

### 任务

- 请求 GET /api/favorites
- 展示收藏商品列表
- 支持取消收藏
- 支持进入商品详情

### 验收标准

- 候选池页面完整
- 刷新页面后收藏数据仍然存在
- 删除收藏后页面更新

---

# 第五阶段：图表与选品分析

## Day 27 - 6月6日：安装并使用 Recharts

### 今日目标

在项目中接入 Recharts。

### 任务

- 安装 Recharts
- 创建基础图表组件
- 熟悉 BarChart、PieChart、Tooltip、ResponsiveContainer

### 验收标准

- 项目中能正常显示一个测试图表
- 不深挖复杂图表

---

## Day 28 - 6月7日：Dashboard 利润率排行图

### 今日目标

Dashboard 展示利润率排行。

### 任务

- 创建 ProfitRankingChart
- 使用 topProfitProducts 数据
- 展示利润率最高的手机支架商品

### 验收标准

- Dashboard 有柱状图
- 图表数据来自后端

---

## Day 29 - 6月8日：类目分布图

### 今日目标

Dashboard 展示手机支架类型分布。

### 任务

- 创建 CategoryPieChart
- 使用 categoryDistribution 数据
- 展示不同类型手机支架占比

### 验收标准

- 饼图正常显示
- 图表样式清晰

---

## Day 30 - 6月9日：选品分析页基础版

### 今日目标

完成 AnalysisPage 基础布局。

### 任务

- 展示高潜力商品
- 展示高风险商品
- 展示低竞争高利润商品
- 展示推荐理由

### 验收标准

- AnalysisPage 有业务分析感
- 不只是简单列表

---

## Day 31 - 6月10日：推荐评分算法

### 今日目标

实现手机支架推荐评分。

### 任务

- 在 productMetrics.js 中实现 calculateRecommendationScore
- 评分考虑：
  - 利润率
  - 月销量
  - 评分
  - 竞争指数
  - 物流成本
  - 重量/体积等级
- 在接口返回 recommendationScore

### 验收标准

- 每个商品有推荐评分
- 可以解释评分规则
- AnalysisPage 使用推荐评分排序

---

## Day 32 - 6月11日：风险分析模块

### 今日目标

完善风险等级与风险原因。

### 任务

- 实现 riskFactors 逻辑
- 风险包括：
  - 利润率过低
  - 竞争指数过高
  - 评分过低
  - 评论数过少
  - 物流成本偏高
  - 重量/体积不适合轻小件
- 前端展示风险标签

### 验收标准

- 商品详情页展示风险原因
- 分析页展示高风险商品
- 风险逻辑能用于面试讲解

---

# 第六阶段：UI、README、简历准备

## Day 33 - 6月12日：全局 UI 优化

### 今日目标

让项目看起来像正式作品。

### 任务

- 统一颜色、字体、间距
- 优化 Layout
- 优化商品卡片
- 优化 Dashboard
- 优化按钮和标签
- 简单适配不同屏幕宽度

### 验收标准

- 项目不像课堂 demo
- 页面视觉统一

---

## Day 34 - 6月13日：代码结构整理与 API 封装

### 今日目标

让代码更像工程项目。

### 任务

- 整理 components
- 整理 services/api.js
- 整理 utils
- 删除无用代码
- 统一命名
- 检查注释是否必要

### 验收标准

- 目录结构清晰
- 页面组件不臃肿
- API 请求统一管理

---

## Day 35 - 6月14日：README、截图、演示素材

### 今日目标

准备项目展示材料。

### 任务

- 完成 README
- 写项目背景
- 写技术栈
- 写核心功能
- 写本地运行方式
- 写接口说明
- 截图：
  - Dashboard
  - 商品列表
  - 商品详情
  - 选品分析
  - 候选池

### 验收标准

- README 可以给面试官看
- 项目截图完整
- 本地运行说明清楚

---

## Day 36 - 6月15日：简历描述与项目讲解稿

### 今日目标

把项目整理成简历内容和面试讲法。

### 任务

- 写简历项目描述
- 准备 1 分钟项目介绍
- 准备技术问题回答
- 准备项目亮点
- 准备项目不足与后续优化

### 验收标准

- 项目可以写进简历
- 能讲清楚为什么做这个项目
- 能讲清楚前后端数据流
- 能讲清楚利润计算和推荐评分