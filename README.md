# AI跨境选品分析平台

AI跨境选品分析平台是一个面向轻小件跨境选品场景的 AI 决策辅助平台。项目围绕商品数据分析、利润测算、竞争判断、风险识别、候选池管理、可视化看板和 AI 选品建议构建，目标是把零散的选品判断整理成可查询、可筛选、可沉淀的工程化工作流。

当前版本使用手机支架相关轻小件商品作为样例数据，用于验证商品池、指标计算、候选池和 AI 辅助分析流程。平台方向不限定于单一品类，后续可扩展到桌面收纳、旅行配件、车载小配件、手机周边、厨房小工具、宠物小用品等更多跨境轻小件候选商品。

## 项目背景

跨境轻小件选品通常需要同时判断售价、采购成本、平台费用、物流成本、销量、评分、评论数量、竞争强度、供应链风险和平台适配度。传统做法容易分散在表格、浏览器收藏、人工备注和临时沟通里，判断过程难以复用，也不利于持续观察。

本项目将商品样本、成本结构、市场信号、风险标签和 AI 分析整合到同一套页面与接口中，让选品流程可以围绕“发现候选商品、拆解利润、识别风险、加入候选池、持续分析”闭环运行。

## 项目目标

- 建立轻小件跨境选品的商品数据模型和分析流程。
- 支持商品列表、详情、Dashboard、选品分析和候选池管理。
- 用统一后端接口输出利润率、竞争等级、风险等级和推荐评分。
- 将 Supabase 商品数据、JSON 备份数据和前端页面连接成稳定的演示基线。
- 通过 AI 选品助手和 AI 商品报告，补充结构化指标之外的解释性建议。
- 为后续接入 1688 API、Amazon API、权限管理、登录模块和更多轻小件品类预留扩展方向。

## 线上访问地址

