import { EventEmitter } from 'events';
import { readFile, readFileSync } from 'fs';
import glob from 'glob';

function findRegex(files, regex) {
  const emitter = new EventEmitter();
  for (const file of files) {
    readFile(file, 'utf8', (err, content) => {
      if (err) {
        return emitter.emit('error', err);
      }

      emitter.emit('fileread', file);
      const match = content.match(regex);
      if (match) {
        match.forEach((elem) => {
          console.log(elem);
          emitter.emit('found', file, elem);
        });
      }
    });
  }
  return emitter;
}

// findRegex(['eventemitter.js', 'unpredicableFunction.js'], /function/gm)
//   .on('fileread', (file) => console.log(`${file} was read`))
//   .on('found', (file, match) => console.log(`Matched ${match} in ${file}`))
//   .on('error', (err) => console.error(`Error emitted ${err.message}`));

class FindRegex extends EventEmitter {
  constructor(regex) {
    super();
    this.regex = regex;
    this.files = [];
  }

  addFile(file) {
    this.files.push(file);
    return this;
  }

  find() {
    for (const file of this.files) {
      readFile(file, 'utf8', (err, content) => {
        if (err) {
          return this.emit('error', err);
        }
        this.emit('fileread', file);

        const match = content.match(this.regex);
        if (match) {
          match.forEach((elem) => this.emit('found', file, elem));
        }
      });
    }
    return this;
  }
}

class FindRegexSync extends FindRegex {
  constructor(regex) {
    super(regex);
  }

  find() {
    for (const file of this.files) {
      let content;
      try {
        content = readFileSync(file, 'utf8');
      } catch (e) {
        this.emit('error', err);
      }

      this.emit('fileread', file);
      const match = content.match(this.regex);
      if (match) {
        match.forEach((elem) => this.emit('found', file, elem));
      }
    }
    return this;
  }
}

const findRegexInstance = new FindRegex(/function/gm);
findRegexInstance
  .addFile('eventemitter.js')
  .find()
  .on('found', (file, match) =>
    console.log(`Matched "${match}" in file ${file}`)
  );

const findRegexSyncInstance = new FindRegexSync(/function/gm);
findRegexSyncInstance
  .addFile('eventemitter.js')
  .on('found', (file, match) => console.log(`[Before] Matched "${match}"`))
  .find()
  .on('found', (file, match) => console.log(`[After] Matched "${match}"`));

glob('../ch02/*.js', (err, files) => {
  if (err) {
    return console.error(err);
  }
  console.log(`All files found: ${JSON.stringify(files)}`);
}).on('match', (match) => console.log(`Match found: ${match}`));
