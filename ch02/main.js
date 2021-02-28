import * as loggerModule from './logger.js';
console.log(loggerModule);

import { log, Logger } from './logger.js';
log('Hello world');
const logger = new Logger('DEFAULT');
logger.log('Hello world');

const SUPPORTED_LANGUAGES = ['en', 'el'];
const selectedLanguage = process.argv[2];

if (!SUPPORTED_LANGUAGES.includes(selectedLanguage)) {
  console.log('The specified language is not supported');
  process.exit(1);
}

const translationModule = `./string-${selectedLanguage}.js`;
import(translationModule).then((string) => {
  console.log(string.HELLO);
});

console.log('init');

import { count, increment } from './counter.js';

console.log(count);
increment();
console.log(count);
// count++;

import fs, { readFile } from 'fs';
console.log(fs);
import { mockEnable, mockDisable } from './mock-read-file.js';
import { syncBuiltinESMExports } from 'module';

mockEnable(Buffer.from('Hello Wrold111'));

fs.readFile('fake-path', (err, data) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(data.toString());
});
syncBuiltinESMExports();
// mockDisable();

console.log(fs.readFile === readFile);
