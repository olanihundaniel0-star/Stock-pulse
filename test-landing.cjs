const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(2000);
  
  // Click on 'Features' to show the about page
  const featuresLink = await page.locator('text=Features');
  if (await featuresLink.count() > 0) {
    await featuresLink.click();
    await page.waitForTimeout(2000);
  }
  
  await browser.close();
})();