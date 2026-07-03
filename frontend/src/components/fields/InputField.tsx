import React from 'react';
import { useFormState } from '../../hooks/useFormState';
import { useDynamicValidation } from '../../hooks/useDynamicValidation';
import type { ParsedField } from '../../types/schema';

interface InputFieldProps {
  field: ParsedField;
}

export const InputField: React.FC<InputFieldProps> = ({ field }) => {
  const { value, error, handleChange, handleBlur } = useFormState(field.id);
  const { validate } = useDynamicValidation(field.id);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    handleChange(val);
    validate(val);
  };

  const onBlur = () => {
    handleBlur();
    validate(value);
  };

  return (
    <div className="mb-4">
      {field.type === 'checkbox' ? (
        <div className="flex items-start mb-4">
          <input
            id={field.id}
            name={field.name}
            type="checkbox"
            className={`mt-1 mr-2 ${error ? 'border-red-500' : ''} ${field.className || ''}`}
            checked={!!value}
            onChange={(e) => {
              handleChange(e.target.checked);
              validate(e.target.checked);
            }}
            onBlur={onBlur}
          />
          <label htmlFor={field.id} className="text-sm text-gray-700">
            {field.label || 'I agree to the terms and conditions / declarations.'} {field.required && <span className="text-red-500">*</span>}
          </label>
        </div>
      ) : (
        <>
          {field.label && (
            <label
              htmlFor={field.id}
              className="block text-sm font-bold text-gray-700 mb-2"
            >
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
          )}
          <input
            id={field.id}
            name={field.name}
            type={field.type}
            className={`w-full px-4 py-2 border rounded-md shadow-sm text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
              error ? 'border-red-500' : 'border-gray-200'
            } ${field.className || ''}`}
            placeholder={field.placeholder}
            maxLength={field.maxLength}
            value={(value as string) || ''}
            onChange={onChange}
            onBlur={onBlur}
            aria-invalid={!!error}
            aria-describedby={error ? `${field.id}-error` : undefined}
          />
        </>
      )}
      {error && (
        <p id={`${field.id}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};
