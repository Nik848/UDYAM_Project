/**
 * Extracts form fields and their associated labels and attributes.
 * @param {import('puppeteer').Page} page 
 * @returns {Promise<Array>} Array of field objects.
 */
export async function extractFields(page) {
  return await page.evaluate(() => {
    const fields = [];
    const elements = document.querySelectorAll('input:not([type="button"]):not([type="submit"]):not([type="image"]), textarea, select');
    
    function findLabelFor(element) {
      if (element.id) {
        const label = document.querySelector(`label[for="${element.id}"]`);
        if (label) return label.innerText.trim();
      }
      
      const parentLabel = element.closest('label');
      if (parentLabel) {
        const clone = parentLabel.cloneNode(true);
        const inputs = clone.querySelectorAll('input, select, textarea');
        inputs.forEach(i => i.remove());
        return clone.innerText.trim();
      }
      
      let prev = element.previousSibling;
      while (prev) {
        if (prev.nodeType === Node.TEXT_NODE && prev.textContent.trim()) {
          return prev.textContent.trim();
        }
        if (prev.nodeType === Node.ELEMENT_NODE) {
          const tagName = prev.tagName.toLowerCase();
          if (['b', 'strong', 'label', 'span', 'legend'].includes(tagName) && prev.innerText.trim()) {
            return prev.innerText.trim();
          }
        }
        prev = prev.previousSibling;
      }
      
      let parent = element.parentElement;
      if (parent) {
        let parentPrev = parent.previousElementSibling;
        if (parentPrev) {
          const text = parentPrev.innerText || parentPrev.textContent;
          if (text && text.trim()) return text.trim();
        }
      }
      
      return null;
    }
    
    function getValidationAttributes(element) {
      const attrs = {};
      for (const attr of element.attributes) {
        if (attr.name.startsWith('data-val') || attr.name === 'required' || attr.name === 'pattern') {
          attrs[attr.name] = attr.value;
        }
      }
      return attrs;
    }

    function getAssociatedValidators(element) {
      const validators = [];
      if (!element.id) return validators;
      const allValidators = document.querySelectorAll('span[controltovalidate], span[data-val-controltovalidate]');
      for (const val of allValidators) {
        if (val.getAttribute('controltovalidate') === element.id || val.getAttribute('data-val-controltovalidate') === element.id) {
          validators.push(val.id);
        }
      }
      return validators;
    }
    
    function getDataAttributes(element) {
      const dataAttrs = {};
      for (const attr of element.attributes) {
        if (attr.name.startsWith('data-') && !attr.name.startsWith('data-val')) {
          dataAttrs[attr.name] = attr.value;
        }
      }
      return dataAttrs;
    }

    elements.forEach(el => {
      const isHidden = el.type === 'hidden';
      const label = isHidden ? null : findLabelFor(el);
      
      let options = null;
      if (el.tagName.toLowerCase() === 'select') {
        options = Array.from(el.options).map(opt => ({
          value: opt.value,
          text: opt.text,
          selected: opt.selected
        }));
      }
      
      const fieldData = {
        tag: el.tagName.toLowerCase(),
        id: el.id || null,
        name: el.name || null,
        type: el.type || null,
        label: label,
        placeholder: el.placeholder || null,
        value: el.value || null,
        autocomplete: el.autocomplete || null,
        tabindex: el.tabIndex !== -1 ? el.tabIndex : null,
        required: el.required || false,
        disabled: el.disabled || false,
        readonly: el.readOnly || false,
        maxlength: el.maxLength !== -1 ? el.maxLength : null,
        minlength: el.minLength !== -1 ? el.minLength : null,
        pattern: el.pattern || null,
        className: el.className || null,
        style: el.getAttribute('style') || null,
        title: el.title || null,
        ariaLabel: el.getAttribute('aria-label') || null,
        dataAttributes: getDataAttributes(el),
        validationAttributes: getValidationAttributes(el),
        associatedValidators: getAssociatedValidators(el)
      };
      
      if (options) fieldData.options = options;
      
      fields.push(fieldData);
    });
    
    return fields;
  });
}
