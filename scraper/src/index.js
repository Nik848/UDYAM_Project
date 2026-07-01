import path from 'path';
import { fileURLToPath } from 'url';
import { launchBrowser, createPage, closeBrowser } from './browser.js';
import { extractStructure } from './extractStructure.js';
import { extractFields } from './extractFields.js';
import { extractButtons } from './extractButtons.js';
import { extractValidators } from './extractValidators.js';
import { extractScripts } from './extractScripts.js';
import { saveSchema } from './saveSchema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_DIR = path.join(__dirname, '../output');
const TARGET_URL = 'https://udyamregistration.gov.in/UdyamRegistration.aspx';

async function extractEvents(page) {
  return await page.evaluate(() => {
    const events = [];
    const elements = document.querySelectorAll('*');
    const eventAttrs = ['onclick', 'onchange', 'onkeyup', 'onblur', 'onfocus', 'oninput'];
    
    elements.forEach(el => {
      eventAttrs.forEach(attr => {
        if (el.hasAttribute(attr)) {
          events.push({
            id: el.id || null,
            tag: el.tagName.toLowerCase(),
            event: attr,
            handler: el.getAttribute(attr)
          });
        }
      });
    });
    return events;
  });
}

async function scrapeUdyamPortal() {
  let browser;
  try {
    browser = await launchBrowser();
    const page = await createPage(browser, TARGET_URL);
    
    console.log('Extracting page information...');
    const title = await page.title();
    const url = page.url();
    const totalForms = await page.evaluate(() => document.forms.length);
    const html = await page.content();
    
    console.log('Extracting UI structure...');
    const structure = await extractStructure(page);
    
    console.log('Extracting form fields...');
    const fields = await extractFields(page);
    
    console.log('Extracting buttons...');
    const buttons = await extractButtons(page);
    
    console.log('Extracting validators...');
    const validators = await extractValidators(page);
    
    console.log('Extracting scripts...');
    const scripts = await extractScripts(page);
    
    console.log('Extracting events...');
    const events = await extractEvents(page);
    
    const extractedData = {
      title,
      url,
      totalForms,
      structure,
      fields,
      buttons,
      validators,
      scripts,
      events
    };
    
    console.log('Saving Step 1 schema...');
    await saveSchema(OUTPUT_DIR, extractedData, html);
    
    console.log('--- Step 2 (PAN Validation) Check ---');
    console.log('Checking if Step 2 PAN fields are pre-rendered in the DOM as hidden elements...');
    
    const hasPanField = await page.evaluate(() => {
      return !!document.querySelector('input[id*="PAN"], input[name*="PAN"], select[id*="PAN"]');
    });
    
    if (hasPanField) {
      console.log('PAN fields found in the current DOM (likely hidden). The schema already includes Step 2 elements.');
    } else {
      console.log('PAN fields are NOT present in the DOM. Server-side postback with valid Aadhaar/OTP is required to load Step 2.');
      console.log('Automated navigation to Step 2 is not possible without test credentials.');
    }
    
    console.log('Scraping completed successfully.');
    
  } catch (error) {
    console.error('Error during scraping:', error);
  } finally {
    await closeBrowser(browser);
  }
}

scrapeUdyamPortal();
