/**
 * Extracts ASP.NET WebForms validation elements and their configurations.
 * @param {import('puppeteer').Page} page 
 * @returns {Promise<Array>} Array of validator objects.
 */
export async function extractValidators(page) {
  return await page.evaluate(() => {
    const validators = [];
    
    // Extract from DOM elements
    const elements = document.querySelectorAll('span[controltovalidate], span[data-val-controltovalidate], div[data-valmsg-summary="true"], span[data-valmsg-for]');
    
    elements.forEach(el => {
      const isSummary = el.tagName.toLowerCase() === 'div' || el.getAttribute('data-valmsg-summary') === 'true';
      const isUnobtrusive = el.hasAttribute('data-valmsg-for');
      
      const valData = {
        id: el.id || null,
        type: isSummary ? 'ValidationSummary' : 'Validator',
        targetControl: el.getAttribute('controltovalidate') || el.getAttribute('data-val-controltovalidate') || el.getAttribute('data-valmsg-for') || null,
        errorMessage: el.getAttribute('errormessage') || el.getAttribute('data-val-errormessage') || el.innerText.trim() || null,
        validationGroup: el.getAttribute('validationgroup') || null,
        validationExpression: el.getAttribute('validationexpression') || el.getAttribute('data-val-regex-pattern') || null,
        initialValue: el.getAttribute('initialvalue') || null,
        evaluationFunction: el.getAttribute('evaluationfunction') || null,
        display: el.getAttribute('display') || null
      };
      
      if (!isSummary) {
        if (valData.validationExpression) {
          valData.type = 'RegularExpressionValidator';
        } else if (valData.initialValue !== null || el.getAttribute('data-val-required') || (isUnobtrusive && el.getAttribute('data-valmsg-replace') === 'true')) {
          valData.type = 'RequiredFieldValidator';
        } else if (el.getAttribute('controltocompare')) {
          valData.type = 'CompareValidator';
          valData.controlToCompare = el.getAttribute('controltocompare');
        } else if (el.getAttribute('maximumvalue') && el.getAttribute('minimumvalue')) {
          valData.type = 'RangeValidator';
        }
      }
      
      validators.push(valData);
    });
    
    // Try to extract from global Page_Validators if it exists
    if (typeof window.Page_Validators !== 'undefined') {
      window.Page_Validators.forEach(v => {
        const existing = validators.find(val => val.id === v.id);
        if (existing) {
          existing.evaluationFunction = v.evaluationfunction ? v.evaluationfunction.toString() : existing.evaluationFunction;
          // Refine type based on function name if possible
          if (v.evaluationfunction && v.evaluationfunction.name) {
             const funcName = v.evaluationfunction.name;
             if (funcName.includes('RequiredField')) existing.type = 'RequiredFieldValidator';
             if (funcName.includes('RegularExpression')) existing.type = 'RegularExpressionValidator';
             if (funcName.includes('Compare')) existing.type = 'CompareValidator';
             if (funcName.includes('Range')) existing.type = 'RangeValidator';
             if (funcName.includes('Custom')) existing.type = 'CustomValidator';
          }
        } else {
          validators.push({
            id: v.id || null,
            type: v.evaluationfunction && v.evaluationfunction.name ? v.evaluationfunction.name : 'Validator',
            targetControl: v.controltovalidate || null,
            errorMessage: v.errormessage || null,
            validationGroup: v.validationGroup || null,
            validationExpression: v.validationexpression || null,
            initialValue: v.initialvalue || null,
            evaluationFunction: v.evaluationfunction ? v.evaluationfunction.toString() : null
          });
        }
      });
    }

    return validators;
  });
}
