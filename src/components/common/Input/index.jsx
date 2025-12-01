import React from "react";

const Input = ({
  id,
  name,
  type = "text",
  label,
  placeholder = "",
  value,
  onChange,
  required = false,
  error,
  className = "",
  inputClassName = "",
  labelClassName = "",
  errorClassName = "",
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
          error ? "border-red-500" : ""
        } ${inputClassName}`}
        {...props}
      />
      {error && (
        <p className={`mt-1 text-sm text-red-600 ${errorClassName}`}>{error}</p>
      )}
    </div>
  );
};

export default Input;
