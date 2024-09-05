import querystring from "querystring";
import { Modal, message } from "antd";

console.log("NODE_ENV: ", process.env.NODE_ENV);

export async function request(
  url: string,
  options = {} as any,
  BASE_URL = process.env.REACT_APP_REMOTE_URL,
) {
  BASE_URL = BASE_URL || "http://localhost:18001";
  let token = localStorage.getItem(".token");
  options.headers = Object.assign({}, options.headers, {
    Authorization: "Bearer " + token,
  });
  return await xxx(url, options, BASE_URL).then((res) => {
    if (res.code !== 0) {
      // message.error(res.message)
      !options.hideMsg &&
        res.message &&
        Modal.error({
          title: "提示",
          content: res.message,
        });
      throw new Error(res.message);
    }
    return res;
  });
}

async function xxx(url: string, options = {} as any, BASE_URL) {
  if (options.body instanceof FormData) {
  } else {
    options = Object.assign({}, options, {
      headers: Object.assign({}, options.headers, {
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(options.body),
    });
  }
  return fetch(BASE_URL + url, options)
    .then((res) => {
      return res;
    })
    .then((res) => res.json());
}
