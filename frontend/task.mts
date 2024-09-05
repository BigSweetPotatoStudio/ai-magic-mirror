import { $, within, fs } from "zx";

let code = fs.readFileSync("./src//common/service.ts", "utf-8");
fs.writeFileSync(
  "./src//common/service.ts",
  code.replace("../../../nodejs/src/router/api_service.js", "./types.js"),
);
