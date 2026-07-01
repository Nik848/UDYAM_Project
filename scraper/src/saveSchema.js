import fs from 'fs-extra';
import path from 'path';

/**
 * Saves the extracted data to the output directory.
 * @param {string} outputDir 
 * @param {Object} data 
 * @param {string} html 
 */
export async function saveSchema(outputDir, data, html) {
  try {
    // Ensure output directory exists
    await fs.ensureDir(outputDir);
    
    // Save raw HTML
    if (html) {
      await fs.writeFile(path.join(outputDir, 'page.html'), html, 'utf8');
      console.log('Saved page.html');
    }
    
    // Save full schema
    const schema = {
      metadata: {
        title: data.title,
        url: data.url,
        timestamp: new Date().toISOString(),
        totalForms: data.totalForms
      },
      steps: data.structure || [],
      fields: data.fields || [],
      buttons: data.buttons || [],
      validators: data.validators || [],
      scripts: data.scripts || [],
      events: data.events || []
    };
    
    await fs.writeJson(path.join(outputDir, 'schema.json'), schema, { spaces: 2 });
    console.log('Saved schema.json');
    
    // Save separate validators JSON
    if (data.validators) {
      await fs.writeJson(path.join(outputDir, 'validators.json'), data.validators, { spaces: 2 });
      console.log('Saved validators.json');
    }
    
    // Save separate scripts JSON
    if (data.scripts) {
      await fs.writeJson(path.join(outputDir, 'scripts.json'), data.scripts, { spaces: 2 });
      console.log('Saved scripts.json');
    }
    
  } catch (error) {
    console.error('Error saving schema:', error);
  }
}
