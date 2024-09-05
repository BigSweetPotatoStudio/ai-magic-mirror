import log4js from "log4js";
import dayjs from "dayjs";
import { fs } from "zx";

fs.ensureDirSync("log");
fs.removeSync(`log/byx-${dayjs().format("YYYY-MM-DD")}.log`);
log4js.configure({
  appenders: {
    default: {
      type: "file",
      filename: `log/${dayjs().format("YYYY-MM-DD")}.log`,
    },
  }, // , mode: 0o644
  categories: { default: { appenders: ["default"], level: "trace" } },
});

export const log = log4js.getLogger();

let binds = ["log", "trace", "debug", "info", "warn", "error", "fatal"];

for (let level of binds) {
  console["o_" + level] = console[level];
  console[level] = function (...args) {
    console["o_" + level].apply(console, args);
    log[level](...args);
  };
}
