/**
 * Extracts script tags, inline JS, external sources, and attempts to categorize them.
 * @param {import('puppeteer').Page} page 
 * @returns {Promise<Array>} Array of script objects.
 */
export async function extractScripts(page) {
  return await page.evaluate(() => {
    const scripts = [];
    const elements = document.querySelectorAll('script');
    
    elements.forEach((el, index) => {
      const src = el.getAttribute('src');
      const content = el.innerText || el.textContent;
      
      const scriptData = {
        id: el.id || `script_${index}`,
        src: src || null,
        type: el.type || 'text/javascript',
        isInline: !src,
        content: content ? content.trim() : null,
        categories: []
      };
      
      if (scriptData.content) {
        const lowerContent = scriptData.content.toLowerCase();
        
        if (lowerContent.includes('webform_dopostbackwithoptions') || lowerContent.includes('__dopostback')) {
          scriptData.categories.push('postback');
        }
        
        if (lowerContent.includes('validator') || lowerContent.includes('page_clientvalidate') || lowerContent.includes('page_validators')) {
          scriptData.categories.push('validation');
        }
        
        if (lowerContent.includes('otp')) {
          scriptData.categories.push('otp');
        }
        
        if (lowerContent.includes('pan')) {
          scriptData.categories.push('pan');
        }
        
        const functionRegex = /function\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*\(/g;
        let match;
        const functions = [];
        while ((match = functionRegex.exec(scriptData.content)) !== null) {
          functions.push(match[1]);
        }
        if (functions.length > 0) {
          scriptData.functions = functions;
        }
      }
      
      scripts.push(scriptData);
    });
    
    return scripts;
  });
}
