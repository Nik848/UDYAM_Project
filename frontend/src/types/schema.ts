export type RawFieldType =
  | 'text'
  | 'hidden'
  | 'checkbox'
  | 'radio'
  | 'button'
  | 'submit'
  | 'textarea'
  | 'select';

export interface RawField {
  tag: string;
  id: string | null;
  name: string | null;
  type: RawFieldType;
  label: string | null;
  placeholder: string | null;
  value: string | null;
  autocomplete: string | null;
  tabindex: number;
  required: boolean;
  disabled: boolean;
  readonly: boolean;
  maxlength: number | null;
  minlength: number | null;
  pattern: string | null;
  className: string | null;
  style: string | null;
  title: string | null;
  ariaLabel: string | null;
  dataAttributes: Record<string, string>;
  validationAttributes: Record<string, string>;
  associatedValidators: string[];
}

export interface RawButton {
  tag: string;
  id: string | null;
  name: string | null;
  type: string;
  text: string | null;
  value: string | null;
  onclick: string | null;
  className: string | null;
  disabled: boolean;
}

export interface RawSchema {
  metadata: {
    title: string;
    url: string;
    timestamp: string;
    totalForms: number;
  };
  steps: any[];
  fields: RawField[];
  buttons: RawButton[];
  validators: any[];
  scripts: any[];
}

export interface ParsedField {
  id: string;
  name: string;
  type: RawFieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  maxLength?: number;
  pattern?: string;
  className?: string;
  options?: { label: string; value: string }[];
}

export interface FormStep {
  id: string;
  title: string;
  fields: ParsedField[];
  submitButton?: RawButton;
}

export interface FormSchema {
  metadata: {
    title: string;
  };
  steps: FormStep[];
}
