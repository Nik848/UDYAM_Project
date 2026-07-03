import React from 'react';
import { useFormState } from '../../hooks/useFormState';
import { useDynamicValidation } from '../../hooks/useDynamicValidation';
import type { ParsedField } from '../../types/schema';

interface CheckboxFieldProps {
  field: ParsedField;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({ field }) => {
  const { value, error, handleChange, handleBlur } = useFormState(field.id);
  const { validate } = useDynamicValidation(field.id);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.checked;
    handleChange(val);
    validate(val);
  };

  const onBlur = () => {
    handleBlur();
    validate(value);
  };

  return (
    <div className="mb-4">
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id={field.id}
            name={field.name}
            type="checkbox"
            checked={!!value}
            onChange={onChange}
            onBlur={onBlur}
            className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
            aria-invalid={!!error}
            aria-describedby={error ? `${field.id}-error` : undefined}
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor={field.id} className="font-medium text-gray-700">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
        </div>
      </div>
      {error && (
        <p id={`${field.id}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};
