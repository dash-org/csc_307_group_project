import './newinventory.css';
import React, { useState } from 'react';
import { Button } from '../Components/Button/button';
import { FormField } from '../Components/FormField/formfield';
import { useParams } from 'react-router-dom';

export const InventorySetupCreate = (props) => {
  const { id } = useParams();
  const kitchenId = id;

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
          <div className="text-wrapper-2">Create A New Inventory</div>

          <p className="p">Enter a name for your inventory here.</p>
        </div>

        <div className="form">
          <div className="form-fields">
            <FormField
              className="form-field-instance"
              label="Inventory Name"
              name="inventoryName"
              placeholder="e.g. Fridge"
              value={creds.name}
              onChange={handleChange}
            />
          </div>

          <div className="button-set">
            <Button
              buttonText="Back"
              className="button-instance"
              hierarchy="secondary"
              onClick={() => (window.location.href = `/kitchens/${kitchenId}`)}
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
      case 'inventoryName':
        setCreds({ ...creds, name: value });
        break;
    }
  }

  function submitForm() {
    props.handleSubmit(creds, kitchenId);
    setCreds({ name: '' });
  }
};
