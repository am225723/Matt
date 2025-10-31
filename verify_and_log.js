
import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const consoleMessages = [];

  page.on('console', msg => {
    consoleMessages.push(msg.text());
  });

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  if (consoleMessages.length > 0) {
    console.log('Console logs:');
    consoleMessages.forEach(msg => console.log(msg));
  } else {
    console.log('No console messages found.');
  }

  await browser.close();
})();
