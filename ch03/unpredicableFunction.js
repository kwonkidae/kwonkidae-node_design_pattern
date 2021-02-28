import { readFile } from 'fs';
const cache = new Map();

function inconsistentRead(filename, cb) {
  if (cache.has(filename)) {
    console.log('has cache');
    process.nextTick(() => {
      cb(cache.get(filename));
    });
  } else {
    readFile(filename, 'utf8', (err, data) => {
      cache.set(filename, data);
      cb(data);
    });
  }
}

function createReadFile(filename) {
  const listeners = [];
  inconsistentRead(filename, (value) => {
    listeners.forEach((listener) => listener(value));
  });

  return {
    onDataReady: (listener) => listeners.push(listener),
  };
}

const reader1 = createReadFile('unpredicableFunction.js');
reader1.onDataReady((data) => {
  console.log(`First call data`);
  const reader2 = createReadFile('unpredicableFunction.js');
  reader2.onDataReady((data) => {
    console.log(`Second Call data`);
  });
});

function readJSONThrows(filename, callback) {
  readFile(filename, 'utf8', (err, data) => {
    if (err) {
      return callback(err);
    }
    callback(null, JSON.parse(data));
  });
}
try {
  readJSONThrows('unpredicableFunction.js', (err) => console.log(err));
} catch (e) {
  console.log('catch e');
}

process.on('uncaughtException', (err) => {
  console.error(
    `This will catch at last the JSON parsing exception:${err.message}`
  );
  process.exit(1);
});
