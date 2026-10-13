const fs = require('fs');
const path = require('path');

const sampleDir = path.join(__dirname, 'sample-files');
const sampleFile = path.join(sampleDir, 'sample.txt');
const message = 'Hello, async world!';

// Create the directory and file programmatically
fs.mkdirSync(sampleDir, { recursive: true });
fs.writeFileSync(sampleFile, message);

// Callback pattern
fs.readFile(sampleFile, 'utf8', (err, data) => {
  if (err) {
    console.error('Callback error:', err);
    return;
  }

  console.log('Callback:', data);

  // Promise pattern
  fs.promises
    .readFile(sampleFile, 'utf8')
    .then((data) => {
      console.log('Promise:', data);

      // Async/await pattern
      return readWithAsyncAwait();
    })
    .catch((err) => {
      console.error('Promise error:', err);
    });
});

// Promise converted to async/await
async function readWithAsyncAwait() {
  try {
    const data = await fs.promises.readFile(sampleFile, 'utf8');
    console.log('Async/Await:', data);
  } catch (err) {
    console.error('Async/Await error:', err);
  }
}

/*
  Callback hell can happen when many asynchronous callbacks
  are nested inside each other. Promises and async/await
  make asynchronous code easier to read and manage.
*/