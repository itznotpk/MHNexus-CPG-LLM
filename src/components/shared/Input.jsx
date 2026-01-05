import React from 'react';

export function Input({
  label,
  id,
  type = 'text',
  error,
  helper,
  className = '',
  ...props
}) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        className={`
          w-full px-4 py-2.5
          bg-white/50 backdrop-blur-sm
          border ${error ? 'border-red-400' : 'border-white/40'}
          rounded-xl
          text-slate-800
          placeholder-slate-400
          transition-all duration-200 ease-out
          focus:ring-2 focus:ring-primary-300 focus:border-primary-300
          hover:bg-white/60 hover:border-white/50 hover:shadow-md
        `}
        {...props}
      />
      {helper && !error && (
        <p className="text-xs text-slate-600">{helper}</p>
      )}
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}

export function TextArea({
  label,
  id,
  rows = 4,
  error,
  helper,
  className = '',
  ...props
}) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        className={`
          w-full px-4 py-3
          bg-white/50 backdrop-blur-sm
          border ${error ? 'border-red-400' : 'border-white/40'}
          rounded-xl
          text-slate-800
          placeholder-slate-400
          transition-all duration-200 ease-out
          focus:ring-2 focus:ring-primary-300 focus:border-primary-300
          hover:bg-white/60 hover:border-white/50 hover:shadow-md
          resize-none
        `}
        {...props}
      />
      {helper && !error && (
        <p className="text-xs text-slate-600">{helper}</p>
      )}
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}

export function Select({
  label,
  id,
  options = [],
  placeholder = 'Select...',
  error,
  className = '',
  ...props
}) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      )}
      <select
        id={id}
        className={`
          w-full px-4 py-2.5
          bg-white/50 backdrop-blur-sm
          border ${error ? 'border-red-400' : 'border-white/40'}
          rounded-xl
          text-slate-800
          transition-all duration-200 ease-out
          focus:ring-2 focus:ring-primary-300 focus:border-primary-300
          hover:bg-white/50 hover:border-white/50 hover:shadow-md
          cursor-pointer
        `}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
