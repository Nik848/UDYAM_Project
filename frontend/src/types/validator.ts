export type ValidatorType = 
  | 'RequiredFieldValidatorEvaluateIsValid' 
  | 'RegularExpressionValidatorEvaluateIsValid' 
  | 'CustomValidatorEvaluateIsValid';

export interface RawValidator {
  id: string;
  type: ValidatorType;
  targetControl: string | null;
  errorMessage: string;
  validationGroup: string | null;
  validationExpression: string | null;
  initialValue: string | null;
  evaluationFunction: string;
}

export type ValidationRuleFn = (value: string | boolean) => string | null;

export interface ValidationRule {
  id: string;
  targetFieldId: string;
  type: ValidatorType;
  errorMessage: string;
  validate: ValidationRuleFn;
}

export interface FieldValidationRules {
  [fieldId: string]: ValidationRule[];
}
