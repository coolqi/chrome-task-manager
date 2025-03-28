<img width="394" alt="image" src="https://github.com/user-attachments/assets/4a261af4-5acd-400e-bf7b-8f9cbdd8c83f" />
<img width="394" alt="image" src="https://github.com/user-attachments/assets/999a98d9-be30-4ad1-b0ce-27460d6f6ec1" />

### 极简任务管理器 Chrome 扩展

一个极简风格的任务管理 Chrome 扩展，帮助您高效管理日常任务。该扩展采用原生 JavaScript 开发，无需依赖框架，体积小巧，加载迅速。


## 功能特点

- **任务管理**：轻松添加、删除、编辑和完成任务
- **截止日期**：为任务设置到期时间，过期任务会有特殊标记
- **固定重要任务**：通过置顶功能突出显示重要任务
- **任务分类**：按项目和优先级对任务进行分类和筛选
- **夜间模式**：支持深色主题，保护眼睛
- **本地存储**：所有数据保存在 chrome.storage 中，不依赖外部服务器
- **快捷键支持**：使用 `Ctrl+Shift+Y`（Windows）或 `Command+Shift+Y`（Mac）快速打开扩展


## 安装指南

### 开发者模式安装

1. 下载或克隆本仓库到本地

```plaintext
git clone https://github.com/yourusername/chrome-task-manager.git
```


2. 打开 Chrome 浏览器，进入扩展管理页面

    1. 在地址栏输入 `chrome://extensions/`
    2. 或者从菜单 > 更多工具 > 扩展程序



3. 开启右上角的"开发者模式"
4. 点击"加载已解压的扩展程序"按钮
5. 选择包含本扩展所有文件的文件夹


### 从 Chrome 网上应用店安装（未发布）

*该扩展尚未发布到 Chrome 网上应用店。发布后将更新安装链接。*

## 使用指南

### 基本操作

1. **添加任务**：

    1. 点击"添加新任务"按钮
    2. 填写任务标题（必填）和描述（可选）
    3. 设置截止日期、优先级和分类（均为可选）
    4. 点击"添加任务"按钮保存

2. **编辑任务**：

    1. 点击任务右侧的编辑图标
    2. 修改任务信息
    3. 点击"保存"按钮更新任务

3. **完成任务**：

    1. 点击任务左侧的圆形复选框
    2. 已完成的任务会显示为灰色并带有删除线

4. **删除任务**：

    1. 点击任务右侧的删除图标
    2. 确认删除操作

## 项目结构

```plaintext
chrome-task-manager/
│
├── manifest.json        # Chrome 扩展配置文件
├── popup.html           # 扩展弹出窗口 HTML
│
├── css/
│   └── styles.css       # 样式文件
│
├── js/
│   ├── app.js           # 主应用逻辑
│   └── storage.js       # 存储操作工具
│
└── icons/               # 扩展图标
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

**注意**：本扩展仅在本地存储数据，不会将您的任务信息发送到任何服务器。
