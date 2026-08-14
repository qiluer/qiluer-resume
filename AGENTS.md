# 仓库指南

## 项目结构与模块组织

这是一个使用 pnpm/Turborepo 的 TypeScript Monorepo。

1. NestJS API 位于 `apps/server/qiluer-resume-server`；领域代码应放在 `src/modules` 下，可复用的基础设施应放在 `src/shared` 下，全局过滤器、拦截器和错误应放在 `src/common` 下。
2. React/Vite 客户端位于 `apps/web/resume`；路由应使用的@tanstack/react-router，特定功能的代码应放在 `src/features` 中，共享集成应放在 `src/lib` 中，静态资源应放在 `src/assets` 或 `public` 中。
3. 共享的 Zod Schema 和传输类型位于 `packages/dto`。
4. Prisma Schema、生成的客户端代码和数据库导出位于 `packages/database`。5.通用 TypeScript 配置位于 `packages/config`。

## 规则

- 所有环境变量统一放在根目录的 `.env` 中。
- 每个项目要使用环境变量也统一从根目录下的 `.env` 中读取。

## 构建、测试与开发命令

请在仓库根目录使用 pnpm 10 运行命令：

- `pnpm install`：安装工作区中的所有依赖。
- `pnpm turbo dev`：启动整个工作区中的常驻开发任务。
- `pnpm turbo build`：按照依赖顺序构建各软件包和应用，并重新生成 Prisma 产物。
- `pnpm turbo lint`：运行工作区的代码检查任务。
- `pnpm format`：格式化支持的源代码和文档文件；`pnpm format:check` 用于检查格式。
- `pnpm --filter qiluer-resume-server test`：运行 API 单元测试。
- `pnpm --filter qiluer-resume-server test:e2e`：运行 API 端到端测试。
- `pnpm --filter resume dev`：仅启动 Vite 客户端。
- `pnpm --filter @qiluer-resume/database db:migrate`：创建并应用本地 Prisma 迁移。

## 编码风格与命名约定

Prettier 强制使用两个空格缩进、单引号、分号、尾随逗号，并将单行长度限制为 150 个字符；其 Tailwind 插件会对工具类进行排序。ESLint 覆盖 TypeScript、NestJS、React Hooks 和 Vite 热更新规则。React 组件和类使用 `PascalCase`，函数和变量使用 `camelCase`，文件名使用 kebab-case 并附加职责后缀，例如 `user.service.ts`、`auth.store.ts` 和 `app.e2e-spec.ts`。请勿手动编辑 `src/routeTree.gen.ts` 或 Prisma 生成的文件。

## 测试指南

服务端使用 Jest 和 Supertest。单元测试应以 `*.spec.ts` 命名并与源文件放在同一目录；集成测试应放在 `test/` 下并以 `*.e2e-spec.ts` 命名。新增控制器、服务、验证和错误处理行为时，应补充相应测试。使用 `test:cov` 查看测试覆盖率；当前未强制要求具体的覆盖率数值。Web 应用尚未配置测试运行器，因此请使用 `pnpm --filter resume lint` 和 `pnpm --filter resume lint:typecheck` 进行代码检查和类型检查。

## 提交与拉取请求指南

当前检出内容中无法获取 Git 历史。提交信息应简洁并使用祈使语气，建议遵循 Conventional Commits 规范（例如 `feat(auth): add captcha verification`）。每个提交应只聚焦于一项变更。拉取请求应说明变更内容和已执行的验证，关联相关 Issue，标明 Schema 或环境配置变更，并为可见的 UI 更新附上截图。切勿提交 `.env`、凭据或生产数据。
