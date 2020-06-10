#!/usr/bin/env node

//imports
require("../globals");
const path = require("path");
const fs = require("fs");
const puppeteer = require("puppeteer-core");
const parseArgs = require("minimist");
const help = require("../lib/help");
const { checkPath, checkWidth, open } = require("../lib/helpers");

console.log(path.resolve("./output/ascii-art.txt"));
// non scope constants
const args = parseArgs(process.argv.slice(2), {
  unknown: (arg) => false,
  boolean: ["colors", "help"],
  string: ["width", "path", "output"],
  default: { width: "80" },
  alias: { c: "colors", w: "width", p: "path", o: "output", h: "help" },
});
const link = "https://manytools.org/hacker-tools/convert-images-to-ascii-art/";
const chromePath = path.resolve(CHROME_PATH);

// help
if (args.help) {
  help();
}

//console.log(path.resolve('../m'))
console.log("checking image path..");
checkPath({ path: args.path, type: "image" });
console.log("checking image path done");
if (args.output) {
  console.log("checking output path..");
  checkPath({
    path: args.output.substring(0, args.output.lastIndexOf("/") + 1),
    type: "output",
  });
  console.log("checking output path done");
}
console.log("checking width..");
checkWidth(args.width);
console.log("checking width done");

(async () => {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
  });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(500000);
  page.setDefaultTimeout(500000);
  await page.goto(link);
  await page._client.send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath: path.resolve(DEFAULT_OUTPUT_DIR),
  });

  // upload the image in the file field
  console.log("uploading image..");
  await page.waitForSelector("#Form_go_ImgUpload");
  const imageInput = await page.$('input[type="file"][name="ImgUpload"]');
  await imageInput.uploadFile(path.resolve(args.path));
  console.log("uploading image done");

  // type the defined width (default: 80)
  console.log("setting width..");
  const widthInput = await page.$('input[type="text"][name="Width"]');
  await widthInput.click({ clickCount: 3 });
  await widthInput.type(parseInt(args.width).toString());
  console.log("setting width done");

  // check 'use colors' if -c or --colors exists
  if (args.colors) {
    console.log("selecting use colors..");
    const colorsInput = await page.$('input[type="checkbox"][name="UseColor"]');
    await colorsInput.click();
    console.log("selecting use colors done");
  }

  // submit
  console.log("submitting data..");
  const [coockiesDismiss] = await page.$x("//a[contains(., 'Got it!')]");
  await coockiesDismiss.click();
  const submitInput = await page.$(
    'input[type="submit"][name="action_Process"]'
  );
  await page.waitFor(3000);
  await submitInput.click();
  await page.waitForSelector("#acii_ansi_holder", {
    visible: true,
  });
  console.log("submitting data done");

  // download
  console.log("exporting results..");
  const downloadInput = await page.$(
    'input[type="submit"][value="Download ASCII (.txt)"]'
  );
  await downloadInput.click();
  await page.waitFor(15000);
  if (args.output) {
    await fs.rename(
      path.resolve(DEFAULT_OUTPUT_DIR + "/ascii-art.txt"),
      path.resolve(args.output),
      (err) => {}
    );
  }
  await browser.close();
  console.log("exporting results done");

  const filePath = args.output
  ? path.resolve(args.output)
  : path.resolve(DEFAULT_OUTPUT_DIR + "/ascii-art.txt");
  console.log("openning the file :" + filePath);
  open(filePath);
})();
