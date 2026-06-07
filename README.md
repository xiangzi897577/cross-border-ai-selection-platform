# 极瑞AI跨境选品分析平台

极瑞AI跨境选品分析平台是一个面向跨境轻小件选品场景的 AI 决策辅助平台，聚焦商品数据分析、候选池管理、风险识别、利润评估和 AI 选品建议。当前版本以手机支架作为种子品类和演示数据，用于验证跨境轻小件选品分析流程；平台定位不局限于手机支架，后续可扩展至更多轻小件品类。

## 项目定位

跨境轻小件选品通常需要同时判断价格、采购成本、物流成本、平台费用、销量、评分、评论数量、竞争强度和供应链风险。这个项目将这些信号整理成可查询、可筛选、可分析、可沉淀的产品化工具，目标是让选品决策从零散判断变成结构化流程。

当前版本重点解决：

- 跨境轻小件候选商品如何统一管理。
- 商品利润、竞争、风险和推荐评分如何集中展示。
- 多页面如何共享一致的数据来源和业务指标。
- 接口较慢或 Serverless 冷启动时如何改善页面体感速度。
- AI 如何基于商品池和候选池上下文提供选品建议。

后续产品路线会围绕真实数据源接入展开，重点包括接入 1688 API 与 Amazon API，扩大选品规模，并提升商品、供应商、市场指标和评价数据的时效性。当前版本作为后续迭代的产品与工程基线。

## 在线预览

- 前端预览地址：https://cross-border-ai-selection-platform.vercel.app/
- 后端接口地址：https://cross-border-ai-selection-api.vercel.app/
- 后端健康检查：https://cross-border-ai-selection-api.vercel.app/api/health

> 当前线上地址沿用历史部署 slug，平台公开名称以“极瑞AI跨境选品分析平台”为准。

## 当前种子品类

当前商品池以手机支架作为种子品类，主要用于验证以下能力：

- 轻小件商品数据建模。
- 价格、成本、物流和平台费用拆解。
- 利润率、竞争指数、风险等级和推荐评分计算。
- 候选池收藏、对比和持续观察。
- AI 选品问答和单商品分析报告。

后续接入 1688 与 Amazon API 后，商品池可以扩展到桌面收纳、旅行配件、车载小配件、手机周边、厨房小工具、宠物小用品等更多跨境轻小件品类。

## 核心功能

### Dashboard 数据看板

- 展示商品总数、平均利润率、高潜力商品数和风险商品数。
- 展示当前商品池判断，输出优先跟进、竞争压力和风险排查结论。
- 展示利润率排行、品类分布、推荐分与竞争度等图表。
- 数据来自后端 `GET /api/dashboard`。

### 商品列表

- 展示跨境轻小件候选商品卡片。
- 支持关键词搜索、类目筛选、最低利润率筛选。
- 支持按利润率、月销量、评分、竞争指数和推荐评分排序。
- 支持从商品卡片加入候选池。
- 在完整商品池缓存命中时支持前端二次筛选，减少重复请求。

### 商品详情

- 根据路由参数请求单个商品详情。
- 展示商品基础信息、价格成本、利润、市场指标、竞争等级、风险等级和推荐评分。
- 展示风险原因标签和推荐理由。
- 支持加入候选池。
- 支持商品不存在和非法 id 的错误状态。

### 选品分析

- 展示高潜力商品、高风险商品、低竞争高利润商品。
- 使用利润率、竞争指数、风险等级、风险因素数量和推荐评分进行分组分析。
- 支持基于候选商品池进行进一步观察和对比。

### 候选池

- 使用 Supabase PostgreSQL `favorites` 表保存候选商品。
- 使用匿名 `client_id` 区分不同浏览器访问者。
- 支持获取候选池商品、添加商品、取消收藏和进入商品详情页。

### AI 选品辅助

- 后端封装 AI 服务，前端不直接持有第三方 AI Key。
- 支持通过 `AI_PROVIDER` 在不同 AI Provider 之间切换。
- 支持多轮 AI 选品对话。
- 支持基于商品详情生成 AI 分析报告。
- AI 回复结合商品池、候选池和业务指标，提供更贴近跨境轻小件选品场景的建议。

