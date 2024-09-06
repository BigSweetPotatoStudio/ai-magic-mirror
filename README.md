# AI魔镜

AI魔镜是一个有趣的Node.js应用，可以通过人工智能为您的照片提供赞美和调侃。照片特征提取使用Gemini flash，赞美和吐槽使用OPENAI gpt-4o-mini的API。

## 功能特点

- 上传个人照片
- AI分析照片并生成赞美评论
- AI分析照片并生成幽默调侃
- 支持多种图片格式
- 用户友好的界面

![alt text](./nodejs/assests/demo2.png)
![alt text](./nodejs/assests/demo1.png)

# DEMO

[DEMO](https://magic-mirror.dadigua.men/)

## 安装
1. 克隆仓库:
   ```
   git clone https://github.com/BigSweetPotatoStudio/ai-magic-mirror.git
   ```
2. 安装依赖，分前端和后端:
   ```
    cd nodejs
    npm install

    cd frontend
    npm install 
   ```
3. 首先设置大模型KEY:
   ```
    OPENAI_API_KEY=
    GEMINI_API_KEY=

   ```
4. 部署

   ```
    cd nodejs 
    npm run build

    cd frontend
    npm run deploy
    
   ```

## 使用方法

1. 启动应用:
   ```
    cd nodejs 
    npm run dev

    cd frontend
    npm run dev
   ```
2. 在浏览器中打开 `http://localhost:9000`
3. 上传您的照片
4. 等待AI分析并生成评论
5. 享受AI的赞美和调侃!

## 技术栈

- Node.js
- REACT tailwind (前端)

## 贡献

欢迎提交问题和拉取请求。对于重大更改，请先开issue讨论您想要改变的内容。

## 许可证

[MIT](https://choosealicense.com/licenses/mit/)
