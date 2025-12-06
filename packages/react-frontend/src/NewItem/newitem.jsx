import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './newitem.css';

/*
Very generic form page
*/
export const ItemSetupCreate = ({ handleSubmit }) => {
  const navigate = useNavigate();
  const { kitchenId, inventoryId } = useParams();

  const [item, setItem] = useState({
    name: '',
    quantity: '',
    description: '',
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setItem((prev) => ({ ...prev, [name]: value }));
  }

  function submitForm() {
    if (!item.name.trim()) return;
    handleSubmit(item, kitchenId, inventoryId);
    setItem({ name: '', quantity: '', description: '' });
  }

  return (
    <div className="new-kitchen">
      {/* HEADER */}
      <div className="header">
        <div className="div">SIDER</div>
      </div>

      {/* MAIN SECTION */}
      <div className="main">
        {/* Section Title */}
        <div className="section-header">
          <div className="text-wrapper-2">Add a New Item</div>
          <p className="p">
            Fill out the details to add an item to your inventory.
          </p>
        </div>

        {/* FORM */}
        <div className="form-wrapper">
          {/* Item Name */}
          <div className="form-group">
            <label className="label">Item Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Milk"
              value={item.name}
              onChange={handleChange}
              className="input"
            />
          </div>

          {/* Quantity */}
          <div className="form-group">
            <label className="label">Quantity</label>
            <input
              type="number"
              min="0"
              name="quantity"
              placeholder="e.g. 2"
              value={item.quantity}
              onChange={handleChange}
              className="input"
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="label">Description</label>
            <textarea
              name="description"
              placeholder="Optional description…"
              value={item.description}
              onChange={handleChange}
              className="textarea"
            />
          </div>
        </div>

        {/* BUTTONS */}
        <div className="button-row">
          <button
            className="btn secondary"
            onClick={() =>
              navigate(`/kitchens/${kitchenId}/inventories/${inventoryId}`)
            }
          >
            Back
          </button>

          <button className="btn primary" onClick={submitForm}>
            Add Item
          </button>
        </div>
      </div>
    </div>
  );
};
