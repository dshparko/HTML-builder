const path = require("path");
const fs = require("fs");

const oldFolder = path.resolve(__dirname, "styles");
const newFile = path.join(__dirname, "project-dist", "bundle.css");

mergeStyles(oldFolder, newFile);

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
