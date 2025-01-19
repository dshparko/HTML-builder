const fs = require('fs');
const readLine = require('readline');
const path = require('path');

const { stdin: input, stdout: output } = require('process');

const rl = readLine.Interface({ input, output });

const pathFile = path.resolve(__dirname, 'newFile.txt');

const writeStream = fs.createWriteStream(pathFile, 'utf-8');

writeStream.on('open', () => {
  console.log('Hello! Please, type a text: ');
});

rl.on('close', () => {
  writeStream.close();
});

writeStream.on('close', () => {
  console.log('\nBYE!');
  rl.close();
});

rl.on('line', (data) => {
  if (data.toLowerCase() === 'exit') {
    writeStream.close();
  } else {
    writeStream.write(data + '\n');
  }
});
