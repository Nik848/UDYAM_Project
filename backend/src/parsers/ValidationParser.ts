import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import { ValidationRule } from '../types';

export class ValidationParser {
  private validators: ValidationRule[] = [];

  constructor(validatorsPath: string) {
    this.loadValidators(validatorsPath);
  }

  private loadValidators(validatorsPath: string) {
    try {
      if (fs.existsSync(validatorsPath)) {
        const data = fs.readFileSync(validatorsPath, 'utf8');
        this.validators = JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading validators.json', error);
    }
  }

  public getZodSchemaForField(targetControl: string): z.ZodString | null {
    const fieldValidators = this.validators.filter(
      (v) => v.targetControl === targetControl
    );

    if (fieldValidators.length === 0) return null;

    let schema = z.string();

    for (const rule of fieldValidators) {
      if (rule.type === 'RequiredFieldValidatorEvaluateIsValid') {
        schema = schema.min(1, rule.errorMessage || 'This field is required');
      } else if (rule.type === 'RegularExpressionValidatorEvaluateIsValid') {
        if (rule.validationExpression) {
          schema = schema.regex(new RegExp(rule.validationExpression), rule.errorMessage || 'Invalid format');
        }
      }
      // Custom validators can be extended here
    }

    return schema;
  }

  public extendSchemaWithDynamicRules(schema: z.ZodObject<any, any>, mapping: Record<string, string>): z.ZodObject<any, any> {
    // mapping maps the request field name to the targetControl ID in the scraper output
    const shape = schema.shape;
    const newShape: Record<string, z.ZodTypeAny> = { ...shape };

    for (const [fieldName, targetControl] of Object.entries(mapping)) {
      const dynamicRule = this.getZodSchemaForField(targetControl);
      if (dynamicRule) {
        // Intersect or replace depending on strictness. Here we replace or apply on top.
        // For simplicity, we just use the dynamic rule if it's stronger, or combine it.
        // The simplest approach is to use zod's refine or just use dynamic rule.
        // Actually, replacing it is easier for dynamic override, but combining ensures both backend fixed rules and dynamic rules run.
        if (newShape[fieldName] && newShape[fieldName] instanceof z.ZodString) {
            newShape[fieldName] = (newShape[fieldName] as z.ZodString).and(dynamicRule);
        } else {
            newShape[fieldName] = dynamicRule;
        }
      }
    }

    return z.object(newShape);
  }
}

// Instantiate a singleton to use across the application
const validatorsFilePath = path.join(__dirname, '../../../../scraper/output/validators.json');
export const validationParser = new ValidationParser(validatorsFilePath);
