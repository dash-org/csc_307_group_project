import './newinventory.css';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

export const InventorySetupCreate = (props) => {
  const { id } = useParams();
  const kitchenId = id;

  const [creds, setCreds] = useState({
    name: '',
  });

  return (
    <div className="pantry-setup-create">
      <div className="text-wrapper">SIDER</div>

      <div className="div">Create Your New Inventory</div>

      <div className="rectangle" />

      <div className="frame">
        <div className="frame-2">
          <div className="text-wrapper-2">Inventory Name</div>

          <input
            className="div-wrapper"
            type="text"
            name="inventoryName"
            id="iventoryName"
            placeholder="e.g. Fridge"
            value={creds.name}
            onChange={handleChange}
          ></input>
          {/* <div className="div-wrapper">
            <div className="text-wrapper-3">e.g. 1st Floor Kitchen</div>
          </div> */}
        </div>

        {/* <div className="frame-2">
          <div className="text-wrapper-2">Inventory Name</div>

          <div className="div-wrapper">
            <div className="text-wrapper-3">e.g. Fridge</div>
          </div>
        </div> */}
      </div>

      <div className="frame-3">
        <button
          className="frame-4"
          onClick={() => {
            window.location.href = `/kitchens/${kitchenId}`;
          }}
        >
          <div className="text-wrapper-4">Back</div>
        </button>
        <button className="frame-5" onClick={submitForm}>
          <div className="text-wrapper-4">Next</div>
        </button>
        {/* <div className="frame-5">
          <div className="text-wrapper-4">Next</div>
        </div> */}
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
