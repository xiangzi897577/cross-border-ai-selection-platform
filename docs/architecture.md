# Architecture

## 高层架构

本文档说明AI跨境选品分析平台的高层技术架构。项目采用前后端分离结构：

```text
React + Vite Client
  |
  | HTTP API
  v
Express API on Vercel Serverless
  |
  |-- Supabase PostgreSQL
  |-- JSON backup data
  |-- AI Provider API
```

前端负责页面展示、用户交互、缓存读取和接口调用；后端负责商品数据读取、业务指标计算、候选池持久化和 AI 服务封装。前端接口调用已从页面组件中的分散请求逻辑收敛到 Axios 统一请求层，页面只依赖业务 API 函数。

## 前端

前端位于 `client/`，核心技术包括：

- React
- Vite
- JavaScript
- React Router
- Recharts
- react-markdown
- remark-gfm
- axios

主要页面包括：

- Dashboard：整体数据看板。
- Products：商品列表、搜索、筛选、排序。
- Product Detail：商品详情和 AI 商品报告。
- Analysis：选品分析和分组观察。
- Favorites：候选池管理。

前端 API 封装位于 `client/src/services/`，采用 axios 统一请求实例和按业务拆分的 API 模块：

```text
client/src/services/
├── http.js          # Axios 实例、baseURL、timeout、响应拦截器、错误归一化、client_id 请求头
├── productApi.js    # 商品列表、商品详情、查询参数组装和商品缓存
├── dashboardApi.js  # Dashboard 数据读取和缓存
├── favoriteApi.js   # 候选池读取、新增、删除、缓存更新和 x-client-id 请求头
├── aiApi.js         # AI 对话、AI 商品报告、消息裁剪、超时和错误兜底
├── index.js         # 统一导出业务 API
└── api.js           # 兼容旧导入路径的 re-export
```

页面组件应优先从 `client/src/services` 导入业务 API，不直接管理 Axios 实例，也不直接拼接跨模块请求细节。

## 后端

后端位于 `server/`，核心技术包括：

- Node.js
- Express
- Vercel Serverless Functions
- Supabase JavaScript SDK
- dotenv

主要接口包括：

| 方法 | 路径 | 用途 |
| --- | --- | --- |
| `GET` | `/api/health` | 后端健康检查 |
| `GET` | `/api/products` | 商品列表，支持搜索、筛选和排序 |
| `GET` | `/api/products/:id` | 商品详情 |
| `GET` | `/api/dashboard` | Dashboard 统计数据 |
| `GET` | `/api/favorites` | 当前匿名访问者候选池 |
| `POST` | `/api/favorites` | 添加商品到候选池 |
| `DELETE` | `/api/favorites/:id` | 从候选池移除商品 |
| `POST` | `/api/ai/chat` | AI 选品助手对话 |
| `POST` | `/api/ai/product-report` | 生成单商品 AI 分析报告 |

后端入口通过 Express 注册路由，并导出 app 供本地启动和 Serverless 部署复用。

## 数据层

当前数据层由 Supabase PostgreSQL 和 JSON 备份数据组成：

- `products` 表：线上接口使用的商品主数据。
- `favorites` 表：候选池收藏数据。
- `server/data/products.json`：种子数据、备份数据和本地导入来源。

后端读取商品数据后，会补充利润、风险、竞争等级、推荐评分等计算字段，使前端页面可以复用统一的数据结构。当前手机支架数据是种子品类，数据模型和分析流程面向跨境轻小件候选商品扩展。

## 候选池机制

候选池使用匿名 `client_id` 区分不同浏览器访问者：

1. 前端在浏览器本地生成 `client_id`。
2. 候选池请求通过 `x-client-id` 请求头发送给后端。
3. 后端按 `client_id` 读写 Supabase `favorites` 表。
4. 前端缓存当前访问者的候选池数据，用于提升二次访问体验。

这个机制适合轻量候选池管理，不等同于完整登录用户系统。

## AI 服务流程

AI 相关接口只在后端调用第三方 AI Provider：

```text
Client
  |
  | POST /api/ai/chat or /api/ai/product-report
  v
Server
  |
  | read product and favorite context
  | read AI key from server environment variables
  v
AI Provider
```

安全边界：

- 前端不保存 `ZHIPU_API_KEY` 或 `NVIDIA_API_KEY`。
- 后端从环境变量读取 AI Key。
- 前端只接收后端返回的 AI 分析结果。

## 缓存与性能

当前版本包含两类缓存：

- 前端 `localStorage` 缓存：用于商品池、Dashboard、商品详情和候选池数据。
- 后端短期内存缓存：用于减少 Supabase 商品池重复读取。

前端页面采用 stale-while-revalidate 体验：优先展示可用缓存，同时后台同步最新接口结果。详细性能说明见 [performance.md](performance.md)。

## 部署结构

当前线上部署使用 Vercel：

- 前端部署为 Vercel 静态站点。
- 后端部署为 Vercel Serverless Functions。
- Supabase 作为托管 PostgreSQL 数据层。
- AI Provider Key 配置在后端部署环境变量中。

## 扩展方向

后续架构扩展重点：

- 接入 1688 API，增加货源数据同步模块。
- 接入 Amazon API，增加市场数据同步模块。
- 设计数据导入、刷新、去重和质量校验流程。
- 对 AI 上下文进行更稳定的数据裁剪和指标解释。
- 增加监控、错误兜底和部署回归检查。
- 增加登录认证、用户体系和权限管理，从匿名候选池逐步扩展为用户级候选池与分析记录。
