const fs = require("fs");
const exec = require("child_process").exec;

const checkWidth = (args) => {
  // check if the given string number is not valid
  if (args.width != undefined && (args.width != "" || isNaN(args.width))) {
    console.error("");
    console.error("width should be a numeric value");
    process.exit();
  }
};

const checkPath = ({ path, type }) => {
  try {
    // check if the given path is not valid
    if (!fs.existsSync(path)) {
      console.error("");
      console.error("incorrect " + type + " path");
      process.exit();
    } else if (type == "image") {
      // check if the selected file is not a valid image
      const exts = ["jpeg", "jpg", "gif", "png"];
      const ext = path.split(".");
      if (!exts.includes(ext[ext.length - 1])) {
        console.error("");
        console.error("selected file is not a valid images");
        process.exit();
      }
    }
  } catch (err) {
    console.error("");
    console.error(err);
    process.exit();
  }
};

const open = (filePath) => {
  let command = "xdg-open";
  switch (process.platform) {
    case "darwin":
      command = "open";
    case "win32":
      command = 'start ""';
    case "win64":
      command = 'start ""';
  }

  exec(`${command} "${filePath}"`);
};

module.exports = { checkPath, checkWidth, open };
