# AI跨境选品分析平台前端

这是AI跨境选品分析平台的前端子项目，负责商品看板、候选商品列表、商品详情、选品分析、候选池和 AI 交互等页面能力。

当前版本以手机支架作为种子品类和演示数据，用于验证跨境轻小件选品分析流程。平台定位不局限于手机支架，后续可扩展到更多跨境轻小件品类。

## 技术栈

- Vite
- React
- JavaScript
- React Router
- Recharts
- axios

## 启动方式

```bash
npm run dev
```

## 打包方式

```bash
npm run build
```

## 环境变量

前端通过 `VITE_API_BASE_URL` 指定后端 API 地址。

```txt
VITE_API_BASE_URL=http://localhost:3000
```

前端环境变量只能包含公开配置，不应保存 Supabase service role key、Zhipu API key、NVIDIA API key 等服务端密钥。

## 说明

- 前端通过后端 API 获取商品、Dashboard、候选池和 AI 分析数据。
- 前端请求层位于 `src/services/`，使用 `http.js` 中的 Axios 实例和按业务拆分的 API 模块。
- 页面组件优先从 `src/services` 统一导入业务 API，不直接拼接后端请求。
- `http.js` 负责 `VITE_API_BASE_URL`、默认超时、响应拦截、错误归一化和匿名 `client_id` 请求头。
- `productApi.js`、`dashboardApi.js`、`favoriteApi.js`、`aiApi.js` 分别封装商品、Dashboard、候选池和 AI 相关请求。
- `api.js` 仅用于兼容旧导入路径，新代码优先使用 `src/services/index.js` 的统一导出。
- 候选池使用浏览器本地生成的匿名 `client_id` 与后端关联。
- 更完整的项目说明请查看根目录 [README.md](../README.md)。
