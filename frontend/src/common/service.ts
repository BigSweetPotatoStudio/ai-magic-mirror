import { request } from "./request.js";
import { ApiService } from "../../../nodejs/src/router/api_service.js";

type FirstParameter<T extends (...args: any[]) => any> = T extends (
  first: infer F,
  ...args: any[]
) => any
  ? F
  : never;
// function exampleFunction(a: number, b: string, c: boolean) {
//   // 函数体
// }

// type FirstArg = FirstParameter<typeof exampleFunction>; // 结果是 number
// type A = (typeof ApiService.prototype)["image_comment"];

// type B = FirstParameter<A>;

export function callRemote<k extends keyof typeof ApiService.prototype>(
  command: k,
  body: FirstParameter<(typeof ApiService.prototype)[k]> | FormData,
): Promise<ReturnType<(typeof ApiService.prototype)[k]>> {
  return request("/api/" + command, { method: "post", body: body });
}
