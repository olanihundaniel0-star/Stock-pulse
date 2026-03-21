import React from 'react';
import { UseFormRegisterReturn, FieldError } from 'react-hook-form';

interface InputFieldProps {
  label: string;
  placeholder?: string;
  type?: string;
  error?: FieldError;
  register: UseFormRegisterReturn;
  disabled?: boolean;
  autoComplete?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  type = 'text',
  error,
  register,
  disabled = false,
  autoComplete,
}) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <input
        {...register}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        className={`w-full px-4 py-2.5 border rounded-lg font-normal transition-colors 
          ${
            error
              ? 'border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 bg-red-50'
              : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          }
          ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-900'}
        `}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <span>•</span>
          {error.message}
        </p>
      )}
    </div>
  );
};

export default InputField;
