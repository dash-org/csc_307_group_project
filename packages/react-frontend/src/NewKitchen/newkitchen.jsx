import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { Form } from '../Components/Form/form';
import './newkitchen.css';
import React, { useState } from 'react';

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

      <div className="div">Create Your New Kitchen</div>

      <div className="rectangle" />

      <div className="frame">
        <div className="frame-2">
          <div className="text-wrapper-2">Kitchen Name</div>

          <input
            className="div-wrapper"
            type="text"
            name="kitchenName"
            id="kitchenName"
            placeholder="e.g. 1st Floor Kitchen"
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
            window.location.href = '/home';
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
