import {
  API_KEY,
  CLOVA_ID,
  CLOVA_SECRET,
  PROMPT,
  RECORD_DURATION,
  VOICE_TYPE,
} from './config';
import { chatgpt } from './chatgpt';
import { textToSpeech } from './textToSpeech';
import { printColored } from './utils';
import { recordAndTranscribe } from './recordAndTranscribe';

const main = async () => {
  const conversation1: any[] = [];

  while (true) {
    const user_message: string = await recordAndTranscribe(
      API_KEY,
      RECORD_DURATION
    );
    printColored('User:', `${user_message}\n\n`, 'red');
    const response: string = await chatgpt(
      API_KEY,
      conversation1,
      PROMPT,
      user_message
    );
    printColored('Christina:', `${response}\n\n`);
    await textToSpeech(response, VOICE_TYPE, CLOVA_ID, CLOVA_SECRET);
  }
};

main();
