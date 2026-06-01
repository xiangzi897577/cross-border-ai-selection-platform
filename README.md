# 跨境电商手机支架选品分析平台

## 项目简介

这是一个用于前端实习简历展示的前后端分离练习项目，聚焦“手机支架”这一跨境电商轻小件品类。

项目通过本地 JSON 数据模拟 Amazon 候选商品和 1688 货源信息，围绕利润、竞争、风险和推荐价值做基础分析，帮助卖家快速筛选更有潜力的商品。

## 当前阶段

当前处于 **第四阶段：候选池与 JSON 持久化**。

当前已经完成第三阶段的商品搜索、类目筛选、利润率筛选、排序和筛选器整合，商品列表主流程已经具备基础选品效率。

第四阶段会在现有商品数据和前后端联调基础上，开始实现“收藏 / 候选池”能力。当前 Day 21 已先完成候选池数据文件和通用 JSON 文件读写工具，为后续接口开发做准备。

当前阶段重点：

- 使用 `server/data/favorites.json` 作为候选池本地存储文件
- 使用 `server/utils/fileStore.js` 封装通用 JSON 文件读写逻辑
- 后续实现 `GET /api/favorites`
- 后续实现 `POST /api/favorites`
- 后续实现 `DELETE /api/favorites/:id`
- 最后接入前端收藏按钮和候选池页面

## 技术栈

### 前端

- React
- Vite
- JavaScript
- React Router
- CSS

### 后端

- Node.js
- Express
- JSON 文件存储

### 数据来源

- `server/data/products.json`
- `server/data/favorites.json`

## 当前已完成内容

### 后端接口

- `GET /api/health`
- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/dashboard`

### 后端工具与数据文件

- `server/data/products.json`：商品 mock 数据
- `server/data/favorites.json`：候选池收藏数据，当前初始内容为 `[]`
- `server/utils/productMetrics.js`：商品利润、风险、竞争、推荐评分等计算逻辑
- `server/utils/fileStore.js`：通用 JSON 文件读取和写入工具

### 前端页面

- `/`：Dashboard 数据看板页
- `/products`：商品列表页
- `/products/:id`：商品详情页
- `/analysis`：选品分析页占位
- `/favorites`：候选池页占位

### 已完成的前端主流程

- 已完成整体 Layout、Sidebar、Header
- 已完成 Sidebar 导航切换与当前项高亮
- 商品列表页直接请求 Node 后端 `GET /api/products`
- 商品列表页支持关键词搜索、类目筛选、利润率筛选和排序
- 商品筛选控件已整合为 `ProductFilters`
- 商品详情页使用路由参数请求 `GET /api/products/:id`
- Dashboard 页直接请求 `GET /api/dashboard`
- 商品列表卡片支持跳转详情页
- 商品不存在和非法 id 已有错误状态

## 当前接口说明

### `GET /api/health`

用于检查后端服务是否正常运行。

### `GET /api/products`

返回商品列表数据，数据来自 `server/data/products.json`，并附带后端计算后的字段，例如：

- `platformFee`
- `profit`
- `profitRate`
- `profitRatePercent`
- `competitionLevel`
- `riskLevel`
- `recommendationScore`

当前支持的查询参数：

- `keyword`：按商品名、类目、标签搜索
- `category`：按手机支架类目筛选
- `minProfitRate`：按最低利润率百分比筛选，例如 `20`、`30`、`40`
- `sort`：按指定方式排序

当前支持的排序方式：

- `profitRateDesc`：利润率从高到低
- `monthlySalesDesc`：月销量从高到低
- `ratingDesc`：评分从高到低
- `competitionScoreAsc`：竞争指数从低到高
- `recommendationScoreDesc`：推荐评分从高到低

### `GET /api/products/:id`

根据商品 `id` 返回单个商品详情。

- 合法且存在的商品 id 返回商品详情
- 不存在的商品 id 返回 `404`
- 非法商品 id 返回 `400`

### `GET /api/dashboard`

返回 Dashboard 首页所需的核心统计字段，包括：

- `totalProducts`
- `averageProfitRate`
- `averageProfitRatePercent`
- `highPotentialCount`
- `riskProductCount`
- `topProfitProducts`
- `categoryDistribution`
- `averageCompetitionScore`

## 当前数据持久化说明

当前项目不使用数据库，后端通过本地 JSON 文件模拟轻量数据存储。

- 商品数据存放在 `server/data/products.json`
- 收藏数据存放在 `server/data/favorites.json`
- 通用读写逻辑封装在 `server/utils/fileStore.js`

`fileStore.js` 当前导出两个函数：

- `readJsonFile(filePath)`：读取指定 JSON 文件，并通过 `JSON.parse` 转成 JavaScript 数据
- `writeJsonFile(filePath, data)`：使用 `JSON.stringify(data, null, 2)` 将 JavaScript 数据格式化写入 JSON 文件

这一步是后续候选池接口的基础，但当前还没有正式实现收藏接口。

## 本地运行方式

### 1. 启动后端

```bash
cd server
npm install
npm start
```

后端默认运行在 `http://localhost:3000`

