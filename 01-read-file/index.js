const fs = require('fs');
const path = require('path');
const process = require('process');

const fStream =  new fs.ReadStream(path.resolve(__dirname, 'text.txt'));

fStream.pipe(process.stdout);

fStream.close;