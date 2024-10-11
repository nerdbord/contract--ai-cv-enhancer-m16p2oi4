import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

chromium.setHeadlessMode = true;
chromium.setGraphicsMode = false;

export async function getWebsiteText(url: string) {
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath:
      process.env.CHROME_EXECUTABLE_PATH || (await chromium.executablePath()),
    headless: chromium.headless == "new" ? true : "shell",
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

  return extractedText;
}
