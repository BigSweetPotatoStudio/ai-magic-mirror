import OpenAI from "openai";
import "dotenv/config";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
});

export class OpenAiChannel {
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
