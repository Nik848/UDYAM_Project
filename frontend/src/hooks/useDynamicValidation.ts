import { useEffect, useCallback } from 'react';
import { useFormContext } from '../context/FormContext';

export const useDynamicValidation = (fieldId: string) => {
  const { rules, formState, setFieldError } = useFormContext();
  const fieldRules = rules[fieldId] || [];

  const validate = useCallback((value: string | boolean) => {
    for (const rule of fieldRules) {
      const error = rule.validate(value);
      if (error) {
        setFieldError(fieldId, error);
        return false;
      }
    }
    setFieldError(fieldId, null);
    return true;
  }, [fieldRules, fieldId, setFieldError]);

  const value = formState.values[fieldId];
  const touched = formState.touched[fieldId];

  useEffect(() => {
    if (touched) {
      // Re-validate on change after touched
      validate(value !== undefined ? value : '');
    }
  }, [value, touched, validate]);

  return { validate };
};
