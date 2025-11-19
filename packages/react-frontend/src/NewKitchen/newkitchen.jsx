import React from 'react';
import './newkitchen.css';

export const PantrySetupCreate = () => {
  return (
    <div className="pantry-setup-create">
      <div className="text-wrapper">SIDER</div>

      <div className="div">Create Your New Pantry</div>

      <div className="rectangle" />

      <div className="frame">
        <div className="frame-2">
          <div className="text-wrapper-2">Pantry Name</div>

          <div className="div-wrapper">
            <div className="text-wrapper-3">e.g. 1st Floor Kitchen</div>
          </div>
        </div>

        <div className="frame-2">
          <div className="text-wrapper-2">Inventory Name</div>

          <div className="div-wrapper">
            <div className="text-wrapper-3">e.g. Fridge</div>
          </div>
        </div>
      </div>

      <div className="frame-3">
        <div className="frame-4">
          <div className="text-wrapper-4">Back</div>
        </div>

        <div className="frame-5">
          <div className="text-wrapper-4">Next</div>
        </div>
      </div>
    </div>
  );
};
