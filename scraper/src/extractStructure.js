/**
 * Extracts the structural hierarchy of the page focusing on sections, containers, forms, etc.
 * @param {import('puppeteer').Page} page 
 * @returns {Promise<Array>} A nested JSON representing the structure.
 */
export async function extractStructure(page) {
  return await page.evaluate(() => {
    function isStructuralNode(element) {
      if (!element || element.nodeType !== Node.ELEMENT_NODE) return false;
      const tagName = element.tagName.toLowerCase();
      if (['section', 'fieldset', 'form'].includes(tagName)) return true;
      
      const className = element.className;
      if (typeof className === 'string') {
        const classes = className.split(/\s+/);
        if (classes.some(c => ['container', 'container-fluid', 'form-group', 'card', 'panel'].includes(c))) {
          return true;
        }
      }
      return false;
    }

    function traverse(element) {
      const result = [];
      for (let i = 0; i < element.children.length; i++) {
        const child = element.children[i];
        if (isStructuralNode(child)) {
          const structData = {
            tag: child.tagName.toLowerCase(),
            id: child.id || null,
            className: child.className || null,
            children: traverse(child)
          };
          result.push(structData);
        } else {
          // If this node isn't structural, its structural descendants should be grouped here
          result.push(...traverse(child));
        }
      }
      return result;
    }

    return traverse(document.body);
  });
}
