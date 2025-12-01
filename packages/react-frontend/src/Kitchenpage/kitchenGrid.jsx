// kitchenGrid.jsx
import './kitchenGrid.css';

export const KitchenGrid = (props) => {
  const { inventories, removeInventory, kitchenId } = props;

  return (
    <section className="hb-kitchen-grid">
      {inventories && inventories.length > 0 ? (
        inventories.map((inventory) => (
          <div key={inventory._id} className="hb-kitchen-card">
            <h3 className="hb-kitchen-name">{inventory.name}</h3>
            <p className="hb-kitchen-created">
              Created:{' '}
              {inventory.createdAt
                ? new Date(inventory.createdAt).toLocaleDateString()
                : 'Unknown'}
            </p>

            <div className="hb-kitchen-actions">
              <button
                className="hb-view-btn"
                onClick={() => {
                  // adjust to whatever route you use for viewing a single inventory
                  console.log('debug123');
                  console.log(kitchenId);
                  window.location.href = `/kitchens/${kitchenId}/inventories/${inventory._id}`;
                }}
              >
                View
              </button>

              <button
                className="hb-delete-btn"
                onClick={() => removeInventory(inventory._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="hb-card-text">
          This kitchen doesn&apos;t have any inventories yet. Create one to
          start organizing items.
        </p>
      )}
    </section>
  );
};