### 2. 启动前端

```bash
cd client
npm install
npm run dev
```

前端默认运行在 `http://localhost:5173`

## 当前可直接访问的地址

### 后端接口

- [http://localhost:3000/api/health](http://localhost:3000/api/health)
- [http://localhost:3000/api/products](http://localhost:3000/api/products)
- [http://localhost:3000/api/products?keyword=车载](http://localhost:3000/api/products?keyword=车载)
- [http://localhost:3000/api/products?category=车载支架](http://localhost:3000/api/products?category=车载支架)
- [http://localhost:3000/api/products?minProfitRate=30](http://localhost:3000/api/products?minProfitRate=30)
- [http://localhost:3000/api/products?sort=profitRateDesc](http://localhost:3000/api/products?sort=profitRateDesc)
- [http://localhost:3000/api/products/1](http://localhost:3000/api/products/1)
- [http://localhost:3000/api/products/999](http://localhost:3000/api/products/999)
- [http://localhost:3000/api/products/abc](http://localhost:3000/api/products/abc)
- [http://localhost:3000/api/dashboard](http://localhost:3000/api/dashboard)

### 前端页面

- [http://localhost:5173/](http://localhost:5173/)
- [http://localhost:5173/products](http://localhost:5173/products)
- [http://localhost:5173/products/1](http://localhost:5173/products/1)
- [http://localhost:5173/products/999](http://localhost:5173/products/999)
- [http://localhost:5173/products/abc](http://localhost:5173/products/abc)
- [http://localhost:5173/analysis](http://localhost:5173/analysis)
- [http://localhost:5173/favorites](http://localhost:5173/favorites)

## 当前项目特点

- 不使用 TypeScript
- 不使用数据库
- 不接真实 Amazon API
- 不接真实 1688 API
- 不做真实爬虫
- 不做登录注册
- 不做 JWT 鉴权
- 不引入 Redux、Zustand 等复杂状态管理库
- 不引入复杂 UI 组件库

## 当前已知限制

- `AnalysisPage` 和 `FavoritesPage` 目前还是占位页，尚未进入真实业务实现阶段
- 商品图片路径已经预留，但当前主要依赖前端图片失败兜底展示
- 当前已经有搜索、筛选和排序功能，但还没有收藏接口和候选池页面真实数据
- 当前还没有图表可视化，后续会接入 Recharts

## 下一阶段计划

第四阶段会围绕候选池功能继续开发：

- `GET /api/favorites`：获取候选池商品
- `POST /api/favorites`：添加候选商品
- `DELETE /api/favorites/:id`：删除候选商品
- 商品列表和详情页接入收藏按钮
- `FavoritesPage` 展示候选池商品列表

## 项目说明

这个仓库当前更适合作为“学习型工程项目”的阶段性展示版本：

- 有清晰的前后端目录结构
- 有基础业务数据模型
- 有后端接口
- 有前端页面和路由
- 有前后端联调主流程
- 有搜索、筛选、排序等基础选品操作
- 已开始进入 JSON 持久化和候选池功能阶段
- 有每日开发记录，方便复盘和面试讲解
