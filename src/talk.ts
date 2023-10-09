import axios from 'axios';
import * as fs from 'fs';
import * as recorder from 'node-record-lpcm16';
import OpenAI from 'openai';
import { execSync } from 'child_process';
import dotenv from 'dotenv';
import { openFile } from './utils';

dotenv.config();

const API_KEY: string = process.env.OPENAI_API_KEY as string;
const CLOVA_ID: string = process.env.NAVER_CLOVA_CLIENT_ID as string;
const CLOVA_SECRET: string = process.env.NAVER_CLOVA_CLIENT_SECRET as string;

const OUTPUT_FILE_PATH: string = './src/temp/output.mp3';
const TRANSCRIBE_FILE_PATH: string = './src/temp/transcribe.wav';
const VOICE_TYPE: string = 'dara-danna';
const PROMPT: string = openFile('./src/resources/chatbot1.txt');

const playSoundSync = (filePath: string) => {
  try {
    execSync(`play ${filePath}`, { stdio: 'inherit' });
  } catch (error) {
    console.error('Error playing sound:', error);
  }
};

let conversation1: any[] = [];

const chatgpt = async (
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

const text_to_speech = async (
  text: string,
  voice_type: string,
  client_id: string,
  client_secret: string
) => {
  const encText: string = encodeURIComponent(text);
  const url: string =
    'https://naveropenapi.apigw.ntruss.com/tts-premium/v1/tts';

  try {
    const response = await axios.post(
      url,
      `speaker=${voice_type}&volume=0&speed=0&pitch=0&format=mp3&text=${encText}`,
      {
        headers: {
          'X-NCP-APIGW-API-KEY-ID': client_id,
          'X-NCP-APIGW-API-KEY': client_secret,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        responseType: 'arraybuffer',
      }
    );

    if (response.status === 200) {
      fs.writeFileSync(OUTPUT_FILE_PATH, response.data);
      playSoundSync(OUTPUT_FILE_PATH);
    } else {
      console.log('Error Code:', response.status);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

const print_colored = (agent: string, text: string): void => {
  console.log('\x1b[36m%s\x1b[0m', `${agent}: ${text}`); // Cyan
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const record_and_transcribe = async (
  apiKey: string,
  duration: number = 8,
  sf: number = 44100
): Promise<string> => {
  const file = fs.createWriteStream(TRANSCRIBE_FILE_PATH, {
    encoding: 'binary',
  });
  const recording = recorder.record({
    sampleRateHertz: sf,
    channels: 2,
  });
  recording //
    .stream()
    .pipe(file)
    .on('error', console.error);

  console.log('Recording started...');
  await delay(duration * 1000);

  recording.stop();
  console.log('Recording stopped...');

  const openai = new OpenAI({ apiKey });
  const result = await openai.audio.transcriptions.create({
    file: fs.createReadStream(TRANSCRIBE_FILE_PATH),
    model: 'whisper-1',
  });
  return result['text'];
};

// 메인 로직
const main = async () => {
  while (true) {
    const user_message: string = await record_and_transcribe(API_KEY);
    const response: string = await chatgpt(
      API_KEY,
      conversation1,
      PROMPT,
      user_message
    );
    print_colored('Christina:', `${response}\n\n`);
    await text_to_speech(response, VOICE_TYPE, CLOVA_ID, CLOVA_SECRET);
  }
};

main();
