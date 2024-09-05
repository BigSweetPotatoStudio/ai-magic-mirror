import React from "react";
import ReactDOM from "react-dom/client";
import "./tailwind.css";

import { HashRouter, BrowserRouter, Link } from "react-router-dom";
import App from "./App";

import { ConfigProvider } from "antd";

import { StyleProvider, px2remTransformer } from "@ant-design/cssinjs";
const px2rem = px2remTransformer({
  rootValue: 16, // 32px = 1rem; @default 16
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <HashRouter>
    <ConfigProvider>
      <StyleProvider transformers={[px2rem]} layer>
        <App />
      </StyleProvider>
    </ConfigProvider>
  </HashRouter>,
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
