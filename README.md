## Gulp4 工作流配置(Gulp4 workflow config)

### 简介 - Introduction

简单实用的前端自动化工作流配置，基于 Gulp4.x
Simple and practical front-end automated workflow configuration based on Gulp4.x

### 特性 - Features

- LESS (CSS preprocessor)
- 图像压缩和转 Base64 (Images compress & save base64 image)
- JS 压缩 (JavaScript compressor)
- 热加载 (Hot reload)
- 一套环境多项目共存 (Multi-Project Builds)
- ES6 转换 (Babel)
- 自动添加 CSS 前缀 (Autoprefixer)
- 移动端适配方案 (Viewport)
- 反向代理（HTTP proxy)

### 目录结构 - Directory structure

```
+ project_file_name                 // Project folder(Example)
    + production                    // Production folder(Output floder)
        - etc...
    + development                   // Development folder(Output floder)
        - etc...
    + test                          // Test folder(Output floder)
        - etc...
    + src                           // Source code
        - images                    // Image folder
        - js                        // Script folder
        - css                       // Style folder
        - project.config.js         // Project custom config
+ public                            // CSS/JS library
    + css                           // common css
        - etc...
    + js                            // js library
        - etc...
- .gitignore                        // Exclude files from git
- gulp.config.js                    // Gulp custom config
- gulpfile.js                       // Gulp config
- package.json                      // Dependency & Module list
- package-lock.json                 // Dependency lock file
- README.md                         // Documentation
```

### 安装方式 - Installation

```bash
# 安装依赖 - Install dependency
$ npm install
# or
$ yarn install
```

### 使用方法 - Used

```bash
# 项目初始化 - Project initialization
$ npm run build --project=<project-folder> --mode=[development, testing, production]

# 环境启动 - Start it
$ npm run dev --project=<project-folder> --mode=[development, testing, production]
```

### 环境切换 - Using environment variables

```bash
# 发布测试环境 - Build for test environment
$ npm run build --project=<project-folder> --mode=testing

# 发布生产环境 - Build for production environment
$ npm run build --project=<project-folder> --mode=production

# 清理指定环境目录 - Clean up the specified environment directory
$ npm run clean --project=<project-folder> --mode=[development, testing, production]
```

### 开源许可(License)

[MIT](https://opensource.org/licenses/MIT)
