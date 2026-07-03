import type { RawValidator, FieldValidationRules } from '../types/validator';
import validatorsJson from '../schema/validators.json';

export class ValidationParser {
  private rawValidators: RawValidator[];

  constructor() {
    this.rawValidators = validatorsJson as RawValidator[];
  }

  public parse(): FieldValidationRules {
    const rules: FieldValidationRules = {};

    this.rawValidators.forEach((validator) => {
      // The target control often has "ctl00_ContentPlaceHolder1_" prefix in ASP.NET
      // We map it to the exact field ID. If targetControl is null (like CustomValidator), 
      // it might apply to a specific field or the whole form. 
      // For now, we will associate it with a specific field if we can infer, otherwise a generic form error.
      // In validators.json: CustomValidator3 is for Declarations. We'll link it to 'ctl00_ContentPlaceHolder1_chkDecarationA'
      
      let fieldId = validator.targetControl;
      if (!fieldId && validator.errorMessage.includes('Agree Declarations')) {
        fieldId = 'ctl00_ContentPlaceHolder1_chkDecarationA';
      }

      if (!fieldId) return; // Skip if we can't determine the target field

      if (!rules[fieldId]) {
        rules[fieldId] = [];
      }

      rules[fieldId].push({
        id: validator.id,
        targetFieldId: fieldId,
        type: validator.type,
        errorMessage: validator.errorMessage,
        validate: this.createValidationFunction(validator),
      });
    });

    return rules;
  }

  private createValidationFunction(validator: RawValidator): (value: string | boolean) => string | null {
    return (value: string | boolean) => {
      // Return error message if invalid, null if valid

      if (validator.type === 'RequiredFieldValidatorEvaluateIsValid') {
        if (typeof value === 'string') {
          if (!value || value.trim() === '') {
            return validator.errorMessage;
          }
        } else if (typeof value === 'boolean') {
          if (!value) return validator.errorMessage;
        } else if (value === null || value === undefined) {
          return validator.errorMessage;
        }
      }

      if (validator.type === 'RegularExpressionValidatorEvaluateIsValid' && validator.validationExpression) {
        const regex = new RegExp(validator.validationExpression);
        if (typeof value === 'string' && value && !regex.test(value)) {
          return validator.errorMessage;
        }
      }

      if (validator.type === 'CustomValidatorEvaluateIsValid') {
        // Special case for checkbox
        if (typeof value === 'boolean' && !value) {
          return validator.errorMessage;
        }
        if (typeof value === 'string' && (!value || value === 'false')) {
          return validator.errorMessage;
        }
      }

      return null; // Valid
    };
  }
}

export const validationParser = new ValidationParser();
