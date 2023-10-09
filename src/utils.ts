import * as fs from 'fs';

export const openFile = (filepath: string): string => {
  return fs.readFileSync(filepath, 'utf-8');
};