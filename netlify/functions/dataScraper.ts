import puppeteer from "puppeteer-core";
import chromium from "chrome-aws-lambda";

export async function getWebsiteText(url: string) {
  console.log("CHROME_PATH:", process.env.CHROME_PATH);
  console.log("Received URL: ", url);

  const executablePath = await chromium.executablePath;

  console.log("executablePath: ", executablePath);

  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: executablePath,
    headless: chromium.headless,
  });

  const page = await browser.newPage();
  await page.goto(url);
  const extractedText = await page.$eval("*", (el: Node) => {
    const selection = window.getSelection();
    if (selection) {
      const range = document.createRange();
      range.selectNode(el);
      selection.removeAllRanges();
      selection.addRange(range);
      return selection.toString();
    }
    return "";
  });

  await browser.close();
  console.log("Extracted text: ", extractedText);

  return extractedText;
}
