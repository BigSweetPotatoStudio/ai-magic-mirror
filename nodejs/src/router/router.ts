import Router from "koa-router";
import { fs } from "zx";
import { log } from "../common/log.js";
import { ApiService } from "./api_service.js";

function genRouter(c, prefix = "") {
  let functions = Object.getOwnPropertyNames(Object.getPrototypeOf(c)).filter(
    (x) => x != "constructor"
  );
  // console.log(c.prefix, functions);
  let router = new Router({
    prefix: prefix,
  });

  for (let name of functions) {
    let func = c[name];
    // console.log(prefix, name);
    router.post(`/${name}`, async (ctx) => {
      // console.log(ctx.request.files);
      try {
        ctx.body = await func(ctx.request.body, ctx);
      } catch (e) {
        log.error(e);
        ctx.body = { code: 1, message: e.message };
      }
    });
  }
  return router;
}

export const api_route = genRouter(new ApiService(), "/api");

// export const router = new Router({
//   prefix: "/api",
// });
// router.get("/test", async (ctx) => {
//   ctx.body = {
//     code: 200,
//     data: "test",
//     msg: "ok",
//   };
// });

// fs.ensureDirSync("uploads");
// router.post("/upload", async (ctx) => {
//   const files = ctx.request.files;
//   log.log(files);
//   // 如果只上传一个文件，files.file就是文件对象
//   if (files && files.file) {
//     const file = files.file;
//     ctx.body = {
//       filename: file.newFilename, //
//       // path: file.path, // 上传后的文件路径
//     };
//   } else {
//     ctx.body = { message: "No file uploaded" };
//   }
// });

function getStaticMethods(cls) {
  return Object.getOwnPropertyNames(cls).filter(
    (prop) => typeof cls[prop] === "function" && prop !== "prototype"
  );
}

// type ClassFunc = {
//   prefix: string;
// } & {
//   [K in string]: K extends "name" ? string : Function;
// };
