import * as fs from 'fs';
import * as recorder from 'node-record-lpcm16';
import OpenAI from 'openai';
import { delay } from './utils';
import { TRANSCRIBE_FILE_PATH } from './config';

export const recordAndTranscribe = async (
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
