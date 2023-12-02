import { chatbotPrompt } from "$lib/constant/chat-prompt";
import {
  OpenAIStream,
  type OpenAIStreamPayload,
} from "$lib/constant/openai-stream";
import type { Message } from "$lib/types/message";

export async function POST({ request }) {
  const { message } = await request.json();
  const outboundMessages = message.map((message: Message) => {
    return {
      role: message.isUserMessage ? "user" : "system",
      content: message.text,
    };
  });

  outboundMessages.unshift({
    role: "system",
    content: chatbotPrompt,
  });

  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages: outboundMessages,
    temperature: 0.4,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 150,
    stream: true,
    n: 1,
  };
  try {
    const stream = await OpenAIStream(payload, "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");
    return new Response(stream);
  } catch (err) {
    return new Response("Something went wrong please try again.", {
      status: 500,
    });
  }
}
