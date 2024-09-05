/* eslint-disable*/

import React, {
  useState,
  useEffect,
  version,
  useCallback,
  useContext,
} from "react";
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
  Progress,
  Card,
  Flex,
  Tag,
} from "antd";
import { fullLoading } from "../../common/loading";
import querystring from "querystring";
import { getText } from "../locale";
import bg_remove_example_logo from "../../../public/bg-remove-example-logo.png";

import { Link, useLocation } from "react-router-dom";
import { HeaderContext } from "../../common/context";

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}
let t = getText("default");

export function OutHome() {
  let { user } = useContext(HeaderContext);

  const [plugin, setPlugin] = useState("");
  let query = useQuery();
  let type = query.get("type");
  let url = query.get("url");

  useEffect(() => {
    (async () => {})();
  }, []);

  return (
    <div style={{ padding: "24px 24px" }}>
      <div>
        <div className="mt-8 flex flex-wrap content-center items-center justify-center gap-10">
          <Card
            title={t`自拍评论生成器`}
            hoverable
            size="small"
            style={{ width: 200, cursor: "pointer" }}
            onClick={async () => {
              location.href = "#/SelfieCommentGenerator";
            }}
          >
            <div>{t`自拍评论生成器`}</div>
          </Card>

          <Card
            title={t`AI去背景`}
            hoverable
            size="small"
            style={{ width: 200, cursor: "pointer" }}
            onClick={async () => {
              location.href = "#/BgRemove";
            }}
          >
            <div>{t`AI去背景，免费，无限制，使用webgpu可以离线`}</div>
            <img width="100%" src={bg_remove_example_logo}></img>
          </Card>

          <Card
            title={t`更多`}
            size="small"
            style={{ width: 200, cursor: "pointer" }}
            onClick={() => {
              // location.href = '#/Test'
              message.info(t`敬请期待`);
            }}
          >
            <div>{t`敬请期待`}</div>
          </Card>
        </div>
      </div>
    </div>
  );
}
