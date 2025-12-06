import React, { useState } from 'react';
import { Button } from '../Components/Button/button';
import { FormField } from '../Components/FormField/formfield';
import './newkitchen.css';

export const PantrySetupCreate = (props) => {
  const [creds, setCreds] = useState({
    name: '',
  });

  return (
    <div className="new-pantry">
      <header className="header">
        <div className="div">SIDER</div>
      </header>

      <div className="main">
        <div className="section-header">
          <div className="text-wrapper-2">Create A New Kitchen</div>

          <p className="p">Enter a name for your kitchen here.</p>
        </div>

        <div className="form">
          <div className="form-fields">
            <FormField
              className="form-field-instance"
              label="Kitchen Name"
              name="kitchenName"
              placeholder="e.g. 1st Floor Kitchen"
              value={creds.name}
              onChange={handleChange}
            />
          </div>

          <div className="button-set">
            <Button
              buttonText="Back"
              className="button-instance"
              hierarchy="secondary"
              onClick={() => (window.location.href = '/home')}
            />
            <Button
              buttonText="Create"
              className="button-instance"
              hierarchy="primary"
              onClick={submitForm}
            />
          </div>
        </div>
      </div>
    </div>
  );

  function handleChange(event) {
    const { name, value } = event.target;
    switch (name) {
      case 'kitchenName':
        setCreds({ ...creds, name: value });
        break;
    }
  }

  function submitForm() {
    props.handleSubmit(creds);
    setCreds({ name: '' });
  }
};
