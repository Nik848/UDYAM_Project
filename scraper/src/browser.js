import puppeteer from 'puppeteer';

/**
 * Launches the Puppeteer browser instance.
 * @returns {Promise<import('puppeteer').Browser>}
 */
export async function launchBrowser() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  return browser;
}

/**
 * Creates a new page, navigates to the URL, and waits for rendering.
 * @param {import('puppeteer').Browser} browser 
 * @param {string} url 
 * @returns {Promise<import('puppeteer').Page>}
 */
export async function createPage(browser, url) {
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1280, height: 800 });

  console.log(`Navigating to ${url}...`);
  // Wait until networkidle2 as requested
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  
  console.log('Waiting an additional 3 seconds for rendering...');
  // Wait another 3 seconds before scraping
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  return page;
}

/**
 * Gracefully closes the browser.
 * @param {import('puppeteer').Browser} browser 
 */
export async function closeBrowser(browser) {
  if (browser) {
    console.log('Closing browser...');
    await browser.close();
  }
}
