const fs = require("fs");
const path = require("path");
const fsPromises = require("fs/promises");

createPage();

function createPage() {
  createDist().then((distPath) => {
    createIndexHTML(distPath).then(() => {
      const oldFolder = path.resolve(__dirname, "assets");
      const newFolder = path.resolve(__dirname, "project-dist", "assets");

      copyDir(oldFolder, newFolder).then(() => {
        const oldFolder = path.resolve(__dirname, "styles");
        const newFolder = path.resolve(__dirname, "project-dist", "style.css");

        mergeStyles(oldFolder, newFolder);
      });
    });
  });
}

async function createDist() {
  const distPath = path.resolve(__dirname, "project-dist");

  await fsPromises.mkdir(distPath, { recursive: true });

  return distPath;
}

async function createIndexHTML(distPath) {
  const indexPath = path.join(distPath, "index.html");

  await fsPromises.writeFile(indexPath, "");

  const template = await getTemplate();

  let result = {
    template: "",
  };

  for (let i = 0; i < template.length; i++) {
    const chunk = template[i];

    if (chunk.includes("}}")) {
      await replaceComponent(result, chunk);
    } else {
      result.template += chunk;
    }
  }

  await fsPromises.appendFile(indexPath, result.template);
}

async function replaceComponent(result, chunk) {
  let arr = chunk.split("}}");

  const name = arr[0];
  const end = arr.slice(1);

  const component = path.resolve(__dirname, "components", name + ".html");

  const componentContent = await fsPromises.readFile(component);

  result.template += componentContent.toString();
  result.template += end;
}

async function getTemplate() {
  const templatePath = path.resolve(__dirname, "template.html");

  const template = await fsPromises.readFile(templatePath, {
    encoding: "utf-8",
  });

  const arr = template.split("{{");

  return arr;
}

async function copyDir(oldFolder, newFolder) {
  try {
    await fsPromises.rm(newFolder, { recursive: true });
    await copy(oldFolder, newFolder);
  } catch (e) {
    await copy(oldFolder, newFolder);
  }
}

async function copy(oldFolder, newFolder) {
  await fsPromises.mkdir(newFolder);

  const files = await fsPromises.readdir(oldFolder, { withFileTypes: true });

  if (files.length) {
    await copyFiles(files, oldFolder, newFolder);
  }
}

async function copyFiles(files, oldFolder, newFolder) {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const isDirectory = file.isDirectory();

    const fromPath = path.join(oldFolder, file.name);
    const toPath = path.join(newFolder, file.name);

    if (!isDirectory) {
      await fsPromises.copyFile(fromPath, toPath);
    } else {
      await copyDir(fromPath, toPath);
    }
  }
}

function mergeStyles(oldFolder, newFile) {
  fs.writeFile(newFile, "", (err) => {
    if (err) {
      return err;
    }
  });

  fs.readdir(oldFolder, { withFileTypes: true }, (err, files) => {
    if (err) {
      return err;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const isCssFile = !file.isDirectory() && file.name.match(/\.css$/);

      if (isCssFile) {
        const fStream = fs.createReadStream(path.join(oldFolder, file.name));

        fStream.on("data", (data) => {
          fs.appendFile(newFile, data.toString(), (err) => {
            if (err) {
              return err;
            }
          });
        });
      }
    }
  });
}
