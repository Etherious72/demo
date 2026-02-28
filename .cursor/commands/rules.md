# rules

Write your command content here.

This command will be available in chat with /rules
---
description: 自动生成或编写 Git commit 消息时使用的规范。
alwaysApply: true
---

当生成 Git commit 消息时（包括点击 Git 面板的“小火花”图标自动生成），请严格遵守以下规则：
1. **语言**：必须使用简体中文编写。
2. **格式**：使用 Conventional Commits 规范 (例如: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `chore:`)。
3. **内容**：描述应简洁明了，准确反映代码变更。
4. **示例**：
   - `feat: 添加用户登录功能`
   - `fix: 修复诗词列表加载失败的问题`
   - `docs: 更新项目说明文档`
    - `style: 代码格式改变`
    - `refactor: 某个已有功能重构`
    - `perf: 性能优化`
    - `test: 增加测试`
    - `build: 改变构建流程`
    - `ci: 改变持续集成配置`
    - `chore: 辅助工具的变动`