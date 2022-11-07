const path = require("path");
const fs = require("fs/promises");

const oldFolder = path.resolve(__dirname, "files");
const newFoldet = path.resolve(__dirname, "files-copy");

copyDir(oldFolder, newFoldet);

async function copyDir(oldFolder, newFoldet) {
  try {
    await fs.rm(newFoldet, { recursive: true });
    await makeCopy(oldFolder, newFoldet);
  } catch (e) {
    await copy(oldFolder, newFoldet);
  }
}

async function copy(oldFolder, newFoldet) {
  await fs.mkdir(newFoldet);

  const files = await fs.readdir(oldFolder, { withFileTypes: true });

  if (files.length) {
    await copyFiles(files, oldFolder, newFoldet);
  }
}

async function copyFiles(files, oldFolder, newFoldet) {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const isDirectory = file.isDirectory();

    const oldFolderPath = path.join(oldFolder, file.name);
    const toPath = path.join(newFoldet, file.name);

    if (!isDirectory) {
      await fs.copyFile(oldFolderPath, toPath);
    } else {
      await copyDir(oldFolderPath, toPath);
    }
  }
}
