import * as fs from 'fs';
import { execSync } from 'child_process';

export const openFile = (filepath: string): string => {
  return fs.readFileSync(filepath, 'utf-8');
};

export const playSoundSync = (filePath: string) => {
  try {
    execSync(`play ${filePath}`, { stdio: 'inherit' });
  } catch (error) {
    console.error('Error playing sound:', error);
  }
};

export const printColored = (agent: string, text: string, color = 'cyan'): void => {
  switch (color) {
    case 'cyan':
      console.log('\x1b[36m%s\x1b[0m', `${agent}: ${text}`); // Cyan
      break;
    case 'red':
      console.log('\x1b[31m%s\x1b[0m', `${agent}: ${text}`); // Red
      break;
    default:
      console.log(`${agent}: ${text}`);
      break;
  }
};

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
