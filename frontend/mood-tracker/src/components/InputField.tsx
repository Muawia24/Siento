import React from 'react';

interface InputFieldProps {
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function InputField({ icon, type, placeholder, value, onChange }: InputFieldProps) {
  return (
    <div>
      <label htmlFor={placeholder.toLowerCase()} className="sr-only">
        {placeholder}
      </label>
      <div className="relative">
        {icon}
        <input
          id={placeholder.toLowerCase()}
          type={type}
          required
          value={value}
          onChange={onChange}
          className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}