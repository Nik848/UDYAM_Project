import type { RawSchema, RawField, FormSchema, FormStep, ParsedField } from '../types/schema';
import schemaJson from '../schema/schema.json';

export class SchemaParser {
  private rawSchema: RawSchema;

  constructor() {
    this.rawSchema = schemaJson as unknown as RawSchema;
  }

  public parse(): FormSchema {
    // Determine the visible fields (filter out hidden fields)
    const visibleFields = this.rawSchema.fields.filter(
      (field) => field.type !== 'hidden' && field.style?.includes('display: none;') !== true
    );

    // Group fields logically. 
    // In this specific schema, step 1 consists of aadhaar and name fields, 
    // step 2 can be empty or we can put the rest of the fields there, but as per assignment, 
    // Step 1: Aadhaar Number, Name of Entrepreneur, Validate & Generate OTP button.
    // Step 2: Not clearly defined in the schema, but we navigate to it. 
    // For now, let's put Aadhaar and Name in Step 1, and the checkboxes in Step 2.
    
    // We'll dynamically group them by identifying Step 1 elements.
    const step1Fields: ParsedField[] = [];
    const step2Fields: ParsedField[] = [];

    visibleFields.forEach((field) => {
      const parsedField = this.mapToParsedField(field);
      
      // Basic heuristic: Aadhaar, Name, and Declaration belong to step 1
      if (
        parsedField.id.includes('txtadharno') || 
        parsedField.id.includes('txtownername') ||
        parsedField.id.includes('chkDecarationA')
      ) {
        step1Fields.push(parsedField);
      } else {
        step2Fields.push(parsedField);
      }
    });

    const submitBtn = this.rawSchema.buttons.find(
      (btn) => btn.id === 'ctl00_ContentPlaceHolder1_btnValidateAadhaar' || btn.text?.includes('Validate')
    );

    const steps: FormStep[] = [
      {
        id: 'step1',
        title: 'Aadhaar Verification',
        fields: step1Fields,
        submitButton: submitBtn
      },
      {
        id: 'step2',
        title: 'Registration Details',
        fields: step2Fields
      }
    ];

    return {
      metadata: {
        title: this.rawSchema.metadata.title,
      },
      steps,
    };
  }

  private mapToParsedField(raw: RawField): ParsedField {
    return {
      id: raw.id || `field_${Math.random().toString(36).substring(7)}`,
      name: raw.name || raw.id || '',
      type: raw.type,
      label: raw.label || '',
      placeholder: raw.placeholder || undefined,
      required: raw.required,
      maxLength: raw.maxlength || undefined,
      pattern: raw.pattern || undefined,
      className: raw.className || undefined,
    };
  }
}

export const schemaParser = new SchemaParser();
