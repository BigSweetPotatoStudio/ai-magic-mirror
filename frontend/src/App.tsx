import React, { useEffect, useState } from "react";
import { Routes, Route, Outlet, Link } from "react-router-dom";

import { OutHome } from "./pages/home/index";
// import { TTS } from "./pages/tts/index";
import {
  Button,
  Table,
  Switch,
  Tooltip,
  Modal,
  message,
  Radio,
  Input,
  Tabs,
  ConfigProvider,
  Popconfirm,
  Popover,
  Dropdown,
  Space,
  MenuProps,
  Select,
  Spin,
  Progress,
} from "antd";
import enUS from "antd/locale/en_US";
import zhCN from "antd/locale/zh_CN";
import { getText } from "./pages/locale";

// import { Audio2Video } from './pages/audio2video';

import {
  DownOutlined,
  ExclamationCircleFilled,
  LoadingOutlined,
  SmileOutlined,
} from "@ant-design/icons";

import { HeaderContext } from "./common/context";

import { BgRemove } from "./pages/bgRemove";
import { Test } from "./pages/test";
import { SelfieCommentGenerator } from "./pages/photo_roast";

let t = getText("default");
const TabPane = Tabs.TabPane;
export default function App() {
  return (
    <div>
      <Routes>
        {/* <Route path="/" element={<Layout />}> */}
        {/* <Route index element={<OutHome />} /> */}
        <Route path="/BgRemove" element={<BgRemove />}></Route>
        <Route path="/Test" element={<Test />}></Route>
        <Route path="/" element={<SelfieCommentGenerator />}></Route>
        <Route path="*" element={<SelfieCommentGenerator />} />
      </Routes>
    </div>
  );
}

let currLang = localStorage.getItem("currLang") || "zhCN";

function Layout() {
  let [user, setUser] = useState({ permissions: [], settingConfig: {} } as any);

  const [locale, setLocal] = useState(currLang == "zhCN" ? zhCN : enUS);

  return (
    <ConfigProvider locale={locale}>
      <div style={{ width: "100%", margin: "0px auto" }}>
        <div
          style={{
            position: "fixed",
            width: "100%",
            top: 0,
            left: 0,
            background: "#eee",
            boxSizing: "border-box",
            zIndex: 999,
            padding: 8,
            fontWeight: "bold",
            height: 40,
            lineHeight: "24px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{ display: "flex", cursor: "pointer" }}
            onClick={() => {
              location.href = "/";
            }}
          >
            <label style={{ marginLeft: 8 }}>{t`AI工具`}</label>
          </div>
        </div>
        <div style={{ marginTop: 40, height: "calc(-40px + 100vh)" }}>
          <HeaderContext.Provider value={{ user }}>
            <Outlet />
          </HeaderContext.Provider>
        </div>
      </div>
    </ConfigProvider>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}
