import React from 'react';
import { Button } from '../Button/button';
import { FormField } from '../FormField/formfield';
import './form.css';

export const Form = ({
  buttonText,
  secondaryButtonText,
  className,
  formFieldLabel,
  formFieldLabel1,
  formFieldValue,
  formFieldValue1,
  formFieldPlaceholder,
  formFieldPlaceholder1,
  formFieldName,
  formFieldName1,
  onChange,
  onPrimaryAction,
  onSecondaryAction,
}) => {
  return (
    <div className={`form ${className}`}>
      <FormField
        className="form-field-instance"
        label={formFieldLabel}
        name={formFieldName}
        onChange={onChange}
        placeholder={formFieldPlaceholder ?? formFieldValue}
        value={formFieldValue ?? ''}
      />
      <FormField
        className="form-field-instance"
        label={formFieldLabel1}
        name={formFieldName1}
        onChange={onChange}
        placeholder={formFieldPlaceholder1 ?? formFieldValue1}
        value={formFieldValue1 ?? ''}
      />
      <div className="form-buttons">
        {secondaryButtonText && (
          <Button
            buttonText={secondaryButtonText}
            className="button-instance"
            hierarchy="secondary"
            onClick={onSecondaryAction}
          />
        )}
        <Button
          buttonText={buttonText}
          className="button-instance"
          hierarchy="primary"
          onClick={onPrimaryAction}
        />
      </div>
    </div>
  );
};
