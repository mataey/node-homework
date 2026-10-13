const os = require('os');
const path = require('path');
const fs = require('fs');

const sampleDir = path.join(__dirname, 'sample-files');
const demoFile = path.join(sampleDir, 'demo.txt');
const largeFile = path.join(sampleDir, 'largefile.txt');

async function main() {
  // OS module
  console.log('Platform:', os.platform());
  console.log('CPU:', os.cpus()[0].model);
  console.log('Total Memory:', os.totalmem());

  // Path module
  const joinedPath = path.join(
    sampleDir,
    'folder',
    'file.txt'
  );
  console.log('Joined path:', joinedPath);

  // fs.promises
  await fs.promises.mkdir(sampleDir, { recursive: true });
  await fs.promises.writeFile(demoFile, 'Hello from fs.promises!');
  const data = await fs.promises.readFile(demoFile, 'utf8');
  console.log('fs.promises read:', data);

  // Create a large file programmatically
  const largeContent = 'This is a line in the large file.\n'.repeat(100);
  await fs.promises.writeFile(largeFile, largeContent);

  // Streams
  const readStream = fs.createReadStream(largeFile, {
    encoding: 'utf8',
    highWaterMark: 64
  });

  readStream.on('data', (chunk) => {
    console.log('Read chunk:', chunk);
  });

  readStream.on('end', () => {
    console.log('Finished reading large file with streams.');
  });

  readStream.on('error', (err) => {
    console.error('Stream error:', err);
  });
}

main().catch((err) => {
  console.error('Error:', err);
});