- 前端访问地址：[https://app.xzmindpro.eu.cc/](https://app.xzmindpro.eu.cc/)
- 后端接口地址：[https://api.xzmindpro.eu.cc/](https://api.xzmindpro.eu.cc/)
- 健康检查地址：[https://api.xzmindpro.eu.cc/api/health](https://api.xzmindpro.eu.cc/api/health)

## 截图展示

以下截图展示平台从“查看商品池整体表现、筛选候选商品、分析风险与利润、加入候选池、查看单品报告”到 AI 辅助判断的核心流程，更多页面状态通过链接查看。

### 核心流程截图

| 页面 | 截图 | 说明 |
| --- | --- | --- |
| Dashboard 数据看板 | ![Dashboard 数据看板](docs/screenshots/dashboard1.png) | 汇总商品池规模、平均利润率、高潜力商品、风险商品和图表分析，是选品判断的总览入口。 |
| 商品列表总览 | ![商品列表总览](docs/screenshots/product-list-1.png) | 展示商品卡片、利润率、风险等级、推荐评分和基础市场信号，支持快速发现候选商品。 |
| 选品分析页面 | ![选品分析页面](docs/screenshots/product-analyse-1.png) | 按高潜力、高风险、低竞争高利润等维度组织商品，帮助从不同策略视角筛选机会。 |
| 候选池管理 | ![候选池管理](docs/screenshots/favorite.png) | 将重点商品加入候选池后，可继续对比利润、风险、竞争和推荐理由。 |
| 商品详情页 | ![商品详情页](docs/screenshots/product-detail.png) | 查看单个商品的基础信息、成本拆解、市场指标、风险标签和后续 AI 报告入口。 |
| AI 深度报告 | ![AI 深度报告](docs/screenshots/ai-report.png) | 基于商品指标和大模型 API 生成综合结论、利润分析、市场需求、竞争风险和下一步建议。 |
| AI 选品助手弹窗 | ![AI 选品助手弹窗](docs/screenshots/ai-assistant.png) | 围绕商品池上下文进行自然语言问答，辅助解释利润、竞争、物流和风险取舍。 |

### 更多截图

- Dashboard 图表补充：[dashboard2-chart.png](docs/screenshots/dashboard2-chart.png)
- 商品列表更多商品卡片：[product-list-2.png](docs/screenshots/product-list-2.png)
- 商品列表筛选 / 策略 / 排序状态：[product-filter-sort.png](docs/screenshots/product-filter-sort.png)
- 候选池横向对比表：[favorites-compare.png](docs/screenshots/favorites-compare.png)
- 高风险与低竞争高利润模块：[product-analyse-2.png](docs/screenshots/product-analyse-2.png)
- 基础规则选品报告：[basic-report.png](docs/screenshots/basic-report.png)

## 技术栈

### 前端

- React
- Vite
- JavaScript
- React Router
- Axios
- Recharts
- react-markdown
- remark-gfm
- CSS

### 后端

- Node.js
- Express
- Vercel Serverless Functions
- Supabase PostgreSQL
- Supabase JavaScript SDK
- Zhipu GLM API
- NVIDIA NIM / OpenAI-compatible Chat Completions
- JSON 文件备份商品数据

## 核心功能

- **Dashboard 数据看板**：展示商品总数、平均利润率、高潜力商品、风险商品、利润率排行、类目分布和竞争概况。
- **商品筛选与排序**：支持关键词搜索、类目筛选、利润率筛选、策略筛选和多维排序，辅助快速定位高潜力商品。
- **商品详情分析**：展示商品基础信息、成本拆解、利润测算、市场指标、风险标签、推荐评分和推荐理由。
- **选品分析页面**：按高潜力、高风险、低竞争高利润等维度组织商品池，提供多角度选品观察视图。
- **候选池管理**：基于匿名 `client_id` 区分访问者，并通过 Supabase 持久化候选商品，支持添加、取消和跨页面状态同步。
- **AI 选品助手**：结合商品数据、候选池和结构化指标生成选品建议，支持 Markdown 渲染、长对话裁剪和异常兜底。
- **AI 商品报告**：围绕单个商品生成优势、风险、跟进优先级和验证方向，补充结构化指标之外的解释性建议。
- **缓存优先体验优化**：在核心页面引入 `localStorage` 缓存与后台刷新策略，降低接口等待感。

## 项目亮点

- **请求层工程化**：将原有请求逻辑重构为 Axios 统一实例与业务 API 模块，按商品、Dashboard、候选池、AI 能力拆分 `services`，并通过响应拦截器统一处理业务错误、HTTP 异常、超时和连接失败。
- **候选池持久化与匿名隔离**：通过匿名 `client_id` 请求头区分不同浏览器访问者，结合 Supabase 实现候选商品持久化，并在添加、取消收藏时同步更新本地缓存，减少二次请求等待。
- **缓存优先与后台刷新**：基于 `localStorage` 与 stale-while-revalidate 策略优化 Dashboard、商品列表、详情页和候选池等核心页面；在模拟慢接口场景下，缓存命中时主要页面首屏内容可见时间由约 4.6s 降至 0.27-0.38s。
- **页面状态治理与可视化分析**：统一设计 Loading / Error / Empty / 同步中状态，结合 `AbortController`、请求序号控制和已有数据兜底，减少页面空白和数据错乱；基于 Recharts 将利润率、竞争指数、风险等级和推荐评分转化为可视化选品依据。
- **AI 选品能力落地**：接入 AI 选品助手与 AI 商品报告，完成聊天状态管理、Markdown 渲染、长对话裁剪和规则化兜底；后端封装多 Provider 大模型调用层，支持模型 fallback、失败冷却、超时处理和轻量级商品上下文构造。
- **部署与扩展基础**：基于 React + Vite、Node.js / Express、Supabase 和 Vercel 完成前后端部署，为后续接入 1688 API、Amazon API、登录鉴权、权限管理和业务工作流扩展预留基础。

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

项目采用前后端分离部署，环境变量需要分别配置在前端项目和后端项目中。请勿提交真实 `.env` 文件，也不要将 Supabase Service Role Key、AI API Key 等后端密钥写入前端代码。

前端示例：`client/.env.example`

```
VITE_API_BASE_URL=https://your-api-domain.vercel.app
```

后端示例：`server/.env.example`

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

AI_PROVIDER=nvidia

ZHIPU_API_KEY=your_zhipu_api_key
ZHIPU_MODEL=glm-4.7

NVIDIA_API_KEY=your_nvidia_api_key
NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
NVIDIA_REQUEST_TIMEOUT_MS=12000
NVIDIA_MODELS=openai/gpt-oss-120b
```

> 注意：`VITE_` 前缀变量会被打包进前端产物，只能用于公开配置；Supabase Service Role Key、AI API Key 等敏感密钥必须只保存在后端环境变量或部署平台的后端配置中，不应提交到 GitHub。

## 接口说明

后端接口统一以 `/api` 为前缀，前端通过 `VITE_API_BASE_URL` 配置后端基础地址。前端不在页面组件中直接拼接请求逻辑，而是通过 `client/src/services/` 中的 Axios 请求层调用后端。

### 请求层约定

- `http.js` 使用 `axios.create` 统一设置 `baseURL`、超时时间和响应拦截器。
- 业务接口按模块拆分到 `productApi.js`、`dashboardApi.js`、`favoriteApi.js` 和 `aiApi.js`。
- `api.js` 仅作为旧导入路径的兼容 re-export，新代码优先从 `client/src/services` 统一导入。
- 候选池和 AI 相关请求会自动携带匿名 `x-client-id`，用于候选池隔离和请求上下文识别。

### 后端接口

| 方法   | 路径                     | 说明                                       |
| ------ | ------------------------ | ------------------------------------------ |
| GET    | `/api/health`            | 后端健康检查                               |
| GET    | `/api/products`          | 商品列表，支持搜索、筛选和排序             |
| GET    | `/api/products/:id`      | 商品详情，返回商品指标、风险标签和推荐评分 |
| GET    | `/api/dashboard`         | Dashboard 统计数据                         |
| GET    | `/api/favorites`         | 获取当前匿名访问者的候选池                 |
| POST   | `/api/favorites`         | 添加商品到候选池                           |
| DELETE | `/api/favorites/:id`     | 从候选池移除商品                           |
| POST   | `/api/ai/chat`           | AI 选品助手对话                            |
| POST   | `/api/ai/product-report` | 生成单商品 AI 分析报告                     |

`GET /api/products` 支持常用查询参数：

- `keyword`：按商品名称、类目、标签搜索。
- `category`：按商品类目筛选。
- `minProfitRate`：按最低利润率百分比筛选。
- `sort`：可选 `profitRateDesc`、`monthlySalesDesc`、`ratingDesc`、`competitionScoreAsc`、`recommendationScoreDesc`。

候选池相关接口需要请求头：

```
x-client-id: current_browser_client_id
```

更详细的请求体、响应结构和错误处理逻辑可参考 `client/src/services/` 与后端 `server/routes/` 实现。

## 项目目录结构

```text
.
├── client/                  # React + Vite 前端
│   ├── public/images/       # 商品图片等静态资源
│   └── src/
│       ├── components/      # 通用组件和图表组件
│       ├── pages/           # Dashboard、商品、详情、分析、候选池页面
│       ├── services/        # Axios 实例、业务 API 模块、缓存和错误归一化
│       └── utils/           # 前端格式化、筛选和展示辅助函数
├── server/                  # Express 后端
│   ├── data/                # JSON 备份商品数据
│   ├── routes/              # API 路由
│   ├── services/            # AI Provider 与商品上下文服务
│   ├── utils/               # 商品计算、映射、筛选、排序工具
│   └── scripts/             # Supabase 数据导入脚本
├── docs/                    # 公开产品、架构、数据、性能和路线文档
└── _private/                # 本地私有材料，已被 .gitignore 忽略
```

## 核心业务流程

1. 前端页面通过 `client/src/services/` 中的 Axios 请求层访问后端 API。
2. 后端从 Supabase `products` 表读取商品主数据，并通过工具函数补充利润率、竞争等级、风险标签、推荐评分等分析字段。
3. 前端在 Dashboard、商品列表、商品详情、选品分析和候选池页面中复用统一商品数据结构。
4. 用户将值得跟进的商品加入候选池，后端根据匿名 `client_id` 将候选关系持久化到 Supabase `favorites` 表。
5. AI 接口读取商品池、候选池和商品详情上下文，调用后端配置的 AI Provider 生成选品建议或商品报告。
6. 当前端命中本地缓存时，页面会优先展示历史数据，并在后台刷新最新接口结果，降低等待感。

前端请求层已按业务模块拆分：

```text
client/src/services/
├── http.js          # Axios 实例、baseURL、timeout、响应拦截器、错误归一化、client_id 请求头
├── productApi.js    # 商品列表、商品详情、查询参数组装和商品缓存
├── dashboardApi.js  # Dashboard 数据读取和缓存
├── favoriteApi.js   # 候选池读取、新增、删除、缓存更新和 x-client-id 请求头
├── aiApi.js         # AI 对话、AI 商品报告、消息裁剪、超时和错误兜底
├── index.js         # 统一导出业务 API，供页面组件导入
└── api.js           # 兼容旧导入路径的 re-export
```

页面组件只负责状态管理和 UI 展示，不直接拼接底层请求逻辑，便于后续扩展登录认证、权限管理、真实商品源 API 和更多业务模块。

## AI 能力说明

本项目的 AI 能力不是独立聊天工具，而是围绕当前商品池、候选池和商品指标运行的选品决策辅助模块，主要包括 **AI 选品助手** 和 **AI 商品报告** 两部分。

### AI 选品助手

AI 选品助手面向多轮选品咨询场景。后端会将商品名称、类目、利润率、月销量、评分、竞争指数、风险因素、推荐评分、候选池状态等信息整理为上下文，再交给 AI Provider 生成回答。

主要使用场景：

- 询问当前商品池中更适合优先跟进的轻小件商品。
- 对比高利润、高风险、低竞争商品的取舍。
- 根据候选池给出下一步观察建议。
- 解释某类商品的选品机会、风险和验证方向。
- 基于当前商品数据生成阶段性选品建议。

### AI 深度报告

AI 深度报告面向单商品深度分析场景。系统会结合当前商品的利润率、销量、评分、竞争指数、物流成本、风险标签和推荐评分，生成结构化分析结果。

报告内容包括：

- 商品优势分析。
- 潜在风险说明。
- 跟进优先级判断。
- 适合验证的数据指标。
- 后续供应商沟通和市场调研方向。

### 异常兜底

后端封装了多 Provider 大模型调用层，支持模型 fallback、失败冷却、超时处理和错误码映射。当 AI 服务不可用时，系统会返回规则化基础报告，保证用户仍能完成基础选品分析流程。

AI 输出仅作为辅助建议，真实选品仍需要结合供应商沟通、平台规则、市场调研和数据更新进行判断。

## Supabase 数据迁移说明

当前商品数据以 Supabase PostgreSQL 为主，`server/data/products.json` 作为备份和导入来源。导入脚本位于：

```txt
server/scripts/importProductsToSupabase.js
```

执行方式：

```bash
cd server
npm run import:products
```

脚本流程：

1. 读取 `server/data/products.json`。
2. 校验商品数组和商品 `id`。
3. 通过 `mapProductToRow` 将前端友好的商品字段映射为 Supabase 表字段。
4. 使用 `upsert` 写入 `products` 表，并以 `id` 作为冲突键。
5. 输出商品数量、成功写入数量、失败数量和失败原因。

执行前需要确认后端环境变量中已配置 `SUPABASE_URL` 和 `SUPABASE_SERVICE_ROLE_KEY`。

## 公开文档

- [产品概览](docs/product-overview.md)
- [技术架构](docs/architecture.md)
- [数据模型](docs/DATA_MODEL.md)
- [性能优化](docs/performance.md)
- [产品路线图](docs/roadmap.md)

## 后续优化方向

- **真实数据源接入**：接入 1688 API、Amazon API 等外部数据源，提升货源价格、供应商信息、起订量、市场表现、评分评论和竞争信号的实时性。
- **数据质量与同步机制**：建立商品数据刷新、去重、字段校验、异常兜底和增量同步机制，提升商品池数据的稳定性和可维护性。
- **登录认证与权限管理**：补充登录模块、用户体系和角色权限控制，支持不同用户查看、管理和沉淀各自的候选商品与分析记录。
- **品类与筛选能力扩展**：扩展更多跨境轻小件品类，完善类目、标签、物流属性、平台适配度等筛选维度，让选品分析更数据驱动。
- **AI 分析能力增强**：优化 AI 建议与结构化指标之间的一致性，使回答更稳定地引用利润率、竞争指数、风险标签、物流成本和候选池上下文。
- **性能与可观测性优化**：增加接口耗时、缓存命中率、AI 调用状态、错误日志和部署健康状态监控；随商品规模扩大，补充分页、虚拟列表和更细粒度的缓存策略。

## 安全与维护说明

- 不提交 `.env`、`server/.env`、`client/.env` 等真实环境变量文件。
- 不在代码、README、截图或公开文档中暴露 API Key、数据库密钥、Service Role Key、Token 等敏感信息。
- `SUPABASE_SERVICE_ROLE_KEY`、`ZHIPU_API_KEY`、`NVIDIA_API_KEY` 等密钥只允许配置在后端环境变量或部署平台的后端配置中。
- 前端只使用公开配置，例如 `VITE_API_BASE_URL`；所有敏感请求必须通过后端接口转发。
- `_private/` 仅用于本地私有材料归档，公开 README 和 `docs/` 不引用该目录内容。