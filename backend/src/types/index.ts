export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface ApiErrorResponse {
  success: boolean;
  message: string;
  errors?: any[];
}

export interface ValidationRule {
  id: string;
  type: string;
  targetControl: string | null;
  errorMessage: string;
  validationGroup: string;
  validationExpression: string | null;
  initialValue: string | null;
  evaluationFunction: string;
}
