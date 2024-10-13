import puppeteer from "puppeteer-core";
import chromium from '@sparticuz/chromium'

chromium.setGraphicsMode = false

export async function getWebsiteText(url: string) {  
  const executablePath = await chromium.executablePath();  

  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: executablePath,
    headless: true,
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
