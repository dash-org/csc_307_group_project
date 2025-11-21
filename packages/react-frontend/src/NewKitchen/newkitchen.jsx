import React, { useState } from 'react';
import './newkitchen.css';

export const PantrySetupCreate = (props) => {
  const [kitchenName, setKitchenName] = useState('');
  const [inventoryName, setInventoryName] = useState('');

  return (
    <div className="pantry-setup-create">
      <div className="text-wrapper">SIDER</div>

      <div className="div">Create Your New Pantry</div>

      <div className="rectangle" />

      <div className="frame">
        <div className="frame-2">
          <label className="text-wrapper-2" htmlFor="kitchenName">
            Pantry Name
          </label>

          <input
            className="div-wrapper"
            type="text"
            name="kitchenName"
            id="kitchenName"
            placeholder="Pantry Name"
            value={kitchenName}
            onChange={handleChange}
          />

          {/* <div className="text-wrapper-3">e.g. 1st Floor Kitchen</div> */}
        </div>

        <div className="frame-2">
          <label className="text-wrapper-2">Inventory Name</label>

          <input
            className="div-wrapper"
            type="text"
            name="inventoryName"
            id="inventoryName"
            placeholder="Inventory Name"
            value={inventoryName}
            onChange={handleChange}
          />
          {/* <div className="div-wrapper">
            <div className="text-wrapper-3">e.g. Fridge</div>
          </div> */}
        </div>
      </div>

      <div className="frame-3">
        <div className="frame-4">
          <div className="text-wrapper-4">Back</div>
        </div>

        {/* <div className="frame-5"> */}
        {/* <div className="text-wrapper-4">Next</div> */}
        <input
          type="button"
          className="frame-5"
          value={props.buttonLabel || 'Next'}
          onClick={submitForm}
        />
        {/* </div> */}
      </div>
    </div>
  );

  function handleChange(event) {
    const { name, value } = event.target;
    if (name === 'kitchenName') {
      setKitchenName(value);
    } else if (name === 'inventoryName') {
      setInventoryName(value);
    }
  }

  function submitForm() {
    props.handleSubmit({
      kitchenName,
      inventoryName,
    });
    setKitchenName('');
    setInventoryName('');
  }
};
