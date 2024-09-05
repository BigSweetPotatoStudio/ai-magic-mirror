import "reflect-metadata";
import { log } from "./common/log.js";
import Koa from "koa";
import Router from "koa-router";
import logger from "koa-logger";
import cors from "@koa/cors";
import { koaBody } from "koa-body";
import { $, fs, os, path } from "zx";
import cron from "node-cron";
import file from "koa-static";
import mount from "koa-mount";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js"; // dependent on utc plugin

import "dotenv/config";
import { PORT } from "./const.js";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { api_route } from "./router/router.js";

dayjs.extend(utc);
dayjs.extend(timezone);
log.log("log init");

const app = new Koa();

function initServer() {
  // var task = cron.schedule("0 * * * *", async () => {
  //   console.log("auto banyun running");
  //   try {
  //     if (process.env.auto == "1") {
  //     }
  //   } catch (e) {
  //     console.error(e);
  //   }
  // });
}
initServer();

fs.ensureDirSync("uploads");
app
  .use(cors())
  .use(logger())
  .use(
    koaBody({
      multipart: true, // 允许多部分（文件）上传
      formidable: {
        uploadDir: "./uploads", // 设置上传文件的目录
        keepExtensions: true, // 保留文件的扩展名
        // maxFileSize: 200 * 1024 * 1024, // 限制文件大小为 200MB
        // onFileBegin: (name, file) => {
        //   console.log(`开始接收文件: ${name}`);
        // },
        // onFileBegin: (name, file: any) => {
        //   console.log(`开始接收文件: ${name}`);
        //   // 生成文件哈希
        //   const hash = crypto.createHash("sha256");
        //   hash.update(file.name + Date.now());
        //   const hashFileName = hash.digest("hex");

        //   // 获取文件扩展名
        //   const ext = path.extname(file.name);

        //   // 设置新的文件路径
        //   file.path = path.join(__dirname, "uploads", hashFileName + ext);
        // },
      },
    })
  )
  .use(mount("/assests", file("./assests")))
  .use(api_route.routes())
  .use(api_route.allowedMethods())
  .use(mount("/", file("./web-build/frontend/build")))
  .listen(PORT, "0.0.0.0", () =>
    console.log(`listening on http://localhost:${PORT}...`)
  );
