import React, { useState } from "react";
import {
  Upload,
  MessageSquare,
  ThumbsUp,
  Camera,
  MessageCircle,
} from "lucide-react";
import { callRemote } from "../../common/service";
import { message } from "antd";
import { motion } from "framer-motion";
const Button = ({ children, onClick, className, loading }) => {
  return (
    <motion.div
    // className="rounded-full"
    // initial={{ "--rotate": "0deg" } as any}
    // animate={{ "--rotate": "360deg" } as any}
    // transition={{ duration: 2, repeat: Infinity }}
    // style={{
    //   background: loading
    //     ? "conic-gradient(from var(--rotate), rgb(255 255 255 / 0%) 0deg, rgb(255 163 74 / 100%) 50deg, rgb(255 255 255 / 0%) 100deg)"
    //     : null,
    //   padding: loading ? "8px" : null,
    // }}
    >
      <motion.button
        onClick={onClick}
        className={`transform rounded-full px-4 py-2 font-semibold text-white transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${className}`}
      >
        {children}
      </motion.button>
    </motion.div>
  );
};

let imageFile = null;
let session_id = null;

export const SelfieCommentGenerator = () => {
  const [image, setImage] = useState(null);
  const [type, setType] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState({
    positive: "",
    negative: "",
  });

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      imageFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        setType(0);
        session_id = null;
        setImage(e.target.result);
        setResult({ positive: "", negative: "" });
      };
      reader.readAsDataURL(file);
    }
  };

  const generateComments = async (type) => {
    // console.log(isLoading);
    if (isLoading) {
      return;
    }
    if (!imageFile) {
      message.error("请上传图片");
      return;
    }

    setType(type);
    if (session_id) {
      continueComments();
      return;
    }
    setIsLoading(true);
    let form = new FormData();
    form.append("file", imageFile);
    let f = await callRemote("upload", form);
    let res = await callRemote("image_comment", {
      filename: f.data.filename,
      mimetype: f.data.mimetype,
      type,
    });
    session_id = res.session_id;
    if (res.type == 1) {
      setResult({ ...result, positive: res.data });
    } else {
      setResult({ ...result, negative: res.data });
    }
    // console.log(res.data);
    setIsLoading(false);
  };
  const continueComments = async () => {
    // console.log(isLoading);
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    let res = await callRemote("image_comment_continue", {
      session_id,
    });
    if (res.data == "") {
      setIsLoading(false);
      message.info("已达到上限");
      return;
    }
    if (res.type == 1) {
      setResult({ ...result, positive: res.data });
    } else {
      setResult({ ...result, negative: res.data });
    }
    setIsLoading(false);
  };

  return (
    <div className="mx-auto w-full overflow-hidden rounded-lg bg-white">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
        <h1 className="text-center text-3xl font-bold">AI 自拍评论器</h1>
        <p className="mt-2 text-center text-purple-100">
          上传自拍，获取AI生成的评论
        </p>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <label htmlFor="image-upload" className="block w-full cursor-pointer">
            <div className="border-3 relative rounded-lg border-dashed border-gray-300 p-8 text-center transition duration-300 hover:border-purple-500">
              {image ? (
                <>
                  <img
                    src={image}
                    alt="上传的自拍"
                    className="mx-auto h-64 max-w-full rounded object-cover"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setImage(null);
                      setType(0);
                      imageFile = null;
                      session_id = null;
                      setResult({ positive: "", negative: "" });
                    }}
                    className="absolute right-2 top-2 bg-white text-purple-500 hover:bg-gray-100"
                  >
                    <Upload size={20} />
                  </button>
                </>
              ) : (
                <div className="text-gray-500">
                  <Camera className="mx-auto text-purple-400" size={64} />
                  <p className="mt-4 text-lg">点击或拖拽上传自拍</p>
                  <p className="mt-2 text-sm text-gray-400">
                    支持 JPG、PNG 格式
                  </p>
                </div>
              )}
            </div>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
        </div>
        <div className="flex justify-center gap-2">
          <div className="flex flex-row items-center space-x-4">
            {(type == 0 || type == 1) && (
              <Button
                loading={isLoading}
                onClick={() => {
                  generateComments(1);
                }}
                className="bg-green-500 hover:bg-green-600 focus:ring-green-400"
              >
                <div className="flex items-center">
                  <ThumbsUp className="mr-2" size={18} />
                  {type != 0 && "再次"}赞美
                </div>
              </Button>
            )}

            {/* <Button
              onClick={() => {}}
              className="bg-blue-500 hover:bg-blue-600 focus:ring-blue-400"
            >
              <div className="flex items-center">
                <ThumbsUp className="mr-2" size={18} />
                赞美 +
                <MessageCircle size={18} />
                吐槽
              </div>
            </Button> */}

            {(type == 0 || type == 2) && (
              <Button
                loading={isLoading}
                onClick={() => {
                  generateComments(2);
                }}
                className="bg-red-500 hover:bg-red-600 focus:ring-red-400"
              >
                <div className="flex items-center">
                  <MessageCircle className="mr-2" size={18} />
                  {type != 0 && "再次"}吐槽
                </div>
              </Button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {result.negative && (
              <div className="rounded-lg border border-red-100 bg-red-50 p-4">
                <div className="mb-2 flex items-center space-x-2 text-red-600">
                  <MessageSquare size={24} />
                  <span className="text-lg font-semibold">温馨提醒</span>
                </div>
                <pre className="whitespace-pre-wrap text-gray-700">
                  {result.negative}
                </pre>
              </div>
            )}
            {result.positive && (
              <div className="rounded-lg border border-green-100 bg-green-50 p-4">
                <div className="mb-2 flex items-center space-x-2 text-green-600">
                  <ThumbsUp size={24} />
                  <span className="text-lg font-semibold">赞美</span>
                </div>
                <pre className="whitespace-pre-wrap text-gray-700">
                  {result.positive}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
