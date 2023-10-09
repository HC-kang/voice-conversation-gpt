import axios from 'axios';
import * as fs from 'fs';
import { playSoundSync } from './utils';
import { OUTPUT_FILE_PATH } from './config';

export const textToSpeech = async (
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
