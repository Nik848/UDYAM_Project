import { useFormContext } from '../context/FormContext';

export const useFormState = (fieldId: string) => {
  const { formState, setFieldValue, setFieldTouched } = useFormContext();

  const value = formState.values[fieldId] !== undefined ? formState.values[fieldId] : '';
  const error = formState.errors[fieldId];
  const touched = formState.touched[fieldId] || false;

  const handleChange = (newValue: string | boolean) => {
    setFieldValue(fieldId, newValue);
    // Optionally trigger validation on change here, or let useDynamicValidation handle it
  };

  const handleBlur = () => {
    setFieldTouched(fieldId, true);
  };

  return {
    value,
    error,
    touched,
    handleChange,
    handleBlur,
  };
};
