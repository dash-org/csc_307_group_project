import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { Form } from '../Components/Form/form';
import './newkitchen.css';

export const PantrySetupCreate = (props) => {
  const navigate = useNavigate();
  const [kitchenName, setKitchenName] = useState('');
  const [inventoryName, setInventoryName] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'kitchenName') {
      setKitchenName(value);
    } else if (name === 'inventoryName') {
      setInventoryName(value);
    }
  };

  const handleBack = () => {
    window.location.href = '/home';
  };

  const submitForm = () => {
    props
      .handleSubmit({
        kitchenName,
        inventoryName,
      })
      .then(() => navigate('/home'));
    setKitchenName('');
    setInventoryName('');
  };

  return (
    <div className="new-kitchen">
      <header className="header">
        <div className="div">SIDER</div>
      </header>

      <div className="main">
        <div className="section-header">
          <div className="text-wrapper-2">Create A New Pantry</div>

          <p className="p">
            Create a pantry and its inventory so you can start keeping track of
            your food.
          </p>
        </div>

        <Form
          buttonText="Create"
          className="form-instance"
          formFieldLabel="Pantry Name"
          formFieldLabel1="Inventory Name"
          formFieldName="kitchenName"
          formFieldName1="inventoryName"
          formFieldPlaceholder="e.g. 1st Floor Kitchen"
          formFieldPlaceholder1="e.g. Fridge"
          formFieldValue={kitchenName}
          formFieldValue1={inventoryName}
          onChange={handleChange}
          onPrimaryAction={submitForm}
          onSecondaryAction={handleBack}
          secondaryButtonText="Back"
        />
      </div>
    </div>
  );
};
