/**
 * Extracts button elements from the page.
 * @param {import('puppeteer').Page} page 
 * @returns {Promise<Array>} Array of button objects.
 */
export async function extractButtons(page) {
  return await page.evaluate(() => {
    const buttons = [];
    const elements = document.querySelectorAll('button, input[type="button"], input[type="submit"], input[type="reset"]');
    
    elements.forEach(el => {
      let text = el.innerText || el.textContent;
      if (el.tagName.toLowerCase() === 'input') {
        text = el.value || text;
      }
      
      const btnData = {
        tag: el.tagName.toLowerCase(),
        id: el.id || null,
        name: el.name || null,
        type: el.type || null,
        text: text ? text.trim() : null,
        value: el.value || null,
        onclick: el.getAttribute('onclick') || null,
        className: el.className || null,
        disabled: el.disabled || false
      };
      
      buttons.push(btnData);
    });
    
    return buttons;
  });
}