## 技术栈

### 前端

- React
- Vite
- JavaScript
- React Router
- Recharts
- react-markdown
- remark-gfm
- CSS

### 后端

- Node.js
- Express
- Vercel Serverless Functions
- Supabase PostgreSQL
- Zhipu GLM API
- NVIDIA NIM / OpenAI-compatible Chat Completions
- JSON 文件备份商品数据

### 数据来源

- Supabase PostgreSQL `products` 表：商品主数据。
- Supabase PostgreSQL `favorites` 表：候选池收藏数据。
- `server/data/products.json`：商品数据备份来源。

当前版本中，后端接口统一读取 Supabase 并返回前端使用的 camelCase 数据结构。JSON 文件仍保留为备份数据源，便于在数据库不可用或后续迁移时进行数据校验。

## 系统架构概览

```text
Browser / React / Vite
  |
  | HTTP + x-client-id
  v
Express API / Vercel Serverless
  |
  |-- Supabase PostgreSQL: products, favorites
  |-- JSON backup data: server/data/products.json
  |-- AI Provider: Zhipu or NVIDIA
```

核心数据流：

1. 前端页面通过 `client/src/services/api.js` 请求后端 API。
2. 后端从 Supabase 读取商品数据和候选池数据。
3. 后端工具函数补充利润、风险、竞争等级、推荐评分等计算字段。
4. 前端展示列表、详情、Dashboard、分析页和候选池。
5. AI 接口在后端读取商品上下文和环境变量，生成选品建议或商品报告。

更多架构说明见 [docs/architecture.md](docs/architecture.md)。

## 后端接口

### `GET /api/health`

用于检查后端服务是否正常运行。

### `GET /api/products`

返回商品列表数据，并附带后端计算字段。

支持查询参数：

- `keyword`：按商品名称、类目、标签搜索。
- `category`：按商品类目筛选。当前种子品类的筛选项以手机支架细分类目为主。
- `minProfitRate`：按最低利润率百分比筛选。
- `sort`：按指定方式排序。

支持排序方式：

- `profitRateDesc`：利润率从高到低。
- `monthlySalesDesc`：月销量从高到低。
- `ratingDesc`：评分从高到低。
- `competitionScoreAsc`：竞争指数从低到高。
- `recommendationScoreDesc`：推荐评分从高到低。

### `GET /api/products/:id`

根据商品 `id` 返回单个商品详情。

- 合法且存在的商品 id 返回商品详情。
- 不存在的商品 id 返回 `404`。
- 非法商品 id 返回 `400`。

### `GET /api/dashboard`

返回 Dashboard 首页统计数据，包括商品总数、平均利润率、高潜力商品数、风险商品数、利润排行、类目分布和竞争相关统计。

### `GET /api/favorites`

返回当前匿名访问者的候选池商品列表。

需要请求头：

```txt
x-client-id: 当前浏览器匿名 client_id
```

### `POST /api/favorites`

添加商品到候选池。

请求体示例：

```json
{
  "productId": 1
}
```

### `DELETE /api/favorites/:id`

根据商品 id 从候选池删除商品。

### `POST /api/ai/chat`

调用后端封装的 AI 服务，返回基于商品池与候选池上下文的多轮 AI 选品建议。

请求体示例：

```json
{
  "messages": [
    { "role": "user", "content": "帮我推荐适合新手的轻小件候选商品" },
    { "role": "assistant", "content": "建议优先关注物流成本低、评分稳定、竞争指数适中的商品..." },
    { "role": "user", "content": "那当前种子品类里利润空间更好的呢？" }
  ]
}
```

### `POST /api/ai/product-report`

为指定商品生成 AI 分析报告，用于辅助判断商品优势、风险、跟进优先级和后续验证方向。

## 核心业务指标

后端通过业务工具函数为商品补充计算字段，主要包括：

