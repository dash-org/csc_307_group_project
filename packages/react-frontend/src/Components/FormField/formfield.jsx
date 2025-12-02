import PropTypes from 'prop-types';
import React from 'react';
import './formfield.css';

export const FormField = ({
  label = 'Label',
  value = '',
  className,
  inputType = 'text',
  name,
  id,
  placeholder,
  onChange,
}) => {
  const inputId = id || name;

  return (
    <div className={`form-field ${className}`}>
      <label className="label" htmlFor={inputId}>
        {label}
      </label>

      <input
        className="input"
        id={inputId}
        name={name}
        onChange={onChange}
        placeholder={placeholder || value}
        type={inputType}
        value={value}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  inputType: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
};
