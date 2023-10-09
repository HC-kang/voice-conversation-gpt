import dotenv from 'dotenv';
import { openFile } from './utils';

dotenv.config();

// Modifiable variables
export const RECORD_DURATION = 8;
export const VOICE_TYPE = 'dara-danna';
export const PROMPT = openFile('./src/resources/chatbot1.txt');

// API Keys
export const API_KEY = process.env.OPENAI_API_KEY as string;
export const CLOVA_ID = process.env.NAVER_CLOVA_CLIENT_ID as string;
export const CLOVA_SECRET = process.env.NAVER_CLOVA_CLIENT_SECRET as string;

// Paths
export const OUTPUT_FILE_PATH = './src/temp/output.mp3';
export const TRANSCRIBE_FILE_PATH = './src/temp/transcribe.wav';