- `revenueCNY`：预估人民币销售收入。
- `platformFee`：平台手续费。
- `totalCost`：总成本。
- `profit`：单件利润。
- `profitRate` / `profitRatePercent`：利润率。
- `competitionLevel`：竞争等级。
- `riskFactors`：风险原因数组。
- `riskLevel`：风险等级。
- `recommendationScore`：推荐评分。
- `recommendationLevel`：推荐等级。

这些字段用于列表排序、Dashboard 统计、风险分析、AI 上下文和商品详情展示。

## 性能优化

当前版本围绕“接口较慢时页面不长时间空白等待”做了缓存与 stale-while-revalidate 体验优化：

- 前端对完整商品池、Dashboard、商品详情和候选池数据做 `localStorage` 缓存。
- 页面优先展示可用缓存，同时后台请求最新数据。
- 商品列表筛选尽量基于完整商品池进行前端二次筛选，减少重复接口请求。
- 后端对 Supabase 商品池读取增加短期内存缓存，减少重复数据库读取。

详细测量口径、结果和限制见 [docs/performance.md](docs/performance.md)。

## 本地运行方式

### 1. 启动后端

```bash
cd server
npm install
npm start
```

默认后端地址：

```txt
http://localhost:3000
```

健康检查：

```txt
http://localhost:3000/api/health
```

### 2. 启动前端

```bash
cd client
npm install
npm run dev
```

默认前端地址由 Vite 输出，通常为：

```txt
http://localhost:5173
```

如需指定后端地址，可在前端环境变量中配置 `VITE_API_BASE_URL`。

## 环境变量说明

后端环境变量放在 `server/.env` 或部署平台的后端环境变量中。不要把后端密钥写入前端代码，也不要使用 `VITE_` 前缀暴露后端密钥。

`server/.env.example` 提供占位示例：

```txt
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
ZHIPU_API_KEY=your_zhipu_api_key
ZHIPU_MODEL=glm-4.7-flash
NVIDIA_API_KEY=your_nvidia_api_key
NVIDIA_MODEL=deepseek-ai/deepseek-v4-flash
AI_PROVIDER=nvidia
```

变量说明：

- `SUPABASE_URL`：Supabase 项目 URL。
- `SUPABASE_SERVICE_ROLE_KEY`：后端使用的 Supabase service role key，只能保存在服务端。
- `ZHIPU_API_KEY`：Zhipu AI 服务 Key。
- `ZHIPU_MODEL`：Zhipu 模型名称。
- `NVIDIA_API_KEY`：NVIDIA NIM API Key。
- `NVIDIA_MODEL`：NVIDIA NIM 模型名称。
- `AI_PROVIDER`：AI 服务提供方，例如 `zhipu` 或 `nvidia`。
- `VITE_API_BASE_URL`：前端请求后端 API 的基础地址，只能配置为公开 API 地址，不包含密钥。

## 文档索引

- [产品概览](docs/product-overview.md)
- [技术架构](docs/architecture.md)
- [数据模型](docs/DATA_MODEL.md)
- [性能优化](docs/performance.md)
- [产品路线图](docs/roadmap.md)

## 后续路线图

当前版本是后续产品迭代的基础。后续重点方向：

- 接入 1688 API，提升货源价格、供应商、起订量、发货地等数据的覆盖度和时效性。
- 接入 Amazon API，提升候选商品、市场表现、评价、评论数量和竞争数据的更新能力。
- 扩大选品规模，从手机支架种子品类扩展到更多跨境轻小件候选商品。
- 增强 AI 选品建议质量评估，让 AI 建议与利润、风险、竞争、物流等结构化指标更稳定地结合。
- 完善部署、监控、错误兜底和数据刷新策略。

完整路线见 [docs/roadmap.md](docs/roadmap.md)。

## 安全说明

- 不提交 `.env`、`server/.env`、`client/.env`。
- 不在公开文档中写入真实 API Key、数据库密钥或 service role key。
- `SUPABASE_SERVICE_ROLE_KEY` 只能放在后端环境变量中。
- 前端只允许配置公开的 `VITE_API_BASE_URL`。
- 私有计划、复盘、草稿和个人材料应放在 `_private/` 或本地忽略目录中。
