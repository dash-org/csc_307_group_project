// import { useNavigate } from 'react-router-dom';
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

    // <div className="pantry-setup-create">
    //   <div className="text-wrapper">SIDER</div>

    //   <div className="div">Create Your New Kitchen</div>

    //   <div className="rectangle" />

    //   <div className="frame">
    //     <div className="frame-2">
    //       <div className="text-wrapper-2">Kitchen Name</div>

    //       <input
    //         className="div-wrapper"
    //         type="text"
    //         name="kitchenName"
    //         id="kitchenName"
    //         placeholder="e.g. 1st Floor Kitchen"
    //         value={creds.name}
    //         onChange={handleChange}
    //       ></input>
    //       {/* <div className="div-wrapper">
    //         <div className="text-wrapper-3">e.g. 1st Floor Kitchen</div>
    //       </div> */}
    //     </div>

    //     {/* <div className="frame-2">
    //       <div className="text-wrapper-2">Inventory Name</div>

    //       <div className="div-wrapper">
    //         <div className="text-wrapper-3">e.g. Fridge</div>
    //       </div>
    //     </div> */}
    //   </div>

    //   <div className="frame-3">
    //     <button
    //       className="frame-4"
    //       onClick={() => {
    //         window.location.href = '/home';
    //       }}
    //     >
    //       <div className="text-wrapper-4">Back</div>
    //     </button>
    //     <button className="frame-5" onClick={submitForm}>
    //       <div className="text-wrapper-4">Next</div>
    //     </button>
    //     {/* <div className="frame-5">
    //       <div className="text-wrapper-4">Next</div>
    //     </div> */}
    //   </div>
    // </div>
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
