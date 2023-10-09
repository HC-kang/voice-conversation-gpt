import OpenAI from 'openai';

export const chatgpt = async (
  apiKey: string,
  conversation: any[],
  chatbot: string,
  user_input: string,
  temperature: number = 0.9,
  frequency_penalty: number = 0.2,
  presence_penalty: number = 0
): Promise<string> => {
  const openai = new OpenAI({ apiKey });
  conversation.push({ role: 'user', content: user_input });
  const messages_input = conversation.slice();
  const prompt = [{ role: 'system', content: chatbot }];
  messages_input.unshift(prompt[0]);
  const completion = await openai.chat.completions.create({
    messages: messages_input,
    model: 'gpt-3.5-turbo',
    temperature,
    frequency_penalty,
    presence_penalty,
  });
  const chat_response = completion['choices'][0]['message']['content'];
  conversation.push({ role: 'assistant', content: chat_response });
  return chat_response as string;
};
