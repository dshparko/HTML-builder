const path = require('path');
const fsPromises = require('fs/promises');

const dirPath = path.resolve(__dirname, 'secret-folder');

getStat();

async function getStat(){
    const files = await fsPromises.readdir(dirPath,{withFileTypes: true});

    await getFilesInfo(files);
}

async function getFilesInfo (files) {
    for (let i = 0; i < files.length; i++) {
        let file = files[i];
        let isDirectory = file.isDirectory();

        if (!isDirectory) {
            let ext = path.extname(file.name).slice(1);
            let basename = path.basename(file.name, '.' + ext);
            let stat = await fsPromises.stat(path.join(dirPath, file.name));
            let size = stat.size / 1000 + 'kb';

            console.log(`${basename} - ${ext} - ${size}`);
        }
    }
}