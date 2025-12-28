import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error, label, className = '', ...props }, ref) => (
    <div className="w-full">
      {label && <label className="block body-small font-semibold mb-md text-primary">{label}</label>}
      <input ref={ref} className={`input ${error ? 'input-error' : ''} ${className}`.trim()} {...props} />
      {error && <p className="text-danger text-sm mt-sm">{error}</p>}
    </div>
  )
);

Input.displayName = 'Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, label, className = '', ...props }, ref) => (
    <div className="w-full">
      {label && <label className="block body-small font-semibold mb-md text-primary">{label}</label>}
      <textarea ref={ref} className={`input ${error ? 'input-error' : ''} ${className}`.trim()} {...props} />
      {error && <p className="text-danger text-sm mt-sm">{error}</p>}
    </div>
  )
);

Textarea.displayName = 'Textarea';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  label?: string;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ error, label, options, className = '', ...props }, ref) => (
    <div className="w-full">
      {label && <label className="block body-small font-semibold mb-md text-primary">{label}</label>}
      <select ref={ref} className={`input ${error ? 'input-error' : ''} ${className}`.trim()} {...props}>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-danger text-sm mt-sm">{error}</p>}
    </div>
  )
);

Select.displayName = 'Select';
