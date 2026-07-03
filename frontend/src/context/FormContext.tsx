import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { FormSchema } from '../types/schema';
import type { FieldValidationRules } from '../types/validator';
import { schemaParser } from '../parser/SchemaParser';
import { validationParser } from '../parser/ValidationParser';

interface FormState {
  values: Record<string, string | boolean>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

interface LoggedInUser {
  id: string;
  aadhaarNumber: string;
  entrepreneurName: string;
  username: string;
  panNumber: string;
  typeOfEnterprise: string;
  typeOfOrganization: string;
  businessName: string;
  mobileNumber: string;
  email: string;
  state: string;
  district: string;
  pinCode: string;
  [key: string]: any;
}

interface FormContextType {
  schema: FormSchema;
  rules: FieldValidationRules;
  currentStepIndex: number;
  formState: FormState;
  setFieldValue: (fieldId: string, value: string | boolean) => void;
  setFieldError: (fieldId: string, error: string | null) => void;
  setFieldTouched: (fieldId: string, isTouched?: boolean) => void;
  nextStep: () => void;
  prevStep: () => void;
  setCurrentStepIndex: (index: number) => void;
  loggedInUser: LoggedInUser | null;
  setLoggedInUser: (user: LoggedInUser | null) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [schema] = useState<FormSchema>(() => schemaParser.parse());
  const [rules] = useState<FieldValidationRules>(() => validationParser.parse());
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [loggedInUser, setLoggedInUser] = useState<LoggedInUser | null>(null);
  
  const [formState, setFormState] = useState<FormState>({
    values: {},
    errors: {},
    touched: {},
  });

  const setFieldValue = useCallback((fieldId: string, value: string | boolean) => {
    setFormState((prev) => ({
      ...prev,
      values: { ...prev.values, [fieldId]: value },
    }));
  }, []);

  const setFieldError = useCallback((fieldId: string, error: string | null) => {
    setFormState((prev) => {
      if (prev.errors[fieldId] === error || (!prev.errors[fieldId] && !error)) {
        return prev;
      }
      const newErrors = { ...prev.errors };
      if (error) {
        newErrors[fieldId] = error;
      } else {
        delete newErrors[fieldId];
      }
      return { ...prev, errors: newErrors };
    });
  }, []);

  const setFieldTouched = useCallback((fieldId: string, isTouched = true) => {
    setFormState((prev) => {
      if (prev.touched[fieldId] === isTouched) return prev;
      return {
        ...prev,
        touched: { ...prev.touched, [fieldId]: isTouched },
      };
    });
  }, []);

  const nextStep = useCallback(() => {
    if (currentStepIndex < schema.steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  }, [currentStepIndex, schema.steps.length]);

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  }, [currentStepIndex]);

  return (
    <FormContext.Provider
      value={{
        schema,
        rules,
        currentStepIndex,
        formState,
        setFieldValue,
        setFieldError,
        setFieldTouched,
        nextStep,
        prevStep,
        setCurrentStepIndex,
        loggedInUser,
        setLoggedInUser,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};
