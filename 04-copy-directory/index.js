const path = require("path");
const fs = require("fs/promises");

const oldFolder = path.resolve(__dirname, "files");
const newFolder = path.resolve(__dirname, "files-copy");

copyDir(oldFolder, newFolder);

async function copyDir(oldFolder, newFolder) {
  try {
    await fs.rm(newFolder, { recursive: true });
    await makeCopy(oldFolder, newFolder);
  } catch (e) {
    await copy(oldFolder, newFolder);
  }
}

async function copy(oldFolder, newFolder) {
  await fs.mkdir(newFolder);

  const files = await fs.readdir(oldFolder, { withFileTypes: true });

  if (files.length) {
    await copyFiles(files, oldFolder, newFolder);
  }
}

async function copyFiles(files, oldFolder, newFolder) {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const isDirectory = file.isDirectory();

    const oldFolderPath = path.join(oldFolder, file.name);
    const toPath = path.join(newFolder, file.name);

    if (!isDirectory) {
      await fs.copyFile(oldFolderPath, toPath);
    } else {
      await copyDir(oldFolderPath, toPath);
    }
  }
}
