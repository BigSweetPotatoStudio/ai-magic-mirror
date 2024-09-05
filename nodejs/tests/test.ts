/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 */

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";

import "dotenv/config";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
});
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Uploads the given file to Gemini.
 *
 * See https://ai.google.dev/gemini-api/docs/prompting_with_media
 */
async function uploadToGemini(path, mimeType) {
  const uploadResult = await fileManager.uploadFile(path, {
    mimeType,
    displayName: path,
  });
  const file = uploadResult.file;
  console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
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

async function run() {
  // TODO Make these files available on the local file system
  // You may need to update the file paths
  const files = [
    await uploadToGemini(
      path.resolve(__dirname, "../assests/1.png"),
      "image/png"
    ),
  ];

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
          { text: "帮我提取出下图中人物的特征，尽量详细" },
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
  console.log(result.response.text());
}

// run();

// async function positive(text) {
//   const chatCompletion = await openai.chat.completions.create({
//     messages: [
//       {
//         role: "system",
//         content: `你是一个AI鼓励师，你的功能就是，根据我的文本，赞美人的的相貌。请使用中文回复。`,
//       },
//       {
//         role: "user",
//         content: text,
//       },
//       // { role: "assistant", content: "你好😏" },
//     ],
//     response_format: {
//       type: "json_schema",
//       json_schema: {
//         name: "keywords_schema",
//         schema: {
//           type: "object",
//           properties: {
//             result: {
//               type: "string",
//               description: "这个是结果.",
//             },
//           },
//           required: ["result"],
//           additionalProperties: false,
//         },
//         strict: true,
//       },
//     },
//     model: "gpt-4o-mini",
//   });

//   let json = chatCompletion.choices[0].message.content;
//   console.log(chatCompletion);
//   let res = JSON.parse(json);
//   return res.result;
// }

// positive(
//   `这是一个中年男性，他留着短发，皮肤偏白，脸型比较圆润，眼睛中等大小，鼻子比较高挺，嘴唇偏薄，下巴圆圆的，看起来比较和善。他穿着黑色圆领T恤，上面印着金色的图案，总体给人一种稳重的感觉。`
// );

async function createMessage(
  message: OpenAI.Chat.Completions.ChatCompletionMessageParam[]
) {
  const chatCompletion = await openai.chat.completions.create({
    messages: message,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "keywords_schema",
        schema: {
          type: "object",
          properties: {
            result: {
              type: "string",
              description: "这个是结果.",
            },
          },
          required: ["result"],
          additionalProperties: false,
        },
        strict: true,
      },
    },
    model: "gpt-4o-mini",
  });
  return chatCompletion.choices[chatCompletion.choices.length - 1].message;
}

class MessageChannel {
  lastMessage: OpenAI.Chat.Completions.ChatCompletionMessageParam;
  constructor(
    public messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]
  ) {}
  addMessage(message: OpenAI.Chat.Completions.ChatCompletionMessageParam) {
    this.messages.push(message);
    return this;
  }
  async completion() {
    const chatCompletion = await openai.chat.completions.create({
      messages: this.messages,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "keywords_schema",
          schema: {
            type: "object",
            properties: {
              result: {
                type: "string",
                description: "这个是结果.",
              },
            },
            required: ["result"],
            additionalProperties: false,
          },
          strict: true,
        },
      },
      model: "gpt-4o-mini",
    });
    let res = chatCompletion.choices[chatCompletion.choices.length - 1].message;
    this.lastMessage = res;
    this.messages.push(this.lastMessage);
    return res;
  }
}

async function main() {
  // let messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
  //   {
  //     role: "system",
  //     content: `你是一个脱口秀演员，你的功能就是，根据我的文本，吐槽一下人物的相貌，记得幽默，刻薄，恶毒。请使用中文回复。`,
  //   },
  //   {
  //     role: "user",
  //     content: `这是一个中年男性，他留着短发，皮肤偏白，脸型比较圆润，眼睛中等大小，鼻子比较高挺，嘴唇偏薄，下巴圆圆的，看起来比较和善。他穿着黑色圆领T恤，上面印着金色的图案，总体给人一种稳重的感觉。`,
  //   },
  // ];
  // let msg = await createMessage(messages);
  // console.log(msg);
  // messages.push(msg);
  // messages.push({
  //   role: "user",
  //   content: `更加恶毒一点，这样才够破防。`,
  // });
  // let msg2 = await createMessage(messages);
  // console.log(msg2);
  // messages.push(msg2);
  // messages.push({
  //   role: "user",
  //   content: `更加恶毒一点，这样才够破防。`,
  // });
  // let msg3 = await createMessage(messages);
  // console.log(msg3);

  let channel = new MessageChannel([
    {
      role: "system",
      content: `你是一个中国的脱口秀演员，你的功能就是，根据我的文本，吐槽一下人物的相貌，记得幽默，刻薄，恶毒，中文梗。请使用中文回复。`,
    },
    {
      role: "user",
      content: `这是一个中年男性，他留着短发，皮肤偏白，脸型比较圆润，眼睛中等大小，鼻子比较高挺，嘴唇偏薄，下巴圆圆的，看起来比较和善。他穿着黑色圆领T恤，上面印着金色的图案，总体给人一种稳重的感觉。`,
    },
  ]);

  let res = await channel.completion();
  console.log(res);
  res = await channel
    .addMessage({
      role: "user",
      content: `更加恶毒一点，这样才够破防。`,
    })
    .completion();
  console.log(res);
  res = await channel
    .addMessage({
      role: "user",
      content: `更加恶毒一点，这样才够破防。`,
    })
    .completion();
  console.log(res);
  console.log(channel.messages);
}

main();
