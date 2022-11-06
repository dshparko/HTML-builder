const fs = require('fs');
const path = require('path');

const fStream =  new fs.ReadStream(path.resolve(__dirname, 'text.txt'));

fStream.pipe(process.stdout);