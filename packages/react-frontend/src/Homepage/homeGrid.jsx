import './homeGrid.css';
export const HomeGrid = (props) => {
  return (
    <section className="hb-kitchen-grid">
      {props.kitchens && props.kitchens.length > 0 ? (
        props.kitchens.map((kitchen) => (
          <div key={kitchen._id} className="hb-kitchen-card">
            <h3 className="hb-kitchen-name">{kitchen.name}</h3>
            <p className="hb-kitchen-created">
              Created: {new Date(kitchen.createdAt).toLocaleDateString()}
            </p>

            <div className="hb-kitchen-actions">
              <button
                className="hb-view-btn"
                onClick={() => {
                  window.location.href = `/kitchens/${kitchen._id}`;
                }}
              >
                View
              </button>

              <button
                className="hb-delete-btn"
                onClick={() => props.removeKitchen(kitchen._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="hb-card-text">
          You don’t have any kitchens set up. Create one to start tracking
          supplies, members, and shopping lists.
        </p>
      )}
    </section>
  );
};
