import { log } from "../common/log.js";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import path from "path";
import OpenAI from "openai";
import { fileURLToPath } from "url";
import { OpenAiChannel } from "../common/messagechannel.js";
import { v4 as gen_uuid } from "uuid";
import "dotenv/config";
import { fs } from "zx";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

const tasks = new Map<number, { openai: OpenAiChannel; type: number }>();
export class ApiService {
  async test() {
    return "test";
  }
  async upload(body?, ctx?) {
    // 如果只上传一个文件，files.file就是文件对象
    const files = ctx.request.files;
    if (files && files.file) {
      const file = files.file;
      // console.log(file);
      return {
        code: 0,
        data: {
          filename: file.newFilename,
          mimetype: file.mimetype,
        },
      };
    } else {
      throw new Error("No file uploaded");
    }
  }
  async image_comment(body: {
    filename: string;
    mimetype: string;
    type: 1 | 2;
  }) {
    let imagePath = path.resolve(__dirname, "../../uploads/", body.filename);
    if ((await fs.stat(imagePath)).size / 1024 / 1024 > 5) {
      throw new Error("图片太大，大于5MB");
    }
    let startText =
      body.type === 1
        ? `你是一个鼓励师，你的功能就是，根据我的文本，赞美人的的相貌。请使用中文回复。`
        : `你是一个中国的脱口秀演员，你的功能就是，根据我的文本，吐槽一下人物的相貌，记得毒舌，刻薄，恶毒，中文梗。请使用中文回复。`;

    const files = [await uploadToGemini(imagePath, body.mimetype)];

    const chatSession = model.startChat({
      generationConfig,
      // safetySettings: Adjust safety settings
      // See https://ai.google.dev/gemini-api/docs/safety-settings
      history: [
        {
          role: "user",
          parts: [
            {
              fileData: {
                mimeType: files[0].mimeType,
                fileUri: files[0].uri,
              },
            },
            {
              text: "帮我提取出下图中人物的相貌特征，尽量详细，不要写感觉，请回复中文",
            },
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
    const feature_text = result.response.text();
    console.log("feature_text: ", feature_text);
    let openAiChannel = new OpenAiChannel([
      {
        role: "system",
        content: startText,
      },
      {
        role: "user",
        content: feature_text,
      },
    ]);

    let res = await openAiChannel.completion();
    let json = JSON.parse(res.content);
    let uuid = gen_uuid();
    tasks.set(uuid, {
      openai: openAiChannel,
      type: body.type,
    });
    return { code: 0, data: json.result, session_id: uuid, type: body.type };
  }
  async image_comment_continue(body: { session_id: number }) {
    let { openai, type } = tasks.get(body.session_id);
    let continueText =
      type === 1 ? `更加鼓励一点，跟多赞美。` : `更加恶毒一点，这样才够破防。`;
    openai.addMessage({
      role: "user",
      content: continueText,
    });
    if (openai.messages.length > 10) {
      return {
        code: 0,
        data: "",
        session_id: body.session_id,
        type: type,
      };
    }
    // tasks.set(body.filename, openAiChannel);
    let res = await openai.completion();
    let json = JSON.parse(res.content);
    return {
      code: 0,
      data: json.result,
      session_id: body.session_id,
      type: type,
    };
  }
}

async function uploadToGemini(path, mimeType) {
  const uploadResult = await fileManager.uploadFile(path, {
    mimeType,
    displayName: path,
  });
  const file = uploadResult.file;
  // console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
  return file;
}

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};
