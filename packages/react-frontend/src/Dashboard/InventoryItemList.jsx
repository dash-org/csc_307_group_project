import React from 'react';
import './InventoryItemList.css';

export const InventoryItemList = ({ items, onDelete }) => {
  if (!items || items.length === 0) {
    return <div className="itemlist-empty">No items in this inventory.</div>;
  }

  return (
    <div className="itemlist-container">
      {items.map((item) => (
        <div key={item._id} className="itemlist-row">
          <div className="itemlist-info">
            <div className="itemlist-name">{item.name}</div>

            <div className="itemlist-detail">
              <strong>Quantity: </strong> {item.quantity}
            </div>

            {item.description && (
              <div className="itemlist-detail">
                <strong>Description: </strong> {item.description}
              </div>
            )}
          </div>

          <button
            className="itemlist-delete"
            onClick={() => onDelete(item._id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};
