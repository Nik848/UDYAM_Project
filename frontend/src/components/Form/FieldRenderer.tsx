import React from 'react';
import type { ParsedField } from '../../types/schema';
import { InputField } from '../fields/InputField';
import { CheckboxField } from '../fields/CheckboxField';

interface FieldRendererProps {
  field: ParsedField;
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({ field }) => {
  switch (field.type) {
    case 'text':
    case 'textarea': // fallback textarea to text input if we don't have TextareaField
      return <InputField field={field} />;
    case 'checkbox':
      return <CheckboxField field={field} />;
    case 'radio':
      // Fallback for radio if RadioField is not implemented yet
      return <InputField field={field} />;
    case 'select':
      // Fallback for select if SelectField is not implemented yet
      return <InputField field={field} />;
    case 'hidden':
    case 'button':
    case 'submit':
      return null;
    default:
      console.warn(`Unsupported field type: ${field.type}`);
      return null;
  }
};
