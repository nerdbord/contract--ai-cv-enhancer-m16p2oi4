import puppeteer from "puppeteer-core";

export async function getWebsiteText(url: string) {
  console.log("Received URL: ", url);

  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_PATH,
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
  console.log("Extracted text: ", extractedText);

  return extractedText;
}
